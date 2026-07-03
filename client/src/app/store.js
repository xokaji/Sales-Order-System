import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "../features/home/homeSlice";
import salesOrderReducer from "../features/salesOrder/salesOrderSlice";

export const store = configureStore({
  reducer: {
    home: homeReducer,
    salesOrder: salesOrderReducer,
  },
});
