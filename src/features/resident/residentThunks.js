import { createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../api/adminApi";
import { removeResidentFromRedux, uptateResidentFromRedux } from "./residentSlice";


export const addResidentThunk = createAsyncThunk(
  "add/Resident",
  async (payload, { rejectWithValue }) => {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("phone", payload.phone);
    formData.append("email", payload.email);
    formData.append("familyId", payload.flat);
    formData.append("phase", payload.phase);
    formData.append("block", payload.block);
    formData.append("plot", payload.plot);
    formData.append("floor", payload.floor);
    formData.append("password", payload.password);

    if (payload.file) {
      formData.append("image", payload.file);
    }
    console.log(formData)

    try {
      const res = await fetch("https://intelligate-server.onrender.com/admin/resident", {
        method: "POST",
        credentials: 'include', 
        body: formData,
        
      })

      const data = await res.json();

      console.log(data,'as hell')
      return data.data
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
);


export const getAllResident = createAsyncThunk("get/Residents",async (_,{rejectWithValue})=>{

   
     try {
        const res = await adminApi.get('/resident')
        console.log(res)
        return res.data
    } catch (error) {
        console.log(error.response?.data?.message)
        return rejectWithValue(error.response?.data?.message || "Server error")
    }
    
})

export const checkOccupationStatus = createAsyncThunk(
  'check/OccupationStatus',
  async (payload,{rejectWithValue})=>{

    try {

      const res = await adminApi.get(
        '/society/occupation-status',
        { params: payload }
      );

      return res.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );

    }
});


export const removeResident = createAsyncThunk('remove/Residnet',async (payload,{rejectWithValue,dispatch})=>{

  console.log(payload)  


  try {
    const res = await adminApi.delete('/resident',{data:payload})
    console.log(res)
    if(res.data.success){
      dispatch(removeResidentFromRedux(res.data.familyId))
    }
  } catch (error) {
    console.log(error.message,'lakshay')
  }

} )

export const updateResidentThunk = createAsyncThunk('update/Resident', async (payload,{rejectWithValue,dispatch})=>{
  console.log(payload)

  try {
    const res = await adminApi.put('/resident',payload)
    console.log(res)
    if(res.data.success){
      dispatch(uptateResidentFromRedux(res.data.data))
    }
  } catch (error) {
    console.log(error.message,'lakshay')
  }
})