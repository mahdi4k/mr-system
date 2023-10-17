import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CounterState = {
    currentMotherBoard: {id:number,name:string};
};

type currentMotherBoard = {
    id:number,
    name:string
}

const initialState = {
    currentMotherBoard: {},
} as CounterState;

export const motherboardSlice = createSlice({
    name: "motherboard",
    initialState,
    reducers: {
        currentMotherboardOnSave: (state, action: PayloadAction<currentMotherBoard>) => {
            state.currentMotherBoard  = action.payload;
        },

    },
});

export const {
    currentMotherboardOnSave,

} = motherboardSlice.actions;
export default motherboardSlice.reducer;
