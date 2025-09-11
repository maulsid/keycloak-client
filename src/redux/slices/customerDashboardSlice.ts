import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { CustomerData } from "../../types";

interface CustomerDashboardState {
  customerData: CustomerData | null;
  availableCodes: any[];
  loading: boolean;
  error: string | null;
}

interface FetchCustomerDashboardArgs {
  token: string | null;
  customerId: string | number | null;
}

const initialState: CustomerDashboardState = {
  customerData: null,
  availableCodes: [],
  loading: false,
  error: null,
};

// Mock user data (as in the original component)
const user = {
  id: "001",
  companyName: "Medical Center",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@medicalcenter.com",
  phoneNumber: "555-123-4567",
};

// Mock fallback data for customer
const fallbackCustomerData: CustomerData = {
  customerId: "CUST-001",
  name: "Medical Center",
  primaryContact: "John Doe",
  email: "john.doe@medicalcenter.com",
  phone: "555-123-4567",
  purchasedCodes: 0,
  utilizedCodes: 0,
  availableCodes: 0,
  recentActivity: [
    {
      id: 1,
      action: "New access code requested",
      patientId: "PAT-001",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      action: "Patient report viewed",
      patientId: "PAT-002",
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: 3,
      action: "Marketing materials downloaded",
      patientId: undefined,
      date: "2024-01-13",
      status: "completed",
    },
  ],
};

export const fetchCustomerDashboard = createAsyncThunk<
  { customerData: CustomerData; availableCodes: any[] }, // Returned type
  FetchCustomerDashboardArgs, // ThunkArg type
  { rejectValue: string } // ThunkApiConfig
>(
  "customerDashboard/fetchCustomerDashboard",
  async ({ token, customerId }, { rejectWithValue }) => {
    try {
      if (!customerId || !token) {
        throw new Error("Missing customer ID or token");
      }

      // Fetch customer stats
      const statsResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}portal/hcp/customers/${customerId}/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const statsData = await statsResponse.json();

      if (!statsResponse.ok) {
        throw new Error("Failed to fetch customer stats");
      }

      // Fetch available codes
      const codesResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}portal/hcp/customers/${customerId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const codesData = await codesResponse.json();

      if (!codesResponse.ok) {
        throw new Error("Failed to fetch available codes");
      }

      // Map the API response for available codes
      const codes = codesData.codes?.map((c: any, index: number) => ({
        id: index.toString(),
        code: c.code,
        status: "unassigned",
        assignedDate: new Date().toISOString(),
      })) || [];

      // Combine data
      const customerData: CustomerData = {
        customerId: `CUST-${customerId}`,
        name: user.companyName,
        primaryContact: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phoneNumber,
        ...statsData,
        recentActivity: [
          {
            id: 1,
            action: "New access code requested",
            patientId: "PAT-001",
            date: "2024-01-15",
            status: "completed",
          },
          {
            id: 2,
            action: "Patient report viewed",
            patientId: "PAT-002",
            date: "2024-01-14",
            status: "completed",
          },
          {
            id: 3,
            action: "Marketing materials downloaded",
            patientId: undefined,
            date: "2024-01-13",
            status: "completed",
          },
        ],
      };

      return { customerData, availableCodes: codes };
    } catch (error) {
      console.error("Error in fetchCustomerDashboard:", error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const customerDashboardSlice = createSlice({
  name: "customerDashboard",
  initialState,
  reducers: {
    resetDashboard: (state) => {
      state.customerData = null;
      state.availableCodes = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.customerData = action.payload.customerData;
        state.availableCodes = action.payload.availableCodes;
      })
      .addCase(fetchCustomerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load customer dashboard";
        state.customerData = fallbackCustomerData;
        state.availableCodes = [];
      });
  },
});

export const { resetDashboard } = customerDashboardSlice.actions;
export default customerDashboardSlice.reducer;