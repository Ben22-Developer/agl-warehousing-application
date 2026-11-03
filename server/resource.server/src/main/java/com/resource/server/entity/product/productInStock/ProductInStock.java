package com.resource.server.entity.product.productInStock;

import com.resource.server.entity.contract.goodsReceiptNote.*;
import com.resource.server.entity.product.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
public class ProductInStock extends Product
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String storageLocation;

    @ManyToOne
    @ToString.Exclude
    private GoodsInStockReceiptNote goodsInStockReceiptNote;
}