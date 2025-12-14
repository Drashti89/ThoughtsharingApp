import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uiReducer from './uiSlice';
import thoughtsReducer from './thoughtsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    thoughts: thoughtsReducer,
  },
});

export default store;
