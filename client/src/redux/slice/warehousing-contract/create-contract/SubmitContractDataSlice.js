import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ACCESS_TOKEN} from "../../auth/TokenSlice.js";
import {postRequest} from "../../../../request/requests/PostRequest.js";
import {SERVER_CREATE_WAREHOUSING_CONTRACT} from "../../../../path/ServerPath.js";

const initialState = {
    contractData: null,
    isSubmitting: false,
    submitSuccess: false,
    submitError: false,
    submitErrorMessage: null,
}

export const submitContractData = createAsyncThunk(
    "submit-contract-data",
    async (payload, {rejectWithValue}) => {
        try {

            console.log(payload)

            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true,
            }

            return await postRequest({"url": SERVER_CREATE_WAREHOUSING_CONTRACT, body: payload, header: header, otherConfig: config });
        }
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Something went wrong while uploading the contract to the server\n1.Check out your connection\n2.Check if you have no similar products in the warehouse with similar codes as u provided\n3.Make sure the advance shipping number is unique\n4.Consult our assistant team for better insights.");
        }
    }
);

const submitContractDataSlice = createSlice({
    name: "contractData",
    initialState,

    reducers: {
        setContractData: (state, action) =>
        {
            state.contractData = action.payload;
        },
        resetContractSubmission: (state) =>
        {
            state.contractData = null;
            state.isSubmitting = false;
            state.submitSuccess = false;
            state.submitError = false;
            state.submitErrorMessage = null;
        }
    },
    extraReducers: (builder) =>
    {
        builder
            .addCase(submitContractData.pending, (state) => {
                state.isSubmitting = true;
                state.submitSuccess = false;
                state.submitError = false;
                state.submitErrorMessage = null;
            })
            .addCase(submitContractData.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.submitSuccess = true;
                state.submitError = false;
                state.submitErrorMessage = null;
            })
            .addCase(submitContractData.rejected, (state, action) => {
                state.isSubmitting = false;
                state.submitSuccess = false;
                state.submitError = true;
                state.submitErrorMessage = action.payload;
            })
    }
})


export const
    {
        setContractData,
        resetContractSubmission
    } = submitContractDataSlice.actions
export default submitContractDataSlice.reducer
