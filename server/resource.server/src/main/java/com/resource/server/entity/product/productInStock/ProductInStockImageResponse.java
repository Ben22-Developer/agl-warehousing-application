package com.resource.server.entity.product.productInStock;

import lombok.*;

@Data
public class ProductInStockImageResponse {

    private String cloudinaryPublicId;

    private String cloudinaryAssetId;

    private String cloudinaryUrl;
}
