import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type currentPower = {
  id: number;
  name: string;
};

type CpuType = {
  currentPower: currentPower; //this for add cpu in admin panel
  selectedPower: Partial<{
    id: number;
    name: string;
    attributes?: string[];
    image: string;
    price?: string;
    links: string;
    graphics: number[];
    brand?: string;
    psu: string;
    modular: number;
  }>; // selected motherboard for show in box
  relatedGraphic: number[];
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
    addselectedPower: (
      state,
      action: PayloadAction<
        Partial<{
          id: number;
          name: string;
          attributes?: string[];
          image: string;
          price?: string;
          links: string;
          graphics: number[];
          brand?: string;
          psu: string;
          modular: number;
        }>
      >,
    ) => {
      state.selectedPower = action.payload;
    },
    relatedGraphicList: (state, action: PayloadAction<number[]>) => {
      state.relatedGraphic = action.payload;
    },
  },
});

export const { currentPowerOnSave, addselectedPower, relatedGraphicList } =
  powerSlice.actions;
export default powerSlice.reducer;
