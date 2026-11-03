package com.resource.server.repository.warehousing;

import com.resource.server.entity.contract.goodsReceiptNote.*;
import com.resource.server.entity.product.productInStock.ProductInStock;
import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import com.resource.server.repository.*;

@Repository
@RequiredArgsConstructor
public class WarehousingContractRepositoryUpdater
{
    private final EntityManagerFactory entityManagerFactory;

    public void updateGoodsReceiptNote(GoodsInStockReceiptNote goodsInStockReceiptNote)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        entityManager.merge(goodsInStockReceiptNote);

        MyRepositoryUtils.closeEntityManager(entityManager);
    }

    public void updateProductInStock(ProductInStock productInStock)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        entityManager.merge(productInStock);

        MyRepositoryUtils.closeEntityManager(entityManager);
    }


}
