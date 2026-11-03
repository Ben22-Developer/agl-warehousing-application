package com.resource.server.entity.product.productInStock;

import lombok.*;

import java.util.*;

@Data
public class ProductInStockUpdateRequest
{
    private String name;

    private int quantity;

    private double weight;

    private String description;

    private String storageLocation;

    private List<ProductInStockImageUpdate> productInStockImage;
}
