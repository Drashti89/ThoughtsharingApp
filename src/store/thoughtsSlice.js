import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array of thought objects
  loading: false,
  error: null,
};

const thoughtsSlice = createSlice({
  name: "thoughts",
  initialState,
  reducers: {
    setThoughts: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    addThought: (state, action) => {
      state.items.unshift(action.payload);
    },

    updateThought: (state, action) => {
      const index = state.items.findIndex(
        (t) => t.id === action.payload.id
      );

      if (index !== -1) {
        // ✅ only update allowed fields safely
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
          likedBy: action.payload.likedBy ?? state.items[index].likedBy,
        };
      }
    },

    deleteThought: (state, action) => {
      state.items = state.items.filter(
        (t) => t.id !== action.payload
      );
    },

    toggleLikeOptimistic: (state, action) => {
      const { thoughtId, userId } = action.payload;
      const thought = state.items.find((t) => t.id === thoughtId);

      if (!thought) return;

      if (!Array.isArray(thought.likedBy)) {
        thought.likedBy = [];
      }

      const index = thought.likedBy.indexOf(userId);

      if (index >= 0) {
        thought.likedBy.splice(index, 1);
      } else {
        thought.likedBy.push(userId);
      }
    },

    // 🔥 rollback if Firestore fails
    revertLike: (state, action) => {
      const { thoughtId, userId } = action.payload;
      const thought = state.items.find((t) => t.id === thoughtId);
      if (!thought || !Array.isArray(thought.likedBy)) return;

      const index = thought.likedBy.indexOf(userId);

      if (index >= 0) {
        thought.likedBy.splice(index, 1);
      } else {
        thought.likedBy.push(userId);
      }
    },
  },
});

export const {
  setThoughts,
  setLoading,
  addThought,
  updateThought,
  deleteThought,
  toggleLikeOptimistic,
  revertLike,
} = thoughtsSlice.actions;

export default thoughtsSlice.reducer;
