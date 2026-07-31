import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Motherboard } from "../services/motherboardApi";
import { CASE } from "../services/caseApi";

type currentCase = {
  id: number;
  name: string;
};

type CaseType = {
  currentCase: currentCase; //this for add cpu in admin panel
  selectedCase: Partial<CASE>; // selected motherboard for show in box
  relatedMotherboards: Motherboard[]; //  related motherboard from selected cpu
};

const initialState = {
  currentCase: {},
  selectedCase: {},
  relatedMotherboards: [],
} as unknown as CaseType;

export const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {
    currentCaseOnSave: (state, action: PayloadAction<currentCase>) => {
      state.currentCase = action.payload;
    },
    addSelectedCase: (state, action: PayloadAction<Partial<CASE>>) => {
      state.selectedCase = action.payload;
    },
    relatedMotherboardList: (state, action: PayloadAction<Motherboard[]>) => {
      state.relatedMotherboards = action.payload;
    },
  },
});

export const { currentCaseOnSave, addSelectedCase, relatedMotherboardList } =
  caseSlice.actions;
export default caseSlice.reducer;
