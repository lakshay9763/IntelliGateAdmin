import { createSlice } from "@reduxjs/toolkit";
import { getAllUtilityWorker, getUtilityDetails } from "./utility.thunk";

export const utilitySlice = createSlice({
    name:'utlity_worker',
    initialState:{
        loading:true,
        error:null,
        data:{
            utilityList:[],
            utilityDetails:{
                logs:[]
            }

            
        },

    },
    reducers:{
        removeUtilityfromRedux : (state,action)=>{
            state.data.utilityList = state.data.utilityList.filter(item => item.utilityId !== action.payload)
        }
    },
    extraReducers : (builder)=>{
        builder
            .addCase(getAllUtilityWorker.pending,(state)=>{
                state.loading = true
            })
            .addCase(getAllUtilityWorker.fulfilled,(state,action)=>{

                // console.log(action.payload)
                state.data.utilityList = action.payload
                state.loading = false
            })
            .addCase(getAllUtilityWorker.rejected,(state,action)=>{
                state.error = action.payload   
                state.loading = false
            })

                .addCase(getUtilityDetails.fulfilled,(state,action)=>{

                state.data.utilityDetails.logs = action.payload
               
            })
            
    }
})

export const {removeUtilityfromRedux} = utilitySlice.actions