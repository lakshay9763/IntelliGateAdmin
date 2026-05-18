import { createAsyncThunk } from "@reduxjs/toolkit"
import adminApi from "../../api/adminApi"
import { setInsideVisitor } from "./logs.slice"

export const getEntryLogs =  createAsyncThunk("get/EntryLogs",async (_,{rejectWithValue})=>{
    console.log("Logs")
    try {
        const res = await adminApi.get('/entry-logs')

        return res.data.data
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
})

