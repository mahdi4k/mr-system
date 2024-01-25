import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Motherboard } from "../services/motherboardApi";
import { CPU } from "../services/cpuApi";
import { Graphic } from "../services/graphicApi";



type currentGraphic = {
    id: number,
    name: string
}

type GraphicType = {
    currentGraphic: currentGraphic; //this for add cpu in admin panel
    selectedGraphic: Partial<Graphic>  // selected motherboard for show in box
    relatedCpus: CPU[] //  related motherboard from selected cpu 
};

const initialState = {
    currentGraphic: {},
    selectedGraphic: {},
    relatedCpus: []

} as unknown as GraphicType;

export const graphicSlice = createSlice({
    name: "cpu",
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
        }
    },
});

export const {
    currentGraphicOnSave,
    addselectedGraphic,
    relatedCpuList
} = graphicSlice.actions;
export default graphicSlice.reducer;
