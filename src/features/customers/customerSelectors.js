export const selectCustomers = (state) => state.customers.list;
export const selectPendingTransactions = (state) => state.customers.pendingTransactions;
export const selectCustomersLoading = (state) => state.customers.loading;
export const selectCustomersError = (state) => state.customers.error;

// Computed selectors
export const selectActiveCustomers = (state) =>
  state.customers.list.filter((c) => c.active);

export const selectInactiveCustomers = (state) =>
  state.customers.list.filter((c) => !c.active);

export const selectPendingCount = (state) =>
  state.customers.pendingTransactions.length;
