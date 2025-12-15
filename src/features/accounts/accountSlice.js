import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { accountApi } from '../../api/accountApi';

// Async Thunks
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await accountApi.getAccounts(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch accounts'
      );
    }
  }
);

export const createAccount = createAsyncThunk(
  'accounts/createAccount',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await accountApi.createAccount(accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create account'
      );
    }
  }
);

export const transferFunds = createAsyncThunk(
  'accounts/transfer',
  async (transferData, { rejectWithValue }) => {
    try {
      const response = await accountApi.transfer(transferData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'Transfer failed'
      );
    }
  }
);

// Initial State
const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  transferSuccess: false,
  transferMessage: null,
};

// Slice
const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    selectAccount: (state, action) => {
      state.selected = state.list.find((acc) => acc.id === action.payload) || null;
    },
    clearAccountError: (state) => {
      state.error = null;
    },
    clearTransferStatus: (state) => {
      state.transferSuccess = false;
      state.transferMessage = null;
    },
    resetAccounts: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Account
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Transfer Funds
      .addCase(transferFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.transferSuccess = false;
        state.transferMessage = null;
      })
      .addCase(transferFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.transferSuccess = true;
        state.transferMessage = action.payload;
      })
      .addCase(transferFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.transferSuccess = false;
      });
  },
});

export const { selectAccount, clearAccountError, clearTransferStatus, resetAccounts } = accountSlice.actions;
export default accountSlice.reducer;
