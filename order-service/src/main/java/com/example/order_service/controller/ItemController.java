package com.example.order_service.controller;

import com.example.order_service.dto.request.AddItemRequest;
import com.example.order_service.dto.request.ItemDetailResponse;
import com.example.order_service.dto.request.UpdateItemRequest;
import com.example.order_service.dto.response.ShopGroupedItemsResponse;
import com.example.order_service.entity.Item;
import com.example.order_service.service.ItemService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/item")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;

    @GetMapping("/cart-details")
    public ResponseEntity<List<ItemDetailResponse>> viewCartDetails(@RequestParam(name = "customer_id") Long customer_id) throws JsonProcessingException {
        return ResponseEntity.ok(itemService.getDetailsCart(customer_id));
    }
    @PostMapping("/update")
    public ResponseEntity<ItemDetailResponse> updateVoucher(@RequestBody UpdateItemRequest updateItemRequest) throws JsonProcessingException {
        return ResponseEntity.ok(itemService.updateItem(updateItemRequest));
    }
    @GetMapping("/find-by-ids")
    public ResponseEntity<List<ShopGroupedItemsResponse>> findByIds(@RequestParam(name = "ids") List<Long> ids) throws JsonProcessingException {
        return ResponseEntity.ok(itemService.findByIds(ids));
    }
    @GetMapping("/find-by-seller-id")
    public ResponseEntity<List<ItemDetailResponse>> getBySellerId(@RequestParam(name = "seller_id") Long sellerId) throws JsonProcessingException {
        return ResponseEntity.ok(itemService.getBySellerId(sellerId));
    }

    @GetMapping("/count-total-sold-quantity")
    public ResponseEntity<?> countSoldQuantityBySeller(@RequestParam Long typeOfProductId)
    {
        return ResponseEntity.ok(itemService.countSoldQuantity(typeOfProductId));
    }
    @PostMapping("/add")
    public ResponseEntity<?> addItem(@RequestBody AddItemRequest addItemRequest) {
        Item item = itemService.addItem(addItemRequest);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/count-sold-quantity-by-seller")
    public ResponseEntity<?> countSoldQuantityBySeller(@RequestParam List<Long> ids)
    {
        return ResponseEntity.ok(itemService.countSoldQuantity(ids));
    }

    @DeleteMapping("/delete")
    public void deleteById(@Param("itemId")Long itemId){
        itemService.deleteById(itemId);
    }

}
