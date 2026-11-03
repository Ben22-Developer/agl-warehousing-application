package com.resource.server.entity.contract.ship;

import com.resource.server.enums.ShippingMode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class AdvanceShippingNoticeCreateRequest {

    private String shipmentNumber;

    private List<ShippingDriverInformationCreateRequest> shippingDriversInformation;

    private String shippedFromAddress;

    private String shippedToAddress;

    private ShippingMode shippingMode;

    private LocalDate shippingDate;
}
