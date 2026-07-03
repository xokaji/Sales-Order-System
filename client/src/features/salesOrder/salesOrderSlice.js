import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { salesOrderApi, customerApi, itemApi } from "./salesOrderApi";
import { calculateLineAmounts, calculateOrderTotals } from "./calculations";

const emptyLine = () => ({
  clientId: nanoid(), // local-only key for React lists / new (unsaved) lines
  id: null,
  itemId: null,
  itemCode: "",
  description: "",
  note: "",
  quantity: 1,
  price: 0,
  taxRate: 0,
  exclAmount: 0,
  taxAmount: 0,
  inclAmount: 0,
});

const initialOrder = {
  id: null,
  invoiceNo: "", // assigned by the server on save
  invoiceDate: new Date().toISOString().slice(0, 10),
  referenceNo: "",
  note: "",
  customerId: null,
  customerName: "",
  address1: "",
  address2: "",
  address3: "",
  suburb: "",
  state: "",
  postCode: "",
  lines: [emptyLine()],
};

const initialState = {
  order: initialOrder,
  customers: [],
  items: [],
  loadStatus: "idle",
  saveStatus: "idle",
  error: null,
};

export const loadLookups = createAsyncThunk("salesOrder/loadLookups", async () => {
  const [customers, items] = await Promise.all([customerApi.getAll(), itemApi.getAll()]);
  return { customers, items };
});

export const loadOrder = createAsyncThunk("salesOrder/loadOrder", async (id) =>
  salesOrderApi.getById(id)
);

export const saveOrder = createAsyncThunk(
  "salesOrder/saveOrder",
  async (_, { getState, rejectWithValue }) => {
    const { order } = getState().salesOrder;

    if (!order.customerId) {
      return rejectWithValue("Please select a customer before saving.");
    }
    if (order.lines.length === 0 || order.lines.every((l) => !l.itemId)) {
      return rejectWithValue("Add at least one line item before saving.");
    }

    const payload = {
      invoiceDate: order.invoiceDate,
      referenceNo: order.referenceNo || null,
      note: order.note || null,
      customerId: order.customerId,
      lines: order.lines
        .filter((l) => l.itemId)
        .map((l) => ({
          id: l.id,
          itemId: l.itemId,
          note: l.note || null,
          quantity: Number(l.quantity) || 0,
        })),
    };

    return order.id
      ? salesOrderApi.update(order.id, payload)
      : salesOrderApi.create(payload);
  }
);

const salesOrderSlice = createSlice({
  name: "salesOrder",
  initialState,
  reducers: {
    resetOrder(state) {
      state.order = { ...initialOrder, lines: [emptyLine()] };
      state.saveStatus = "idle";
      state.error = null;
    },
    setCustomer(state, action) {
      const customer = state.customers.find((c) => c.id === action.payload);
      if (!customer) return;
      state.order.customerId = customer.id;
      state.order.customerName = customer.name;
      state.order.address1 = customer.address1 || "";
      state.order.address2 = customer.address2 || "";
      state.order.address3 = customer.address3 || "";
      state.order.suburb = customer.suburb || "";
      state.order.state = customer.state || "";
      state.order.postCode = customer.postCode || "";
    },
    setHeaderField(state, action) {
      const { field, value } = action.payload;
      state.order[field] = value;
    },
    addLine(state) {
      state.order.lines.push(emptyLine());
    },
    removeLine(state, action) {
      state.order.lines = state.order.lines.filter((l) => l.clientId !== action.payload);
      if (state.order.lines.length === 0) {
        state.order.lines.push(emptyLine());
      }
    },
    setLineItemByCode(state, action) {
      const { clientId, itemCode } = action.payload;
      const line = state.order.lines.find((l) => l.clientId === clientId);
      if (!line) return;

      line.itemCode = itemCode;
      const match = state.items.find(
        (i) => i.itemCode.toLowerCase() === itemCode.toLowerCase()
      );

      if (match) {
        line.itemId = match.id;
        line.description = match.description;
        line.price = match.price;
        line.taxRate = match.taxRate;
        Object.assign(line, calculateLineAmounts(line));
      } else {
        line.itemId = null;
        line.description = "";
      }
    },
    updateLineField(state, action) {
      const { clientId, field, value } = action.payload;
      const line = state.order.lines.find((l) => l.clientId === clientId);
      if (!line) return;

      line[field] = value;
      if (field === "quantity" || field === "price") {
        Object.assign(line, calculateLineAmounts(line));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLookups.fulfilled, (state, action) => {
        state.customers = action.payload.customers;
        state.items = action.payload.items;
      })
      .addCase(loadOrder.pending, (state) => {
        state.loadStatus = "loading";
      })
      .addCase(loadOrder.fulfilled, (state, action) => {
        state.loadStatus = "succeeded";
        const dto = action.payload;
        state.order = {
          ...dto,
          lines: dto.lines.map((l) => ({ ...l, clientId: nanoid() })),
        };
      })
      .addCase(loadOrder.rejected, (state, action) => {
        state.loadStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(saveOrder.pending, (state) => {
        state.saveStatus = "saving";
        state.error = null;
      })
      .addCase(saveOrder.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        const dto = action.payload;
        state.order = {
          ...dto,
          lines: dto.lines.map((l) => ({ ...l, clientId: nanoid() })),
        };
      })
      .addCase(saveOrder.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  resetOrder,
  setCustomer,
  setHeaderField,
  addLine,
  removeLine,
  setLineItemByCode,
  updateLineField,
} = salesOrderSlice.actions;

export const selectOrderTotals = (state) => calculateOrderTotals(state.salesOrder.order.lines);

export default salesOrderSlice.reducer;
