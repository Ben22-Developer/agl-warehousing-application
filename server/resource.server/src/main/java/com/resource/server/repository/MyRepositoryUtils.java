package com.resource.server.repository;

import jakarta.persistence.*;

import java.util.*;

public class MyRepositoryUtils
{
    // User entity
    public static String User = "User";
    public static String UserId = "id";
    public static String UserName = "name";
    public static String UserUsername = "username";
    public static String UserPassword = "password";
    public static String UserProfilePicture = "profilePicture";
    public static String UserCreatedAt = "createdAt";
    public static String UserRole = "role";

    // Role entity
    public static String Role = "Role";
    public static String RoleId = "id";
    public static String RoleName = "name";

    // Product entity
    public static String Product = "Product";
    public static String ProductId = "id";
    public static String ProductCode = "code";
    public static String ProductName = "name";
    public static String ProductQuantity = "quantity";
    public static String ProductWeight = "weight";
    public static String ProductDescription = "description";

    // ProductInStock entity
    public static String ProductInStock = "ProductInStock";
    public static String ProductInStockId = "id";
    public static String ProductInStockStorageLocation = "storageLocation";
    public static String ProductInStockGoodsInStockReceiptNote = "goodsInStockReceiptNote";

    // ProductInStockImage entity
    public static String ProductInStockImage = "ProductInStockImage";
    public static String ProductInStockImageId = "id";
    public static String ProductInStockImageCloudinaryPublicId = "cloudinaryPublicId";
    public static String ProductInStockImageCloudinaryAssetId = "cloudinaryAssetId";
    public static String ProductInStockImageCloudinaryUrl = "cloudinaryUrl";
    public static String ProductInStockImageProductInStock = "productInStock";

    // PurchaseOrderProduct entity
    public static String PurchaseOrderProduct = "PurchaseOrderProduct";
    public static String PurchaseOrderProductId = "id";
    public static String PurchaseOrderProductUnitPrice = "unitPrice";
    public static String PurchaseOrderProductPurchaseOrder = "purchaseOrder";

    // WarehousingContract entity
    public static String WarehousingContract = "WarehousingContract";
    public static String WarehousingContractId = "id";
    public static String WarehousingContractDocumentIdentifier = "documentIdentifier";
    public static String WarehousingContractContractOwner = "contractOwner";
    public static String WarehousingContractCreatedAt = "createdAt";
    public static String WarehousingContractPurchaseOrder = "purchaseOrder";
    public static String WarehousingContractAdvanceShippingNotice = "advanceShippingNotice";
    public static String WarehousingContractGoodsInStockReceiptNote = "goodsInStockReceiptNote";

    // PurchaseOrder entity
    public static String PurchaseOrder = "PurchaseOrder";
    public static String PurchaseOrderId = "id";

    // GoodsInStockReceiptNote entity
    public static String GoodsInStockReceiptNote = "GoodsInStockReceiptNote";
    public static String GoodsInStockReceiptNoteId = "id";
    public static String GoodsInStockReceiptNoteDescription = "description";
    public static String GoodsInStockReceiptNotePaymentStatus = "paymentStatus";
    public static String GoodsInStockReceiptNoteGoodsInStockExpiryTime = "goodsInStockExpiryTime";
    public static String GoodsInStockReceiptNoteGoodsInContractReceiver = "goodsInContractReceiver";
    public static String GoodsInStockReceiptNoteReceivedOn = "receivedOn";

    // AdvanceShippingNotice entity
    public static String AdvanceShippingNotice = "AdvanceShippingNotice";
    public static String AdvanceShippingNoticeId = "id";
    public static String AdvanceShippingNoticeShipmentNumber = "shipmentNumber";
    public static String AdvanceShippingNoticeShippedFromAddress = "shippedFromAddress";
    public static String AdvanceShippingNoticeShippedToAddress = "shippedToAddress";
    public static String AdvanceShippingNoticeShippingMode = "shippingMode";
    public static String AdvanceShippingNoticeShippingDate = "shippingDate";

    // ShippingDriverInformation entity
    public static String ShippingDriverInformation = "ShippingDriverInformation";
    public static String ShippingDriverInformationId = "id";
    public static String ShippingDriverInformationName = "name";
    public static String ShippingDriverInformationPhoneNumber = "phoneNumber";
    public static String ShippingDriverInformationEmail = "email";
    public static String ShippingDriverInformationAdvanceShippingNotice = "advanceShippingNotice";

    // SupplierInformation entity
    public static String SupplierInformation = "SupplierInformation";
    public static String SupplierInformationId = "id";
    public static String SupplierInformationName = "name";
    public static String SupplierInformationLocation = "location";
    public static String SupplierInformationPhoneNumber = "phoneNumber";
    public static String SupplierInformationEmail = "email";
    public static String SupplierInformationPurchaseOrder = "purchaseOrder";



    public static<T> void persistIntoEntityManagerContext (EntityManager entityManager, List<T> list)
    {
        for (T l : list)
            entityManager.persist(l);
    }

    public static void closeEntityManager (EntityManager entityManager)
    {
        entityManager.getTransaction().commit();
        entityManager.close();
    }

    public static String appendInClauseParameters (String parameter, int count)
    {
        StringBuilder builder = new StringBuilder();

        for (int i = 0; i<count; i++)
        {
            builder.append(parameter+(i+1)).append(i == count-1 ? "" : ",");
        }
        return builder.toString();
    }

    public static<T> void setParameters (Query query, List<T> values)
    {
        for (int i = 0; i < values.size(); i++)
        {
            query.setParameter((i+1), values.get(i));
        }
    }
}
