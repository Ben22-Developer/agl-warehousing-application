import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SERVER_READ_CONTRACT_BY_DOCUMENT_IDENTIFIER} from "../../../../path/ServerPath.js";
import {ACCESS_TOKEN} from "../../auth/TokenSlice.js";
import {getRequest} from "../../../../request/requests/GetRequest.js";

const initialState = {
    warehousingAgreements: {},
    isLoading: false,
    error: null
}

export const fetchWarehousingAgreement = createAsyncThunk(
    "fetch-warehousing-agreement",
    async (documentIdentifier, {rejectWithValue}) => {
        try {
            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true,
            }

            const url = `${SERVER_READ_CONTRACT_BY_DOCUMENT_IDENTIFIER}/${documentIdentifier}`;
            return await getRequest({"url": url, header: header, otherConfig: config });
        }
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Something went wrong while fetching warehousing agreement\n1 Check out your connection and try again later.\n2.Our server maybe down please connect to the administrators.");
        }
    }
);

const warehousingAgreementSlice = createSlice({
    name: 'warehousingAgreementSlice',
    initialState,
    reducers: {
        resetState: (state) => {
            state.isLoading = false
            state.error = null
            state.warehousingAgreements = {}
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWarehousingAgreement.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWarehousingAgreement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.warehousingAgreements[action.payload.documentIdentifier] = action.payload;
                state.error = null;
            })
            .addCase(fetchWarehousingAgreement.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
})

export const { resetState } = warehousingAgreementSlice.actions

export default warehousingAgreementSlice.reducer;
