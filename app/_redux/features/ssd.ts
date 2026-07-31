import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Motherboard } from "../services/motherboardApi";
import { SSD } from "../services/ssdApi";

type currentSsd = {
  id: number;
  name: string;
};

type SsdType = {
  currentSsd: currentSsd; //this for add cpu in admin panel
  selectedSsd: Partial<SSD>; // selected motherboard for show in box
  relatedMotherboards: Motherboard[]; //  related motherboard from selected cpu
};

const initialState = {
  currentSsd: {},
  selectedSsd: {},
  relatedMotherboards: [],
} as unknown as SsdType;

export const ssdSlice = createSlice({
  name: "ssd",
  initialState,
  reducers: {
    currentSsdOnSave: (state, action: PayloadAction<currentSsd>) => {
      state.currentSsd = action.payload;
    },
    addSelectedSsd: (state, action: PayloadAction<Partial<SSD>>) => {
      state.selectedSsd = action.payload;
    },
    relatedMotherboardList: (state, action: PayloadAction<Motherboard[]>) => {
      state.relatedMotherboards = action.payload;
    },
  },
});

export const { currentSsdOnSave, addSelectedSsd, relatedMotherboardList } =
  ssdSlice.actions;
export default ssdSlice.reducer;
