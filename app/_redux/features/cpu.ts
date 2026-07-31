import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type currentCpu = {
  id: number;
  name: string;
};

type CpuType = {
  currentCpu: currentCpu; //this for add cpu in admin panel
  selectedCpu: Partial<{
    id: number;
    name: string;
    cpu_socket?: string;
    integrated_graphic?: string;
    manufacturer?: string;
    price?: string;
    attributes?: string[];
    image: string;
    motherboards: number[];
    fans: number[];
    graphics: number[];
    links: string;
    brand?: string;
    rams: number[];
  }>; // selected motherboard for show in box
  relatedMotherboards: number[]; //  related motherboard from selected cpu
  relatedGraphic: number[];
};

const initialState = {
  currentCpu: {},
  selectedCpu: {},
  relatedMotherboards: [],
  relatedGraphic: [],
} as unknown as CpuType;

export const cpuSlice = createSlice({
  name: "cpu",
  initialState,
  reducers: {
    currentCpuOnSave: (state, action: PayloadAction<currentCpu>) => {
      state.currentCpu = action.payload;
    },
    addselectedCpu: (
      state,
      action: PayloadAction<
        Partial<{
          id: number;
          name: string;
          cpu_socket?: string;
          integrated_graphic?: string;
          manufacturer?: string;
          price?: string;
          attributes?: string[];
          image: string;
          motherboards: number[];
          fans: number[];
          graphics: number[];
          links: string;
          brand?: string;
          rams: number[];
        }>
      >,
    ) => {
      state.selectedCpu = action.payload;
    },
    relatedMotherboardList: (state, action: PayloadAction<number[]>) => {
      state.relatedMotherboards = action.payload;
    },
    relatedGraphicList: (state, action: PayloadAction<number[]>) => {
      state.relatedGraphic = action.payload;
    },
  },
});

export const {
  currentCpuOnSave,
  addselectedCpu,
  relatedMotherboardList,
  relatedGraphicList,
} = cpuSlice.actions;
export default cpuSlice.reducer;
