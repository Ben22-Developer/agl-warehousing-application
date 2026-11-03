package com.resource.server.entity.contract.warehouseContract;

import com.resource.server.entity.contract.purchaseOrder.*;
import com.resource.server.entity.contract.ship.AdvanceShippingNoticeCreateRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WarehousingContractCreateRequest {

    private PurchaseOrderCreateRequest purchaseOrder;

    private AdvanceShippingNoticeCreateRequest advanceShippingNotice;
}
