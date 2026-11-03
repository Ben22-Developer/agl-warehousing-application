import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    SERVER_READ_USER_CONTRACT_IDENTIFIERS,
    SERVER_READ_ADMIN_AGENT_CONTRACT_IDENTIFIERS,
    SERVER_READ_ADMIN_CONTRACT_IDENTIFIERS
} from "../../../../path/ServerPath.js";
import {ACCESS_TOKEN} from "../../auth/TokenSlice.js";
import {getRequest} from "../../../../request/requests/GetRequest.js";

export const contractTypeSelectedItems = ["View own contracts", "View contracts on good receipt", "View all contracts"];
export const contractTypeSelectedItemsForAdmin = contractTypeSelectedItems;
export const contractTypeSelectedItemsForAdmin_Agent = [contractTypeSelectedItems[0], contractTypeSelectedItems[1]];

const initialState = {
    documentIdentifiers:[],
    selectedDocumentIdentifier: null,
    isLoading: false,
    error: null,
    hasLoaded: false
}

export const fetchContractIdentifiers = createAsyncThunk(
    "fetch-contract-identifiers",
    async (payload, {rejectWithValue}) => {
        try {
            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true,
            }

            switch (payload.selectedItem) {
                case contractTypeSelectedItems[0]:
                    return await getRequest({url: SERVER_READ_USER_CONTRACT_IDENTIFIERS, header: header, otherConfig: config });
                case contractTypeSelectedItems[1]:
                    return await getRequest({url:  SERVER_READ_ADMIN_AGENT_CONTRACT_IDENTIFIERS, header: header, otherConfig: config });
                case contractTypeSelectedItems[2]:
                    return await getRequest({url: SERVER_READ_ADMIN_CONTRACT_IDENTIFIERS, header: header, otherConfig: config });
                default:
                    return await getRequest({url:  SERVER_READ_USER_CONTRACT_IDENTIFIERS, header: header, otherConfig: config });
            }
        }
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Something went wrong while fetching contract identifiers\n1 Check out your connection and try again later.\n2.Our server maybe down please connect to the administrators.");
        }
    }
);

const readContractIdentifiersSlice = createSlice({
    name: 'readContractIdentifiersSlice',
    initialState,
    reducers:{
        setSelectedDocumentIdentifier: (state, action) => {
            state.selectedDocumentIdentifier = action.payload
        },
        resetState: (state) => {
            state.isLoading = false
            state.error = null
            state.documentIdentifiers = []
            state.hasLoaded = false
            state.selectedDocumentIdentifier = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContractIdentifiers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchContractIdentifiers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.documentIdentifiers = action.payload;
                state.error = null;
                state.hasLoaded = true;
            })
            .addCase(fetchContractIdentifiers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasLoaded = true;
            })
    }
})

export const { setSelectedDocumentIdentifier, resetState } = readContractIdentifiersSlice.actions

export default readContractIdentifiersSlice.reducer;