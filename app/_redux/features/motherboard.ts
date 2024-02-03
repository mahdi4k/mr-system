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
    relatedCpus: CPU[]
};

const initialState = {
    selectedMotherboard: {},
    currentMotherBoard: {},
    relatedCpus: []
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
            state.relatedCpus = action.payload
        }
    },
});

export const {
    currentMotherboardOnSave,
    addselectedMotherboard,
    relatedCpuList
} = motherboardSlice.actions;
export default motherboardSlice.reducer;
