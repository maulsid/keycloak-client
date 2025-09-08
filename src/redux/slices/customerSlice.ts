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
      state.searchTerm = action.payload.toLowerCase();
      state.currentPage = 1;
      state.filteredCustomers = state.customers.filter((customer) => {
        const matchesSearch =
          customer.name.toLowerCase().includes(state.searchTerm) ||
          customer.customer_id.toString().toLowerCase().includes(state.searchTerm) ||
          (customer.organization_name?.toLowerCase() || "").includes(state.searchTerm);
        const matchesStatus =
          state.statusFilter === "all" ||
          customer.customer_status.toLowerCase() === state.statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      });
    },
    setStatusFilter: (state, action: { payload: string }) => {
      state.statusFilter = action.payload.toLowerCase();
      state.currentPage = 1;
      state.filteredCustomers = state.customers.filter((customer) => {
        const matchesSearch =
          customer.name.toLowerCase().includes(state.searchTerm) ||
          customer.customer_id.toString().toLowerCase().includes(state.searchTerm) ||
          (customer.organization_name?.toLowerCase() || "").includes(state.searchTerm);
        const matchesStatus =
          action.payload === "all" ||
          customer.customer_status.toLowerCase() === action.payload.toLowerCase();
        return matchesSearch && matchesStatus;
      });
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
      .addCase(fetchCustomersThunk.fulfilled, (state, action:{payload:Customer[]}) => {
        state.loading = false;
        state.customers = action.payload;
        state.filteredCustomers = action.payload.filter((customer) => {
          const matchesSearch =
            customer.name.toLowerCase().includes(state.searchTerm) ||
            customer.customer_id.toString().toLowerCase().includes(state.searchTerm) ||
            (customer.organization_name?.toLowerCase() || "").includes(state.searchTerm);
          const matchesStatus =
            state.statusFilter === "all" ||
            customer.customer_status.toLowerCase() === state.statusFilter.toLowerCase();
          return matchesSearch && matchesStatus;
        });
      })
      .addCase(fetchCustomersThunk.rejected, (state, action: {payload:string | undefined}) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch data. Using fallback data.";
        state.customers = [];
        state.filteredCustomers = [];
      });
  },
});

export const { setSearchTerm, setStatusFilter, setCurrentPage, resetSearch } =
  customersSlice.actions;
export default customersSlice.reducer;