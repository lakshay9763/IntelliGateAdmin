import { createSlice } from "@reduxjs/toolkit";
import { pairDeviceThunk } from "./deviceThunks";

export const deviceSlice = createSlice({
    name: 'add/Device',
    initialState: {
        loading: false,
        error: null,
        data: {
            existing: [],
            newDevice: null
        }
    },
    reducers: {
        setGateDevices: (state, action) => {
            state.data.existing = action.payload
        },
        toogleDevicePermissionReducer: (state, action) => {
            state.data.existing = state.data.existing.map(it => it.deviceId === action.payload.deviceId ? action.payload : it)
        },
        deleteDeviceReducer: (state, action) => {
            state.data.existing = state.data.existing.filter(item => item.deviceId !== action.payload)
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(pairDeviceThunk.pending, state => {
                state.loading = true
            })

            .addCase(pairDeviceThunk.fulfilled, (state, action) => {
                state.loading = true
                state.data.newDevice = action.payload
            })
            .addCase(pairDeviceThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })

    }
})

export const { setGateDevices, toogleDevicePermissionReducer ,deleteDeviceReducer} = deviceSlice.actions