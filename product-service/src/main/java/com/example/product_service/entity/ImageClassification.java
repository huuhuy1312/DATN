package com.example.product_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Entity(name = "image_classifications")
public class ImageClassification{
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private long id;


    private String classification1;

    private Boolean isDeleted=false;

    @ManyToOne
    @JoinColumn(name="product_id")
    @JsonBackReference(value="product-reference")
    private Product product;

    public ImageClassification( String classification1,Product product)
    {
        this.classification1= classification1;
        this.product=  product;
    }

}
