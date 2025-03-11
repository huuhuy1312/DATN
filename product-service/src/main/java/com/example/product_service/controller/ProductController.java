package com.example.product_service.controller;

import com.example.product_service.dto.request.AddProductRequest;
import com.example.product_service.dto.request.FilterProductRequest;
import com.example.product_service.dto.response.TOPRevenueResponse;
import com.example.product_service.repository.ProductRepository;
import com.example.product_service.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@ModelAttribute @Valid AddProductRequest addProductRequest) throws IOException{
        System.out.println(addProductRequest.description);
        productService.add(addProductRequest);
        return ResponseEntity.ok("abc");
    }
    @PostMapping("/update")
    public ResponseEntity<?> updateProduct(@ModelAttribute @Valid AddProductRequest addProductRequest) throws IOException{
        System.out.println(addProductRequest.description);
        productService.edit(addProductRequest);
        return ResponseEntity.ok("abc");
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAllProduct() {
        return ResponseEntity.ok(productService.getAll());
    }
    @GetMapping("/{pid}")
    public ResponseEntity<?> getProductByID(@PathVariable long pid)
    {
       return ResponseEntity.ok(productService.findById(pid));
    }
    @GetMapping("/find-by-seller-id")
    public ResponseEntity<?> findBySellerId(@RequestParam("sellerId")Long sellerId){
        return ResponseEntity.ok(productService.findBySellerId(sellerId));
    }
    @GetMapping("/revenue")
    public ResponseEntity<List<TOPRevenueResponse>> getRevenue(@RequestParam("objectName")String objectName, @RequestParam("objectId") Long objectId){
        return ResponseEntity.ok(productService.calRevenue(objectName,objectId));
    }
    @PostMapping("/find-by-condition")
    public ResponseEntity<?> findByCondition(@RequestBody FilterProductRequest filter){
        return ResponseEntity.ok(productService.findByCondition(filter));
    }

    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody FilterProductRequest filter){
        return ResponseEntity.ok(productService.search(filter));
    }
    @PostMapping("/delete-by-ids")
    public ResponseEntity<?> deleteByIds(@RequestBody List<Long> ids)
    {
        productRepository.softDeleteProductsByIds(ids);
        return ResponseEntity.ok("Xóa thành công");
    }
    @GetMapping("/static-by-seller")
    public ResponseEntity<?> countBy()
    {
        return ResponseEntity.ok(productRepository.getSellerStatistics());
    }

    @GetMapping("/suggest")
    public ResponseEntity<?> suggestById(@RequestParam("pid") Long pid)
    {
        return ResponseEntity.ok(productService.suggestById(pid));
    }

    @GetMapping("/suggest-cf")
    public ResponseEntity<?> suggestCFById(@RequestParam("userId") Long userId)
    {
        return ResponseEntity.ok(productService.suggestByUserId(userId));
    }
}
