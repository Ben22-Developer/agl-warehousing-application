package com.resource.server.repository.warehousing;

import com.resource.server.entity.contract.goodsReceiptNote.*;
import com.resource.server.entity.contract.purchaseOrder.*;
import com.resource.server.entity.contract.ship.*;
import com.resource.server.entity.contract.supplierInformation.*;
import com.resource.server.entity.contract.warehouseContract.*;
import com.resource.server.entity.product.*;
import com.resource.server.entity.product.productInStock.*;
import com.resource.server.service.security.*;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import com.resource.server.repository.*;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class WarehousingContractRepositoryReader
{
    private final EntityManagerFactory entityManagerFactory;

    public WarehousingContract readWarehousingContractByDocumentIdentifier(String documentIdentifier)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        WarehousingContract warehousingContract = readWarehousingContractByDocumentIdentifier(entityManager, documentIdentifier);

        MyRepositoryUtils.closeEntityManager(entityManager);

        return warehousingContract;
    }

    public WarehousingContractResponse readWarehousingContractResponse(String documentIdentifier)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        WarehousingContract warehousingContract = readWarehousingContractByDocumentIdentifier(entityManager, documentIdentifier);

        var purchaseOrder = warehousingContract.getPurchaseOrder();
        var advanceShippingNotice = warehousingContract.getAdvanceShippingNotice();
        var goodsInStockReceiptNote = warehousingContract.getGoodsInStockReceiptNote();

        var purchaseOrderProductList= purchaseOrderProductInformation(entityManager, purchaseOrder);
        var purchaseOrderSupplierList = purchaseOrderSupplierInformation(entityManager, purchaseOrder);

        var shippingDriverInformationList= shippingDriverInformation(entityManager, advanceShippingNotice);

        var productInStockList = productInStockByReceiptNote(entityManager, goodsInStockReceiptNote);

        var warehousingContractResponse =  new WarehousingContractResponse();

        warehousingContractResponse.setId(warehousingContract.getId());
        warehousingContractResponse.setDocumentIdentifier(warehousingContract.getDocumentIdentifier());

        warehousingContractResponse.setPurchaseOrderResponse(new PurchaseOrderResponse(purchaseOrder.getId(), purchaseOrderSupplierList, purchaseOrderProductList));
        warehousingContractResponse.setAdvanceShippingNoticeResponse(new AdvanceShippingNoticeResponse(advanceShippingNotice.getId(), advanceShippingNotice.getShippedFromAddress(), advanceShippingNotice.getShipmentNumber(), advanceShippingNotice.getShippedToAddress(), advanceShippingNotice.getShippingMode(), advanceShippingNotice.getShippingDate(), shippingDriverInformationList));

        if (goodsInStockReceiptNote != null)
            warehousingContractResponse.setGoodsInStockReceiptNoteResponse(new GoodsInStockReceiptNoteResponse(goodsInStockReceiptNote.getId(), goodsInStockReceiptNote.getDescription(), goodsInStockReceiptNote.getPaymentStatus(), goodsInStockReceiptNote.getGoodsInStockExpiryTime(), goodsInStockReceiptNote.getGoodsInContractReceiver(), productInStockList, goodsInStockReceiptNote.getReceivedOn()));

        warehousingContractResponse.setUser(warehousingContract.getContractOwner());
        warehousingContractResponse.setCreatedAt(warehousingContract.getCreatedAt());

        warehousingContract.setGoodsInStockReceiptNote(goodsInStockReceiptNote);


        MyRepositoryUtils.closeEntityManager(entityManager);

        return warehousingContractResponse;
    }

    private WarehousingContract readWarehousingContractByDocumentIdentifier(EntityManager entityManager, String documentIdentifier)
    {
        return entityManager.createQuery(String.format("""
                SELECT w FROM %s w WHERE w.%s = ?1
            """, MyRepositoryUtils.WarehousingContract, MyRepositoryUtils.WarehousingContractDocumentIdentifier)
                        , WarehousingContract.class)
                .setParameter(1, documentIdentifier)
                .getSingleResultOrNull();
    }

    private List<SupplierInformation> purchaseOrderSupplierInformation (EntityManager entityManager, PurchaseOrder purchaseOrder)
    {
        return entityManager.createQuery(String.format("""
                SELECT s FROM %s s WHERE s.%s = ?1
            """, MyRepositoryUtils.SupplierInformation, MyRepositoryUtils.SupplierInformationPurchaseOrder)
                , SupplierInformation.class)
                .setParameter(1, purchaseOrder)
                .getResultList();
    }

    private List<PurchaseOrderProduct> purchaseOrderProductInformation (EntityManager entityManager, PurchaseOrder purchaseOrder)
    {
        return entityManager.createQuery(String.format("""
                SELECT p FROM %s p WHERE p.%s = ?1
            """, MyRepositoryUtils.PurchaseOrderProduct, MyRepositoryUtils.PurchaseOrderProductPurchaseOrder)
                , PurchaseOrderProduct.class)
                .setParameter(1, purchaseOrder)
                .getResultList();
    }

    private List<ShippingDriverInformation> shippingDriverInformation (EntityManager entityManager, AdvanceShippingNotice advanceShippingNotice)
    {
        return entityManager.createQuery(String.format("""
                SELECT shippingDriverInformation FROM %s shippingDriverInformation
                WHERE shippingDriverInformation.%s.id = ?1
            """, MyRepositoryUtils.ShippingDriverInformation, MyRepositoryUtils.ShippingDriverInformationAdvanceShippingNotice)
                , ShippingDriverInformation.class)
                .setParameter(1, advanceShippingNotice.getId())
                .getResultList();
    }

    private List<ProductInStock> productInStockByReceiptNote (EntityManager entityManager, GoodsInStockReceiptNote goodsInStockReceiptNote)
    {
        if (goodsInStockReceiptNote == null)
            return List.of();

        return entityManager.createQuery(String.format("""
                SELECT pis FROM %s pis WHERE pis.%s.id = ?1 
            """, MyRepositoryUtils.ProductInStock, MyRepositoryUtils.ProductInStockGoodsInStockReceiptNote)
                , ProductInStock.class)
                .setParameter(1, goodsInStockReceiptNote.getId())
                .getResultList();
    }

    public long countProductInStockCodeOccurrence(List<String> codeList)
    {
        if (codeList == null || codeList.isEmpty())
            return 0;

        EntityManager entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

         TypedQuery<Long> query = entityManager.createQuery(String.format(
                    """
                        SELECT COUNT(*) FROM %s WHERE %s IN(%s)
                    """,
                    MyRepositoryUtils.ProductInStock, MyRepositoryUtils.ProductCode,
                    MyRepositoryUtils.appendInClauseParameters("?",codeList.size())
                 )
                 , Long.class
            );

         MyRepositoryUtils.setParameters(query, codeList);

         long count = query.getSingleResult();

         MyRepositoryUtils.closeEntityManager(entityManager);

        return count;
    }

    public long readCurrentUserWarehousingContract()
    {
        var entityManager = entityManagerFactory.createEntityManager();

        String username = SecurityContextUtils.getUsername();

        entityManager.getTransaction().begin();

        Long count = entityManager.createQuery(
                        String.format("""
                        SELECT COUNT(warehousingContract) FROM %s warehousingContract
                        JOIN %s user ON user.%s = warehousingContract.%s.id
                        WHERE user.%s = ?1
                        """, MyRepositoryUtils.WarehousingContract, MyRepositoryUtils.User, MyRepositoryUtils.UserId, MyRepositoryUtils.WarehousingContractContractOwner, MyRepositoryUtils.UserUsername)
                        , Long.class)
                .setParameter(1, username)
                .getSingleResultOrNull();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return count;
    }

    public List<String> readDocumentIdentifiersByWarehousingContractUser()
    {
        var entityManager = entityManagerFactory.createEntityManager();

        String username = SecurityContextUtils.getUsername();

        entityManager.getTransaction().begin();

        List<String> documentIdentifiers = entityManager.createQuery(
                        String.format("""
                        SELECT w.%s FROM %s w
                        JOIN %s user ON user.%s = w.%s.id
                        WHERE user.%s = ?1
                        """, MyRepositoryUtils.WarehousingContractDocumentIdentifier, MyRepositoryUtils.WarehousingContract, MyRepositoryUtils.User, MyRepositoryUtils.UserId, MyRepositoryUtils.WarehousingContractContractOwner, MyRepositoryUtils.UserUsername)
                        , String.class)
                .setParameter(1, username)
                .getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return documentIdentifiers;
    }

    public List<String> readDocumentIdentifiersByUserInGoodReceipt()
    {
        var entityManager = entityManagerFactory.createEntityManager();

        String username = SecurityContextUtils.getUsername();

        entityManager.getTransaction().begin();

        List<String> documentIdentifiers = entityManager.createQuery(
                        String.format("""
                        SELECT w.%s FROM %s w
                        JOIN w.%s grn
                        JOIN grn.%s user
                        WHERE user.%s = ?1
                        """, MyRepositoryUtils.WarehousingContractDocumentIdentifier, MyRepositoryUtils.WarehousingContract, MyRepositoryUtils.WarehousingContractGoodsInStockReceiptNote, MyRepositoryUtils.GoodsInStockReceiptNoteGoodsInContractReceiver, MyRepositoryUtils.UserUsername)
                        , String.class)
                .setParameter(1, username)
                .getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return documentIdentifiers;
    }


    public List<String> readDocumentIdentifiers() {

        var entityManager = entityManagerFactory.createEntityManager();

        String username = SecurityContextUtils.getUsername();

        entityManager.getTransaction().begin();

        List<String> documentIdentifiers = entityManager.createQuery(
                        String.format("""
                        SELECT w.%s FROM %s w
                        """, MyRepositoryUtils.WarehousingContractDocumentIdentifier, MyRepositoryUtils.WarehousingContract)
                        , String.class)
                .getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return documentIdentifiers;
    }

    public List<PurchaseOrderProduct> readPurchaseOrderProductByWarehousingContractDocumentIdentifier(String documentIdentifier)
    {
        PurchaseOrder purchaseOrder = readPurchaseOrderByWarehouseDocumentIdentifier(documentIdentifier);

        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        List<PurchaseOrderProduct> purchaseOrderProducts = entityManager.createQuery(String.format("""
                SELECT pop FROM %s pop WHERE pop.%s.id = ?1
            """, MyRepositoryUtils.PurchaseOrderProduct, MyRepositoryUtils.PurchaseOrderProductPurchaseOrder)
                , PurchaseOrderProduct.class)
                .setParameter(1, purchaseOrder.getId())
                .getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return purchaseOrderProducts;
    }

    public List<SupplierInformation> readSuppliersInformationByWarehousingContractDocumentIdentifier(String documentIdentifier)
    {
        PurchaseOrder purchaseOrder = readPurchaseOrderByWarehouseDocumentIdentifier(documentIdentifier);

        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        List<SupplierInformation> suppliersInformation = entityManager.createQuery(String.format("""
                SELECT si FROM %s si WHERE si.%s.id = ?1
            """, MyRepositoryUtils.SupplierInformation, MyRepositoryUtils.SupplierInformationPurchaseOrder)
                , SupplierInformation.class)
                .setParameter(1, purchaseOrder.getId())
                .getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return suppliersInformation;
    }

    public List<ShippingDriverInformation> readShippingDriverInformationByWarehousingContractDocumentIdentifier (String documentIdentifier)
    {
        AdvanceShippingNotice advanceShippingNotice = readAdvanceShippingNoticeByWarehouseDocumentIdentifier(documentIdentifier);

        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        List< ShippingDriverInformation> shippingDriversInformation = entityManager.createQuery(
                        String.format("""
                        SELECT sdi FROM %s sdi
                        JOIN sdi.%s asn
                        WHERE asn.%s = ?1
                        """, MyRepositoryUtils.ShippingDriverInformation, MyRepositoryUtils.ShippingDriverInformationAdvanceShippingNotice, MyRepositoryUtils.AdvanceShippingNoticeId)
                        , ShippingDriverInformation.class)
                .setParameter(1, advanceShippingNotice.getId())
                .getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return shippingDriversInformation;
    }


    public List<ProductInStock> readProductsInStockByWarehousingContractDocumentIdentifier(String documentIdentifier)
    {
        GoodsInStockReceiptNote goodsInStockReceiptNote = readGoodsInStockReceiptNoteByWarehouseDocumentIdentifier(documentIdentifier);

        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        List<ProductInStock> productsInStock = entityManager.createQuery(
                        String.format("""
                        SELECT p FROM %s p
                        JOIN p.%s gsrn
                        WHERE gsrn.%s = ?1
                        """, MyRepositoryUtils.ProductInStock, MyRepositoryUtils.ProductInStockGoodsInStockReceiptNote, MyRepositoryUtils.GoodsInStockReceiptNoteId)
                        , ProductInStock.class)
                .setParameter(1, goodsInStockReceiptNote.getId())
                .getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return productsInStock;
    }

    public List<ProductInStockImage> readProductsInStockImageByProductInStockImageId(List<Long> productInStockId)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        TypedQuery<ProductInStockImage> query = entityManager.createQuery(
                        String.format("""
                        SELECT pisi FROM %s pisi
                        JOIN pisi.%s pis
                        WHERE pis.%s IN (%s)
                        """,MyRepositoryUtils.ProductInStockImage
                                ,MyRepositoryUtils.ProductInStockImageProductInStock
                                ,MyRepositoryUtils.ProductInStockImageId
                                ,MyRepositoryUtils.appendInClauseParameters("?", productInStockId.size()))
                        , ProductInStockImage.class);

        MyRepositoryUtils.setParameters(query, productInStockId);

        List<ProductInStockImage> productInStockImageList = query.getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return productInStockImageList;
    }

    private GoodsInStockReceiptNote readGoodsInStockReceiptNoteByWarehouseDocumentIdentifier (String documentIdentifier)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        GoodsInStockReceiptNote result = entityManager.createQuery(String.format("""
                            SELECT wc.%s FROM %s wc WHERE wc.%s = ?1
                        """, MyRepositoryUtils.WarehousingContractGoodsInStockReceiptNote, MyRepositoryUtils.WarehousingContract, MyRepositoryUtils.WarehousingContractDocumentIdentifier)
                        , GoodsInStockReceiptNote.class)
                .setParameter(1, documentIdentifier)
                .getSingleResultOrNull();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return result;
    }

    private AdvanceShippingNotice readAdvanceShippingNoticeByWarehouseDocumentIdentifier (String documentIdentifier)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        AdvanceShippingNotice result = entityManager.createQuery(String.format("""
                            SELECT wc.%s FROM %s wc WHERE wc.%s = ?1
                        """, MyRepositoryUtils.WarehousingContractAdvanceShippingNotice, MyRepositoryUtils.WarehousingContract, MyRepositoryUtils.WarehousingContractDocumentIdentifier)
                        , AdvanceShippingNotice.class)
                .setParameter(1, documentIdentifier)
                .getSingleResultOrNull();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return result;
    }

    private PurchaseOrder readPurchaseOrderByWarehouseDocumentIdentifier (String documentIdentifier)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        PurchaseOrder result = entityManager.createQuery(String.format("""
                            SELECT wc.%s FROM %s wc WHERE wc.%s = ?1
                        """, MyRepositoryUtils.WarehousingContractPurchaseOrder, MyRepositoryUtils.WarehousingContract, MyRepositoryUtils.WarehousingContractDocumentIdentifier)
                        , PurchaseOrder.class)
                .setParameter(1, documentIdentifier)
                .getSingleResultOrNull();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return result;
    }

    public List<ProductInStock> readProductsInStockByWarehousingContractUser()
    {
        var entityManager = entityManagerFactory.createEntityManager();

        String username = SecurityContextUtils.getUsername();

        entityManager.getTransaction().begin();

        List<ProductInStock> productsInStock = entityManager.createQuery(
                        String.format("""
                        SELECT p FROM %s p
                        JOIN p.%s grn
                        JOIN %s wc ON wc.%s = grn
                        JOIN wc.%s user
                        WHERE user.%s = ?1
                        """, MyRepositoryUtils.ProductInStock, MyRepositoryUtils.ProductInStockGoodsInStockReceiptNote, MyRepositoryUtils.WarehousingContract, MyRepositoryUtils.WarehousingContractGoodsInStockReceiptNote, MyRepositoryUtils.WarehousingContractContractOwner, MyRepositoryUtils.UserUsername)
                        , ProductInStock.class)
                .setParameter(1, username)
                .getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return productsInStock;
    }

    public List<ProductInStock> readProductsInStockByGoodsReceiptUser()
    {
        var entityManager = entityManagerFactory.createEntityManager();

        String username = SecurityContextUtils.getUsername();

        entityManager.getTransaction().begin();

        List<ProductInStock> productsInStock = entityManager.createQuery(
                        String.format("""
                        SELECT p FROM %s p
                        JOIN p.%s grn
                        JOIN grn.%s user
                        WHERE user.%s = ?1
                        """, MyRepositoryUtils.ProductInStock, MyRepositoryUtils.ProductInStockGoodsInStockReceiptNote, MyRepositoryUtils.GoodsInStockReceiptNoteGoodsInContractReceiver, MyRepositoryUtils.UserUsername)
                        , ProductInStock.class)
                .setParameter(1, username)
                .getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return productsInStock;
    }

    public List<ProductInStock> readProductsInStock()
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        List<ProductInStock> productsInStock = entityManager.createQuery(
                        String.format("""
                        SELECT p FROM %s p
                        JOIN p.%s grn
                        """, MyRepositoryUtils.ProductInStock, MyRepositoryUtils.ProductInStockGoodsInStockReceiptNote)
                        , ProductInStock.class)
                .getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return productsInStock;
    }

    public List<ProductInStock> readProductsInStock (List<Long> productInStockIds)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        TypedQuery<ProductInStock> query = entityManager.createQuery(
                String.format("""
                        SELECT p FROM %s p
                        JOIN p.%s grn
                        WHERE p.%s IN(%s)
                        """, MyRepositoryUtils.ProductInStock, MyRepositoryUtils.ProductInStockGoodsInStockReceiptNote, MyRepositoryUtils.ProductInStockId, MyRepositoryUtils.appendInClauseParameters("?", productInStockIds.size()))
                        , ProductInStock.class);

        MyRepositoryUtils.setParameters(query, productInStockIds);

        List<ProductInStock> productsInStock = query.getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return productsInStock;
    }

    public ProductInStock readProductInStock (long productInStockId)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        ProductInStock productsInStock = entityManager.createQuery(
                        String.format("""
                        SELECT p FROM %s p
                        JOIN p.%s grn
                        WHERE p.%s = ?1
                        """, MyRepositoryUtils.ProductInStock, MyRepositoryUtils.ProductInStockGoodsInStockReceiptNote, MyRepositoryUtils.ProductInStockId)
                        , ProductInStock.class)
                .setParameter(1, productInStockId)
                .getSingleResultOrNull();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return productsInStock;
    }

}
