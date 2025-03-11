package com.example.order_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Table(name = "warehouses")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToOne
    @JoinColumn(name = "address_id")
    @JsonManagedReference
    private Address address;

    @OneToMany(mappedBy = "warehouse")
    @JsonIgnore
    private List<Shipper> shippers;

    private boolean isActive;

    @OneToMany(mappedBy = "pickupWarehouse")
    @JsonIgnore
    private List<OrderLine> pickupOrderLines;

    @OneToMany(mappedBy = "deliveryWarehouse")
    @JsonIgnore
    private List<OrderLine> deliveryOrders;


    private Long idAccount;

    public Warehouse(String name, Address address, boolean isActive, Long idAccount) {
        this.name = name;
        this.address = address;
        this.isActive = isActive;
        this.idAccount = idAccount;
    }
}
