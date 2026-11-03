package com.resource.server.config.repository.init;

import com.resource.server.entity.contract.goodsReceiptNote.*;
import com.resource.server.entity.contract.purchaseOrder.*;
import com.resource.server.entity.contract.ship.*;
import com.resource.server.entity.contract.supplierInformation.*;
import com.resource.server.entity.contract.warehouseContract.*;
import com.resource.server.entity.grantedAuthorities.*;
import com.resource.server.entity.product.*;
import com.resource.server.entity.user.*;
import com.resource.server.repository.warehousing.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.*;
import java.util.*;
import java.util.stream.*;

import com.resource.server.repository.*;

@RequiredArgsConstructor
public class RepositoryWarehousingContractInit implements RepositoryInit {

    private final EntityManagerFactory entityManagerFactory;
    private WarehousingContractRepositoryCreator warehousingContractRepositoryCreator;

    @Override
    public void init() {
        warehousingContractRepositoryCreator = new WarehousingContractRepositoryCreator(entityManagerFactory);
        warehousingContractInit();
        System.out.println("Warehousing contract initialized successfully");
    }

    private void warehousingContractInit() {
        var entityManager = entityManagerFactory.createEntityManager();
        entityManager.getTransaction().begin();

        var users = entityManager.createQuery(String.format("SELECT u FROM %s u", MyRepositoryUtils.User), User.class)
                .getResultList();

        var contractReceivers = users.stream().filter(e -> e.getRole().getName().equalsIgnoreCase(Role.AdminRole) || e.getRole().getName().equalsIgnoreCase(Role.AgentRole)).collect(Collectors.toUnmodifiableList());

        MyRepositoryUtils.closeEntityManager(entityManager);

        int i = 0;

        for (User user : users)
        {
            var contractReceiver = (i >= contractReceivers.size()) ? contractReceivers.get(contractReceivers.size()-1) : contractReceivers.get(i);
            createWarehousingContractForUser(user, contractReceiver,users.indexOf(user));
            i ++;
        }
    }

    private void createWarehousingContractForUser(User user, User contractReceiver, int contractIndex) {
        var warehousingContractCreateRequest = WarehousingContractTestDataBuilder.buildWarehousingContractCreateRequest(contractIndex);
        var advanceShippingNotice = AdvanceShippingNotice.getAdvanceShippingNotice(warehousingContractCreateRequest.getAdvanceShippingNotice());
        var purchaseOrder = PurchaseOrder.getPurchaseOrder(warehousingContractCreateRequest.getPurchaseOrder());

        var warehousingContract = new WarehousingContract();
        warehousingContract.setAdvanceShippingNotice(advanceShippingNotice);
        warehousingContract.setPurchaseOrder(purchaseOrder);
        warehousingContract.setContractOwner(user);
        warehousingContract.setCreatedAt(LocalDateTime.now());
        warehousingContract.setDocumentIdentifier(user.getUsername() + " warehouse agreement " + contractIndex);

        var shippingDriversInformation = warehousingContractCreateRequest.getAdvanceShippingNotice().getShippingDriversInformation().stream()
                .map(ShippingDriverInformation::getShippingDriverInformation).collect(Collectors.toList());

        var suppliersInformation = warehousingContractCreateRequest.getPurchaseOrder().getSuppliersInformation().stream()
                .map(SupplierInformation::getSupplierInformation).collect(Collectors.toList());

        var purchaseOrderProducts = warehousingContractCreateRequest.getPurchaseOrder().getPurchaseOrderProducts().stream()
                .map(PurchaseOrderProduct::getPurchaseOrderProduct).collect(Collectors.toList());

        shippingDriversInformation.forEach(driver -> driver.setAdvanceShippingNotice(advanceShippingNotice));
        suppliersInformation.forEach(supplier -> supplier.setPurchaseOrder(purchaseOrder));
        purchaseOrderProducts.forEach(product -> product.setPurchaseOrder(purchaseOrder));

        warehousingContractRepositoryCreator.createWarehousingContract(warehousingContract, shippingDriversInformation, suppliersInformation, purchaseOrderProducts);

        var goodsInStockReceiptNoteCreateRequest = WarehousingContractTestDataBuilder.buildGoodsInStockReceiptNoteCreateRequest(warehousingContract.getDocumentIdentifier());
        var goodsInStockReceiptNote = new GoodsInStockReceiptNote();
        goodsInStockReceiptNote.setDescription(goodsInStockReceiptNoteCreateRequest.getDescription());
        goodsInStockReceiptNote.setPaymentStatus(goodsInStockReceiptNoteCreateRequest.getPaymentStatus());
        goodsInStockReceiptNote.setGoodsInStockExpiryTime(goodsInStockReceiptNoteCreateRequest.getGoodsInStockExpiryTime());
        goodsInStockReceiptNote.setReceivedOn(LocalDateTime.now());
        goodsInStockReceiptNote.setGoodsInContractReceiver(contractReceiver);

        warehousingContractRepositoryCreator.createGoodsReceiptNote(warehousingContract, goodsInStockReceiptNote);
    }

}
