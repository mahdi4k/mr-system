import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth'
import motherboardReducer from "./features/motherboard";
import graphicReducer from "./features/graphic";
import cpuReducer from "./features/cpu";
import PowerReducer from "./features/power";
import FanReducer from "./features/fan";
import RamReducer from "./features/ram";
import { api } from './services/api'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        motherboard: motherboardReducer,
        cpu: cpuReducer,
        power: PowerReducer,
        fan: FanReducer,
        ram:RamReducer,
        graphic:graphicReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    devTools: process.env.NODE_ENV !== "production",

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
