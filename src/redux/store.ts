import { configureStore } from '@reduxjs/toolkit';
import codesSlice from './slices/codeSlice';

export const store = configureStore({
  reducer: {
    codes: codesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;