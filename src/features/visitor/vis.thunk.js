import { createAsyncThunk } from "@reduxjs/toolkit"
import adminApi from "../../api/adminApi"


export const getActiveVisitors = createAsyncThunk('get/VisitorInside',async (_,{rejectWithValue,dispatch})=>{
    try {
        const rest = await adminApi.get('/visitor')
        return rest.data.data

    } catch (error) {
        console.log(error.message)
    }
})