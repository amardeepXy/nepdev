import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mode: 'light',
};

export const modeSlice = createSlice({
    name: 'mode',
    initialState, 
    reducers: {
        toggleMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            localStorage.setItem('mode', state.mode);  
            document.body.classList.toggle('dark');
        },
        setDarkMode: (state) => {
            state.mode = 'dark';
            localStorage.setItem('mode', 'dark');
            document.body.classList.add('dark');
        }
    }
});

export const {toggleMode, setDarkMode} = modeSlice.actions;
export default modeSlice.reducer;