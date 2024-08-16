import {createSlice} from '@reduxjs/toolkit';

const initialState = {
   isAuthenticated: false,
   isLoading: false,
   user: null,
}

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      login: (state, action) => {
         state.user = action.payload;
         state.isAuthenticated = true;
      },
      logout: (state) => {
         state.isAuthenticated = false;
         state.user = null;
      },
      setLoading: (state, action) => {
         state.isLoading = action.payload;
      }
   }
});

export const {login, logout, setLoading} = authSlice.actions;
export default authSlice.reducer;