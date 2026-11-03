import {configureStore} from "@reduxjs/toolkit";
import supplierInformationReducer from "./slice/warehousing-contract/create-contract/SuppliersInformationSlice.js";
import productsReducer from "./slice/warehousing-contract/create-contract/ProductsSlice.js";
import advanceShippingNoticeReducer from "./slice/warehousing-contract/create-contract/AdvanceShippingNoticeSlice.js";
import goodReceiptNoteReducer from "./slice/warehousing-contract/create-contract/CreateGoodReceiptNoteSlice.js";
import submitContractDataReducer from "./slice/warehousing-contract/create-contract/SubmitContractDataSlice.js";
import readContractIdentifiersReducer from "./slice/warehousing-contract/read-contract/ReadContractIdentifiersSlice.js";
import warehouseAgreementsReducer from "./slice/warehousing-contract/read-contract/WarehousingAgreementSlice.js";
import updateGoodReceiptNoteReducer from "./slice/warehousing-contract/update/UpdateGoodReceiptNoteSlice.js";
import deleteGoodReceiptNoteReducer from "./slice/warehousing-contract/delete/DeleteGoodReceiptNoteSlice.js"
import deleteWarehousingContractReducer from "./slice/warehousing-contract/delete/DeleteWarehousingContractSlice.js"
import readProductInStockReducer from "./slice/product-in-stock/read-product-in-stock/ReadProductInStockSlice.js";
import updateProductInStockReducer from "./slice/product-in-stock/update-product-in-stock/UpdateProductInStockSlice.js";
import createProductInStockReducer from "./slice/product-in-stock/create-product-in-stock/CreateProductInStockSlice.js";
import deleteProductInStockReducer from "./slice/product-in-stock/delete-product-in-stock/DeleteProductInStockSlice.js";
import tokenReducer from "./slice/auth/TokenSlice.js";
import logoutReducer from "./slice/auth/LogoutSlice.js";
import testConnectionReducer from "./slice/connection-test/TestConnectionSlice.js";
import userSlice from "./slice/user/UserSlice.js";

export const store = configureStore({
    reducer: {

        // warehousing contract
        purchaseOrderSuppliersInformation: supplierInformationReducer,
        purchaseOrderProducts: productsReducer,
        advanceShippingNotice: advanceShippingNoticeReducer,
        createGoodReceiptNote: goodReceiptNoteReducer,
        submitContractData: submitContractDataReducer,
        contractIdentifiers: readContractIdentifiersReducer,
        warehousingAgreements: warehouseAgreementsReducer,
        updateGoodReceiptNote: updateGoodReceiptNoteReducer,
        deleteGoodReceiptNote: deleteGoodReceiptNoteReducer,
        deleteWarehousingContract: deleteWarehousingContractReducer,


        // product in stock
        readProductInStock: readProductInStockReducer,
        updateProductInStock: updateProductInStockReducer,
        createProductInStock: createProductInStockReducer,
        deleteProductInStock: deleteProductInStockReducer,

        // auth
        token: tokenReducer,
        logout: logoutReducer,

        //user
        user: userSlice,

        // test connection
        testConnection: testConnectionReducer,
    }
});