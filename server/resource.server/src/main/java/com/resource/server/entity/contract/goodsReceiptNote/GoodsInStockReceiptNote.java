package com.resource.server.entity.contract.goodsReceiptNote;

import com.resource.server.entity.contract.warehouseContract.*;
import com.resource.server.entity.product.*;
import com.resource.server.entity.user.*;
import com.resource.server.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.*;

import java.time.*;
import java.util.*;

@Entity
@Table
@Getter
@Setter
public class GoodsInStockReceiptNote
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String description;

    private PaymentStatus paymentStatus;

    private LocalDateTime goodsInStockExpiryTime;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @ToString.Exclude
    private User goodsInContractReceiver; // admin / agent who received GoodsInStock

    private LocalDateTime receivedOn;
}