package com.resource.server.entity.product.productInStock;

import com.resource.server.entity.contract.goodsReceiptNote.*;
import lombok.*;

import java.util.*;

@Data
public class ProductInStockResponse
{
    private long productInStockId;

    private String code;

    private String name;

    private int quantity;

    private double weight;

    private String description;

    private String storageLocation;

    private GoodsInStockReceiptNote goodsInStockReceiptNote;
    
    List<ProductInStockImageResponse> productInStockImageResponseList;
}
