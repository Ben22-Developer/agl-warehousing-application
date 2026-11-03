import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    products:[
        {
            code:"PRD001",
            name:"Industrial Equipment",
            quantity:"100",
            weight:"50.5",
            description:"Heavy machinery for industrial use",
            unitPrice:"1500.00"
        }
    ]
}

const productsSlice = createSlice({
    name: "purchaseOrderProducts",
    initialState,

    reducers: {
        setProducts: (state, action) =>
        {
            state.products = action.payload;
        }
    }
})


export const
    {
        setProducts
    } = productsSlice.actions
export default productsSlice.reducer
