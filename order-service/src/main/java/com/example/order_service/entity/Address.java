package com.example.order_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String city;
    private String district;
    private String ward;
    private String addressDetails;
    private String nameUser;
    private String phoneNumberUser;
    private Long sellerId;
    private Long customerId;
    private Double longitude;
    private Double latitude;
    @OneToMany(mappedBy = "address")
    @JsonBackReference
    private List<Order> orderList;

    private Boolean isDeleted=false;
    private Boolean isDefault=false;

    @OneToOne(mappedBy = "address")
    @JsonBackReference
    private Warehouse warehouse;
    public Address(String city, String district, String ward, String addressDetails, String nameUser, String phoneNumberUser) {
        this.city = city;
        this.district = district;
        this.ward = ward;
        this.addressDetails = addressDetails;
        this.nameUser = nameUser;
        this.phoneNumberUser = phoneNumberUser;

    }
}
