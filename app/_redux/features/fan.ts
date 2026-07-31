import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Motherboard } from "../services/motherboardApi";
import { FAN } from "../services/fanApi";

type currentFan = {
  id: number;
  name: string;
};

type FanType = {
  currentFan: currentFan; //this for add cpu in admin panel
  selectedFan: Partial<FAN>; // selected motherboard for show in box
  relatedMotherboards: Motherboard[]; //  related motherboard from selected cpu
};

const initialState = {
  currentFan: {},
  selectedFan: {},
  relatedMotherboards: [],
} as unknown as FanType;

export const fanSlice = createSlice({
  name: "fan",
  initialState,
  reducers: {
    currentFanOnSave: (state, action: PayloadAction<currentFan>) => {
      state.currentFan = action.payload;
    },
    addselectedFan: (state, action: PayloadAction<Partial<FAN>>) => {
      state.selectedFan = action.payload;
    },
    relatedMotherboardList: (state, action: PayloadAction<Motherboard[]>) => {
      state.relatedMotherboards = action.payload;
    },
  },
});

export const { currentFanOnSave, addselectedFan, relatedMotherboardList } =
  fanSlice.actions;
export default fanSlice.reducer;
