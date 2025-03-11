package com.example.order_service.dto.response;

import com.example.order_service.entity.Voucher;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderResponse {
    public Long id;//
    public String code;//
    public AddressResponse addressCustomer;
    public Long totalAmount;//
    public Set<Voucher> vouchers;//
    public LocalDateTime createdAt;//
    public List<OrderLineResponse> orderLines;//
    public String paymentMethod;//
    public String status;

    public OrderResponse(Long id, String code, Long totalAmount, Set<Voucher> vouchers, LocalDateTime createdAt, String paymentMethod) {
        this.id = id;
        this.code = code;
        this.totalAmount = totalAmount;
        this.vouchers = vouchers;
        this.createdAt = createdAt;
        this.paymentMethod = paymentMethod;
    }
}
