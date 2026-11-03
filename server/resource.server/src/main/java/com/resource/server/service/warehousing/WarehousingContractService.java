package com.resource.server.service.warehousing;

import com.resource.server.entity.contract.goodsReceiptNote.GoodsInStockReceiptNote;
import com.resource.server.entity.contract.goodsReceiptNote.GoodsInStockReceiptNoteCreateRequest;
import com.resource.server.entity.contract.goodsReceiptNote.GoodsInStockReceiptNoteUpdateRequest;
import com.resource.server.entity.contract.purchaseOrder.*;
import com.resource.server.entity.contract.ship.*;
import com.resource.server.entity.contract.supplierInformation.*;
import com.resource.server.entity.contract.warehouseContract.*;
import com.resource.server.entity.grantedAuthorities.*;
import com.resource.server.entity.product.*;
import com.resource.server.entity.product.productInStock.*;
import com.resource.server.entity.user.*;
import com.resource.server.exception.*;
import com.resource.server.repository.user.UserRepository;
import com.resource.server.repository.warehousing.*;
import com.resource.server.service.client.*;
import com.resource.server.service.security.*;
import lombok.*;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.*;

@Service
@RequiredArgsConstructor
public class WarehousingContractService
{
    private final WarehousingContractRepositoryReader warehousingContractRepositoryReader;
    private final WarehousingContractRepositoryCreator warehousingContractRepositoryCreator;
    private final WarehousingContractRepositoryUpdater warehousingContractRepositoryUpdater;
    private final WarehousingContractRepositoryDeleter warehousingContractRepositoryDeleter;
    private final UserRepository userRepository;

    private final CloudinaryClientService cloudinaryClientService;

    private final SecurityService securityService;

    public WarehousingContractResponse createWarehousingContract(WarehousingContractCreateRequest warehousingContractCreateRequest)
    {
        try {

            AdvanceShippingNotice advanceShippingNotice = AdvanceShippingNotice.getAdvanceShippingNotice(warehousingContractCreateRequest.getAdvanceShippingNotice());

            PurchaseOrder purchaseOrder = PurchaseOrder.getPurchaseOrder(warehousingContractCreateRequest.getPurchaseOrder());

            User user = userRepository.getUserInContext();

            long currentUserWarehousingContract = warehousingContractRepositoryReader.readCurrentUserWarehousingContract();

            WarehousingContract warehousingContract = new WarehousingContract();

            warehousingContract.setAdvanceShippingNotice(advanceShippingNotice);
            warehousingContract.setPurchaseOrder(purchaseOrder);
            warehousingContract.setContractOwner(user);
            warehousingContract.setCreatedAt(LocalDateTime.now());
            warehousingContract.setDocumentIdentifier(SecurityContextUtils.getUsername()+" warehouse agreement " + (currentUserWarehousingContract+1));


            List<ShippingDriverInformation> shippingDriversInformation = warehousingContractCreateRequest.getAdvanceShippingNotice().getShippingDriversInformation().stream().map(driver -> ShippingDriverInformation.getShippingDriverInformation(driver)).collect(Collectors.toList());
            List<SupplierInformation> suppliersInformation = warehousingContractCreateRequest.getPurchaseOrder().getSuppliersInformation().stream().map(supplier -> SupplierInformation.getSupplierInformation(supplier)).collect(Collectors.toList());
            List<PurchaseOrderProduct> purchaseOrderProducts = warehousingContractCreateRequest.getPurchaseOrder().getPurchaseOrderProducts().stream().map(e -> PurchaseOrderProduct.getPurchaseOrderProduct(e)).collect(Collectors.toUnmodifiableList());

            shippingDriversInformation.stream().forEach(driver -> driver.setAdvanceShippingNotice(advanceShippingNotice));
            suppliersInformation.stream().forEach(supplier -> supplier.setPurchaseOrder(purchaseOrder));
            purchaseOrderProducts.stream().forEach(purchaseOrderProduct -> purchaseOrderProduct.setPurchaseOrder(purchaseOrder));

            warehousingContractRepositoryCreator.createWarehousingContract(warehousingContract, shippingDriversInformation, suppliersInformation, purchaseOrderProducts);
            return warehousingContractRepositoryReader.readWarehousingContractResponse(warehousingContract.getDocumentIdentifier());
        }
        catch (Exception ex) {
            throw new ItemsNotCreatedException("Goods not created, possible errors, can be similar product codes!\nPlease consider consulting an agent for further support");
        }
    }

