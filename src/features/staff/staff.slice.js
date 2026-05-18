import { createSlice } from "@reduxjs/toolkit";
import { getAllStaff, getStaffDetails } from "./staff.thunk";

export const staffSlice = createSlice({
    name:'residents',
    initialState:{
        loading:false,
        error:null,
        data:{
            staffList:[],
            staffToday:[],
            staffDeatils : {
                logs:[],
                houses:[]
            }
        },

    },
    reducers:{
        removeStafffromRedux : (state,action)=>{
            state.data.staffList = state.data.staffList.filter(item => item.staffId !== action.payload)
        }
    },
    extraReducers : (builder)=>{
        builder
            .addCase(getAllStaff.pending,(state)=>{
                state.loading = true
            })
            .addCase(getAllStaff.fulfilled,(state,action)=>{
                state.data.staffList = action.payload.staffList
                state.data.staffToday = action.payload.staffToday
                state.loading = false
            })
            .addCase(getAllStaff.rejected,(state,action)=>{
                state.error = action.payload   
                state.loading = false
            })

              .addCase(getStaffDetails.fulfilled,(state,action)=>{
                
                state.data.staffDeatils.logs = action.payload.logs
                state.data.staffDeatils.houses = action.payload.houses
            })
            
    }
})

export const {removeStafffromRedux} = staffSlice.actions