package com.resource.server.repository.warehousing;

import com.resource.server.entity.contract.warehouseContract.WarehousingContract;
import com.resource.server.entity.contract.goodsReceiptNote.GoodsInStockReceiptNote;
import com.resource.server.entity.contract.ship.AdvanceShippingNotice;
import com.resource.server.entity.contract.ship.ShippingDriverInformation;
import com.resource.server.entity.contract.supplierInformation.SupplierInformation;
import com.resource.server.entity.contract.purchaseOrder.PurchaseOrder;
import com.resource.server.entity.product.*;
import com.resource.server.entity.product.productInStock.*;
import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import com.resource.server.repository.*;

import java.util.*;
import java.util.stream.*;

@Repository
@RequiredArgsConstructor
public class WarehousingContractRepositoryCreator
{
    private final EntityManagerFactory entityManagerFactory;

    public void createWarehousingContract(WarehousingContract warehousingContract,
                                          List<ShippingDriverInformation> shippingDriversInformation,
                                          List<SupplierInformation> suppliersInformation,
                                          List<PurchaseOrderProduct> purchaseOrderProducts)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        try {
            entityManager.getTransaction().begin();

            AdvanceShippingNotice advanceShippingNotice = warehousingContract.getAdvanceShippingNotice();
            PurchaseOrder purchaseOrder = warehousingContract.getPurchaseOrder();

            MyRepositoryUtils.persistIntoEntityManagerContext(entityManager, purchaseOrderProducts);
            MyRepositoryUtils.persistIntoEntityManagerContext(entityManager, shippingDriversInformation);
            MyRepositoryUtils.persistIntoEntityManagerContext(entityManager, suppliersInformation);
            MyRepositoryUtils.persistIntoEntityManagerContext(entityManager, List.of(warehousingContract, advanceShippingNotice, purchaseOrder));
        }
        catch (Exception e) {
            entityManager.getTransaction().rollback();
            throw new RuntimeException();
        }
        finally {
            MyRepositoryUtils.closeEntityManager(entityManager);
        }
    }


    public void createGoodsReceiptNote(WarehousingContract warehousingContract, GoodsInStockReceiptNote goodsInStockReceiptNote)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        try {
            entityManager.getTransaction().begin();

            entityManager.persist(goodsInStockReceiptNote);

            var mergedWarehousingContract = entityManager.merge(warehousingContract);

            mergedWarehousingContract.setGoodsInStockReceiptNote(goodsInStockReceiptNote);
        }
        catch (Exception e) {
            entityManager.getTransaction().rollback();
            throw new RuntimeException();
        }
        finally {
            MyRepositoryUtils.closeEntityManager(entityManager);
        }
    }

    public void createProductInStock(
            GoodsInStockReceiptNote goodsInStockReceiptNote
            ,List<ProductInStock> productsInStock
            ,HashMap<String,List<ProductInStockImage>> productInStockImageMap)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        try {
            entityManager.getTransaction().begin();

            for (ProductInStock productInStock : productsInStock)
            {
                productInStock.setGoodsInStockReceiptNote(goodsInStockReceiptNote);
                productInStockImageMap.get(productInStock.getCode()).forEach(productInStockImage -> productInStockImage.setProductInStock(productInStock));
            }

            MyRepositoryUtils.persistIntoEntityManagerContext(entityManager,productsInStock);
            MyRepositoryUtils.persistIntoEntityManagerContext(entityManager, productInStockImageMap.values().stream().flatMap(e -> e.stream()).toList());

        }
        catch (Exception e) {
            entityManager.getTransaction().rollback();
            throw new RuntimeException();
        }
        finally {
            MyRepositoryUtils.closeEntityManager(entityManager);
        }
    }

    public void createProductInStockImage(List<ProductInStockImage> productInStockImageList)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        try {
            entityManager.getTransaction().begin();

            MyRepositoryUtils.persistIntoEntityManagerContext(entityManager, productInStockImageList);

        }
        catch (Exception e) {
            entityManager.getTransaction().rollback();
            throw new RuntimeException();
        }
        finally {
            MyRepositoryUtils.closeEntityManager(entityManager);
        }
    }
}
