import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getRequest} from "../../../../request/requests/GetRequest.js";
import {
    SERVER_READ_ADMIN_AGENT_PRODUCT_IN_STOCK,
    SERVER_READ_ADMIN_PRODUCT_IN_STOCK,
    SERVER_READ_PRODUCT_IN_STOCK
} from "../../../../path/ServerPath.js";
import {ACCESS_TOKEN} from "../../auth/TokenSlice.js";

export const productInStockSelectedItems = ["View own product in stock", "View on good receipt product in stock", "View all product in stock"];

export const productInStockSelectedItemsForAdmin = [productInStockSelectedItems[0], productInStockSelectedItems[1], productInStockSelectedItems[2]];

export const productInStockSelectedItemsForAdmin_Agent = [productInStockSelectedItems[0], productInStockSelectedItems[1]];

const initialState = {
    productInStock: [],
    isLoading: false,
    error: null,
    errorMessage: null
};

export const fetchProductInStock = createAsyncThunk(
    "fetch-product-in-stock",
    async (payload, {rejectWithValue}) => {
        try {
            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true
            }

            switch (payload.selectedItem)
            {
                case productInStockSelectedItems[0]:
                    return await getRequest({url: SERVER_READ_PRODUCT_IN_STOCK, header: header, otherConfig: config});

                case productInStockSelectedItems[1]:
                    return await getRequest({url: SERVER_READ_ADMIN_AGENT_PRODUCT_IN_STOCK, header: header, otherConfig: config});

                case productInStockSelectedItems[2]:
                    return await getRequest({url: SERVER_READ_ADMIN_PRODUCT_IN_STOCK, header: header, otherConfig: config});

                default:
                    return await getRequest({url: SERVER_READ_PRODUCT_IN_STOCK, header: header, otherConfig: config})
            }
        }
        catch(err) {
            console.log(err);
            return rejectWithValue(err.response?.data || "Something went wrong while fetching products in stock from the server\n1.Check out your connection\n2.Consult our assistant team for better insights.");
        }
    }
)

const readProductInStockSlice = createSlice({
    name: "readProductInStockSlice",
    initialState,
    reducers: {
        resetProductInStock: (state) => {
            state.productInStock = [];
            state.isLoading = false;
            state.error = null;
            state.errorMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductInStock.pending, (state) => {
                state.isLoading = true;
                state.error = false;
                state.errorMessage = null;
            })
            .addCase(fetchProductInStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = false;
                state.errorMessage = null;
                state.productInStock = action.payload;
            })
            .addCase(fetchProductInStock.rejected, (state, action) => {
                state.isLoading = false;
                state.error = true;
                state.errorMessage = action.payload;
            })
    }
});

export const { resetProductInStock } = readProductInStockSlice.actions;

export default readProductInStockSlice.reducer;