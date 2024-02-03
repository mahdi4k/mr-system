import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Motherboard } from "../services/motherboardApi";
import { CPU } from "../services/cpuApi";
import { Graphic } from "../services/graphicApi";



type currentCpu = {
    id: number,
    name: string
}

type CpuType = {
    currentCpu: currentCpu; //this for add cpu in admin panel
    selectedCpu: Partial<CPU>  // selected motherboard for show in box
    relatedMotherboards: Motherboard[] //  related motherboard from selected cpu 
    relatedGraphic:Graphic[]
};


const initialState = {
    currentCpu: {},
    selectedCpu: {},
    relatedMotherboards: [],
    relatedGraphic:[]

} as unknown as CpuType;

export const cpuSlice = createSlice({
    name: "cpu",
    initialState,
    reducers: {
        currentCpuOnSave: (state, action: PayloadAction<currentCpu>) => {
            state.currentCpu = action.payload;
        },
        addselectedCpu: (state, action: PayloadAction<Partial<CPU>>) => {
            state.selectedCpu = action.payload
        },
        relatedMotherboardList: (state, action: PayloadAction<Motherboard[]>) => {
            state.relatedMotherboards = action.payload
        },
        relatedGraphicList: (state, action: PayloadAction<Graphic[]>) => {
            state.relatedGraphic = action.payload
        }
    },
});

export const {
    currentCpuOnSave,
    addselectedCpu,
    relatedMotherboardList,
    relatedGraphicList
} = cpuSlice.actions;
export default cpuSlice.reducer;
