import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CPU } from "../services/cpuApi";
import { Motherboard } from "../services/motherboardApi";

type CounterState = {
    currentMotherBoard: {id:number,name:string};
    selectedMotherboard:  Motherboard
};

type currentMotherBoard = {
    id:number,
    name:string
}

const initialState = {
    currentMotherBoard: {},
    selectedMotherboard:{}
} as CounterState;

export const motherboardSlice = createSlice({
    name: "motherboard",
    initialState,
    reducers: {
        currentMotherboardOnSave: (state, action: PayloadAction<currentMotherBoard>) => {
            state.currentMotherBoard  = action.payload;
        },
        addselectedMotherboard:(state, action: PayloadAction<Motherboard>)=>{
            state.selectedMotherboard = action.payload

        }
    },
});

export const {
    currentMotherboardOnSave,

} = motherboardSlice.actions;
export default motherboardSlice.reducer;
