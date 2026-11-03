package com.resource.server.entity.product.productInStock;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table
@Getter
@Setter
public class ProductInStockImage
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true)
    private String cloudinaryPublicId;

    @Column(unique = true)
    private String cloudinaryAssetId;

    @Column(nullable = false)
    private String cloudinaryUrl;

    @ManyToOne
    private ProductInStock productInStock;
}
