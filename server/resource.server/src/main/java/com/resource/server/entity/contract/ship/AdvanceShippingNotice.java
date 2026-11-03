package com.resource.server.entity.contract.ship;

import com.resource.server.entity.contract.warehouseContract.*;
import com.resource.server.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.*;

import java.time.*;
import java.util.*;
import java.util.stream.*;

@Entity
@Table
@Getter
@Setter
public class AdvanceShippingNotice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, nullable = false)
    private String shipmentNumber;

    @Column(nullable = false)
    private String shippedFromAddress;

    @Column(nullable = false)
    private String shippedToAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShippingMode shippingMode;

    @Column(nullable = false)
    private LocalDate shippingDate;

    public static AdvanceShippingNotice getAdvanceShippingNotice(AdvanceShippingNoticeCreateRequest advanceShippingNoticeCreateRequest)
    {
        AdvanceShippingNotice advanceShippingNotice = new AdvanceShippingNotice();

        advanceShippingNotice.setShipmentNumber(advanceShippingNoticeCreateRequest.getShipmentNumber());
        advanceShippingNotice.setShippedFromAddress(advanceShippingNoticeCreateRequest.getShippedFromAddress());
        advanceShippingNotice.setShippedToAddress(advanceShippingNoticeCreateRequest.getShippedToAddress());
        advanceShippingNotice.setShippingDate(advanceShippingNoticeCreateRequest.getShippingDate());
        advanceShippingNotice.setShippingMode(advanceShippingNoticeCreateRequest.getShippingMode());

        return advanceShippingNotice;
    }

    public String toString () {
        return "AdvanceShippingNotice [id=" + id + ", shipmentNumber=" + shipmentNumber + ", shippingDate=" + shippingDate + ", shippingMode=" + shippingMode + "]";
    }
}