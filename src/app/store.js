import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import accountReducer from '../features/accounts/accountSlice';
import transactionReducer from '../features/transactions/transactionSlice';
import billPaymentReducer from '../features/billPayments/billPaymentSlice';
import customerReducer from '../features/customers/customerSlice';
import userReducer from '../features/users/userSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountReducer,
    transactions: transactionReducer,
    billPayments: billPaymentReducer,
    customers: customerReducer,
    users: userReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.DEV,
});

export default store;
