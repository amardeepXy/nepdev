import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isVerified: false,
    isLoading: false,
    user: null,
}

const userVerificationSlice = createSlice({
    name: 'userVerification',
    initialState,
    reducers: {
        loadUserData: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setVerified: (state, action) => {
            state.isVerified = action.payload;
        }
    }
});

export const { loadUserData, setLoading, setVerified } = userVerificationSlice.actions;
export default userVerificationSlice.reducer;