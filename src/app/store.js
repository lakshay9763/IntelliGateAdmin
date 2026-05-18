

import { configureStore } from "@reduxjs/toolkit"
import { residentSlice } from "../features/resident/residentSlice";
import { guardSlice } from "../features/guard/guardSlice";
import { deviceSlice } from "../features/devices/deviceSlice";
import { staffSlice } from "../features/staff/staff.slice";
import { logSlice } from "../features/auth/logs.slice";
import { visitorSlice } from "../features/visitor/vis.slice";
import { utilitySlice } from "../features/utility_worker/utility.slice";
import { authSlice } from "../features/auth/auth.slice";

const store = configureStore({
  reducer: {
    auth:authSlice.reducer,
    residents:residentSlice.reducer,
    staff:staffSlice.reducer,
    utility:utilitySlice.reducer,
    visitor:visitorSlice.reducer,
    
    
    logs:logSlice.reducer,
    // guards:guardSlice.reducer
    gateDevices:deviceSlice.reducer
  }
}
);

export default store
 
