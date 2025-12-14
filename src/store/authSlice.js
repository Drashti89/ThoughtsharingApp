import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { uid, email, username, isAdmin }
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Expecting action.payload to be the user object or null
      if (action.payload) {
        state.user = {
            uid: action.payload.uid,
            email: action.payload.email,
            username: action.payload.username,
            isAdmin: action.payload.isAdmin,
            emailVerified: action.payload.emailVerified
        };
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const { setUser, logoutUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
