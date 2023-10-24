import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CounterState = {
    currentMotherBoard: {id:number,name:string};
};

type currentCpuBoard = {
    id:number,
    name:string
}

const initialState = {
    currentMotherBoard: {},
} as CounterState;

export const cpuSlice = createSlice({
    name: "motherboard",
    initialState,
    reducers: {
        currentCpuOnSave: (state, action: PayloadAction<currentCpuBoard>) => {
            state.currentMotherBoard  = action.payload;
        },
    },
});

export const {
    currentCpuOnSave,
} = cpuSlice.actions;
export default cpuSlice.reducer;
