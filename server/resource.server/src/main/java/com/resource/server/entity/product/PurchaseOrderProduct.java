package com.resource.server.entity.product;

import com.resource.server.entity.contract.purchaseOrder.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.*;

@Entity
@Getter
@Setter
public class PurchaseOrderProduct extends Product
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @ToString.Exclude
    private PurchaseOrder purchaseOrder;

    private BigDecimal unitPrice;

    public static PurchaseOrderProduct getPurchaseOrderProduct(PurchaseOrderProductCreateRequest e)
    {
        PurchaseOrderProduct purchaseOrderProduct = new PurchaseOrderProduct();

        purchaseOrderProduct.setWeight(e.getWeight());
        purchaseOrderProduct.setUnitPrice(e.getUnitPrice());
        purchaseOrderProduct.setQuantity(e.getQuantity());
        purchaseOrderProduct.setName(e.getName());
        purchaseOrderProduct.setDescription(e.getDescription());
        purchaseOrderProduct.setCode(e.getCode());

        return purchaseOrderProduct;
    }
}
