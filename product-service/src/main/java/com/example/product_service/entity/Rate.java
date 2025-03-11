package com.example.product_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "rates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long itemId;
    private Long customerId;
    private String content;
    private Integer rateStar;
    private Date createdDate;
    private String replySeller;
    private String customerName;
    @ManyToOne
    @JoinColumn(name = "type_of_product_id")
    @JsonIgnore
    private TypeOfProduct typeOfProduct;
    public Rate(Long itemId, Long customerId, String content, Integer rateStar,TypeOfProduct typeOfProduct) {
        this.itemId = itemId;
        this.customerId = customerId;
        this.content = content;
        this.rateStar = rateStar;
        this.typeOfProduct = typeOfProduct;
    }
    @PrePersist
    protected void onCreate() {
        this.createdDate = new Date();
    }
}
