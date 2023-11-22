import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice"; // Import the reducer

export const store = configureStore({
  reducer: {
    loader: loaderReducer, // Use the reducer
  },
});
