import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth'
import motherboardReducer from "./features/motherboard";
import graphicReducer from "./features/graphic";
import cpuReducer from "./features/cpu";
import { api } from './services/api'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        motherboard: motherboardReducer,
        cpu: cpuReducer,
        graphic:graphicReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    devTools: process.env.NODE_ENV !== "production",

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
