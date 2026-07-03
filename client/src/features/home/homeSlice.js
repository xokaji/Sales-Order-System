import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { homeApi } from "./homeApi";

export const fetchOrders = createAsyncThunk(
  "home/fetchOrders",
  async ({ pageNumber = 1, pageSize = 20, sortBy, descending = true } = {}) =>
    homeApi.getList({ pageNumber, pageSize, sortBy, descending })
);

const initialState = {
  items: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 20,
  sortBy: "invoicedate",
  descending: true,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setSort(state, action) {
      const column = action.payload;
      if (state.sortBy === column) {
        state.descending = !state.descending;
      } else {
        state.sortBy = column;
        state.descending = false;
      }
    },
    setPage(state, action) {
      state.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSort, setPage } = homeSlice.actions;
export default homeSlice.reducer;
