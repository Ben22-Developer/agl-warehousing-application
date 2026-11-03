import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {patchRequest} from "../../../../request/requests/PatchRequest.js";
import {SERVER_UPDATE_PRODUCT_IN_STOCK} from "../../../../path/ServerPath.js";
import {ACCESS_TOKEN} from "../../auth/TokenSlice.js";

const initialState = {
    name: '',
    code: '',
    description: '',
    quantity: 0,
    weight: 0,
    storageLocation: '',
    images: [],
    newImages: [],
    updateProductInStockFieldError: false,
    isUpdating: false,
    updateErrorMessage: null,
    updateSuccess: false,
    updateError: false,
};

export const updateProductInStock = createAsyncThunk(
    "update-product-in-stock",
    async (payload, {rejectWithValue}) => {
        try {
            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true
            }

            const url = SERVER_UPDATE_PRODUCT_IN_STOCK + payload.productInStockId;
            const body = {
                name: payload.name,
                quantity: payload.quantity,
                weight: payload.weight,
                description: payload.description,
                storageLocation: payload.storageLocation,
                productInStockImage: payload.productInStockImage
            };

            return await patchRequest({url: url, body: body, header: header, otherConfig: config})
        }
        catch(err) {
            console.log(err);
            return rejectWithValue(err.response?.data || "Something went wrong while updating the product in stock\n1.Check out your connection\n2.Consult our assistant team for better insights.");
        }
    }
)

const updateProductInStockSlice = createSlice({

    name: "updateProductInStockSlice",
    initialState,
    reducers: {
        setProductInStockUpdateName: (state, action) => {
            state.name = action.payload;
        },
        setProductInStockUpdateCode: (state, action) => {
            state.code = action.payload;
        },
        setProductInStockUpdateDescription: (state, action) => {
            state.description = action.payload;
        },
        setProductInStockUpdateQuantity: (state, action) => {
            state.quantity = action.payload;
        },
        setProductInStockUpdateWeight: (state, action) => {
            state.weight = action.payload;
        },
        setProductInStockUpdateStorageLocation: (state, action) => {
            state.storageLocation = action.payload;
        },
        addProductInStockImages: (state, action) => {
            state.images = action.payload;
        },
        removeProductInStockImages: (state, action) => {

            state.images = state.images.map((e => {

                if (e.cloudinaryPublicId == action.payload.cloudinaryPublicId)
                    e.hasOnDeleteMark = true;
                return e;
            }))

        },
        addProductInStockNewImages: (state, action) => {
            state.newImages.push({ cloudinaryPublicId: "", cloudinaryUrl: action.payload.base64String, hasOnDeleteMark: false, base64String: action.payload.base64String });
        },
        removeProductInStockNewImages: (state, action) => {
            state.newImages = state.newImages.filter((element, index) => index != action.payload.id);
        },
        setUpdateProductInStockFieldError: (state, action) => {
          state.updateProductInStockFieldError = action.payload;
        },
        resetUpdateProductInStock: (state) => {
            state.name = '';
            state.code = '';
            state.description = '';
            state.quantity = 0;
            state.weight = 0;
            state.storageLocation = '';
            state.images = [];
            state.newImages = [];
            state.isUpdating = false;
            state.updateSuccess = false;
            state.updateError = false;
            state.updateErrorMessage = null;
            state.updateProductInStockFieldError = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProductInStock.pending, (state) => {
                state.isUpdating = true;
                state.updateSuccess = false;
                state.updateError = false;
                state.updateErrorMessage = null;
            })
            .addCase(updateProductInStock.fulfilled, (state) => {
                state.isUpdating = false;
                state.updateSuccess = true;
                state.updateError = false;
                state.updateErrorMessage = null;
            })
            .addCase(updateProductInStock.rejected, (state, action) => {
                state.isUpdating = false;
                state.updateSuccess = false;
                state.updateError = true;
                state.updateErrorMessage = action.payload;
            })
    }
});

export const {
    setProductInStockUpdateName, setProductInStockUpdateCode, setProductInStockUpdateDescription,
    setProductInStockUpdateQuantity, setProductInStockUpdateWeight, setProductInStockUpdateStorageLocation,
    addProductInStockImages, removeProductInStockImages, addProductInStockNewImages,
    removeProductInStockNewImages, resetUpdateProductInStock,
    setUpdateProductInStockFieldError
} = updateProductInStockSlice.actions;

export default updateProductInStockSlice.reducer;