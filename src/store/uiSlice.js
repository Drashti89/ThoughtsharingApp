import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedThoughtId: undefined, // undefined = Grid, null = Add, string = Detail
  isAddModalOpen: false,
  isLogoutModalOpen: false,
  likedThoughtIds: [], // Array of strings
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLikedThoughtIds: (state, action) => {
      state.likedThoughtIds = action.payload;
    },
    setSelectedThoughtId: (state, action) => {
      state.selectedThoughtId = action.payload;
    },
    toggleAddModal: (state, action) => {
      state.isAddModalOpen = action.payload !== undefined ? action.payload : !state.isAddModalOpen;
    },
    toggleLogoutModal: (state, action) => {
      state.isLogoutModalOpen = action.payload !== undefined ? action.payload : !state.isLogoutModalOpen;
    },
  },
});

export const { setSelectedThoughtId, toggleAddModal, toggleLogoutModal, setLikedThoughtIds } = uiSlice.actions;
export default uiSlice.reducer;
