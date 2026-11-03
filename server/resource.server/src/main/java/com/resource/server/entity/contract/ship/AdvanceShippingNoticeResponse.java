package com.resource.server.entity.contract.ship;

import com.resource.server.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.*;
import java.util.*;

public record AdvanceShippingNoticeResponse (long id, String shippedFromAddress, String shipmentNumber, String shippedToAddress, ShippingMode shippingMode , LocalDate shippingDate, List<ShippingDriverInformation> shippingDriversInformation) {}
