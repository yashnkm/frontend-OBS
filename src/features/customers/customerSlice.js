import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bankerApi } from '../../api/bankerApi';

// Async Thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bankerApi.getCustomers();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch customers'
      );
    }
  }
);

export const activateCustomer = createAsyncThunk(
  'customers/activate',
  async (id, { rejectWithValue }) => {
    try {
      await bankerApi.activateCustomer(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to activate customer'
      );
    }
  }
);

export const deactivateCustomer = createAsyncThunk(
  'customers/deactivate',
  async (id, { rejectWithValue }) => {
    try {
      await bankerApi.deactivateCustomer(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to deactivate customer'
      );
    }
  }
);

export const fetchPendingTransactions = createAsyncThunk(
  'customers/fetchPendingTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bankerApi.getPendingTransactions();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch pending transactions'
      );
    }
  }
);

export const approveTransaction = createAsyncThunk(
  'customers/approveTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await bankerApi.approveTransaction(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to approve transaction'
      );
    }
  }
);

export const rejectTransaction = createAsyncThunk(
  'customers/rejectTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await bankerApi.rejectTransaction(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reject transaction'
      );
    }
  }
);

// Initial State
const initialState = {
  list: [],
  pendingTransactions: [],
  loading: false,
  error: null,
};

// Slice
const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },
    resetCustomers: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Activate Customer
      .addCase(activateCustomer.fulfilled, (state, action) => {
        const customer = state.list.find((c) => c.id === action.payload);
        if (customer) {
          customer.active = true;
        }
      })
      .addCase(activateCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Deactivate Customer
      .addCase(deactivateCustomer.fulfilled, (state, action) => {
        const customer = state.list.find((c) => c.id === action.payload);
        if (customer) {
          customer.active = false;
        }
      })
      .addCase(deactivateCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch Pending Transactions
      .addCase(fetchPendingTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTransactions = action.payload;
      })
      .addCase(fetchPendingTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve Transaction
      .addCase(approveTransaction.fulfilled, (state, action) => {
        state.pendingTransactions = state.pendingTransactions.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(approveTransaction.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Reject Transaction
      .addCase(rejectTransaction.fulfilled, (state, action) => {
        state.pendingTransactions = state.pendingTransactions.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(rejectTransaction.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCustomerError, resetCustomers } = customerSlice.actions;
export default customerSlice.reducer;
