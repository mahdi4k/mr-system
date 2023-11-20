import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Motherboard } from "../services/motherboardApi";
import { CPU } from "../services/cpuApi";

type CounterState = {
    currentCpu: {id:number,name:string};
    selectedCpu:   CPU
};

type currentCpu = {
    id:number,
    name:string
}

const initialState = {
    currentCpu: {},
    selectedCpu:{}

} as CounterState;

export const cpuSlice = createSlice({
    name: "cpu",
    initialState,
    reducers: {
        currentCpuOnSave: (state, action: PayloadAction<currentCpu>) => {
            state.currentCpu  = action.payload;
        },
        addselectedCpu:(state, action: PayloadAction<CPU>)=>{
            state.selectedCpu = action.payload

        }
    },
});

export const {
    currentCpuOnSave,
    addselectedCpu
} = cpuSlice.actions;
export default cpuSlice.reducer;
