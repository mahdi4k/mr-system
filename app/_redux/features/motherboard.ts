import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CPU } from "../services/cpuApi";
import { Motherboard } from "../services/motherboardApi";



type currentMotherBoard = {
    id: number,
    name: string
}

type MotherboardProp = {
    currentMotherBoard: currentMotherBoard;
    selectedMotherboard: Partial<Motherboard>;
    relatedCpu: CPU[]
};

const initialState = {
    selectedMotherboard: {},
    currentMotherBoard: {},
    relatedCpu: []
} as unknown as MotherboardProp;

export const motherboardSlice = createSlice({
    name: "motherboard",
    initialState,
    reducers: {
        currentMotherboardOnSave: (state, action: PayloadAction<currentMotherBoard>) => {
            state.currentMotherBoard = action.payload;
        },
        addselectedMotherboard: (state, action: PayloadAction<Partial<Motherboard>>) => {
            state.selectedMotherboard = action.payload
        },
        relatedCpuList: (state, action: PayloadAction<CPU[]>) => {
            state.relatedCpu = action.payload
        }
    },
});

export const {
    currentMotherboardOnSave,
    addselectedMotherboard,
    relatedCpuList
} = motherboardSlice.actions;
export default motherboardSlice.reducer;