    public GoodsInStockReceiptNote createGoodsReceiptNote(GoodsInStockReceiptNoteCreateRequest goodsInStockReceiptNoteCreateRequest)
    {
        try{
            GoodsInStockReceiptNote goodsInStockReceiptNote = new GoodsInStockReceiptNote();
            goodsInStockReceiptNote.setDescription(goodsInStockReceiptNoteCreateRequest.getDescription());
            goodsInStockReceiptNote.setPaymentStatus(goodsInStockReceiptNoteCreateRequest.getPaymentStatus());
            goodsInStockReceiptNote.setGoodsInStockExpiryTime(goodsInStockReceiptNoteCreateRequest.getGoodsInStockExpiryTime());
            goodsInStockReceiptNote.setReceivedOn(LocalDateTime.now());

            User user = userRepository.getUserByUsername(goodsInStockReceiptNoteCreateRequest.getGoodsReceiverUsername());

            if (user == null ||
                    (!user.getRole().getName().equalsIgnoreCase(Role.AdminRole) && !user.getRole().getName().equalsIgnoreCase(Role.AgentRole)) ||
                    (!securityService.isPasswordValid(goodsInStockReceiptNoteCreateRequest.getGoodsReceiverRawPassword(), user.getPassword()))
            ) {
                throw new ItemNotFoundException("Unknown or invalid contract receiver user.");
            }

            goodsInStockReceiptNote.setGoodsInContractReceiver(user);

            String documentIdentifier = goodsInStockReceiptNoteCreateRequest.getWarehousingContractDocumentIdentifier();
            WarehousingContract warehousingContract = warehousingContractRepositoryReader.readWarehousingContractByDocumentIdentifier(documentIdentifier);

            if (warehousingContract == null)
                throw new ItemNotFoundException("No warehouse found with document identifier " + documentIdentifier);

            if (warehousingContract.getGoodsInStockReceiptNote() != null)
                throw new RuntimeException("Good receipt note for contract " + documentIdentifier + " already exists.");

            warehousingContractRepositoryCreator.createGoodsReceiptNote(warehousingContract, goodsInStockReceiptNote);

            return goodsInStockReceiptNote;
        }
        catch (Exception ex) {
            throw new ItemsNotCreatedException("A good in stock receipt note for this warehousing contract already exists!");
        }
    }


    public List<ProductInStock> createProductInStock(ProductInStockCreateRequest productInStockCreateRequest)
    {
        if (productInStockCreateRequest == null)
            throw new IllegalArgumentException("ProductInStockCreateRequest list cannot be null or empty");

        String documentIdentifier = productInStockCreateRequest.getWarehousingContractDocumentIdentifier();
        WarehousingContract warehousingContract = warehousingContractRepositoryReader.readWarehousingContractByDocumentIdentifier(documentIdentifier);

        if (warehousingContract == null)
            throw new ItemNotFoundException("Warehousing contract not found for document identifier: " + documentIdentifier);

        GoodsInStockReceiptNote goodsInStockReceiptNote = warehousingContract.getGoodsInStockReceiptNote();

        if (goodsInStockReceiptNote == null)
            throw new ItemNotFoundException("GoodsInStockReceiptNote not found for warehousing contract: " + documentIdentifier);

        checkDuplicateProductInStockCode(productInStockCreateRequest);

        HashMap<String,  List<ProductInStockImage>> productInStockImageMap = new HashMap<>();
        HashMap<String,  String> publicIdToBase64StringMap = new HashMap<>();
        List<ProductInStock> productsInStock = getProductsInStockFromProductInStockCreateRequest(productInStockCreateRequest, productInStockImageMap, publicIdToBase64StringMap);

        cloudinaryProductInStockImageUpload(productInStockImageMap, publicIdToBase64StringMap);

        try {
            warehousingContractRepositoryCreator.createProductInStock(goodsInStockReceiptNote, productsInStock, productInStockImageMap);
        }
        catch (RuntimeException e) {
            throw new ItemsNotCreatedException("Goods not created, possible errors, can be similar product codes!\nPlease consider consulting an agent for further support");
        }

        return productsInStock;
    }

