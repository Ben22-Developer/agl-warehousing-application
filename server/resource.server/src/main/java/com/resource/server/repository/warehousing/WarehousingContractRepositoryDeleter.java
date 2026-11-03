package com.resource.server.repository.warehousing;

import com.resource.server.entity.contract.ship.*;
import com.resource.server.entity.contract.warehouseContract.WarehousingContract;
import com.resource.server.entity.contract.goodsReceiptNote.GoodsInStockReceiptNote;
import com.resource.server.entity.contract.purchaseOrder.PurchaseOrder;
import com.resource.server.entity.product.productInStock.ProductInStock;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import com.resource.server.repository.*;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class WarehousingContractRepositoryDeleter
{
    private final EntityManagerFactory entityManagerFactory;

    public void deleteWarehousingContract(WarehousingContract warehousingContract)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        GoodsInStockReceiptNote goodsInStockReceiptNote = warehousingContract.getGoodsInStockReceiptNote();
        AdvanceShippingNotice advanceShippingNotice = warehousingContract.getAdvanceShippingNotice();
        PurchaseOrder purchaseOrder = warehousingContract.getPurchaseOrder();


        goodsInStockReceiptNoteDelete(entityManager, goodsInStockReceiptNote);
        advanceShippingNoticeDelete(entityManager, advanceShippingNotice);
        purchaseOrderDelete(entityManager, purchaseOrder);

        entityManager.getTransaction().begin();
        entityManager.remove(entityManager.merge(warehousingContract));
        MyRepositoryUtils.closeEntityManager(entityManager);
    }

    public void deleteGoodsInStockReceiptNote(GoodsInStockReceiptNote goodsInStockReceiptNote)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();
        goodsInStockReceiptNoteDelete(entityManager, goodsInStockReceiptNote);
        MyRepositoryUtils.closeEntityManager(entityManager);
    }

    public<T> void deleteEntitiesList(List<T> entitiesList)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        for (T shippingDriverInformation : entitiesList)
        {
            entityManager.remove(entityManager.merge(shippingDriverInformation));
        }

        MyRepositoryUtils.closeEntityManager(entityManager);
    }

    private void goodsInStockReceiptNoteDelete(EntityManager entityManager, GoodsInStockReceiptNote goodsInStockReceiptNote)
    {
        if (goodsInStockReceiptNote == null)
            return;

        entityManager.remove(entityManager.merge(goodsInStockReceiptNote));
    }

    private void advanceShippingNoticeDelete(EntityManager entityManager, AdvanceShippingNotice advanceShippingNotice)
    {
        if (advanceShippingNotice == null)
            return;

        entityManager.remove(entityManager.merge(advanceShippingNotice));
    }

    private void purchaseOrderDelete(EntityManager entityManager, PurchaseOrder purchaseOrder)
    {
        if (purchaseOrder == null)
            return;

        entityManager.remove(entityManager.merge(purchaseOrder));
    }
}
