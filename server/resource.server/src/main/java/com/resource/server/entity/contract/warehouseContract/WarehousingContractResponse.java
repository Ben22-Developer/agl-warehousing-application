package com.resource.server.entity.contract.warehouseContract;

import com.resource.server.entity.contract.goodsReceiptNote.*;
import com.resource.server.entity.contract.purchaseOrder.*;
import com.resource.server.entity.contract.ship.*;
import com.resource.server.entity.user.*;
import lombok.*;

import java.time.*;

@Data
public class WarehousingContractResponse
{
    private long id;

    private String documentIdentifier;

    private PurchaseOrderResponse purchaseOrderResponse;

    private AdvanceShippingNoticeResponse advanceShippingNoticeResponse;

    private GoodsInStockReceiptNoteResponse goodsInStockReceiptNoteResponse;

    private User user;

    private LocalDateTime createdAt;
}
