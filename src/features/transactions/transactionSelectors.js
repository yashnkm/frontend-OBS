export const selectTransactions = (state) => state.transactions.list;
export const selectTransactionFilters = (state) => state.transactions.filters;
export const selectTransactionsLoading = (state) => state.transactions.loading;
export const selectTransactionsError = (state) => state.transactions.error;

// Filtered transactions
export const selectFilteredTransactions = (state) => {
  const { list, filters } = state.transactions;

  return list.filter((transaction) => {
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.status && transaction.status !== filters.status) return false;
    return true;
  });
};

// Recent transactions (last 5)
export const selectRecentTransactions = (state) => {
  return [...state.transactions.list]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);
};
