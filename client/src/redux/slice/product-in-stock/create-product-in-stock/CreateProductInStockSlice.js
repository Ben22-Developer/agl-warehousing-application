import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {postRequest} from "../../../../request/requests/PostRequest.js";
import {SERVER_CREATE_PRODUCT_IN_STOCK} from "../../../../path/ServerPath.js";
import {ACCESS_TOKEN} from "../../auth/TokenSlice.js";

const initialState = {
    warehousingContractDocumentIdentifier: '',
    products: [{
        code: '',
        storageLocation: '',
        name: '',
        quantity: 0,
        weight: 0,
        description: '',
        base64ImageStrings: []
    }],
    currentIndex: 0,
    isSubmitting: false,
    submitErrorMessage: null,
    submitSuccess: false,
    submitError: false,
};

export const postProductInStock = createAsyncThunk(
    "post-product-in-stock",
    async (payload,  {rejectWithValue}) =>
    {
        try{

            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true
            }

            return await postRequest({url:SERVER_CREATE_PRODUCT_IN_STOCK, body:payload, header: header, otherConfig: config})
        }
        catch(err) {
            console.log(err);
            return rejectWithValue(err.response?.data || "Something went wrong while uploading the products in stock to the server\n1.Check out your connection\n2.Check if you have no similar products in the warehouse with similar codes as u provided\n3.Make sure the warehousing agreement document identifier you entered exist\n4.Consult our assistant team for better insights.");
        }
    }
)

const createProductInStockSlice = createSlice({
    name: "createProductInStockSlice",
    initialState,
    reducers: {
        setProductInStockCreateWarehousingContractDocumentIdentifier: (state, action) => {
            state.warehousingContractDocumentIdentifier = action.payload;
        },
        addProductInStockCreateProduct: (state) => {
            if (state.products.length >= 10) {
                return
            }
            state.products.push({
                code: '',
                storageLocation: '',
                name: '',
                quantity: 0,
                weight: 0,
                description: '',
                base64ImageStrings: []
            });
        },
        setProductInStockFields: (state, action) =>
        {
            const product = state.products[state.currentIndex];

            product.code = action.payload.code;
            product.storageLocation = action.payload.storageLocation;
            product.name = action.payload.name;
            product.quantity = action.payload.quantity;
            product.weight = action.payload.weight;
            product.description = action.payload.description;
            product.base64ImageStrings = action.payload.base64ImageStrings;
        },
        removeProductInStockCreateProduct: (state, action) => {

            if (state.products.length <= 1)
                return

            state.products = state.products.filter((_, index) => index !== action.payload);
            state.currentIndex = action.payload === 0 ? 0 : action.payload-1;
        },
        resetProductInStockCreateForm: (state) => {
            state.warehousingContractDocumentIdentifier = '';
            state.products = [{
                code: '',
                storageLocation: '',
                name: '',
                quantity: 0,
                weight: 0,
                description: '',
                base64ImageStrings: []
            }];
            state.currentIndex = 0;

            state.isSubmitting = false;
            state.submitSuccess = false;
            state.submitError = false;
            state.submitErrorMessage = null;
        },
        setProductInStockCreateNextIndex: (state) => {
            if (state.currentIndex < state.products.length - 1) {
                state.currentIndex += 1;
            }
        },
        setProductInStockCreatePrevIndex: (state) => {
            if (state.currentIndex > 0) {
                state.currentIndex -= 1;
            }
        },
        setSubmitError: (state, action) => {
            state.submitError = action.payload;
        },
        setSubmitSuccess: (state, action) => {
            state.submitSuccess = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(postProductInStock.pending, (state) => {
                state.isSubmitting = true;
                state.submitSuccess = false;
                state.submitError = false;
                state.submitErrorMessage = null;
            })
            .addCase(postProductInStock.fulfilled, (state) => {
                state.isSubmitting = false;
                state.submitSuccess = true;
                state.submitError = false;
                state.submitErrorMessage = null;
            })
            .addCase(postProductInStock.rejected, (state, action) => {
                state.isSubmitting = false;
                state.submitSuccess = false;
                state.submitError = true;
                state.submitErrorMessage = action.payload;
            })
    }
});

export const {
    setProductInStockCreateWarehousingContractDocumentIdentifier,
    addProductInStockCreateProduct,
    removeProductInStockCreateProduct,
    resetProductInStockCreateForm,
    setProductInStockFields,
    setProductInStockCreateNextIndex,
    setProductInStockCreatePrevIndex,
    setSubmitError,
    setSubmitSuccess,
} = createProductInStockSlice.actions;

export default createProductInStockSlice.reducer;
