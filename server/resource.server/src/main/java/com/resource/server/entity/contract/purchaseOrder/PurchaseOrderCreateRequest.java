package com.resource.server.entity.contract.purchaseOrder;

import com.resource.server.entity.contract.supplierInformation.*;
import com.resource.server.entity.product.PurchaseOrderProductCreateRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PurchaseOrderCreateRequest {

    private List<SupplierInformationCreateRequest> suppliersInformation;

    private List<PurchaseOrderProductCreateRequest> purchaseOrderProducts;
}
