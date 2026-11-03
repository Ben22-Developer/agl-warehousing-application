import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    documentIdentifier: ""
}

const deleteGoodReceiptNoteSlice = createSlice({
    name: "deleteGoodReceiptNoteSlice",
    initialState,

    reducers: {
        deleteGoodReceiptNote: (state, action) =>
        {
            state.documentIdentifier = action.payload;
        },
        resetDeleteGoodReceiptNote: (state) =>
        {
            state.documentIdentifier = "";
        }
    }
})

export const
    {
        deleteGoodReceiptNote,
        resetDeleteGoodReceiptNote
    } = deleteGoodReceiptNoteSlice.actions
export default deleteGoodReceiptNoteSlice.reducer