    private void checkDuplicateProductInStockCode (ProductInStockCreateRequest productInStockCreateRequest)
    {
        try {
            long count = warehousingContractRepositoryReader.countProductInStockCodeOccurrence(productInStockCreateRequest
                    .getProducts()
                    .stream()
                    .map(e -> e.getCode())
                    .toList());

            if (count > 0)
                throw new RuntimeException();
        }
        catch (Exception e) {
            throw new ItemsNotCreatedException("Sorry we can't save the product in stpck provided as there is duplicated product code.");
        }
    }

    public WarehousingContractResponse readWarehousingContract(String documentIdentifier)
    {
        return warehousingContractRepositoryReader.readWarehousingContractResponse(documentIdentifier);
    }

    public List<String> readDocumentIdentifiersByWarehousingContractUser() {
        return warehousingContractRepositoryReader.readDocumentIdentifiersByWarehousingContractUser();
    }

    public List<String> readDocumentIdentifiersByUserInGoodReceipt() {
        return warehousingContractRepositoryReader.readDocumentIdentifiersByUserInGoodReceipt();
    }

    public List<String> readDocumentIdentifiers() {
        return warehousingContractRepositoryReader.readDocumentIdentifiers();
    }

    public List<ProductInStockResponse> readProductsInStockByWarehousingContractDocumentIdentifier(String documentIdentifier)
    {
        List<ProductInStock> productInStockList = warehousingContractRepositoryReader.readProductsInStockByWarehousingContractDocumentIdentifier(documentIdentifier);
        List<ProductInStockImage> productInStockImageList = warehousingContractRepositoryReader.readProductsInStockImageByProductInStockImageId(productInStockList.stream().map(e -> e.getId()).collect(Collectors.toUnmodifiableList()));

        HashMap<Long, List<ProductInStockImage>> productInStockImageMap = populateProductInStockImageMap(productInStockImageList);

        return convertToProductInStockResponseList(productInStockList, productInStockImageMap);
    }

    public List<ProductInStockResponse> readProductsInStockByWarehousingContractUser()
    {
        List<String> warehouseDocumentIdentifiers = warehousingContractRepositoryReader.readDocumentIdentifiersByWarehousingContractUser();

        List<List<ProductInStock>> allProductInStock = new ArrayList<>();

        for (String warehouseDocumentIdentifier : warehouseDocumentIdentifiers)
        {
            List<ProductInStock> productInStock = warehousingContractRepositoryReader.readProductsInStockByWarehousingContractDocumentIdentifier(warehouseDocumentIdentifier);
            allProductInStock.add(productInStock);
        }

        List<ProductInStock> productInStockList = allProductInStock.stream().flatMap(List::stream).collect(Collectors.toList());
        List<ProductInStockImage> productInStockImageList = warehousingContractRepositoryReader.readProductsInStockImageByProductInStockImageId(productInStockList.stream().map(e -> e.getId()).collect(Collectors.toUnmodifiableList()));

        HashMap<Long, List<ProductInStockImage>> productInStockImageMap = populateProductInStockImageMap(productInStockImageList);

        return convertToProductInStockResponseList(productInStockList, productInStockImageMap);
    }

    public List<ProductInStockResponse> readProductsInStockByGoodsReceiptUser()
    {
        List<ProductInStock> productInStockList = warehousingContractRepositoryReader.readProductsInStockByGoodsReceiptUser();
        List<ProductInStockImage> productInStockImageList = warehousingContractRepositoryReader.readProductsInStockImageByProductInStockImageId(productInStockList.stream().map(e -> e.getId()).collect(Collectors.toUnmodifiableList()));

        HashMap<Long, List<ProductInStockImage>> productInStockImageMap = populateProductInStockImageMap(productInStockImageList);

        return convertToProductInStockResponseList(productInStockList, productInStockImageMap);
    }

    public List<ProductInStockResponse> readProductsInStock()
    {
        List<ProductInStock> productInStockList = warehousingContractRepositoryReader.readProductsInStock();
        List<ProductInStockImage> productInStockImageList = warehousingContractRepositoryReader.readProductsInStockImageByProductInStockImageId(productInStockList.stream().map(e -> e.getId()).collect(Collectors.toUnmodifiableList()));

        HashMap<Long, List<ProductInStockImage>> productInStockImageMap = populateProductInStockImageMap(productInStockImageList);

        return convertToProductInStockResponseList(productInStockList, productInStockImageMap);
    }

