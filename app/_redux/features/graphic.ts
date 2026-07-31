import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type currentGraphic = {
  id: number;
  name: string;
};

type GraphicType = {
  currentGraphic: currentGraphic; //this for add cpu in admin panel
  selectedGraphic: Partial<{
    id: number;
    name: string;
    manufacturer?: string;
    attributes?: string[];
    links: string;
    type?: string;
    ram?: number;
    image: string;
    price?: string;
    cpus: number[];
    brand?: string;
    psu: string;
    powers: number[];
  }>; // selected motherboard for show in box
  relatedCpus: number[]; //  related motherboard from selected cpu
  relatedPowers: number[];
};

const initialState = {
  currentGraphic: {},
  selectedGraphic: {},
  relatedCpus: [],
  relatedPowers: [],
} as unknown as GraphicType;

export const graphicSlice = createSlice({
  name: "graphic",
  initialState,
  reducers: {
    currentGraphicOnSave: (state, action: PayloadAction<currentGraphic>) => {
      state.currentGraphic = action.payload;
    },
    addselectedGraphic: (
      state,
      action: PayloadAction<
        Partial<{
          id: number;
          name: string;
          manufacturer?: string;
          attributes?: string[];
          links: string;
          type?: string;
          ram?: number;
          image: string;
          price?: string;
          cpus: number[];
          brand?: string;
          psu: string;
          powers: number[];
        }>
      >,
    ) => {
      state.selectedGraphic = action.payload;
    },
    relatedCpuList: (state, action: PayloadAction<number[]>) => {
      state.relatedCpus = action.payload;
    },
    relatedPowerList: (state, action: PayloadAction<number[]>) => {
      state.relatedPowers = action.payload;
    },
  },
});

export const {
  currentGraphicOnSave,
  addselectedGraphic,
  relatedCpuList,
  relatedPowerList,
} = graphicSlice.actions;
export default graphicSlice.reducer;
