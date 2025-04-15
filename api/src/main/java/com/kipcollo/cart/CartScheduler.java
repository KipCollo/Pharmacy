package com.kipcollo.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CartScheduler {

    private final CartRepository cartRepository;
    private final NotificationService notificationService;

    @Scheduled(fixedRate = 60000) // runs every 1 minute
    public void checkForAbandonedCarts() {
        LocalDateTime timeout = LocalDateTime.now().minusMinutes(5);
        List<Cart> staleCarts = cartRepository.findByStatusAndUpdateTimeBefore(CartStatus.STARTED, timeout);

        for (Cart cart : staleCarts) {
            cart.setStatus(CartStatus.ABANDONED);
            cart.setUpdateTime(LocalDateTime.now());
            cartRepository.save(cart);
            notificationService.sendPendingCartNotification(cart.getUserId(), cart.getId());
        }
    }
}
