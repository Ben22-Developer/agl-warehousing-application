package com.resource.server.entity.contract.goodsReceiptNote;

import com.resource.server.entity.product.productInStock.*;
import com.resource.server.entity.user.User;
import com.resource.server.enums.PaymentStatus;

import java.time.LocalDateTime;
import java.util.*;

public record GoodsInStockReceiptNoteResponse(long id, String description, PaymentStatus paymentStatus, LocalDateTime goodsInStockExpiryTime, User user, List<ProductInStock> productInStocktList, LocalDateTime receivedOn) {}