    private HashMap<Long, List<ProductInStockImage>> populateProductInStockImageMap (List<ProductInStockImage> productInStockImageList)
    {
        HashMap<Long, List<ProductInStockImage>> productInStockImageMap = new HashMap<>();

        productInStockImageList.forEach(e ->
        {
            if (!productInStockImageMap.containsKey(e.getProductInStock().getId()))
                productInStockImageMap.put(e.getProductInStock().getId(), new ArrayList<>());

            productInStockImageMap.get(e.getProductInStock().getId()).add(e);

        });
        return  productInStockImageMap;
    }

    private List<ProductInStockResponse> convertToProductInStockResponseList(List<ProductInStock> productInStockList, HashMap<Long, List<ProductInStockImage>> productInStockImageMap)
    {
        List<ProductInStockResponse> productInStockResponseList = new ArrayList<>();

        productInStockList.forEach(e ->
        {
            var productInStockImage = productInStockImageMap.get(e.getId());

            var productInStockResponse = new ProductInStockResponse();

            productInStockResponse.setProductInStockId(e.getId());
            productInStockResponse.setCode(e.getCode());
            productInStockResponse.setName(e.getName());
            productInStockResponse.setQuantity(e.getQuantity());
            productInStockResponse.setWeight(e.getWeight());
            productInStockResponse.setDescription(e.getDescription());
            productInStockResponse.setStorageLocation(e.getStorageLocation());
            productInStockResponse.setGoodsInStockReceiptNote(e.getGoodsInStockReceiptNote());

            if (productInStockImage != null)
            {
                productInStockResponse.setProductInStockImageResponseList(
                        productInStockImageMap
                                .get(e.getId())
                                .stream()
                                .map(f -> {
                                    var productInStockImageResponse = new ProductInStockImageResponse();

                                    productInStockImageResponse.setCloudinaryPublicId(f.getCloudinaryPublicId());
                                    productInStockImageResponse.setCloudinaryAssetId(f.getCloudinaryAssetId());
                                    productInStockImageResponse.setCloudinaryUrl(f.getCloudinaryUrl());

                                    return productInStockImageResponse;
                                })
                                .collect(Collectors.toUnmodifiableList())
                );
            }

            productInStockResponseList.add(productInStockResponse);
        });

        return productInStockResponseList;
    }


    public void updateGoodsReceiptNote(String documentIdentifier, GoodsInStockReceiptNoteUpdateRequest goodsInStockReceiptNoteUpdateRequest)
    {
        WarehousingContract warehousingContract = warehousingContractRepositoryReader.readWarehousingContractByDocumentIdentifier(documentIdentifier);

        if (warehousingContract == null)
            throw new ItemNotFoundException("Warehousing contract not found");

        GoodsInStockReceiptNote goodsInStockReceiptNote = warehousingContract.getGoodsInStockReceiptNote();

        if (goodsInStockReceiptNote == null)
            throw new ItemNotFoundException("GoodsInStockReceiptNote not found");

        goodsInStockReceiptNote.setPaymentStatus(goodsInStockReceiptNoteUpdateRequest.getPaymentStatus());
        goodsInStockReceiptNote.setDescription(goodsInStockReceiptNoteUpdateRequest.getDescription());
        goodsInStockReceiptNote.setGoodsInStockExpiryTime(goodsInStockReceiptNoteUpdateRequest.getGoodsInStockExpiryTime());

        warehousingContractRepositoryUpdater.updateGoodsReceiptNote(goodsInStockReceiptNote);
    }

    public void updateProductInStock(long productInStockId, ProductInStockUpdateRequest productInStockUpdateRequest)
    {
        ProductInStock productsInStock = warehousingContractRepositoryReader.readProductInStock(productInStockId);

        if (productsInStock == null)
            throw new ItemNotFoundException("Product to update not found");

        updateProductInStockImage(productsInStock, productInStockUpdateRequest);

        productsInStock.setQuantity(productInStockUpdateRequest.getQuantity());
        productsInStock.setDescription(productInStockUpdateRequest.getDescription());
        productsInStock.setName(productInStockUpdateRequest.getName());
        productsInStock.setWeight(productInStockUpdateRequest.getWeight());
        productsInStock.setStorageLocation(productInStockUpdateRequest.getStorageLocation());

        warehousingContractRepositoryUpdater.updateProductInStock(productsInStock);
    }

