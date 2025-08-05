import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCodes } from '../../components/api/api';

interface Code {
  code_id: number;
  code: string;
  status: string | null;
  order_id: number | null;
}

interface CodeState {
  codes: Code[];
  filteredCodes: Code[];
  searchTerm: string;
  statusFilter: string;
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: CodeState = {
  codes: [],
  filteredCodes: [],
  searchTerm: '',
  statusFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
  loading: false,
  error: null,
};

const fallbackCodes: Code[] = [
  {
    code_id: 1,
    code: '0B4DA646',
    status: 'assigned',
    order_id: 1,
  },
  {
    code_id: 2,
    code: 'E1D7862C',
    status: 'assigned',
    order_id: 1,
  },
  {
    code_id: 74,
    code: '9WNZEP6MB9issss',
    status: null,
    order_id: null,
  },
];

export const fetchCodesThunk = createAsyncThunk<Code[], void, { rejectValue: string }>(
  'codes/fetchCodes',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCodes();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const codesSlice = createSlice({
  name: 'codes',
  initialState,
  reducers: {
    setSearchTerm: (state, action: { payload: string }) => {
      state.searchTerm = action.payload;
      state.filteredCodes = state.codes.filter((code) =>
        code.code.toLowerCase().includes(action.payload.toLowerCase())
      );
      if (state.statusFilter !== 'all') {
        state.filteredCodes = state.filteredCodes.filter(
          (code) =>
            (state.statusFilter === 'assigned' && code.status === 'assigned') ||
            (state.statusFilter === 'unassigned' && !code.status)
        );
      }
      state.currentPage = 1;
    },
    setStatusFilter: (state, action: { payload: string }) => {
      state.statusFilter = action.payload;
      state.filteredCodes = state.codes.filter((code) =>
        code.code.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
      if (action.payload !== 'all') {
        state.filteredCodes = state.filteredCodes.filter(
          (code) =>
            (action.payload === 'assigned' && code.status === 'assigned') ||
            (action.payload === 'unassigned' && !code.status)
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
      state.filteredCodes = state.codes;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCodesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCodesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.codes = action.payload.length ? action.payload : fallbackCodes;
        state.filteredCodes = action.payload.length ? action.payload : fallbackCodes;
        if (state.searchTerm) {
          state.filteredCodes = state.filteredCodes.filter((code) =>
            code.code.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        }
        if (state.statusFilter !== 'all') {
          state.filteredCodes = state.filteredCodes.filter(
            (code) =>
              (state.statusFilter === 'assigned' && code.status === 'assigned') ||
              (state.statusFilter === 'unassigned' && !code.status)
          );
        }
      })
      .addCase(fetchCodesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to fetch data. Using fallback data.';
        state.codes = fallbackCodes;
        state.filteredCodes = fallbackCodes;
      });
  },
});

export const { setSearchTerm, setStatusFilter, setCurrentPage, resetSearch } = codesSlice.actions;
export default codesSlice.reducer;