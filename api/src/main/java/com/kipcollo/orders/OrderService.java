package com.kipcollo.orders;

import com.kipcollo.cart.Cart;
import com.kipcollo.cart.CartRepository;
import com.kipcollo.cart.CartStatus;
import com.kipcollo.email.EmailService;
import com.kipcollo.email.EmailTemplate;
import com.kipcollo.exceptions.BadRequestException;
import com.kipcollo.exceptions.ResourceNotFoundException;
import com.kipcollo.orderlines.OrderLineRequest;
import com.kipcollo.orderlines.OrderLineService;
import com.kipcollo.payments.PaymentRequest;
import com.kipcollo.payments.PaymentService;
import com.kipcollo.products.ProductService;
import com.kipcollo.products.PurchaseProductRequest;
import com.kipcollo.shipments.*;
import com.kipcollo.user.UserService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;
        private final OrderMapper orderMapper;
        private final OrderLineService orderLineService;
        private final UserService userService;
        private final ProductService productService;
        private final CartRepository cartRepository;
        private final PaymentService paymentService;
        private final EmailService emailService;
        private final ShipmentRepository shipmentRepository;
        private final ShipmentMapper shipmentMapper;

        @Transactional
        public Integer createOrder(OrderRequest orderRequest) {
                // Use authenticated customer for consistency with cart ownership.
                var user = userService.getAuthenticatedUser();

                List<Cart> carts = cartRepository
                                .findByUserCustomerIdAndStatus(
                                                user.getCustomerId(),
                                                CartStatus.STARTED);

                if (carts.isEmpty()) {
                        throw new BadRequestException("No active carts");
                }

                // Build purchase lines from all active cart products.
                List<PurchaseProductRequest> purchaseRequests = carts.stream()
                                .flatMap(cart -> cart.getCartProducts().stream())
                                .map(cartProduct -> PurchaseProductRequest.builder()
                                                .productId(cartProduct.getProduct().getId())
                                                .quantity(cartProduct.getQuantity())
                                                .build())
                                .toList();

                if (purchaseRequests.isEmpty()) {
                        throw new BadRequestException("No products found in active carts");
                }

                // Keep item-level details for confirmation email before cart state is updated.
                List<Map<String, String>> orderedItems = carts.stream()
                                .flatMap(cart -> cart.getCartProducts().stream())
                                .map(cartProduct -> {
                                        var product = cartProduct.getProduct();
                                        int quantity = cartProduct.getQuantity();
                                        BigDecimal unitPrice = product.getPrice() == null ? BigDecimal.ZERO
                                                        : product.getPrice();
                                        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));

                                        Map<String, String> item = new HashMap<>();
                                        item.put("name", product.getName());
                                        item.put("quantity", String.valueOf(quantity));
                                        item.put("unitPrice", unitPrice.toPlainString());
                                        item.put("lineTotal", lineTotal.toPlainString());
                                        return item;
                                })
                                .toList();

                productService.purchaseProduct(purchaseRequests);

                // persist order
                orderRequest.setCustomers(user);
                var order = orderRepository.save(Objects.requireNonNull(orderMapper.toOrder(orderRequest)));

                for (PurchaseProductRequest purchaseRequest : purchaseRequests) {
                        orderLineService.saveOrderLine(
                                        new OrderLineRequest(
                                                        0,
                                                        order.getId(),
                                                        purchaseRequest.getProductId(),
                                                        purchaseRequest.getQuantity()));
                }

                var paymentRequest = new PaymentRequest(
                                orderRequest.getTotalAmount(),
                                orderRequest.getPaymentMethod(),
                                order.getId(),
                                order.getReference(),
                                user);
                paymentService.process(paymentRequest);

                for (Cart cart : carts) {
                        cart.setStatus(CartStatus.CHECKED_OUT);
                        cart.setUpdateTime(LocalDateTime.now());
                }

                cartRepository.saveAll(carts);

                try {
                        Map<String, Object> properties = new HashMap<>();
                        properties.put("username", user.fullname());
                        properties.put("orderReference", order.getReference());
                        properties.put("paymentMethod", order.getPaymentMethod().name());
                        properties.put("totalAmount", order.getTotalAmount().toPlainString());
                        properties.put("orderDate", order.getCreatedAt() == null ? LocalDateTime.now().toString()
                                        : order.getCreatedAt().toString());
                        properties.put("orderedItems", orderedItems);
                        properties.put("orderTrackingUrl", "http://localhost:4200/orders");

                        emailService.send(
                                        user.getEmail(),
                                        "Order Confirmation - " + order.getReference(),
                                        EmailTemplate.ORDER_PLACED,
                                        properties);
                } catch (Exception ignored) {
                        // Do not fail checkout if email delivery fails.
                }

                return order.getId();
        }

        @Transactional
        public ShipmentResponse updateOrderAdminWorkflow(Integer orderId, OrderAdminUpdateRequest request) {
                if (request == null || request.getAction() == null) {
                        throw new BadRequestException("Action is required");
                }

                Orders order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

                Shipment shipment = shipmentRepository.findFirstByOrder_Id(orderId)
                                .orElseGet(() -> Shipment.builder()
                                                .shipmentId(generateShipmentId(order))
                                                .order(order)
                                                .status(ShipmentStatus.DRAFT)
                                                .progressStep(0)
                                                .timeline(new ArrayList<>())
                                                .build());

                switch (request.getAction()) {
                        case APPROVE -> {
                                order.setApprovalStatus(OrderApprovalStatus.APPROVED);
                                shipment.setStatus(ShipmentStatus.DRAFT);
                                shipment.setProgressStep(0);
                                applyShipmentDetails(order, shipment, request);
                                appendTimeline(shipment, "Order approved", "Admin approved order and started fulfillment.");
                                if (Boolean.TRUE.equals(request.getNotifyCustomer()) || request.getNotifyCustomer() == null) {
                                        sendOrderApprovedEmail(order, shipment);
                                }
                        }
                        case PREPARE -> {
                                order.setApprovalStatus(OrderApprovalStatus.PREPARING);
                                shipment.setStatus(ShipmentStatus.IN_PROGRESS);
                                shipment.setProgressStep(Math.max(1, shipment.getProgressStep()));
                                applyShipmentDetails(order, shipment, request);
                                appendTimeline(shipment, "Package prepared", "Order packed and ready for dispatch.");
                                if (Boolean.TRUE.equals(request.getNotifyCustomer())) {
                                        sendTrackingEmail(order, shipment);
                                }
                        }
                        case DISPATCH -> {
                                order.setApprovalStatus(OrderApprovalStatus.DISPATCHED);
                                shipment.setStatus(ShipmentStatus.IN_PROGRESS);
                                shipment.setProgressStep(Math.max(2, shipment.getProgressStep()));
                                applyShipmentDetails(order, shipment, request);
                                appendTimeline(shipment, "Shipment dispatched", "Package has left the shop and is on the way.");
                                if (Boolean.TRUE.equals(request.getNotifyCustomer()) || request.getNotifyCustomer() == null) {
                                        sendTrackingEmail(order, shipment);
                                }
                        }
                        case DELIVER -> {
                                order.setApprovalStatus(OrderApprovalStatus.DELIVERED);
                                shipment.setStatus(ShipmentStatus.ARRIVED);
                                shipment.setProgressStep(4);
                                applyShipmentDetails(order, shipment, request);
                                appendTimeline(shipment, "Delivered", "Shipment delivered successfully.");
                                if (Boolean.TRUE.equals(request.getNotifyCustomer()) || request.getNotifyCustomer() == null) {
                                        sendTrackingEmail(order, shipment);
                                }
                        }
                        case CANCEL -> {
                                order.setApprovalStatus(OrderApprovalStatus.CANCELED);
                                shipment.setStatus(ShipmentStatus.CANCELED);
                                shipment.setProgressStep(0);
                                applyShipmentDetails(order, shipment, request);
                                appendTimeline(shipment, "Shipment canceled", "Order shipment was canceled by admin.");
                                if (Boolean.TRUE.equals(request.getNotifyCustomer()) || request.getNotifyCustomer() == null) {
                                        sendTrackingEmail(order, shipment);
                                }
                        }
                }

                orderRepository.save(order);
                Shipment saved = shipmentRepository.save(shipment);
                return shipmentMapper.fromShipment(saved);
        }

        private void applyShipmentDetails(Orders order, Shipment shipment, OrderAdminUpdateRequest request) {
                String customerAddress = order.getCustomers() != null ? order.getCustomers().getLocation() : null;

                shipment.setCarrier(nonBlankOrDefault(request.getCarrier(), shipment.getCarrier(), "Pharmacy Dispatch"));
                shipment.setService(nonBlankOrDefault(request.getService(), shipment.getService(), "Standard"));
                shipment.setShippingDate(nonBlankOrDefault(request.getShippingDate(), shipment.getShippingDate(), LocalDateTime.now().toLocalDate().toString()));
                shipment.setExpectedArrival(nonBlankOrDefault(request.getExpectedArrival(), shipment.getExpectedArrival(), LocalDateTime.now().plusDays(2).toString()));
                shipment.setDepartureTime(nonBlankOrDefault(request.getDepartureTime(), shipment.getDepartureTime(), LocalDateTime.now().toString()));
                shipment.setTotalTime(nonBlankOrDefault(request.getTotalTime(), shipment.getTotalTime(), "2 days"));
                shipment.setOrigin(nonBlankOrDefault(request.getOrigin(), shipment.getOrigin(), "Main Shop"));
                shipment.setDestination(nonBlankOrDefault(request.getDestination(), shipment.getDestination(), customerAddress == null ? "Customer address pending" : customerAddress));

                if (request.getOriginLat() != null) {
                        shipment.setOriginLat(request.getOriginLat());
                }
                if (request.getOriginLng() != null) {
                        shipment.setOriginLng(request.getOriginLng());
                }
                if (request.getDestinationLat() != null) {
                        shipment.setDestinationLat(request.getDestinationLat());
                }
                if (request.getDestinationLng() != null) {
                        shipment.setDestinationLng(request.getDestinationLng());
                }
        }

        private void appendTimeline(Shipment shipment, String title, String note) {
                if (shipment.getTimeline() == null) {
                        shipment.setTimeline(new ArrayList<>());
                }

                ShipmentTimeline timeline = ShipmentTimeline.builder()
                                .sequenceNumber(shipment.getTimeline().size() + 1)
                                .title(title)
                                .time(LocalDateTime.now().toString())
                                .note(note)
                                .shipment(shipment)
                                .build();

                shipment.getTimeline().add(timeline);
        }

        private void sendOrderApprovedEmail(Orders order, Shipment shipment) {
                if (order.getCustomers() == null || order.getCustomers().getEmail() == null) {
                        return;
                }

                try {
                        Map<String, Object> properties = baseShipmentEmailProps(order, shipment);
                        properties.put("shipmentStatus", "APPROVED");

                        emailService.send(
                                        order.getCustomers().getEmail(),
                                        "Order Approved - " + order.getReference(),
                                        EmailTemplate.ORDER_TRACKING,
                                        properties);
                } catch (Exception ignored) {
                }
        }

        private void sendTrackingEmail(Orders order, Shipment shipment) {
                if (order.getCustomers() == null || order.getCustomers().getEmail() == null) {
                        return;
                }

                try {
                        Map<String, Object> properties = baseShipmentEmailProps(order, shipment);
                        properties.put("shipmentStatus", shipment.getStatus() == null ? "UNKNOWN" : shipment.getStatus().name());

                        emailService.send(
                                        order.getCustomers().getEmail(),
                                        "Shipment Update - " + shipment.getShipmentId(),
                                        EmailTemplate.ORDER_TRACKING,
                                        properties);
                } catch (Exception ignored) {
                }
        }

        private Map<String, Object> baseShipmentEmailProps(Orders order, Shipment shipment) {
                List<Map<String, String>> timeline = shipment.getTimeline() == null
                                ? List.of()
                                : shipment.getTimeline().stream()
                                                .map(entry -> {
                                                        Map<String, String> timelineEntry = new HashMap<>();
                                                        timelineEntry.put("title", entry.getTitle());
                                                        timelineEntry.put("time", entry.getTime());
                                                        timelineEntry.put("note", entry.getNote());
                                                        return timelineEntry;
                                                }).toList();

                Map<String, Object> properties = new HashMap<>();
                properties.put("username", order.getCustomers().fullname());
                properties.put("orderReference", order.getReference());
                properties.put("shipmentId", shipment.getShipmentId());
                properties.put("carrier", shipment.getCarrier());
                properties.put("service", shipment.getService());
                properties.put("expectedArrival", shipment.getExpectedArrival());
                properties.put("origin", shipment.getOrigin());
                properties.put("destination", shipment.getDestination());
                properties.put("timeline", timeline);
                properties.put("trackingUrl", "http://localhost:4200/orders");
                return properties;
        }

        private String generateShipmentId(Orders order) {
                return "SHP-" + order.getId() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        }

        private String nonBlankOrDefault(String first, String second, String fallback) {
                if (first != null && !first.trim().isEmpty()) {
                        return first.trim();
                }
                if (second != null && !second.trim().isEmpty()) {
                        return second.trim();
                }
                return fallback;
        }

        public List<OrderResponse> findAll() {
                return orderRepository.findAll()
                                .stream()
                                .map(orderMapper::fromOrder)
                                .collect(Collectors.toList());
        }

        public OrderResponse findById(Integer orderId) {
                Objects.requireNonNull(orderId, "orderId cannot be null");

                return orderRepository.findById(orderId)
                                .map(orderMapper::fromOrder)
                                .orElseThrow(
                                                () -> new EntityNotFoundException(String.format(
                                                                "No Order found with provided ID: %d", orderId)));
        }

        public List<RevenueReportResponse> getRevenueReport(String period) {
                List<OrderResponse> orders = findAll();
                LocalDate today = LocalDate.now();
                List<RevenueReportResponse> report = new ArrayList<>();

                switch (period.toLowerCase()) {
                        case "day":
                                BigDecimal todayRevenue = orders.stream()
                                                .filter(order -> order.getCreatedAt() != null
                                                                && order.getCreatedAt().toLocalDate().isEqual(today))
                                                .map(OrderResponse::getTotalAmount)
                                                .filter(Objects::nonNull)
                                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                                report.add(new RevenueReportResponse(today.toString(), todayRevenue));
                                break;
                        case "week":
                                LocalDate weekAgo = today.minusDays(6);
                                for (int i = 0; i < 7; i++) {
                                        LocalDate day = weekAgo.plusDays(i);
                                        BigDecimal dailyRevenue = orders.stream()
                                                        .filter(order -> order.getCreatedAt() != null
                                                                        && order.getCreatedAt().toLocalDate()
                                                                                        .isEqual(day))
                                                        .map(OrderResponse::getTotalAmount)
                                                        .filter(Objects::nonNull)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                                        report.add(new RevenueReportResponse(day.toString(), dailyRevenue));
                                }
                                break;
                        case "month":
                                int daysInMonth = today.lengthOfMonth();
                                for (int i = 1; i <= daysInMonth; i++) {
                                        LocalDate day = today.withDayOfMonth(i);
                                        BigDecimal dailyRevenue = orders.stream()
                                                        .filter(order -> order.getCreatedAt() != null
                                                                        && order.getCreatedAt().toLocalDate()
                                                                                        .isEqual(day))
                                                        .map(OrderResponse::getTotalAmount)
                                                        .filter(Objects::nonNull)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                                        report.add(new RevenueReportResponse(day.toString(), dailyRevenue));
                                }
                                break;
                        case "year":
                                for (int month = 1; month <= 12; month++) {
                                        int targetMonth = month;
                                        BigDecimal monthlyRevenue = orders.stream()
                                                        .filter(order -> order.getCreatedAt() != null
                                                                        && order.getCreatedAt()
                                                                                        .getMonthValue() == targetMonth
                                                                        && order.getCreatedAt().getYear() == today
                                                                                        .getYear())
                                                        .map(OrderResponse::getTotalAmount)
                                                        .filter(Objects::nonNull)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                                        report.add(new RevenueReportResponse(today.getYear() + "-" + month,
                                                        monthlyRevenue));
                                }
                                break;
                        default:
                                throw new BadRequestException("Unsupported period. Use one of: day, week, month, year");
                }

                return report;
        }
}
