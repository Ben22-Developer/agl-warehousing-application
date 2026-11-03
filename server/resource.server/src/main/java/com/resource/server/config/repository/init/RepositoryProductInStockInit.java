package com.resource.server.config.repository.init;

import com.resource.server.entity.contract.warehouseContract.WarehousingContract;
import com.resource.server.entity.product.productInStock.*;
import com.resource.server.repository.user.*;
import com.resource.server.repository.warehousing.WarehousingContractRepositoryCreator;
import com.resource.server.repository.warehousing.WarehousingContractRepositoryReader;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;

import java.util.*;
import java.util.stream.*;

@RequiredArgsConstructor
public class RepositoryProductInStockInit implements RepositoryInit {

    private final EntityManagerFactory entityManagerFactory;
    WarehousingContractRepositoryCreator warehousingContractRepositoryCreator;
    WarehousingContractRepositoryReader warehousingContractRepositoryReader;
    UserRepository userRepository;

    @Override
    public void init()
    {
        warehousingContractRepositoryCreator = new WarehousingContractRepositoryCreator(entityManagerFactory);
        warehousingContractRepositoryReader = new WarehousingContractRepositoryReader(entityManagerFactory);
        userRepository = new UserRepository(entityManagerFactory);

        productInStockInit();
        System.out.println("Product in stock initialized successfully");
    }

    private void productInStockInit() {
        var documentIdentifiers = warehousingContractRepositoryReader.readDocumentIdentifiers();
        var userIds = userRepository.getAllUsers().stream().map(e -> e.getId()).collect(Collectors.toUnmodifiableList());

        int i = 0;

        for (String documentIdentifier : documentIdentifiers)
        {
            long userId = (i >= userIds.size()) ? 0 : i;

            createProductInStockForContract(documentIdentifier, userId);
            i ++;
        }
    }

    private void createProductInStockForContract(String documentIdentifier, long userIndex) {
        var productInStockCreateRequest = WarehousingContractTestDataBuilder.buildProductInStockCreateRequest(documentIdentifier, userIndex);

        WarehousingContract warehousingContract = warehousingContractRepositoryReader.readWarehousingContractByDocumentIdentifier(documentIdentifier);

        if (warehousingContract == null)
            throw new RuntimeException("Warehousing contract not found for document identifier: " + documentIdentifier);

        var goodsInStockReceiptNote = warehousingContract.getGoodsInStockReceiptNote();

        if (goodsInStockReceiptNote == null)
            throw new RuntimeException("GoodsInStockReceiptNote not found for warehousing contract: " + documentIdentifier);

        HashMap<String, List<ProductInStockImage>> productInStockImageMap = new HashMap<>();

        List<ProductInStock> productsInStock = productInStockCreateRequest
                .getProducts()
                .stream()
                .map(e -> {
                    var productInStock = new ProductInStock();
                    productInStock.setCode(e.getCode());
                    productInStock.setName(e.getName());
                    productInStock.setQuantity(e.getQuantity());
                    productInStock.setWeight(e.getWeight());
                    productInStock.setDescription(e.getDescription());
                    productInStock.setStorageLocation(e.getStorageLocation());

                    for (String getBase64String : e.getBase64ImageStrings()) {
                        var productInStockImage = new ProductInStockImage();
                        productInStockImage.setCloudinaryPublicId(e.getCode() + "_" + UUID.randomUUID());
                        productInStockImage.setCloudinaryAssetId(e.getCode() + "_asset_id_" + UUID.randomUUID());
                        productInStockImage.setCloudinaryUrl(getBase64String);

                        if (!productInStockImageMap.containsKey(e.getCode()))
                            productInStockImageMap.put(e.getCode(), new ArrayList<>());

                        productInStockImageMap.get(e.getCode()).add(productInStockImage);
                    }

                    return productInStock;
                }).collect(Collectors.toUnmodifiableList());

        warehousingContractRepositoryCreator.createProductInStock(goodsInStockReceiptNote, productsInStock, productInStockImageMap);
    }

    private int extractUserIndexFromDocumentIdentifier(String documentIdentifier) {
        String[] parts = documentIdentifier.split(" ");
        return Integer.parseInt(parts[parts.length - 1]);
    }
}
