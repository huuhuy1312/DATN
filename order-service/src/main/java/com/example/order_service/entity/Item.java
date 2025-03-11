 package com.example.order_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "items")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long typeOfProductId;

    private Long customerId;

    private Integer quantity;

    private Boolean isRated = false;
    @ManyToOne
    @JoinColumn(name = "order_line_id")
    private OrderLine orderLine;


    private Boolean isActive=true;
    public Item(Long typeOfProductId, Long customerId, Integer quantity) {
        this.typeOfProductId = typeOfProductId;
        this.customerId = customerId;
        this.quantity = quantity;
    }

    public Item(Long id, Long typeOfProductId, Long customerId, Integer quantity) {
        this.id = id;
        this.typeOfProductId = typeOfProductId;
        this.customerId = customerId;
        this.quantity = quantity;
    }
}
