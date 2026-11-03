package com.resource.server.entity.product.productInStock;

import lombok.*;

import java.util.*;

@Data
public class ProductInStockCreateRequest {

    List<ProductInStockCreate> products;

    private String warehousingContractDocumentIdentifier;
}
