import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import keycloak from '../../config/keycloak';

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
};
let isKeycloakInitialized = false;

export const initializeKeycloak = createAsyncThunk(
  'auth/initializeKeycloak',
  async (_, { rejectWithValue }) => {
    if (isKeycloakInitialized) {
      console.warn('Keycloak already initialized. Skipping.');
      return rejectWithValue('Keycloak already initialized');
    }

    try {
      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
      });
      isKeycloakInitialized = true;

      return {
        isAuthenticated: authenticated,
        token: keycloak.token || null,
      };
    } catch (err: any) {
      console.error('Keycloak init failed:', err);
      return rejectWithValue(err?.message || 'Keycloak init failed');
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      keycloak.logout({ redirectUri: window.location.origin+ '/logged-out' });
      state.isAuthenticated = false;
      state.token = null;
    },
    loginUser: () => {
      keycloak.login({ redirectUri: window.location.origin + '/dashboard' });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeKeycloak.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;
    });
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
