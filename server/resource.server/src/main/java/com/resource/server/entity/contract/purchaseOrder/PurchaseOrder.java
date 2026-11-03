package com.resource.server.entity.contract.purchaseOrder;

import com.resource.server.entity.contract.supplierInformation.*;
import com.resource.server.entity.contract.warehouseContract.*;
import com.resource.server.entity.product.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.*;
import java.util.stream.*;

@Entity
@Table
@Getter
@Setter
public class PurchaseOrder
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    public static PurchaseOrder getPurchaseOrder (PurchaseOrderCreateRequest purchaseOrderCreateRequest)
    {
        PurchaseOrder purchaseOrder = new PurchaseOrder();

        List<PurchaseOrderProduct> purchaseOrderProductList =

                purchaseOrderCreateRequest
                        .getPurchaseOrderProducts()
                        .stream()
                        .map(e ->
                        {
                            PurchaseOrderProduct purchaseOrderProduct = new PurchaseOrderProduct();

                            purchaseOrderProduct.setCode(e.getCode());
                            purchaseOrderProduct.setDescription(e.getDescription());
                            purchaseOrderProduct.setName(e.getName());
                            purchaseOrderProduct.setQuantity(e.getQuantity());
                            purchaseOrderProduct.setUnitPrice(e.getUnitPrice());
                            purchaseOrderProduct.setWeight(e.getWeight());


                            return purchaseOrderProduct;

                        })
                        .collect(Collectors.toUnmodifiableList());


        List<SupplierInformation> suppliersInformation = purchaseOrderCreateRequest
                .getSuppliersInformation()
                .stream()
                .map(e -> {

                    SupplierInformation supplierInformation = new SupplierInformation();

                    supplierInformation.setEmail(e.getEmail());
                    supplierInformation.setName(e.getName());
                    supplierInformation.setPhoneNumber(e.getPhoneNumber());
                    supplierInformation.setLocation(e.getLocation());

                    return supplierInformation;
                })
                .collect(Collectors.toUnmodifiableList());



        return purchaseOrder;
    }
}
