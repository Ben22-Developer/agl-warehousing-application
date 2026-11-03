package com.resource.server.entity.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class Product
{
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private long id;

    @Column(unique = true)
    private String code;

    private String name;

    private int quantity;

    private double weight;

    private String description;
}
