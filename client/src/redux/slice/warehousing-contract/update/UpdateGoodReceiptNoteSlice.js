import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SERVER_UPDATE_GOOD_RECEIPT} from "../../../../path/ServerPath.js";
import {ACCESS_TOKEN} from "../../auth/TokenSlice.js";
import {patchRequest} from "../../../../request/requests/PatchRequest.js";

const initialState = {
    description: "",
    paymentStatus: "",
    goodsInStockExpiryTime: "",
    warehousingContractDocumentIdentifier: "",
    isUpdating: false,
    updateError: null,
    updateSuccess: false
}

export const updateGoodReceiptNote = createAsyncThunk(
    "update-good-receipt-note",
    async ({documentIdentifier, payload}, {rejectWithValue}) => {
        try {
            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true,
            }

            const url = `${SERVER_UPDATE_GOOD_RECEIPT}/${documentIdentifier}/goods-receipt`;
            return await patchRequest({"url": url, body: payload, header: header, otherConfig: config });
        }
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Something went wrong while updating good receipt note\n1 Check out your connection and try again later.\n2.Our server maybe down please connect to the administrators.");
        }
    }
);

const updateGoodReceiptNoteSlice = createSlice({
    name: "updateGoodReceiptNoteSlice",
    initialState,

    reducers: {
        setUpdateGoodReceiptNote: (state, action) =>
        {
            state.description = action.payload.description;
            state.paymentStatus = action.payload.paymentStatus;
            state.goodsInStockExpiryTime = action.payload.goodsInStockExpiryTime;
            state.warehousingContractDocumentIdentifier = action.payload.warehousingContractDocumentIdentifier;
        },
        resetUpdateState: (state) => {
            state.isUpdating = false;
            state.updateError = null;
            state.updateSuccess = false;

            state.description = "";
            state.paymentStatus = "";
            state.goodsInStockExpiryTime = "";
            state.warehousingContractDocumentIdentifier = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateGoodReceiptNote.pending, (state) => {
                state.isUpdating = true;
                state.updateError = null;
                state.updateSuccess = false;
            })
            .addCase(updateGoodReceiptNote.fulfilled, (state) => {
                state.isUpdating = false;
                state.updateError = null;
                state.updateSuccess = true;
            })
            .addCase(updateGoodReceiptNote.rejected, (state, action) => {
                state.isUpdating = false;
                state.updateError = action.payload;
                state.updateSuccess = false;
            })
    }
})

export const
    {
        setUpdateGoodReceiptNote,
        resetUpdateState
    } = updateGoodReceiptNoteSlice.actions
export default updateGoodReceiptNoteSlice.reducer
