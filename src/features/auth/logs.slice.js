import { createSlice } from "@reduxjs/toolkit";
import { getEntryLogs } from "./logs.thunk";

export const logSlice = createSlice({
    name:'residents',
    initialState:{
        loading:false,
        error:null,
        data:{
            today:[],
           
        },

    },
  
    extraReducers : (builder)=>{
        builder
            .addCase(getEntryLogs.pending,(state)=>{
                state.loading = true
            })
            .addCase(getEntryLogs.fulfilled,(state,action)=>{

                state.data.today = action.payload
               
                state.loading = false
            })
            .addCase(getEntryLogs.rejected,(state,action)=>{
                state.error = action.payload   
                state.loading = false
            })
            
    }
})

export const {setInsideVisitor} = logSlice.actions