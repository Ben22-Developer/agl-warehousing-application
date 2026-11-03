import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SERVER_DELETE_GOOD_RECEIPT} from "../../../../path/ServerPath.js";
import {ACCESS_TOKEN} from "../../auth/TokenSlice.js";
import {deleteRequest} from "../../../../request/requests/DeleteRequest.js";

const initialState = {
    isDeleting: false,
    deleteError: null,
    deleteSuccess: false
}

export const deleteGoodReceiptNote = createAsyncThunk(
    "delete-good-receipt-note",
    async (documentIdentifier, {rejectWithValue}) => {
        try {
            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true,
            }

            const url = `${SERVER_DELETE_GOOD_RECEIPT}/${documentIdentifier}/stock-goods-receipt-note`;
            return await deleteRequest({"url": url, header: header, otherConfig: config });
        }
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Something went wrong while deleting good receipt note\n1 Check out your connection and try again later.\n2.Our server maybe down please connect to the administrators.");
        }
    }
);

const deleteGoodReceiptNoteSlice = createSlice({
    name: "deleteGoodReceiptNoteSlice",
    initialState,

    reducers: {
        resetDeleteState: (state) => {
            state.isDeleting = false;
            state.deleteError = null;
            state.deleteSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteGoodReceiptNote.pending, (state) => {
                state.isDeleting = true;
                state.deleteError = null;
                state.deleteSuccess = false;
            })
            .addCase(deleteGoodReceiptNote.fulfilled, (state) => {
                state.isDeleting = false;
                state.deleteError = null;
                state.deleteSuccess = true;
            })
            .addCase(deleteGoodReceiptNote.rejected, (state, action) => {
                state.isDeleting = false;
                state.deleteError = action.payload;
                state.deleteSuccess = false;
            })
    }
})

export const
    {
        resetDeleteState
    } = deleteGoodReceiptNoteSlice.actions
export default deleteGoodReceiptNoteSlice.reducer
