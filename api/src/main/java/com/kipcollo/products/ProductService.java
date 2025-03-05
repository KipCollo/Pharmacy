package com.kipcollo.products;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import com.kipcollo.exceptions.ProductPurchaseException;
import com.kipcollo.service.FileStorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

   private final ProductRepository repository;
   private final ProductMapper mapper;
   private FileStorageService fileStorageService;

   public PageResponse<ProductResponse> getAllMedicine(int page, int size ) {
       Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
       Page<Product> medicines = repository.findAllDisplayableMedicine(pageable);
       List<ProductResponse> productResponses = medicines.stream()
               .map(mapper::fromProduct)
               .collect(Collectors.toList());

       return new PageResponse<>(
               productResponses,
               medicines.getNumber(),
               medicines.getSize(),
               medicines.getTotalElements()
               ,medicines.getTotalPages(),
               medicines.isFirst(),
               medicines.isLast());
   }

   public ProductResponse getMedicineById(Integer medicineId) {
       return repository.findById(medicineId)
               .map(mapper::fromProduct)
               .orElseThrow();
   }

   public String createMedicine(ProductRequest productRequest, MultipartFile imageFile) {
       var medicine = repository.save(mapper.toProduct(productRequest));
       return "Medicine added with ID:: " + medicine.getMedicineId();
   }

   public void deleteMedicine(Integer medicineId) {
       repository.deleteById(medicineId);
   }

   public void updateMedicine(ProductRequest request) {
           var medicine = repository.findById(request.getMedicineId())
                   .orElseThrow(() -> new RuntimeException("Medicine not found"));
           mergeMedicine(medicine,request);
       }

   private void mergeMedicine(Product product, ProductRequest request) {

       if (StringUtils.isNotBlank(String.valueOf(product.getMedicineId()))){
           product.setMedicineId(request.getMedicineId());
       }
       if (StringUtils.isNotBlank(product.getName())){
           product.setName(product.getName());
       }
       if (StringUtils.isNotBlank(product.getDescription())){
           product.setDescription(request.getDescription());
       }
       if (StringUtils.isNotBlank(String.valueOf(product.getPrice()))){
           product.setPrice(request.getPrice());
       }
       if (StringUtils.isNotBlank(String.valueOf(product.getStockQuantity()))){
           product.setStockQuantity(request.getStockQuantity());
       }
       if (StringUtils.isNotBlank(String.valueOf(product.getType()))){
           product.setType(request.getType());
       }
       if (StringUtils.isNotBlank(String.valueOf(product.getManufacturer()))){
           product.setManufacturer(product.getManufacturer());
       }

   }

   public List<PurchaseProductResponse> purchaseProduct(List<PurchaseProductRequest> requests){
       var productIds = requests
               .stream()
               .map(PurchaseProductRequest::getProductId)
               .toList();
       var storedProducts = repository.findAllByIdInOrderId(productIds);

       if (productIds.size() != storedProducts.size()){
           throw new ProductPurchaseException("One or more products doesn't exist");
       }

       var storedRequest = requests
               .stream()
               .sorted(Comparator.comparing(PurchaseProductRequest::getProductId))
               .toList();
       var purchasedProducts = new ArrayList<PurchaseProductResponse>();
       for (int i = 0; i < storedProducts.size();i++){
           var product = storedProducts.get(i);
           var productRequest = storedRequest.get(i);

           if(product.getStockQuantity() < productRequest.getQuantity() ){
               throw new ProductPurchaseException("Insufficient stock quantity for product with the id::" + product.getMedicineId());
           }

           var newAvailableQuantity = product.getStockQuantity()- productRequest.getQuantity();
           product.setStockQuantity(newAvailableQuantity);
           repository.save(product);
           purchasedProducts.add(mapper.toPurchaseProductResponse(product,productRequest.getQuantity()));
       }
       return purchasedProducts;
       }


}