    private void updateProductInStockImage (ProductInStock productsInStock, ProductInStockUpdateRequest productInStockUpdateRequest)
    {
        List<ProductInStockImage> productInStockImageList = warehousingContractRepositoryReader.readProductsInStockImageByProductInStockImageId(List.of(productsInStock.getId()));

        Set<String> toDeleteProductInStockImagePublicIdSet = productInStockUpdateRequest.getProductInStockImage().stream().filter(e -> e.isHasOnDeleteMark()).map(e -> e.getCloudinaryPublicId()).collect(Collectors.toUnmodifiableSet());

        List<String> base64List = productInStockUpdateRequest.getProductInStockImage().stream().filter(e -> !e.isHasOnDeleteMark() && !e.getBase64String().isEmpty()).map(e -> e.getBase64String()).collect(Collectors.toUnmodifiableList());

        List<ProductInStockImage> toDeleteProductInStockImageList = productInStockImageList.stream().filter(e -> toDeleteProductInStockImagePublicIdSet.contains(e.getCloudinaryPublicId())).collect(Collectors.toUnmodifiableList());

        HashMap<String,  List<ProductInStockImage>> productInStockImageMap = new HashMap<>();
        HashMap<String,  String> publicIdToBase64StringMap = new HashMap<>();


        base64List.stream().forEach(e ->
        {
            var productInStockImage = instatiateProductInStockImage(productsInStock.getCode());
            populateProductInStockImageDSA(productsInStock.getCode(), e, productInStockImage, productInStockImageMap, publicIdToBase64StringMap);
        });

        cloudinaryProductInStockImageUpload(productInStockImageMap, publicIdToBase64StringMap);

        deleteProductInStockImage(toDeleteProductInStockImageList);

        List<ProductInStockImage> toCreateProductInStockImageList = productInStockImageMap.values().stream().flatMap(List::stream).collect(Collectors.toUnmodifiableList());

        toCreateProductInStockImageList.forEach(e -> e.setProductInStock(productsInStock));

        warehousingContractRepositoryCreator.createProductInStockImage(toCreateProductInStockImageList);
    }



    public void deleteWarehousingContract(String documentIdentifier)
    {
        WarehousingContract warehousingContract = warehousingContractRepositoryReader.readWarehousingContractByDocumentIdentifier(documentIdentifier);

        List<ProductInStock> productInStocks = warehousingContractRepositoryReader.readProductsInStockByWarehousingContractDocumentIdentifier(documentIdentifier);
        List<ProductInStockImage> productInStockImages = warehousingContractRepositoryReader.readProductsInStockImageByProductInStockImageId(productInStocks.stream().map(e -> e.getId()).collect(Collectors.toUnmodifiableList()));
        List<ShippingDriverInformation> shippingDriversInformation = warehousingContractRepositoryReader.readShippingDriverInformationByWarehousingContractDocumentIdentifier(documentIdentifier);
        List<SupplierInformation> suppliersInformation = warehousingContractRepositoryReader.readSuppliersInformationByWarehousingContractDocumentIdentifier(documentIdentifier);
        List<PurchaseOrderProduct> purchaseOrderProducts = warehousingContractRepositoryReader.readPurchaseOrderProductByWarehousingContractDocumentIdentifier(documentIdentifier);

        deleteEntitiesList(productInStockImages);
        deleteEntitiesList(productInStocks);
        deleteEntitiesList(shippingDriversInformation);
        deleteEntitiesList(suppliersInformation);
        deleteEntitiesList(purchaseOrderProducts);

        warehousingContractRepositoryDeleter.deleteWarehousingContract(warehousingContract);
    }

    public void deleteGoodsInStockReceiptNote(String documentIdentifier)
    {
        WarehousingContract warehousingContract = warehousingContractRepositoryReader.readWarehousingContractByDocumentIdentifier(documentIdentifier);

        if (warehousingContract == null)
            throw new ItemNotFoundException("Warehousing contract not found for document identifier: " + documentIdentifier);

        GoodsInStockReceiptNote goodsInStockReceiptNote = warehousingContract.getGoodsInStockReceiptNote();

        if (goodsInStockReceiptNote == null)
            throw new ItemNotFoundException("Goods in stock receipt note not found for document identifier: " + documentIdentifier);

        List<ProductInStock> productInStocks = warehousingContractRepositoryReader.readProductsInStockByWarehousingContractDocumentIdentifier(documentIdentifier);
        List<ProductInStockImage> productInStockImages = warehousingContractRepositoryReader.readProductsInStockImageByProductInStockImageId(productInStocks.stream().map(e -> e.getId()).collect(Collectors.toUnmodifiableList()));

        deleteEntitiesList(productInStockImages);
        deleteEntitiesList(productInStocks);

        warehousingContractRepositoryDeleter.deleteGoodsInStockReceiptNote(warehousingContract.getGoodsInStockReceiptNote());
    }

