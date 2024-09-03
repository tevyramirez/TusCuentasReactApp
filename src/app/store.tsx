import { configureStore } from '@reduxjs/toolkit';
import periodoReducer from '../features/periodo/periodoSlice';

export const store = configureStore({
  reducer: {
    periodo: periodoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
