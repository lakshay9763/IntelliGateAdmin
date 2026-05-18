import { createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../api/adminApi";
import { removeUtilityfromRedux } from "./utility.slice";

export const getAllUtilityWorker = createAsyncThunk("get/UtilityWorker",async (_,{rejectWithValue})=>{
    console.log("Hel maze!")
    try {
        const res = await adminApi.get('/utility')
        // console.log(res.data.data)
        return res.data.data
    } catch (error) {
        return rejectWithValue(error.response.data.message || "Failed to fetch utility staff list.")
    }
})


export const updateUtilityAccess = createAsyncThunk("update/UtilityAccess", async (payload,{rejectWithValue})=>{
    try {
        const rest = await adminApi.put('/utility/toogle-access',payload)
        
    } catch (error) {
        console.log(error.message)
    }
})

export const getUtilityDetails = createAsyncThunk('get/UtilityDetails',async (payload,{rejectWithValue})=>{
    try {
        const rest = await adminApi.get('/utility/details',{params:payload})

        console.log(rest)
        return rest.data.data.logs

    } catch (error) {
        console.log(error.message)
    }
})

export const removeUtilityWorker =  createAsyncThunk('delete/Utility', async (payload,{rejectWithValue,dispatch})=>{
    try {
        const res = await adminApi.delete('/utility',{data:payload})
        console.log(res)
        dispatch(removeUtilityfromRedux(res.data.utilityId))
    } catch (error) {
        console.log(error.message)
    }
})