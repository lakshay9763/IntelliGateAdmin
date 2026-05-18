import { createSlice } from "@reduxjs/toolkit";
import { addResidentThunk, checkOccupationStatus, getAllResident } from "./residentThunks";

export const residentSlice = createSlice({
    name: 'residents',
    initialState: {
        loading: false,
        error: null,
        residentList: []
    },
    reducers: {
        removeResidentFromRedux: (state, action) => {

            state.residentList = state.residentList.filter(item => item.familyId !== action.payload)

        },
        uptateResidentFromRedux : (state,action)=>{
            state.residentList = state.residentList.map(item => item._id === action.payload._id ? action.payload : item)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addResidentThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(addResidentThunk.fulfilled, (state, action) => {
                state.residentList.push(action.payload)
                state.loading = false
            })
            .addCase(addResidentThunk.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })
            .addCase(getAllResident.fulfilled, (state, action) => {
                state.residentList = action.payload
            })

            .addCase(checkOccupationStatus.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })

    }
})

export const {removeResidentFromRedux,uptateResidentFromRedux} = residentSlice.actions