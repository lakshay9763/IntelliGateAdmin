import { createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../api/adminApi";
import { removeStafffromRedux } from "./staff.slice";

export const getAllStaff = createAsyncThunk("get/AllStaff",async (_,{rejectWithValue})=>{
    console.log("Hel")
    try {
        const res = await adminApi.get('/staff')
        console.log(res)
        return res.data.data
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
})


export const getStaffDetails = createAsyncThunk("get/StaffDetails",async (payload,{rejectWithValue})=>{
    console.log("Hel")
    try {
        const res = await adminApi.get('/staff/details',{params:payload})
        console.log(res)
        return res.data.data
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
})

export const removeStaff = createAsyncThunk('delete/Staff', async (payload,{rejectWithValue,dispatch})=>{
    try {
        const res = await adminApi.delete('/staff',{data:payload})
        console.log(res)
        dispatch(removeStafffromRedux(res.data.staffId))
    } catch (error) {
        console.log(error.message)
    }
})

