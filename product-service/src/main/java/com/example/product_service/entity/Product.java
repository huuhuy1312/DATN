package com.example.product_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String title1;
    private String title2;
    private Long sellerId;
    private String origin;

    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference
    private List<TypeOfProduct> typesOfProducts;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name="category_id")
    private Category category;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name="supplier_id")
    private Supplier supplier;



    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference
    private List<ImageClassification> imageClassificationsList;

    @Column(name = "is_deleted")
    private Boolean isDeleted=false;

    public Product(String name, String title1, String title2, long seller_id, Category category, Supplier supplier,String origin) {
        this.name = name;
        this.title1 = title1;
        this.title2 = title2;
        this.sellerId = seller_id;
        this.category = category;
        this.supplier = supplier;
        this.origin = origin;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now(); // Gán thời gian hiện tại khi tạo đối tượng
    }
}
