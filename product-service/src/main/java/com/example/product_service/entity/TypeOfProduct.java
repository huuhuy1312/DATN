package com.example.product_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity(name = "types_of_product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypeOfProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Nullable
    private String label1;
    @Nullable
    private String label2;
    private Integer quantity;
    private Long originalPrice;
    private Long price;
    private Long cost;
    private Long weight;
    private Long soldQuantity;
    private Boolean isDeleted = false;
    @ManyToOne
    @JoinColumn(name="product_id")
    @JsonBackReference
    private Product product;

    @OneToMany(mappedBy = "typeOfProduct",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private List<Rate> rates;
    public TypeOfProduct(String label1, String label2, Integer quantity, Long price, Long cost, Product product, Long weight,Long originalPrice) {
        this.label1 = label1;
        this.label2 = label2;
        this.quantity = quantity;
        this.price = price;
        this.cost = cost;
        this.product = product;
        this.weight = weight;
        this.originalPrice = originalPrice;
    }

    public TypeOfProduct(@Nullable String label1, @Nullable String label2, int quantity, long price, long cost) {
        this.label1 = label1;
        this.label2 = label2;
        this.quantity = quantity;
        this.price = price;
        this.cost = cost;
    }

    public TypeOfProduct(long id, @Nullable String label1, @Nullable String label2, int quantity, long price, long cost, Product product) {
        this.id = id;
        this.label1 = label1;
        this.label2 = label2;
        this.quantity = quantity;
        this.price = price;
        this.cost = cost;
        this.product = product;
    }

    public TypeOfProduct(Long id, String label1, String label2, Integer quantity, Long price, Long cost, Product product, Long weight, Long originalPrice) {
        this.id = id;
        this.label1 = label1;
        this.label2 = label2;
        this.quantity = quantity;
        this.price = price;
        this.cost = cost;
        this.product = product;
        this.weight = weight;
        this.originalPrice = originalPrice;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + id +
                ", \"label1\":\"" + label1 + "\"" +
                ", \"label2\":\"" + label2 + "\"" +
                ", \"quantity\":" + quantity +
                ", \"price\":" + price +
                ", \"cost\":" + cost +
                "}";
    }
}
