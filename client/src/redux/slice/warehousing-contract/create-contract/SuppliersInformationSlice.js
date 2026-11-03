import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    suppliers:[
        {
            name:"ABC Supplies Ltd",
            location:"Kigali Rwanda",
            phoneNumber:"+250788123456",
            email:"contact@gmail.com"
        }
    ]
}

const suppliersInformationSlice = createSlice({
    name: "suppliersInformationSlice",
    initialState,

    reducers: {
        setSuppliers: (state, action) =>
        {
            state.suppliers = action.payload
        }
    }
})


export const
    {
        setSuppliers
    } = suppliersInformationSlice.actions
export default suppliersInformationSlice.reducer