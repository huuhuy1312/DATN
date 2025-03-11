package com.example.order_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    private Long reduceMaxAmount;
    private Long conditionAmount;
    private Double percentReduce;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long maxQuantity;
    private String code;
    private Boolean isActive;

    @ManyToMany(mappedBy = "vouchers") // Quan hệ ngược
    @JsonIgnore
    private Set<Order> orders = new HashSet<>();

    @OneToMany(mappedBy = "voucherOffset")
    @JsonIgnore
    private List<ShippingMethods> shippingMethods;

}
