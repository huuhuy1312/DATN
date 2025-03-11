package com.example.order_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "shipping_methods")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShippingMethods {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price_from_0_to_1kg")
    private Long priceFrom0To1kg;

    @Column(name = "price_from_1_to_1_5kg")
    private Long priceFrom1To1_5kg;

    @Column(name = "price_from_1_5_to_2kg")
    private Long priceFrom1_5To2kg;

    @Column(name = "price_next_0_5kg")
    private Long priceNext0_5kg;

    @Column(name = "price_per_1km")
    private Long pricePer1Km;

    private String description;
    private String name;
    private int dayStandard;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "voucher_offset_id")
    private Voucher voucherOffset;

    @OneToMany(mappedBy = "shippingMethods")
    @JsonBackReference
    private List<OrderLine> orderLines;
}
