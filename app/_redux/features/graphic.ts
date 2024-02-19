import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Motherboard } from "../services/motherboardApi";
import { CPU } from "../services/cpuApi";
import { Graphic } from "../services/graphicApi";
import { POWER } from "../services/powerApi";



type currentGraphic = {
    id: number,
    name: string
}

type GraphicType = {
    currentGraphic: currentGraphic; //this for add cpu in admin panel
    selectedGraphic: Partial<Graphic>  // selected motherboard for show in box
    relatedCpus: CPU[] //  related motherboard from selected cpu 
    relatedPowers: POWER[]
};

const initialState = {
    currentGraphic: {},
    selectedGraphic: {},
    relatedCpus: [],
    relatedPowers:[]

} as unknown as GraphicType;

export const graphicSlice = createSlice({
    name: "graphic",
    initialState,
    reducers: {
        currentGraphicOnSave: (state, action: PayloadAction<currentGraphic>) => {
            state.currentGraphic = action.payload;
        },
        addselectedGraphic: (state, action: PayloadAction<Partial<Graphic>>) => {
            state.selectedGraphic = action.payload
        },
        relatedCpuList: (state, action: PayloadAction<CPU[]>) => {
            state.relatedCpus = action.payload
        },
        relatedPowerList: (state, action: PayloadAction<POWER[]>) => {
            state.relatedPowers = action.payload
        }
    },
});

export const {
    currentGraphicOnSave,
    addselectedGraphic,
    relatedCpuList,
    relatedPowerList
} = graphicSlice.actions;
export default graphicSlice.reducer;
