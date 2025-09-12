import type { PayloadAction } from "@reduxjs/toolkit"; // Use type-only import
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
    setSearchTerm: (state, action: PayloadAction<string>) => {
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
    setStatusFilter: (state, action: PayloadAction<string>) => {
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
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetSearch: (state) => {
      state.searchTerm = "";
      state.statusFilter = "all";
      state.filteredCustomers = state.customers;
      state.currentPage = 1;
    },
    updateCustomerCodes: (
      state,
      action: PayloadAction<{ customerId: string; newCodes: number }>
    ) => {
      const { customerId, newCodes } = action.payload;
      const customer = state.customers.find(
        (c) => c.customer_id.toString() === customerId
      );
      if (customer) {
        customer.codes_available += newCodes;
        customer.total_codes_ordered += newCodes;
      }
      // Update filteredCustomers to reflect the change
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersThunk.fulfilled, (state, action: PayloadAction<Customer[]>) => {
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
      .addCase(fetchCustomersThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch data. Using fallback data.";
        state.customers = [];
        state.filteredCustomers = [];
      });
  },
});

export const { setSearchTerm, setStatusFilter, setCurrentPage, resetSearch, updateCustomerCodes } =
  customersSlice.actions;
export default customersSlice.reducer;