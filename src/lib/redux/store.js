import {configureStore} from '@reduxjs/toolkit';
import authSlice from './features/authSlice';
import modeSlice from './features/modeSlice';
import userVerificationSlice from './features/userVerificationSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        mode: modeSlice,
        userVerification: userVerificationSlice
    }
})

export default store;