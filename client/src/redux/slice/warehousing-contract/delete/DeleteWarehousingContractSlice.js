import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SERVER_DELETE_WAREHOUSING_CONTRACT} from "../../../../path/ServerPath.js";
import {ACCESS_TOKEN} from "../../auth/TokenSlice.js";
import {deleteRequest} from "../../../../request/requests/DeleteRequest.js";

const initialState = {
    isDeleting: false,
    deleteError: null,
    deleteSuccess: false
}

export const deleteWarehousingContract = createAsyncThunk(
    "delete-warehousing-contract",
    async (documentIdentifier, {rejectWithValue}) => {
        try {
            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true,
            }

            const url = `${SERVER_DELETE_WAREHOUSING_CONTRACT}/${documentIdentifier}`;
            return await deleteRequest({"url": url, header: header, otherConfig: config });
        }
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Something went wrong while deleting warehousing contract\n1 Check out your connection and try again later.\n2.Our server maybe down please connect to the administrators.");
        }
    }
);

const deleteWarehousingContractSlice = createSlice({
    name: "deleteWarehousingContractSlice",
    initialState,

    reducers: {
        resetDeleteContractState: (state) => {
            state.isDeleting = false;
            state.deleteError = null;
            state.deleteSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteWarehousingContract.pending, (state) => {
                state.isDeleting = true;
                state.deleteError = null;
                state.deleteSuccess = false;
            })
            .addCase(deleteWarehousingContract.fulfilled, (state) => {
                state.isDeleting = false;
                state.deleteError = null;
                state.deleteSuccess = true;
            })
            .addCase(deleteWarehousingContract.rejected, (state, action) => {
                state.isDeleting = false;
                state.deleteError = action.payload;
                state.deleteSuccess = false;
            })
    }
})

export const
    {
        resetDeleteContractState
    } = deleteWarehousingContractSlice.actions
export default deleteWarehousingContractSlice.reducer
