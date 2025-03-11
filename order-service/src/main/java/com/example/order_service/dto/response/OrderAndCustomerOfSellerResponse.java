package com.example.order_service.dto.response;

import com.example.order_service.entity.Address;
import com.example.order_service.entity.OrderLine;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderAndCustomerOfSellerResponse {
    public List<OrderLineResponse> orderLines;
    public List<Address> customers;
}
