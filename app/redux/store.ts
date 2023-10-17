import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth'
import {motherboardApi} from "./services/motherboardApi";
import motherboardReducer from "./features/motherboard";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        motherboard: motherboardReducer,
        [motherboardApi.reducerPath]: motherboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(motherboardApi.middleware),
    devTools: process.env.NODE_ENV !== "production",

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
