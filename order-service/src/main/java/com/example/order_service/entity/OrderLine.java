package com.example.order_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "order_lines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long  id;
    private Long sellerId;
    private String reasonCancel;
    private LocalDateTime shipperPickupTime;
    private String status;
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
    private String customerMessage;
    private LocalDateTime confirmTime;
    public LocalDate sellerPickupRequestDate;
    private String waybillCode;
    @ManyToOne
    @JoinColumn(name = "pickup_warehouse_id")
    @JsonIgnore
    private Warehouse pickupWarehouse;
    @ManyToOne
    @JoinColumn(name = "pickup_shipper_id")
    @JsonIgnore
    private Shipper pickupShipper;
    private LocalDateTime deliveryWarehouseReceiveTime;
    @ManyToOne
    @JoinColumn(name = "shipping_method_id")
    @JsonManagedReference
    private ShippingMethods shippingMethods;

    private LocalDateTime shipperDeliveryTime;
    private LocalDateTime doneTime;
    @ManyToOne
    @JoinColumn(name = "delivery_shipper_id")
    @JsonIgnore
    private Shipper deliveryShipper;

    @OneToMany(mappedBy = "orderLine")
    private List<Item> itemList;

    private Long totalPrice;
    private Long revenue;
    @ManyToOne
    @JoinColumn(name = "delivery_warehouse_id")
    @JsonIgnore
    private Warehouse deliveryWarehouse;
    private LocalDateTime paymentTime;

    private Long shipCost;

    public OrderLine(Long sellerId, String status, String customerMessage, Order order) {
        this.sellerId = sellerId;
        this.status = status;
        this.customerMessage = customerMessage;
        this.order = order;
    }
}