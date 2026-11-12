import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from '@/services/authService';

// Khôi phục phiên đăng nhập (nếu có) khi F5 trang
const session = authService.getSession();

const emptyState = {
  user: null,
  token: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const initialState = {
  ...emptyState,
  user: session?.user ?? null,
  token: session?.token ?? null,
};

// ===== Async thunks =====
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      return rejectWithValue(error.message || 'Đăng nhập thất bại.');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

// ===== Slice =====
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      })
      .addCase(logout.fulfilled, () => emptyState);
  },
});

export const { clearAuthError } = authSlice.actions;

// ===== Selectors =====
export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);

export default authSlice.reducer;

