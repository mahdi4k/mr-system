import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CounterState = {
    currentCpu: {id:number,name:string};
};

type currentCpu = {
    id:number,
    name:string
}

const initialState = {
    currentCpu: {},
} as CounterState;

export const cpuSlice = createSlice({
    name: "cpu",
    initialState,
    reducers: {
        currentCpuOnSave: (state, action: PayloadAction<currentCpu>) => {
            state.currentCpu  = action.payload;
        },
    },
});

export const {
    currentCpuOnSave,
} = cpuSlice.actions;
export default cpuSlice.reducer;
