import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { accountApi } from '../../api/accountApi';

// Async Thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await accountApi.getTransactions(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch transactions'
      );
    }
  }
);

export const fetchTransactionsWithFilters = createAsyncThunk(
  'transactions/fetchWithFilters',
  async (params, { rejectWithValue }) => {
    try {
      const response = await accountApi.getTransactionsWithFilters(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch transactions'
      );
    }
  }
);

// Initial State
const initialState = {
  list: [],
  filters: {
    type: '',
    status: '',
    startDate: '',
    endDate: '',
  },
  loading: false,
  error: null,
};

// Slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearTransactionError: (state) => {
      state.error = null;
    },
    resetTransactions: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch With Filters
      .addCase(fetchTransactionsWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTransactionsWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearTransactionError, resetTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
