package com.example.order_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private LocalDateTime createdAt;
    private Long customerId;

    private String status;
    @ManyToOne
    @JoinColumn(name = "address_ship_id")
    @JsonManagedReference
    private Address address;
    private Long totalAmount;
    private String paymentMethod;

    @OneToMany(mappedBy = "order")
    List<OrderLine> orderLineList;

    @ManyToMany
    @JsonIgnore
    @JoinTable(
            name = "vouchers_orders", // Tên bảng trung gian
            joinColumns = @JoinColumn(name = "order_id"), // Cột liên kết tới bảng Order
            inverseJoinColumns = @JoinColumn(name = "voucher_id") // Cột liên kết tới bảng Voucher
    )
    private Set<Voucher> vouchers = new HashSet<>();


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }






}
