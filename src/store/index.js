import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { clientsApi } from './clientsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clientsApi.middleware),
});