import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    userInfo: {}, // for user object
    userToken: null, // for storing the JWT
    error: null,
    success: false, // for monitoring the registration process.
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addToken: (state, action) => {
            state.userToken = action.payload
        },
        setSuccessLogin: (state, action: PayloadAction<boolean>) => {
            state.success = action.payload;
        },

    },
})
export const { addToken, setSuccessLogin } = authSlice.actions

export default authSlice.reducer
