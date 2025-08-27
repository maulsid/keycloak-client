import { configureStore } from '@reduxjs/toolkit';
import codesSlice from './slices/codeSlice';
import customersReducer from './slices/customerSlice';

export const store = configureStore({
  reducer: {
    codes: codesSlice,
    customers: customersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;