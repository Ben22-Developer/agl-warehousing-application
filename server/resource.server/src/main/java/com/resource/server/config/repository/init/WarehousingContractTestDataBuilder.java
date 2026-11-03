package com.resource.server.config.repository.init;

import com.resource.server.entity.contract.goodsReceiptNote.*;
import com.resource.server.entity.contract.purchaseOrder.*;
import com.resource.server.entity.contract.ship.*;
import com.resource.server.entity.contract.supplierInformation.*;
import com.resource.server.entity.contract.warehouseContract.*;
import com.resource.server.entity.product.*;
import com.resource.server.entity.product.productInStock.*;
import com.resource.server.enums.*;

import java.math.*;
import java.time.*;
import java.util.*;

public class WarehousingContractTestDataBuilder {

    public static WarehousingContractCreateRequest buildWarehousingContractCreateRequest(int userIndex) {
        WarehousingContractCreateRequest request = new WarehousingContractCreateRequest();

        PurchaseOrderCreateRequest purchaseOrder = new PurchaseOrderCreateRequest();
        purchaseOrder.setSuppliersInformation(List.of(
                createSupplier("Supplier " + userIndex + "A", "City " + userIndex, "08990292" + userIndex, "supplier" + userIndex + "a@gmail.com"),
                createSupplier("Supplier " + userIndex + "B", "Town " + userIndex, "08990292" + (userIndex + 1), "supplier" + userIndex + "b@gmail.com"),
                createSupplier("Supplier " + userIndex + "C", "Village " + userIndex, "08990292" + (userIndex + 2), "supplier" + userIndex + "c@gmail.com")
        ));
        purchaseOrder.setPurchaseOrderProducts(List.of(
                createPurchaseOrderProduct("1" + userIndex + "001", "Product " + userIndex + "A", 10 + userIndex, 2.5 + userIndex, "Description " + userIndex + "A", new BigDecimal("100" + userIndex)),
                createPurchaseOrderProduct("1" + userIndex + "002", "Product " + userIndex + "B", 15 + userIndex, 0.5 + userIndex, "Description " + userIndex + "B", new BigDecimal("500" + userIndex))
        ));

        AdvanceShippingNoticeCreateRequest advanceShippingNotice = new AdvanceShippingNoticeCreateRequest();
        advanceShippingNotice.setShipmentNumber("SHIP" + userIndex + "001");
        advanceShippingNotice.setShippingDriversInformation(List.of(
                createDriver("Driver " + userIndex + "A", "07123456" + userIndex, "driver" + userIndex + "a@gmail.com"),
                createDriver("Driver " + userIndex + "B", "07123456" + (userIndex + 1), "driver" + userIndex + "b@gmail.com")
        ));
        advanceShippingNotice.setShippedFromAddress("Origin " + userIndex);
        advanceShippingNotice.setShippedToAddress("Destination " + userIndex);
        advanceShippingNotice.setShippingMode(ShippingMode.values()[userIndex % ShippingMode.values().length]);
        advanceShippingNotice.setShippingDate(LocalDate.of(2026, 10, 21 + userIndex));

        request.setPurchaseOrder(purchaseOrder);
        request.setAdvanceShippingNotice(advanceShippingNotice);

        return request;
    }

    public static GoodsInStockReceiptNoteCreateRequest buildGoodsInStockReceiptNoteCreateRequest(String documentIdentifier) {
        GoodsInStockReceiptNoteCreateRequest request = new GoodsInStockReceiptNoteCreateRequest();
        request.setDescription("string");
        request.setPaymentStatus(PaymentStatus.paid);
        request.setGoodsInStockExpiryTime(LocalDateTime.of(2026, 10, 22, 6, 10, 32, 118000000));
        request.setWarehousingContractDocumentIdentifier(documentIdentifier);
        return request;
    }

    public static ProductInStockCreateRequest buildProductInStockCreateRequest(String documentIdentifier, long userIndex)
    {
        ProductInStockCreateRequest request = new ProductInStockCreateRequest();

        List<List<String>> imageUrls = imagesUrls(userIndex);
        List<String> productNames = productNames(userIndex);
        List<String> productDescription= productDescriptions(userIndex);

        request.setProducts(List.of(
                createProductInStock("1" + userIndex + "101", productNames.get(0), 10, 1.5 + userIndex, productDescription.get(0), "Room " + userIndex + "A Shelf 1",
                        imageUrls.getFirst()),
                createProductInStock("1" + userIndex + "102", productNames.get(1), 11, 2.5 + userIndex, productDescription.get(1), "Room " + userIndex + "B Shelf 2",
                        imageUrls.get(1)),
                createProductInStock("1" + userIndex + "103", productNames.get(2), 20, 3.5 + userIndex, productDescription.get(2), "Room " + userIndex + "Z Shelf 3",
                        imageUrls.get(2))
        ));
        request.setWarehousingContractDocumentIdentifier(documentIdentifier);
        return request;
    }

    private static SupplierInformationCreateRequest createSupplier(String name, String location, String phoneNumber, String email) {
        var supplier = new SupplierInformationCreateRequest();
        supplier.setName(name);
        supplier.setLocation(location);
        supplier.setPhoneNumber(phoneNumber);
        supplier.setEmail(email);
        return supplier;
    }

