import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of thought objects
  loading: false,
  error: null,
};

const thoughtsSlice = createSlice({
  name: 'thoughts',
  initialState,
  reducers: {
    setThoughts: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addThought: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateThought: (state, action) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteThought: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    toggleLikeOptimistic: (state, action) => {
      const { thoughtId, userId } = action.payload;
      const thought = state.items.find(t => t.id === thoughtId);
      if (thought) {
        if (!thought.likedBy) thought.likedBy = [];
        
        const alreadyLiked = thought.likedBy.includes(userId);
        if (alreadyLiked) {
            thought.likedBy = thought.likedBy.filter(id => id !== userId);
        } else {
            thought.likedBy.push(userId);
        }
        // Remove likesCount field as we'll use likedBy array length
        delete thought.likesCount;
      }
    },
  },
});

export const { setThoughts, setLoading, addThought, updateThought, deleteThought, toggleLikeOptimistic } = thoughtsSlice.actions;
export default thoughtsSlice.reducer;
