// src/store/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    advisorId: null,
    fullName: null,
    email: null,
    isAuthenticated: false,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.advisorId = action.payload.advisorId;
            state.fullName = action.payload.fullName;
            state.email = action.payload.email;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.advisorId = null;
            state.fullName = null;
            state.email = null;
            state.isAuthenticated = false;
        },
    },
});
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
