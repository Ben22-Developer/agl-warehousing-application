package com.resource.server.entity.product.productInStock;

import lombok.*;

import java.util.*;

@Data
public class ProductInStockCreate
{
    private String code;

    private String storageLocation;

    private String name;

    private int quantity;

    private double weight;

    private List<String> base64ImageStrings;

    private String description;
}
