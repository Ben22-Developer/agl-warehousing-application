import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {act} from "react";
import {postRequest} from "../../../request/requests/PostRequest.js";
import {
    SERVER_ACCESS_TOKEN_REFRESH,
    SERVER_AUTHORIZATION_CODE_EXCHANGE,
    SERVER_LOGOUT, SERVER_LOGOUT1
} from "../../../path/ServerPath.js";

export let ACCESS_TOKEN = null;

const initialState = {
    onFetch: false,
    onFetchSuccess: false,
    onFetchError: false,
    onFetchErrorMessage: null,
};

export const logout = createAsyncThunk(
    "logout",
    async (payload, {rejectWithValue}) => {
        try {

            const header = {
                "Content-Type": "application/json; charset=UTF-8",
            }

            const config = {
                withCredentials: true,
            }

            await postRequest({"url": SERVER_LOGOUT1, header:header, otherConfig:config });

            return await postRequest({"url": SERVER_LOGOUT, header:header, otherConfig:config });
        }
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const logoutSlice = createSlice({
    name: "access_token",
    initialState,
    reducers: {
        resetLogoutState: (state) => {
            state.onFetch= false;
            state.onFetchSuccess= false;
            state.onFetchError= false;
            state.onFetchErrorMessage= null;
        }
    },
    extraReducers: (builder) =>
    {
            builder
                .addCase(logout.pending, (state) => {
                    state.onFetch = true
                })
                .addCase(logout.fulfilled, (state, action) => {
                    state.onFetchSuccess = true;
                    state.onFetch = false;
                })
                .addCase(logout.rejected, (state, action) => {
                    state.onFetchError = true;
                    state.onFetch = false;
                    state.onFetchErrorMessage = action.payload;
                })
    }
});

export const {resetLogoutState} = logoutSlice.actions;

export default logoutSlice.reducer;
