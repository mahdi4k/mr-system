import { AnyAction, createAsyncThunk, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Province {
    id: number;
    name: string;
}
interface City {
    id: number;
    name: string;
}
export type IStatusFetch = 'idle' | 'loading' | 'succeeded' | 'failed'
const initialState = {
    ostan: [] as Province[],
    city: [] as City[],
    status: 'idle' as IStatusFetch, // idle | loading | succeeded | failed
    error: '',

};

export const fetchOstan = createAsyncThunk<Province[]>('location/fetchOstan', async () => {
    const response = await fetch('/provinces.json');
    if (!response.ok) {
        throw new Error('Failed to fetch ostan');
    }
    return response.json();
});

export const fetchCity = createAsyncThunk('location/fetchCity', async () => {
    const response = await fetch('/cities.json');
    if (!response.ok) {
        throw new Error('Failed to fetch city');
    }
    return response.json();
});


export const adsSlice = createSlice({
    name: "ads",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // Handle fetching ostan data
            .addCase(fetchOstan.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOstan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ostan = action.payload;
            })
            .addCase(fetchOstan.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            })
            // Handle fetching city data
            .addCase(fetchCity.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCity.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.city = action.payload;
            })
            .addCase(fetchCity.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            });
    },
});

export const {
} = adsSlice.actions;
export default adsSlice.reducer;
