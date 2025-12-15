export const selectBillPaymentHistory = (state) => state.billPayments.history;
export const selectScheduledPayments = (state) => state.billPayments.scheduled;
export const selectBillPaymentLoading = (state) => state.billPayments.loading;
export const selectBillPaymentError = (state) => state.billPayments.error;
export const selectPaymentSuccess = (state) => state.billPayments.paymentSuccess;
export const selectPaymentMessage = (state) => state.billPayments.paymentMessage;

// Active scheduled payments (not cancelled)
export const selectActiveScheduledPayments = (state) =>
  state.billPayments.scheduled.filter(
    (payment) => payment.status !== 'CANCELLED' && payment.status !== 'FAILED'
  );
