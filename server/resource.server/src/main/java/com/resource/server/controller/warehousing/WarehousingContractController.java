package com.resource.server.controller.warehousing;

import com.resource.server.entity.contract.goodsReceiptNote.GoodsInStockReceiptNoteCreateRequest;
import com.resource.server.entity.contract.goodsReceiptNote.GoodsInStockReceiptNoteUpdateRequest;
import com.resource.server.entity.contract.warehouseContract.*;
import com.resource.server.entity.product.productInStock.ProductInStockCreateRequest;
import com.resource.server.entity.product.productInStock.ProductInStockUpdateRequest;
import com.resource.server.service.warehousing.WarehousingContractService;
import io.swagger.v3.oas.annotations.*;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/secure")
@RequiredArgsConstructor
public class WarehousingContractController
{
    private final WarehousingContractService warehousingContractService;

    @Operation(summary = "endpoint for a user to create warehouse contract")
    @PostMapping("/warehousing")
    public ResponseEntity<?> createWarehousingContract (@RequestBody WarehousingContractCreateRequest warehousingContractCreateRequest)
    {
        return ResponseEntity.ok(warehousingContractService.createWarehousingContract(warehousingContractCreateRequest));
    }

    @Operation(summary = "endpoint for an admin or an agent to create stock goods receipt note")
    @PostMapping("/warehousing/stock-goods-receipt-note")
    public ResponseEntity<?> createGoodsReceiptNote (@RequestBody GoodsInStockReceiptNoteCreateRequest goodsInStockReceiptNoteCreateRequest)
    {
        return ResponseEntity.ok(warehousingContractService.createGoodsReceiptNote(goodsInStockReceiptNoteCreateRequest));
    }

    @Operation(summary = "endpoint for an admin or an agent to create products in stock")
    @PostMapping("/admin_agent/warehousing/products-in-stock")
    public ResponseEntity<?> createProductInStock (@RequestBody ProductInStockCreateRequest productInStockCreateRequests)
    {
        return ResponseEntity.ok(warehousingContractService.createProductInStock(productInStockCreateRequests));
    }

    @Operation(summary = "endpoint to read warehouse contract by the document identifier")
    @GetMapping("/warehousing/{documentIdentifier}")
    public ResponseEntity<?> readWarehousingAgreement(@PathVariable String documentIdentifier)
    {
        return ResponseEntity.ok(warehousingContractService.readWarehousingContract(documentIdentifier));
    }

    @Operation(summary = "endpoint for a user in the session to read his warehouse contract document identifiers")
    @GetMapping("/warehousing")
    public ResponseEntity<?> readDocumentIdentifiersByWarehousingContractUser() {
        return ResponseEntity.ok(warehousingContractService.readDocumentIdentifiersByWarehousingContractUser());
    }

    @Operation(summary = "endpoint for an admin or agent to read the warehouse contract document identifiers, by the user on good receipt")
    @GetMapping("/admin_agent/warehousing")
    public ResponseEntity<?> readDocumentIdentifiersByUserInGoodReceipt() {
        return ResponseEntity.ok(warehousingContractService.readDocumentIdentifiersByUserInGoodReceipt());
    }

    @Operation(summary = "endpoint for an admin to read the warehouse contract document identifiers")
    @GetMapping("/admin/warehousing")
    public ResponseEntity<?> readDocumentIdentifiers() {
        return ResponseEntity.ok(warehousingContractService.readDocumentIdentifiers());
    }

    @Operation(summary = "endpoint for an admin to read the products in stock")
    @GetMapping("/admin/warehousing/products-in-stock")
    public ResponseEntity<?> readProductsInStock() {
        return ResponseEntity.ok(warehousingContractService.readProductsInStock());
    }

    @Operation(summary = "endpoint for a user in the session to read his products in stock")
    @GetMapping("/warehousing/products-in-stock")
    public ResponseEntity<?> readProductsInStockByWarehousingContractUser()
    {
        return ResponseEntity.ok(warehousingContractService.readProductsInStockByWarehousingContractUser());
    }

    @Operation(summary = "endpoint for an admin or agent to read the products in stock")
    @GetMapping("/admin_agent/warehousing/products-in-stock")
    public ResponseEntity<?> readProductsInStockByGoodsReceiptUser()
    {
        return ResponseEntity.ok(warehousingContractService.readProductsInStockByGoodsReceiptUser());
    }

    @Operation(summary = "endpoint to read products in stock by warehouse contract document identifier")
    @GetMapping("/warehousing/{documentIdentifier}/products-in-stock")
    public ResponseEntity<?> readProductsInStockByWarehousingContractDocumentIdentifier(@PathVariable String documentIdentifier)
    {
        return ResponseEntity.ok(warehousingContractService.readProductsInStockByWarehousingContractDocumentIdentifier(documentIdentifier));
    }

    @Operation(summary = "endpoint for an admin or agent to update the goods receipt note")
    @PatchMapping("/admin_agent/warehousing/{documentIdentifier}/goods-receipt")
    public ResponseEntity<?> updateGoodsReceiptNote(@PathVariable String documentIdentifier, @RequestBody GoodsInStockReceiptNoteUpdateRequest goodsInStockReceiptNoteUpdateRequest)
    {
        warehousingContractService.updateGoodsReceiptNote(documentIdentifier, goodsInStockReceiptNoteUpdateRequest);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "endpoint for an admin or agent to update the products in stock")
    @PatchMapping("/admin_agent/warehousing/products-in-stock/{productInStockId}")
    public ResponseEntity<?> updateProductInStock(@PathVariable long productInStockId, @RequestBody ProductInStockUpdateRequest productInStockUpdateRequest)
    {
        warehousingContractService.updateProductInStock(productInStockId, productInStockUpdateRequest);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "endpoint to delete warehouse contract by document identifier")
    @DeleteMapping("/warehousing/{documentIdentifier}")
    public ResponseEntity<?> deleteWarehousingAgreement(@PathVariable String documentIdentifier)
    {
        warehousingContractService.deleteWarehousingContract(documentIdentifier);
        return ResponseEntity.ok("Warehouse contract deleted successfully");
    }

    @Operation(summary = "endpoint for an admin or agent to delete stock goods receipt note by document identifier")
    @DeleteMapping("/admin_agent/warehousing/{documentIdentifier}/stock-goods-receipt-note")
    public ResponseEntity<?> deleteStockReceiptNote(@PathVariable String documentIdentifier)
    {
        warehousingContractService.deleteGoodsInStockReceiptNote(documentIdentifier);
        return ResponseEntity.ok("Stock goods receipt note deleted successfully");
    }


    @Operation(summary = "endpoint for an admin or agent to delete product in stock by it's id")
    @DeleteMapping("/admin_agent/warehousing/products-in-stock/{productInStockId}")
    public ResponseEntity<?> deleteProductsInStock(@PathVariable long productInStockId)
    {
        warehousingContractService.deleteProductsInStock(productInStockId);
        return ResponseEntity.ok("Selected products deleted successfully");
    }

    @Operation(summary = "endpoint for an admin or agent to delete products in stock by product in stock ids")
    @DeleteMapping("/admin_agent/warehousing/products-in-stock")
    public ResponseEntity<?> deleteProductsInStock(@RequestBody List<Long> productInStockIds)
    {
        warehousingContractService.deleteProductsInStock(productInStockIds);
        return ResponseEntity.ok("Selected products deleted successfully");
    }
}
