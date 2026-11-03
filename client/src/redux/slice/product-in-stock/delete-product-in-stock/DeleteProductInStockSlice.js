import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {deleteRequest} from "../../../../request/requests/DeleteRequest.js";
import {SERVER_DELETE_PRODUCT_IN_STOCK} from "../../../../path/ServerPath.js";
import {ACCESS_TOKEN} from "../../auth/TokenSlice.js";

const initialState = {
    isDeleting: false,
    deleteSuccess: false,
    deleteError: false,
    deleteErrorMessage: null,
};

export const deleteProductInStock = createAsyncThunk(
    "delete-product-in-stock",
    async (payload, {rejectWithValue}) => {
        try {
            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true,
            }

            console.log(`${SERVER_DELETE_PRODUCT_IN_STOCK}${payload.productInStockId}`)

            return await deleteRequest({url: `${SERVER_DELETE_PRODUCT_IN_STOCK}${payload.productInStockId}`, header: header, otherConfig: config})
        }
        catch(err) {
            console.log(err);
            return rejectWithValue(err.response?.data || "Something went wrong while deleting the product in stock\n1.Check out your connection\n2.Consult our assistant team for better insights.");
        }
    }
)

const deleteProductInStockSlice = createSlice({

    name: "deleteProductInStockSlice",
    initialState,
    reducers: {
        resetDeleteProductInStock: (state) => {
            state.isDeleting = false;
            state.deleteSuccess = false;
            state.deleteError = false;
            state.deleteErrorMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteProductInStock.pending, (state) => {
                state.isDeleting = true;
                state.deleteSuccess = false;
                state.deleteError = false;
                state.deleteErrorMessage = null;
            })
            .addCase(deleteProductInStock.fulfilled, (state) => {
                state.isDeleting = false;
                state.deleteSuccess = true;
                state.deleteError = false;
                state.deleteErrorMessage = null;
            })
            .addCase(deleteProductInStock.rejected, (state, action) => {
                state.isDeleting = false;
                state.deleteSuccess = false;
                state.deleteError = true;
                state.deleteErrorMessage = action.payload;
            })
    }
});

export const {
    resetDeleteProductInStock
} = deleteProductInStockSlice.actions;

export default deleteProductInStockSlice.reducer;
