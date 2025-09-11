import { configureStore } from "@reduxjs/toolkit";
import codesSlice from "./slices/codeSlice";
import customersReducer from "./slices/customerSlice";
import customerDashboardSlice from "./slices/customerDashboardSlice";

export const store = configureStore({
  reducer: {
    codes: codesSlice,
    customers: customersReducer,
    customerDashbaord:customerDashboardSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
