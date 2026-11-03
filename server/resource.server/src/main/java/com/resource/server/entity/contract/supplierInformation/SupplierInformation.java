package com.resource.server.entity.contract.supplierInformation;

import com.fasterxml.jackson.annotation.*;
import com.resource.server.entity.contract.purchaseOrder.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table
@Getter
@Setter
public class SupplierInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private String location;

    private String phoneNumber;

    private String email;

    @ManyToOne
    @ToString.Exclude
    private PurchaseOrder purchaseOrder;

    public static SupplierInformation getSupplierInformation(SupplierInformationCreateRequest supplier) {

        SupplierInformation supplierInformation = new SupplierInformation();

        supplierInformation.setName(supplier.getName());
        supplierInformation.setLocation(supplier.getLocation());
        supplierInformation.setPhoneNumber(supplier.getPhoneNumber());
        supplierInformation.setEmail(supplier.getEmail());

        return supplierInformation;
    }
}
