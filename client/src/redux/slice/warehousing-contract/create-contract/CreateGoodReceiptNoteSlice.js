import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ACCESS_TOKEN} from "../../auth/TokenSlice.js";
import {SERVER_CREATE_GOODS_RECEIPT_NOTE} from "../../../../path/ServerPath.js";
import {postRequest} from "../../../../request/requests/PostRequest.js";


const initialState = {
    isSubmitting: false,
    submitSuccess: false,
    submitError: false,
    submitErrorMessage: null,
    description: null,
    paymentStatus: null,
    goodsInStockExpiryTime: null,
    goodsReceiverUsername:null,
    goodsReceiverRawPassword:null,
    warehousingContractDocumentIdentifier: null
}

export const submitGoodReceiptNote = createAsyncThunk(
    "submit-good-receipt-note",
    async (_, {getState, rejectWithValue}) => {
        try {
            const state = getState();
            const payload = {
                description: state.createGoodReceiptNote.description,
                paymentStatus: state.createGoodReceiptNote.paymentStatus,
                goodsInStockExpiryTime: state.createGoodReceiptNote.goodsInStockExpiryTime,
                goodsReceiverUsername: state.createGoodReceiptNote.goodsReceiverUsername,
                goodsReceiverRawPassword: state.createGoodReceiptNote.goodsReceiverRawPassword,
                warehousingContractDocumentIdentifier: state.createGoodReceiptNote.warehousingContractDocumentIdentifier
            };

            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true,
            }

            return await postRequest({"url": SERVER_CREATE_GOODS_RECEIPT_NOTE, body: payload, header: header, otherConfig: config });
        }
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Something went wrong while submitting the goods receipt note\n1. Check your connection\n2. Make sure you entered valid credentials of the goods receiver.");
        }
    }
);

const createGoodReceiptNoteSlice = createSlice({
    name: "goodReceiptNoteSlice",
    initialState,

    reducers: {
        setGoodReceiptNote: (state, action) =>
        {
            state.description = action.payload.description;
            state.paymentStatus = action.payload.paymentStatus;
            state.goodsInStockExpiryTime = action.payload.goodsInStockExpiryTime;
            state.goodsReceiverUsername = action.payload.goodsReceiverUsername;
            state.goodsReceiverRawPassword = action.payload.goodsReceiverRawPassword;
            state.warehousingContractDocumentIdentifier = action.payload.warehousingContractDocumentIdentifier;
        },
        resetGoodReceiptNoteSubmission: (state) =>
        {
            state.isSubmitting = false;
            state.submitSuccess = false;
            state.submitError = false;
            state.submitErrorMessage = null;

            state.description = null;
            state.paymentStatus = null;
            state.goodsInStockExpiryTime = null;
            state.goodsReceiverUsername = null;
            state.goodsReceiverRawPassword = null;
            state.warehousingContractDocumentIdentifier = null;
        }
    },
    extraReducers: (builder) =>
    {
        builder
            .addCase(submitGoodReceiptNote.pending, (state) => {
                state.isSubmitting = true;
                state.submitSuccess = false;
                state.submitError = false;
                state.submitErrorMessage = null;
            })
            .addCase(submitGoodReceiptNote.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.submitSuccess = true;
                state.submitError = false;
                state.submitErrorMessage = null;
            })
            .addCase(submitGoodReceiptNote.rejected, (state, action) => {
                state.isSubmitting = false;
                state.submitSuccess = false;
                state.submitError = true;
                state.submitErrorMessage = action.payload;
            })
    }
})

export const
    {
        setGoodReceiptNote,
        resetGoodReceiptNoteSubmission
    } = createGoodReceiptNoteSlice.actions
export default createGoodReceiptNoteSlice.reducer
