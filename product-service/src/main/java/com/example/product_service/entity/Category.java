package com.example.product_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "category_parent_id", nullable = true) // Nullable if it's a parent category
    private Category categoryParent;

    @OneToMany(mappedBy = "categoryParent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Category> subcategories; // Represents subcategories

    @OneToMany(mappedBy = "category")
    @JsonBackReference
    private List<Product> products;

}

