import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Motherboard } from "../services/motherboardApi";
import { RAM } from "../services/ramApi";

type currentRam = {
  id: number;
  name: string;
};

type RamType = {
  currentRam: currentRam; //this for add cpu in admin panel
  selectedRam: Partial<RAM>; // selected motherboard for show in box
  relatedMotherboards: Motherboard[]; //  related motherboard from selected cpu
};

const initialState = {
  currentRam: {},
  selectedRam: {},
  relatedMotherboards: [],
} as unknown as RamType;

export const ramSlice = createSlice({
  name: "ram",
  initialState,
  reducers: {
    currentRamOnSave: (state, action: PayloadAction<currentRam>) => {
      state.currentRam = action.payload;
    },
    addSelectedRam: (state, action: PayloadAction<Partial<RAM>>) => {
      state.selectedRam = action.payload;
    },
    relatedMotherboardList: (state, action: PayloadAction<Motherboard[]>) => {
      state.relatedMotherboards = action.payload;
    },
  },
});

export const { currentRamOnSave, addSelectedRam, relatedMotherboardList } =
  ramSlice.actions;
export default ramSlice.reducer;
