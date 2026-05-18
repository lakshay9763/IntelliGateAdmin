import { createSlice } from "@reduxjs/toolkit";
import { addGuardThunk, getAllGuard } from "./guardThunks";

export const guardSlice = createSlice({
    name:'guards',
    initialState:{
        loading:false,
        error:null,
        guardList:[]
    },
    extraReducers : (builder)=>{
        builder
            .addCase(addGuardThunk.pending,(state)=>{
                state.loading = true
            })
            .addCase(addGuardThunk.fulfilled,(state,action)=>{
                state.guardList.push(action.payload)
                state.loading = false
            })
            .addCase(addGuardThunk.rejected,(state,action)=>{
                state.error = action.payload   
                state.loading = false
            })
            .addCase(getAllGuard.fulfilled,(state,action)=>{
                state.guardList = action.payload
            })
    }
})