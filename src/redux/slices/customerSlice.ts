import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCustomers } from '../../components/api/api';
import type { Customer } from '../../types';


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
  searchTerm: '',
  statusFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
  loading: false,
  error: null,
};

const fallbackCustomers: Customer[] = [
  {
    customer_id: 1,
    name: 'Acme Corp',
    customer_type: 'B2B',
    organization_id: null,
    organization_name: null,
    total_codes_ordered: 10,
    codes_utilized: 5,
    codes_available: 5,
    user_count: 0,
    created_at: '2025-01-01T12:00:00.000Z',
  },
  {
    customer_id: 2,
    name: 'Global Inc',
    customer_type: 'B2B',
    organization_id: null,
    organization_name: null,
    total_codes_ordered: 20,
    codes_utilized: 15,
    codes_available: 5,
    user_count: 0,
    created_at: '2025-01-02T12:00:00.000Z',
  },
  {
    customer_id: 3,
    name: 'Tech Solutions',
    customer_type: 'B2C',
    organization_id: null,
    organization_name: null,
    total_codes_ordered: 30,
    codes_utilized: 30,
    codes_available: 0,
    user_count: 0,
    created_at: '2025-01-03T12:00:00.000Z',
  },
];

export const fetchCustomersThunk = createAsyncThunk<Customer[], string, { rejectValue: string }>(
  'customers/fetchCustomers',
  async (token, { rejectWithValue }) => {
    try {
      const data = await fetchCustomers(token);
      return data;
    } catch (error) {
      console.error('Error in fetchCustomersThunk:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSearchTerm: (state, action:{ payload: string }) => {
      state.searchTerm = action.payload;
      state.filteredCustomers = state.customers.filter((customer) =>
        customer.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        customer.customer_id.toString().toLowerCase().includes(action.payload.toLowerCase()) ||
        (customer.organization_name?.toLowerCase() || '').includes(action.payload.toLowerCase())
      );
      if (state.statusFilter !== 'all') {
        state.filteredCustomers = state.filteredCustomers.filter(
          (customer) => customer.customer_type.toLowerCase() === state.statusFilter.toLowerCase()
        );
      }
      state.currentPage = 1;
    },
    setStatusFilter: (state, action: { payload: string }) => {
      state.statusFilter = action.payload;
      state.filteredCustomers = state.customers.filter((customer) =>
        customer.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        customer.customer_id.toString().toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        (customer.organization_name?.toLowerCase() || '').includes(state.searchTerm.toLowerCase())
      );
      if (action.payload !== 'all') {
        state.filteredCustomers = state.filteredCustomers.filter(
          (customer) => customer.customer_type.toLowerCase() === state.statusFilter.toLowerCase()
        );
      }
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: { payload: number }) => {
      state.currentPage = action.payload;
    },
    resetSearch: (state) => {
      state.searchTerm = '';
      state.statusFilter = 'all';
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
      .addCase(fetchCustomersThunk.fulfilled, (state, action:{ payload: Customer[] }) => {
        state.loading = false;
        state.customers = action.payload.length ? action.payload : fallbackCustomers;
        state.filteredCustomers = action.payload.length ? action.payload : fallbackCustomers;
        if (state.searchTerm) {
          state.filteredCustomers = state.filteredCustomers.filter(
            (customer) =>
              customer.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
              customer.customer_id.toString().toLowerCase().includes(state.searchTerm.toLowerCase()) ||
              (customer.organization_name?.toLowerCase() || '').includes(state.searchTerm.toLowerCase())
          );
        }
        if (state.statusFilter !== 'all') {
          state.filteredCustomers = state.filteredCustomers.filter(
            (customer) => customer.customer_type.toLowerCase() === state.statusFilter.toLowerCase()
          );
        }
      }).addCase(fetchCustomersThunk.rejected, (state, action: { payload: string |undefined }) => {
        state.loading = false;
        state.error = action.payload || 'Unable to fetch data. Using fallback data.';
        state.customers = fallbackCustomers;
        state.filteredCustomers = fallbackCustomers;
      });
  },
});

export const { setSearchTerm, setStatusFilter, setCurrentPage, resetSearch } = customersSlice.actions;
export default customersSlice.reducer;
