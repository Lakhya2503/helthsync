import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Add loading state
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // console.log("login reducer triggered with", action.payload); // Debug log
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false; // Set loading to false on login
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false; // Set loading to false on logout
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Update loading state
    },
  },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;