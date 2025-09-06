import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCustomers } from "../../components/api/api";
import type { Customer } from "../../types";

interface CustomerState {
  customers: Customer[];
  filteredCustomers: Customer[];
  searchTerm: string;
  statusFilter: string;
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  filteredCustomers: [],
  searchTerm: "",
  statusFilter: "all",
  currentPage: 1,
  itemsPerPage: 10,
  loading: false,
  error: null,
};



export const fetchCustomersThunk = createAsyncThunk<
  Customer[],
  string,
  { rejectValue: string }
>("customers/fetchCustomers", async (token, { rejectWithValue }) => {
  try {
    const data = await fetchCustomers(token);
    return data;
  } catch (error) {
    console.error("Error in fetchCustomersThunk:", error);
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});
const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setSearchTerm: (state, action: { payload: string }) => {
      state.searchTerm = action.payload;
      state.filteredCustomers = state.customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          customer.customer_id
            .toString()
            .toLowerCase()
            .includes(action.payload.toLowerCase()) ||
          (customer.organization_name?.toLowerCase() || "").includes(
            action.payload.toLowerCase(),
          ),
      );
      if (state.statusFilter !== "all") {
        state.filteredCustomers = state.filteredCustomers.filter(
          (customer) =>
            customer.customer_type.toLowerCase() ===
            state.statusFilter.toLowerCase(),
        );
      }
      state.currentPage = 1;
    },
    setStatusFilter: (state, action: { payload: string }) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;

      // Start with all customers
      state.filteredCustomers = state.customers;

      // Apply search term filter
      if (state.searchTerm) {
        state.filteredCustomers = state.filteredCustomers.filter(
          (customer) =>
            customer.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            customer.customer_id
              .toString()
              .toLowerCase()
              .includes(state.searchTerm.toLowerCase()) ||
            (customer.organization_name?.toLowerCase() || "").includes(
              state.searchTerm.toLowerCase()
            )
        );
      }

      if (action.payload !== "all") {
        state.filteredCustomers = state.filteredCustomers.filter(
          (customer) =>
            customer.customer_status.toLowerCase() === action.payload.toLowerCase()
        );
      }
    },
    setCurrentPage: (state, action: { payload: number }) => {
      state.currentPage = action.payload;
    },
    resetSearch: (state) => {
      state.searchTerm = "";
      state.statusFilter = "all";
      state.filteredCustomers = state.customers;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCustomersThunk.fulfilled,
        (state, action: { payload: Customer[] }) => {
          state.loading = false;
          state.customers = action.payload
          state.filteredCustomers = action.payload
          if (state.searchTerm) {
            state.filteredCustomers = state.filteredCustomers.filter(
              (customer) =>
                customer.name
                  .toLowerCase()
                  .includes(state.searchTerm.toLowerCase()) ||
                customer.customer_id
                  .toString()
                  .toLowerCase()
                  .includes(state.searchTerm.toLowerCase()) ||
                (customer.organization_name?.toLowerCase() || "").includes(
                  state.searchTerm.toLowerCase(),
                ),
            );
          }
          if (state.statusFilter !== "all") {
            state.filteredCustomers = state.filteredCustomers.filter(
              (customer) =>
                customer.customer_type.toLowerCase() ===
                state.statusFilter.toLowerCase(),
            );
          }
        },
      )
      .addCase(
        fetchCustomersThunk.rejected,
        (state, action: { payload: string | undefined }) => {
          state.loading = false;
          state.error =
            action.payload || "Unable to fetch data. Using fallback data.";
          state.customers = [];
          state.filteredCustomers = [];
        },
      );
  },
});

export const { setSearchTerm, setStatusFilter, setCurrentPage, resetSearch } =
  customersSlice.actions;
export default customersSlice.reducer;
