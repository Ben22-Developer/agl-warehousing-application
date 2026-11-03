package com.resource.server.entity.contract.supplierInformation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierInformationCreateRequest {

    private String name;

    private String location;

    private String phoneNumber;

    private String email;
}
