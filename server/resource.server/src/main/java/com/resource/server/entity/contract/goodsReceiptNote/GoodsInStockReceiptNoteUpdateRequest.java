package com.resource.server.entity.contract.goodsReceiptNote;

import com.resource.server.enums.*;
import lombok.Getter;
import lombok.Setter;

import java.time.*;

@Getter
@Setter
public class GoodsInStockReceiptNoteUpdateRequest {

    private String description;

    private PaymentStatus paymentStatus;

    private LocalDateTime goodsInStockExpiryTime;
}
