import { configureStore } from '@reduxjs/toolkit';
import codesSlice from './slices/codeSlice';
import authSlice from './slices/authSlice';
export const store = configureStore({
  reducer: {
    codes: codesSlice,
    auth:authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;