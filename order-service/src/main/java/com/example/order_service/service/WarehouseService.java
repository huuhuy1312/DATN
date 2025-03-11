package com.example.order_service.service;

import com.example.order_service.dto.response.*;
import com.example.order_service.entity.Order;
import com.example.order_service.entity.Warehouse;
import com.example.order_service.repository.OrderRepository;
import com.example.order_service.repository.WarehouseRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final RestTemplate restTemplate;
    public StaticShipProviderAdminResponse staticShipProviderAdmin() throws JsonProcessingException {
        List<Warehouse> warehouseList = warehouseRepository.findAll();
        List<Order> orders = orderRepository.findAll();
        List<OrderResponse> orderResponses = orderService.convertOrdersToOrdersResponse(orders);
        String url = "http://localhost:8080/api/seller/findAll";
        ResponseEntity<List<SellerResponse>> sellers = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );
        return new StaticShipProviderAdminResponse(warehouseList,orderResponses,sellers.getBody());
    }

//    public List<StaticWarehouseResponse> staticWarehouseAdmin() {
//        List<Warehouse> warehouses = warehouseRepository.findAll();
//        for (Warehouse warehouse:warehouses)
//        {
//            StaticWarehouseResponse response = new StaticWarehouseResponse();
//
//        }
//    }
}
