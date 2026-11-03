import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ACCESS_TOKEN} from "../auth/TokenSlice.js";
import {getRequest} from "../../../request/requests/GetRequest.js";
import {SERVER_USER_PROFILE} from "../../../path/ServerPath.js";

const initialState = {

    hasFetchedUserData: false,
    user: {},
    onFetch: false,
    onFetchSuccess: false,
    onFetchError: false,
    onFetchErrorMessage: null,
}

export const fetchUserData = createAsyncThunk(
    "fetch-user-data",
    async (_, {rejectWithValue}) => {
        try {
            const header = {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: ACCESS_TOKEN
            }

            const config = {
                withCredentials: true,
            }

            return await getRequest({url: SERVER_USER_PROFILE, header: header, otherConfig:config})
        }
        catch (error) {
            console.log(error);
            return rejectWithValue("Failed to fetch user data");
        }
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUser: (state) => {
            setState(state, {},false, false, false, false, null);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) =>
            {
                setState(state, {}, false,true, false, false, null);
            })
            .addCase(fetchUserData.fulfilled, (state, action) =>
            {
                setState(state, action.payload,true, false, true, false, null);
            })
            .addCase(fetchUserData.rejected, (state, action) =>
            {
                setState(state, {}, false, false, false, true, action.payload);
            })
    }
})


function setState(state, user, hasFetchedUserData, onFetch, onFetchSuccess, onFetchError, onFetchErrorMessage)
{
    state.user = user;
    state.hasFetchedUserData = hasFetchedUserData;
    state.onFetch = onFetch;
    state.onFetchSuccess = onFetchSuccess;
    state.onFetchError = onFetchError;
    state.onFetchErrorMessage = onFetchErrorMessage;
}

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
