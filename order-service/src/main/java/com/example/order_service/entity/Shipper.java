package com.example.order_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Table(name = "shippers")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shipper {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;

    private String name;

    private String phoneNumber;

    private String note;
    @ManyToOne
    @JoinColumn(name = "warehouse_id")
    @JsonIgnore
    private Warehouse warehouse;

    @OneToMany(mappedBy = "pickupShipper")
    @JsonIgnore
    private List<OrderLine> pickupOrderLines;

    @OneToMany(mappedBy = "deliveryShipper")
    @JsonIgnore
    private List<OrderLine> deliveryOrderLines;

    private Long idAccount;

    private Boolean isActive;
    private Boolean isDeleted;
}
