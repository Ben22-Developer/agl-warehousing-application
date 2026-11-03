package com.resource.server.entity.contract.ship;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Table
@Entity
@Getter
@Setter
public class ShippingDriverInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private String phoneNumber;

    private String email;

    @ManyToOne
    @ToString.Exclude
    private AdvanceShippingNotice advanceShippingNotice;

    public static ShippingDriverInformation getShippingDriverInformation(ShippingDriverInformationCreateRequest driver)
    {
        ShippingDriverInformation shippingDriverInformation = new ShippingDriverInformation();

        shippingDriverInformation.setName(driver.getName());
        shippingDriverInformation.setPhoneNumber(driver.getPhoneNumber());
        shippingDriverInformation.setEmail(driver.getEmail());

        return shippingDriverInformation;
    }
}
