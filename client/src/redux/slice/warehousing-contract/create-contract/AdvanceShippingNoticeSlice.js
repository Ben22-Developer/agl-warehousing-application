import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    shipmentNumber: 'SHP001',
    shippedFromAddress: 'Kigali Kicukiro',
    shippedToAddress: 'Musanze Rubavu',
    shippingMode: 'ground',
    shippingDate: '2024-12-15',
    shippingDriversInformation: [
        {
            name: 'John Mugabo',
            phoneNumber: '+250780270994',
            email: 'johnmugabo@gmail.com'
        }
    ]
}

const advanceShippingNoticeSlice = createSlice({
    name: "advanceShippingNotice",
    initialState,

    reducers: {
        setAdvanceShippingNotice: (state, action) =>
        {
            state.shipmentNumber = action.payload.shipmentNumber;
            state.shippedFromAddress = action.payload.shippedFromAddress;
            state.shippedToAddress = action.payload.shippedToAddress;
            state.shippingMode = action.payload.shippingMode;
            state.shippingDate = action.payload.shippingDate;
            state.shippingDriversInformation = action.payload.shippingDriversInformation;
        }
    }
})


export const
    {
        setAdvanceShippingNotice
    } = advanceShippingNoticeSlice.actions
export default advanceShippingNoticeSlice.reducer
