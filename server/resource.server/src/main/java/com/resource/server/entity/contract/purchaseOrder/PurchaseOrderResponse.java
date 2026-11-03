package com.resource.server.entity.contract.purchaseOrder;

import com.resource.server.entity.contract.supplierInformation.*;
import com.resource.server.entity.product.*;
import lombok.*;

import java.util.*;

public record PurchaseOrderResponse (long id, List<SupplierInformation> supplierInformationList, List<PurchaseOrderProduct> purchaseOrderProductList) {}
