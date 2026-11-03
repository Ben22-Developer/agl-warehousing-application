package com.resource.server.entity.contract.ship;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShippingDriverInformationCreateRequest {

    private String name;

    private String phoneNumber;

    private String email;
}
