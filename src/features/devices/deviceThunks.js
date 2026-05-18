import { createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../api/adminApi";
import { deleteDeviceReducer, setGateDevices, toogleDevicePermissionReducer } from "./deviceSlice";


export const pairDeviceThunk = createAsyncThunk('pair/Device',async (payload,{rejectWithValue})=>{
    console.log(payload)

    try {
        const res =await adminApi.post('/add-device',payload)
        return res.data
    } catch (error) {
        rejectWithValue(error.response.data.message)
    }
})


export const getAllDevices  = createAsyncThunk('get/Devices',async (_,{rejectWithValue,dispatch})=>{
  
    try {
        const res =await adminApi.get('/gate-device')
        console.log(res.data)
        dispatch(setGateDevices(res.data.data))

    } catch (error) {
        rejectWithValue(error.response.data.message)
    }
})


export const toggleDevicePermission = createAsyncThunk('toogle/DevicePermission',async (payload,{rejectWithValue,dispatch})=>{
  
    try {
        const res =await adminApi.put('/gate-device',payload)
        console.log(res.data)
        dispatch(toogleDevicePermissionReducer(res.data.data))

    } catch (error) {
        rejectWithValue(error.response.data.message)
    }
})

export const deleteDeviceThunk = createAsyncThunk('delete/Device',async (payload,{rejectWithValue,dispatch})=>{
  
    try {
        const res =await adminApi.delete('/gate-device',{data:payload})
        console.log(res.data)
        if(res.data.success){
            window.alert("Device deleted from database.")
            dispatch(deleteDeviceReducer(res.data.deviceId))

        }
        // 
    } catch (error) {
        rejectWithValue(error.response.data.message)
    }
})
