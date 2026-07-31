import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type currentMotherBoard = {
  id: number;
  name: string;
};

type MotherboardProp = {
  currentMotherBoard: currentMotherBoard;
  selectedMotherboard: Partial<{
    id: number;
    name: string;
    size: string;
    total_slot_ram: number;
    brand: string;
    price?: string;
    cpu_socket?: string;
    ddr3?: boolean;
    ddr4?: boolean;
    ddr5?: boolean;
    wifi_support?: boolean;
    links: string;
    image: string;
    cpus: number[];
    rams: number[];
    attributes?: string[];
  }>;
  relatedCpus: number[];
};

const initialState = {
  selectedMotherboard: {},
  currentMotherBoard: {},
  relatedCpus: [],
} as unknown as MotherboardProp;

export const motherboardSlice = createSlice({
  name: "motherboard",
  initialState,
  reducers: {
    currentMotherboardOnSave: (
      state,
      action: PayloadAction<currentMotherBoard>,
    ) => {
      state.currentMotherBoard = action.payload;
    },
    addselectedMotherboard: (
      state,
      action: PayloadAction<
        Partial<{
          id: number;
          name: string;
          size: string;
          total_slot_ram: number;
          brand: string;
          price?: string;
          cpu_socket?: string;
          ddr3?: boolean;
          ddr4?: boolean;
          ddr5?: boolean;
          wifi_support?: boolean;
          links: string;
          image: string;
          cpus: number[];
          rams: number[];
          attributes?: string[];
        }>
      >,
    ) => {
      state.selectedMotherboard = action.payload;
    },
    relatedCpuList: (state, action: PayloadAction<number[]>) => {
      state.relatedCpus = action.payload;
    },
  },
});

export const {
  currentMotherboardOnSave,
  addselectedMotherboard,
  relatedCpuList,
} = motherboardSlice.actions;
export default motherboardSlice.reducer;
