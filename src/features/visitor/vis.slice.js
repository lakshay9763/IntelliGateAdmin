import { createSlice } from "@reduxjs/toolkit";
import { getActiveVisitors } from "./vis.thunk";

export const visitorSlice = createSlice({
    name:'residents',
    initialState:{
        loading:false,
        error:null,
        data:{
            passList:[],
            passCounts:[],
            fcmList:[]
        },

    },
    
    extraReducers : (builder)=>{
        builder
            .addCase(getActiveVisitors.pending,(state)=>{
                state.loading = true
            })
            .addCase(getActiveVisitors.fulfilled,(state,action)=>{

                console.log(action.payload,'nnnnnnnnnn')
                state.data.passList = action.payload.passList
                state.data.fcmList = action.payload.fcmList
                state.data.passCounts = action.payload.passCounts
                state.loading = false
            })
            .addCase(getActiveVisitors.rejected,(state,action)=>{
                state.error = action.payload   
                state.loading = false
            })
            
    }
})
