import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
    isLoading: false,
};

export const loadingSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    switchLoading: (loadingState) => {
        loadingState.isLoading = !loadingState.isLoading;
     }
  },
});

// Action creators are generated for each case reducer function
export const { switchLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
