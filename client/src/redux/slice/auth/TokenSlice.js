import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {act} from "react";
import {postRequest} from "../../../request/requests/PostRequest.js";
import {
    SERVER_ACCESS_TOKEN_REFRESH,
    SERVER_AUTHORIZATION_CODE_EXCHANGE,
    SERVER_LOGOUT
} from "../../../path/ServerPath.js";

export let ACCESS_TOKEN = null;

const initialState = {
    isAuthenticated: false,
    onFetch: false,
    onFetchSuccess: false,
    onFetchError: false,
    onFetchErrorMessage: '',
};

export const fetchToken = createAsyncThunk(
    "fetch-token",
    async (payload, {rejectWithValue}) => {
        try {
            const header = {
                "Content-Type": "application/json; charset=UTF-8",
            }

            const config = {
                withCredentials: true,
            }

            return await postRequest({"url": SERVER_AUTHORIZATION_CODE_EXCHANGE, body: {token:payload}, header:header, otherConfig:config });
        }
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const refreshAccessToken = createAsyncThunk(
    "refresh-access-token",
    async (payload, {rejectWithValue}) => {
        try {
            const config = {
                withCredentials: true,
            }

            return await postRequest({"url": SERVER_ACCESS_TOKEN_REFRESH, otherConfig:config });
        }
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const tokenSlice = createSlice({
    name: "access_token",
    initialState,
    reducers: {
        setToken: (state, action) => {
            ACCESS_TOKEN = action.payload;
        },
        clearToken: (state) => {
            ACCESS_TOKEN = '';
            state.isAuthenticated = false;
            state.onFetch = false;
            state.onFetchError = false;
            state.onFetchSuccess = false;
            state.onFetchErrorMessage = "";
        },
        setTokenSliceOnFetch: (state, action) => {
            state.onFetch = action.payload
        },
        setTokenSliceOnFetchError: (state, action) => {
            state.onFetchError = action.payload
        },
        setTokenSliceOnFetchSuccess: (state, action) => {
            state.onFetchSuccess = action.payload
        },
        setTokenSliceOnFetchErrorMessage: (state, action) => {
            state.onFetchErrorMessage = action.payload
        }
    },
    extraReducers: (builder) =>
    {
        builder
            .addCase(fetchToken.pending, (state) => {
            state.onFetch = true
            })
            .addCase(fetchToken.fulfilled, (state, action) => {
                state.onFetchSuccess = true;
                state.onFetch = false;
                state.isAuthenticated = true;
                ACCESS_TOKEN = setAccessToken(action.payload.access_token);
            })
            .addCase(fetchToken.rejected, (state, action) => {
                state.onFetchError = true;
                state.onFetch = false;
                state.onFetchErrorMessage = action.payload;
            }),
        builder
            .addCase(refreshAccessToken.pending, (state) => {
                state.onFetch = true
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.onFetchSuccess = true;
                state.onFetch = false;
                state.isAuthenticated = true;
                ACCESS_TOKEN = setAccessToken(action.payload.access_token);
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                state.onFetchError = true;
                state.onFetch = false;
                state.onFetchErrorMessage = action.payload;
            })
    }
});

export function setAccessToken (accessToken) {
    ACCESS_TOKEN = "Bearer " + accessToken;
}

export const {
    setTokenSliceOnFetch,setTokenSliceOnFetchError,
    setTokenSliceOnFetchSuccess, setTokenSliceOnFetchErrorMessage,
    clearToken
} = tokenSlice.actions;

export default tokenSlice.reducer;