    private static PurchaseOrderProductCreateRequest createPurchaseOrderProduct(String code, String name, int quantity, double weight, String description, BigDecimal unitPrice) {
        var product = new PurchaseOrderProductCreateRequest();
        product.setCode(code);
        product.setName(name);
        product.setQuantity(quantity);
        product.setWeight(weight);
        product.setDescription(description);
        product.setUnitPrice(unitPrice);
        return product;
    }

    private static ShippingDriverInformationCreateRequest createDriver(String name, String phoneNumber, String email) {
        var driver = new ShippingDriverInformationCreateRequest();
        driver.setName(name);
        driver.setPhoneNumber(phoneNumber);
        driver.setEmail(email);
        return driver;
    }

    private static ProductInStockCreate createProductInStock(String code, String name, int quantity, double weight, String description, String storageLocation, List<String> base64StringList) {
        var product = new ProductInStockCreate();
        product.setCode(code);
        product.setName(name);
        product.setQuantity(quantity);
        product.setWeight(weight);
        product.setDescription(description);
        product.setStorageLocation(storageLocation);
        product.setBase64ImageStrings(base64StringList);
        return product;
    }

    private static List<List<String>> imagesUrls (long userIndex)
    {
        List<List<String>> urls = new ArrayList<>();

        if (userIndex == 1)
        {
            urls.add(List.of("https://images.pexels.com/photos/29855877/pexels-photo-29855877.jpeg",
                    "https://images.pexels.com/photos/39308937/pexels-photo-39308937.jpeg",
                    "https://images.pexels.com/photos/8286692/pexels-photo-8286692.jpeg")); // apples

            urls.add(List.of("https://images.pexels.com/photos/5855893/pexels-photo-5855893.jpeg",
                    "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg",
                    "https://images.pexels.com/photos/32218646/pexels-photo-32218646.jpeg")); // music accessories

            urls.add(List.of("https://images.pexels.com/photos/34803969/pexels-photo-34803969.jpeg",
                    "https://images.pexels.com/photos/20066400/pexels-photo-20066400.jpeg",
                    "https://images.pexels.com/photos/1207918/pexels-photo-1207918.jpeg",
                    "https://images.pexels.com/photos/34803977/pexels-photo-34803977.jpeg")); // coffee
        }
        else if (userIndex == 2)
        {
            urls.add(List.of("https://images.pexels.com/photos/17695225/pexels-photo-17695225.jpeg",
                    "https://images.pexels.com/photos/2918534/pexels-photo-2918534.jpeg")); // shoes

            urls.add(List.of("https://images.pexels.com/photos/16117896/pexels-photo-16117896.jpeg",
                    "https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg")); // hand bags

            urls.add(List.of("https://images.pexels.com/photos/31547714/pexels-photo-31547714.jpeg",
                    "https://images.pexels.com/photos/396777/pexels-photo-396777.jpeg",
                    "https://images.pexels.com/photos/11962316/pexels-photo-11962316.jpeg")); // hats
        }
        else
        {
            urls.add(List.of("https://images.pexels.com/photos/1082328/pexels-photo-1082328.jpeg",
                    "https://images.pexels.com/photos/999299/pexels-photo-999299.jpeg")); // headphones

            urls.add(List.of("https://images.pexels.com/photos/9941174/pexels-photo-9941174.jpeg",
                    "https://images.pexels.com/photos/34241691/pexels-photo-34241691.jpeg",
                    "https://images.pexels.com/photos/19482597/pexels-photo-19482597.jpeg")); // speakers

            urls.add(List.of("https://images.pexels.com/photos/7474165/pexels-photo-7474165.jpeg")); // dj set
        }
        return urls;
    }

    private static List<String> productNames (long userIndex) {
        
        if (userIndex == 1) {
            return List.of("Apples", "Music Accessories", "Coffee");

        }
        else if (userIndex == 2) {
            return List.of("Shoes", "Hand Bags", "Hats");
        }
        else {
            return List.of("Headphones", "Speakers", "DJ Set");
        }
    }

    private static List<String> productDescriptions (long userIndex)
    {
        if (userIndex == 1)
        {
            return List.of(
                "Premium organic apples sourced from the finest orchards, crisp and bursting with natural sweetness",
                "Professional-grade music accessories crafted for audiophiles and performers alike",
                "Artisan roasted coffee beans from sustainable farms, delivering rich and complex flavor profiles"
            );

        }
        else if (userIndex == 2)
        {
            return List.of(
                "Stylish footwear collection blending comfort with contemporary design trends",
                "Luxurious handbags crafted from premium materials, perfect for any occasion",
                "Trendy headwear designed to elevate your fashion statement with elegance"
            );
        }
        else
        {
            return List.of(
                "High-fidelity wireless headphones with active noise cancellation and premium sound quality",
                "Powerful Bluetooth speakers delivering immersive audio experience with deep bass",
                "Professional DJ equipment set featuring cutting-edge technology for ultimate performance"
            );
        }
    }
}
