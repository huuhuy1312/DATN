package com.example.order_service.controller;

import com.example.order_service.dto.request.FilterOrderLineRequest;
import com.example.order_service.dto.request.UpdateOrderLineRequest;
import com.example.order_service.dto.response.CountOrderLineByTypeResponse;
import com.example.order_service.dto.response.OrderLineResponse;
import com.example.order_service.entity.OrderLine;
import com.example.order_service.service.OrderLineService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/order-line")
@RequiredArgsConstructor
public class OrderLineController {
    private final OrderLineService orderLineService;
    @PostMapping("/search")
    public ResponseEntity<List<OrderLineResponse>> getBySellerId(@RequestBody FilterOrderLineRequest filterOrderLineRequest) throws JsonProcessingException {
        return ResponseEntity.ok(orderLineService.search(filterOrderLineRequest));
    }
    @PostMapping("/update")
    public ResponseEntity<String> confirmById(@RequestBody UpdateOrderLineRequest updateOrderLineRequest){
        orderLineService.updateOrderLine(updateOrderLineRequest);
        return ResponseEntity.ok("Update order line successfully");
    }

    @PostMapping("/count-order-line-by-type")
    public ResponseEntity<CountOrderLineByTypeResponse> countOrderLineByType(@RequestParam(value = "idAccountWarehouse", required = false) Long idAccountWarehouse){
        return ResponseEntity.ok(orderLineService.countOrderLineByType(idAccountWarehouse));
    }

    @PostMapping("/count-order-line-of-shipper-by-type")
    public ResponseEntity<CountOrderLineByTypeResponse> countOrderLineOfShipperByType(@RequestParam(value = "idAccountShipper", required = false) Long idAccountShipper){
        return ResponseEntity.ok(orderLineService.countOrderLineOfShipperByType(idAccountShipper));
    }


    @GetMapping("/order-and-customer-of-seller")
    public ResponseEntity<?> orderAndCustomerOfSeller(@RequestParam("idSeller")Long idSeller) throws JsonProcessingException {
        return ResponseEntity.ok(orderLineService.orderAndCustomerOfSeller(idSeller));
    }

    @GetMapping("/get-process")
    public ResponseEntity<?> getProcess(@RequestParam Long id)
    {
        return ResponseEntity.ok(orderLineService.getProcess(id));
    }

    @GetMapping("/static-by-admin")
    public ResponseEntity<?> staticByAdmin()
    {
        return ResponseEntity.ok(orderLineService.staticByAdmin());
    }

}
