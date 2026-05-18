import { createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../api/adminApi";

export const addGuardThunk = createAsyncThunk("add/Guard",async (guardData,{rejectWithValue}) => {
  try {
    const formData = new FormData();

    console.log(guardData)

   
    if (guardData.photoPreview) {
      const response = await fetch(guardData.photoPreview);
      const blob = await response.blob();
      formData.append("photo", blob, "profile.jpg");
    }

   
    formData.append("name", guardData.name);
    formData.append("phoneNumber", guardData.phone);
    formData.append("gate", guardData.gate);
    formData.append("status", guardData.status);
    formData.append("shift",guardData.shift)
    formData.append("startTime",guardData.startTime)
    formData.append("endTime",guardData.endTime)
    formData.append("joinDate", guardData.joinDate);
    formData.append("password",guardData.password)
    
    const apiResponse = await fetch("https://intelligate-server.onrender.com/admin/guard", {
      method: "POST",
      body: formData, 
      credentials: 'include',
      
    });

    const result = await apiResponse.json();

    return result
    console.log("Success:", result);
  } catch (error) {
    console.error("Upload failed:", error);
  }
})

export const getAllGuard = createAsyncThunk("get/Guards",async (_,{rejectWithValue})=>{

   
     try {
        const res = await adminApi.get('/guard')
        console.log(res)
        return res.data
    } catch (error) {
        console.log(error.response?.data?.message)
        return rejectWithValue(error.response?.data?.message)
    }
    
})