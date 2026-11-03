package com.resource.server.entity.contract.warehouseContract;

import com.resource.server.entity.contract.goodsReceiptNote.*;
import com.resource.server.entity.contract.purchaseOrder.*;
import com.resource.server.entity.contract.ship.*;
import com.resource.server.entity.user.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.*;

import java.time.*;

@Entity
@Table
@Getter
@Setter
public class WarehousingContract
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, nullable = false)
    private String documentIdentifier;

    @ManyToOne
    private User contractOwner;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToOne
    private PurchaseOrder purchaseOrder;

    @OneToOne
    private AdvanceShippingNotice advanceShippingNotice;

    @OneToOne
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private GoodsInStockReceiptNote goodsInStockReceiptNote;
}
