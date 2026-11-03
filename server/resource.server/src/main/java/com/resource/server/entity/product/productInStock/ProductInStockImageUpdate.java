package com.resource.server.entity.product.productInStock;

import lombok.*;

@Data
public class ProductInStockImageUpdate {

    private String cloudinaryPublicId;

    private boolean hasOnDeleteMark;

    private String base64String;
}
