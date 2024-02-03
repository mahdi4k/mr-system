import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Motherboard } from "../services/motherboardApi";
import { CPU } from "../services/cpuApi";
import { Graphic } from "../services/graphicApi";



type currentPower = {
    id: number,
    name: string
}

type CpuType = {
    currentPower: currentPower; //this for add cpu in admin panel
    selectedPower: Partial<CPU>  // selected motherboard for show in box
    relatedMotherboards: Motherboard[] //  related motherboard from selected cpu 
    relatedGraphic:Graphic[]
};


const initialState = {
    currentPower: {},
    selectedPower: {},
    relatedGraphic: [],
 
} as unknown as CpuType;

export const powerSlice = createSlice({
    name: "power",
    initialState,
    reducers: {
        currentPowerOnSave: (state, action: PayloadAction<currentPower>) => {
            state.currentPower = action.payload;
        },
        addselectedPower: (state, action: PayloadAction<Partial<CPU>>) => {
            state.selectedPower = action.payload
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
    currentPowerOnSave,
    addselectedPower,
    relatedMotherboardList,
    relatedGraphicList
} = powerSlice.actions;
export default powerSlice.reducer;
