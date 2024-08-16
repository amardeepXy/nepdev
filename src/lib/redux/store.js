import {configureStore} from '@reduxjs/toolkit';
import authSlice from './features/authSlice';
import modeSlice from './features/modeSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        mode: modeSlice
    }
})

export default store;