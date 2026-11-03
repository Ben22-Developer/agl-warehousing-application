import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {postRequest} from "../../../request/requests/PostRequest.js";
import {SERVER_TESTING} from "../../../path/ServerPath.js";
import {ACCESS_TOKEN} from "../auth/TokenSlice.js";

const initialState = {
    onFetch: false,
    onFetchSuccess: false,
    onFetchError: false,
};

export const testConnection = createAsyncThunk(
    "test-connection",
    async (payload, {rejectWithValue}) => {
        try {

            const header = {
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true,
            }

            const emptyObject = {}

            return await postRequest({"url": SERVER_TESTING, emptyObject, header:header, otherConfig: config });
        }
        catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const testConnectionSlice = createSlice({
    name: "test_connection",
    initialState,
    reducers: {
        setTestConnectionSliceOnFetch: (state, action) => {
            state.onFetch = action.payload
        },
        setTestConnectionSliceOnFetchError: (state, action) => {
            state.onFetchError = action.payload
        },
        setTestConnectionSliceOnFetchSuccess: (state, action) => {
            state.onFetchSuccess = action.payload
        },
    },
    extraReducers: (builder) =>
    {
        builder
            .addCase(testConnection.pending, (state) => {
            state.onFetch = true
            })
            .addCase(testConnection.fulfilled, (state, action) => {
                state.onFetchSuccess = true;
                state.onFetch = false;
                state.onFetchError = false;
            })
            .addCase(testConnection.rejected, (state, action) => {
                state.onFetchError = true;
                state.onFetch = false;
                state.onFetchSuccess = false;
            })
    }
});

export const {
    setTestConnectionSliceOnFetch,
    setTestConnectionSliceOnFetchError,
    setTestConnectionSliceOnFetchSuccess,
} = testConnectionSlice.actions;

export default testConnectionSlice.reducer;
