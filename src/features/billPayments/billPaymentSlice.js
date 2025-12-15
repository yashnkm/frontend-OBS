import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { billPaymentApi } from '../../api/billPaymentApi';

// Async Thunks
export const payBill = createAsyncThunk(
  'billPayments/payBill',
  async (data, { rejectWithValue }) => {
    try {
      const response = await billPaymentApi.payBill(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'Bill payment failed'
      );
    }
  }
);

export const scheduleRecurringPayment = createAsyncThunk(
  'billPayments/scheduleRecurring',
  async (data, { rejectWithValue }) => {
    try {
      const response = await billPaymentApi.scheduleRecurring(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'Failed to schedule payment'
      );
    }
  }
);

export const fetchScheduledPayments = createAsyncThunk(
  'billPayments/fetchScheduled',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await billPaymentApi.getScheduledPayments(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch scheduled payments'
      );
    }
  }
);

export const cancelScheduledPayment = createAsyncThunk(
  'billPayments/cancelScheduled',
  async (id, { rejectWithValue }) => {
    try {
      await billPaymentApi.cancelScheduledPayment(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel payment'
      );
    }
  }
);

// Initial State
const initialState = {
  history: [],
  scheduled: [],
  loading: false,
  error: null,
  paymentSuccess: false,
  paymentMessage: null,
};

// Slice
const billPaymentSlice = createSlice({
  name: 'billPayments',
  initialState,
  reducers: {
    clearBillPaymentError: (state) => {
      state.error = null;
    },
    clearPaymentStatus: (state) => {
      state.paymentSuccess = false;
      state.paymentMessage = null;
    },
    resetBillPayments: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Pay Bill
      .addCase(payBill.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentSuccess = false;
      })
      .addCase(payBill.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSuccess = true;
        state.paymentMessage = action.payload;
      })
      .addCase(payBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Schedule Recurring
      .addCase(scheduleRecurringPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentSuccess = false;
      })
      .addCase(scheduleRecurringPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSuccess = true;
        state.paymentMessage = action.payload;
      })
      .addCase(scheduleRecurringPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Scheduled
      .addCase(fetchScheduledPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScheduledPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduled = action.payload;
      })
      .addCase(fetchScheduledPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Scheduled
      .addCase(cancelScheduledPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelScheduledPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduled = state.scheduled.filter((p) => p.id !== action.payload);
      })
      .addCase(cancelScheduledPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBillPaymentError, clearPaymentStatus, resetBillPayments } = billPaymentSlice.actions;
export default billPaymentSlice.reducer;
