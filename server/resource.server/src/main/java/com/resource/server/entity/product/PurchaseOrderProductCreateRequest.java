package com.resource.server.entity.product;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PurchaseOrderProductCreateRequest {

    private String code;

    private String name;

    private int quantity;

    private double weight;

    private String description;

    private BigDecimal unitPrice;
}
