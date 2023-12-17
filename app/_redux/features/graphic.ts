import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Motherboard } from "../services/motherboardApi";
import { CPU } from "../services/cpuApi";
import { Graphic } from "../services/graphicApi";



type currentGraphic = {
    id: number,
    name: string
}

type CpuType = {
    currentGraphic: currentGraphic; //this for add cpu in admin panel
    selectedGraphic: Partial<Graphic>  // selected motherboard for show in box
    relatedCpus: CPU[] //  related motherboard from selected cpu 
};

const initialState = {
    currentGraphic: {},
    selectedGraphic: {},
    relatedCpus: []

} as unknown as CpuType;

export const cpuSlice = createSlice({
    name: "cpu",
    initialState,
    reducers: {
        currentCpuOnSave: (state, action: PayloadAction<currentGraphic>) => {
            state.currentGraphic = action.payload;
        },
        addselectedGraphic: (state, action: PayloadAction<Partial<Graphic>>) => {
            state.selectedGraphic = action.payload
        },
        relatedCpuList: (state, action: PayloadAction<CPU[]>) => {
            state.relatedCpus = action.payload
        }
    },
});

export const {
    currentCpuOnSave,
    addselectedGraphic,
    relatedCpuList
} = cpuSlice.actions;
export default cpuSlice.reducer;
