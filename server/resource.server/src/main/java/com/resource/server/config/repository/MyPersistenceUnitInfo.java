package com.resource.server.config.repository;

import com.resource.server.entity.contract.goodsReceiptNote.GoodsInStockReceiptNote;
import com.resource.server.entity.contract.purchaseOrder.*;
import com.resource.server.entity.contract.ship.*;
import com.resource.server.entity.contract.supplierInformation.*;
import com.resource.server.entity.contract.warehouseContract.*;
import com.resource.server.entity.grantedAuthorities.*;
import com.resource.server.entity.product.*;
import com.resource.server.entity.product.productInStock.*;
import com.resource.server.entity.user.*;
import jakarta.persistence.*;
import jakarta.persistence.spi.*;
import lombok.*;
import org.hibernate.jpa.*;

import javax.sql.*;
import java.net.*;
import java.util.*;


@RequiredArgsConstructor
public class MyPersistenceUnitInfo implements PersistenceUnitInfo
{

    private final DataSource hikariDataSource;

    private final String mysqlPersistenceUnitName;

    @Override
    public String getPersistenceUnitName() {
        return mysqlPersistenceUnitName;
    }

    @Override
    public String getPersistenceProviderClassName() {
        return HibernatePersistenceProvider.class.getName();
    }

    @Override
    public String getScopeAnnotationName() {
        return "";
    }

    @Override
    public List<String> getQualifierAnnotationNames() {
        return List.of();
    }


    @Override
    @SuppressWarnings("removal")
    public jakarta.persistence.spi.PersistenceUnitTransactionType getTransactionType() {
        return jakarta.persistence.spi.PersistenceUnitTransactionType.RESOURCE_LOCAL;
    }

    @Override
    public DataSource getJtaDataSource()
    {
        return hikariDataSource;
    }

    @Override
    public DataSource getNonJtaDataSource() {
        return null;
    }

    @Override
    public List<String> getMappingFileNames() {
        return List.of();
    }

    @Override
    public List<URL> getJarFileUrls() {
        return List.of();
    }

    @Override
    public URL getPersistenceUnitRootUrl() {
        return null;
    }

    @Override
    public List<String> getManagedClassNames() {
        return List.of(
            Role.class.getName(),
            User.class.getName(),
            WarehousingContract.class.getName(),
            PurchaseOrder.class.getName(),
            AdvanceShippingNotice.class.getName(),
            ShippingDriverInformation.class.getName(),
            GoodsInStockReceiptNote.class.getName(),
            SupplierInformation.class.getName(),
            Product.class.getName(),
            PurchaseOrderProduct.class.getName(),
            ProductInStock.class.getName(),
            ProductInStockImage.class.getName()
        );
    }

    @Override
    public boolean excludeUnlistedClasses() {
        return false;
    }

    @Override
    public SharedCacheMode getSharedCacheMode() {
        return null;
    }

    @Override
    public ValidationMode getValidationMode() {
        return null;
    }

    @Override
    public Properties getProperties() {
        return null;
    }

    @Override
    public String getPersistenceXMLSchemaVersion() {
        return "";
    }

    @Override
    public ClassLoader getClassLoader() {
        return null;
    }

    @Override
    public void addTransformer(ClassTransformer transformer) {

    }

    @Override
    public ClassLoader getNewTempClassLoader() {
        return null;
    }
}