    public void deleteProductsInStock(List<Long> productInStockIds)
    {
        List<ProductInStock> productsToDelete = warehousingContractRepositoryReader.readProductsInStock(productInStockIds);

        if (productsToDelete.isEmpty())
            throw new ItemNotFoundException("No Product in stock found");

        List<ProductInStockImage> productInStockImageList = warehousingContractRepositoryReader.readProductsInStockImageByProductInStockImageId(productInStockIds);
        deleteProductInStockImage(productInStockImageList);

        deleteEntitiesList(productsToDelete);
    }

    public void deleteProductsInStock(Long productInStockId)
    {
        deleteProductsInStock(List.of(productInStockId));
    }

    private void deleteProductInStockImage (List<ProductInStockImage> toDeleteProductInStockImageList)
    {
        if (toDeleteProductInStockImageList == null || toDeleteProductInStockImageList.isEmpty())
            return;

        cloudinaryProductInStockImageDelete(toDeleteProductInStockImageList);
        deleteEntitiesList(toDeleteProductInStockImageList);
    }

    public<T> void deleteEntitiesList(List<T> entitiesList)
    {
        if (entitiesList.isEmpty())
            return;

        warehousingContractRepositoryDeleter.deleteEntitiesList(entitiesList);
    }

    private List<ProductInStock> getProductsInStockFromProductInStockCreateRequest (ProductInStockCreateRequest productInStockCreateRequest,
                                                                                    HashMap<String,  List<ProductInStockImage>> productInStockImageMap,
                                                                                    HashMap<String,  String> publicIdToBase64StringMap)
    {
        return productInStockCreateRequest.getProducts().stream().map(e ->
        {
            var productInStock = new ProductInStock();

            productInStock.setCode(e.getCode());
            productInStock.setName(e.getName());
            productInStock.setQuantity(e.getQuantity());
            productInStock.setWeight(e.getWeight());
            productInStock.setDescription(e.getDescription());
            productInStock.setStorageLocation(e.getStorageLocation());

            for (String base64String : e.getBase64ImageStrings())
            {
                var productInStockImage = instatiateProductInStockImage(e.getCode());

                populateProductInStockImageDSA (e.getCode(), base64String, productInStockImage, productInStockImageMap, publicIdToBase64StringMap);
            }



            return productInStock;

        }).collect(Collectors.toUnmodifiableList());
    }

    private ProductInStockImage instatiateProductInStockImage (String productCode)
    {
        var productInStockImage = new ProductInStockImage();
        productInStockImage.setCloudinaryPublicId(productCode +"_"+UUID.randomUUID());
        return productInStockImage;
    }

    private void populateProductInStockImageDSA (String productCode,
                                                 String base64String,
                                                 ProductInStockImage productInStockImage,
                                                 HashMap<String,  List<ProductInStockImage>> productInStockImageMap,
                                                 HashMap<String,  String> publicIdToBase64StringMap)
    {
        if (!productInStockImageMap.containsKey(productCode))
            productInStockImageMap.put(productCode, new ArrayList<>());

        productInStockImageMap.get(productCode).add(productInStockImage);
        publicIdToBase64StringMap.put(productInStockImage.getCloudinaryPublicId(), base64String);
    }

    private void cloudinaryProductInStockImageUpload(
            HashMap<String,  List<ProductInStockImage>> productInStockImageMap
            ,HashMap<String,  String> publicIdToBase64StringMap)

    {
        cloudinaryClientService.uploadProductInStockImage(productInStockImageMap, publicIdToBase64StringMap);
    }

    private void cloudinaryProductInStockImageDelete(List<ProductInStockImage> productInStockImageList)
    {
        HashMap<String, String> map = new HashMap<>();

        productInStockImageList.forEach(e -> map.put(e.getCloudinaryAssetId(), e.getCloudinaryPublicId()));

        cloudinaryClientService.deleteProductInStockImageByAssetIdToPublicIdMap(map);
    }
}