export const selectAccounts = (state) => state.accounts.list;
export const selectSelectedAccount = (state) => state.accounts.selected;
export const selectAccountsLoading = (state) => state.accounts.loading;
export const selectAccountsError = (state) => state.accounts.error;
export const selectTransferSuccess = (state) => state.accounts.transferSuccess;
export const selectTransferMessage = (state) => state.accounts.transferMessage;

// Computed selectors
export const selectTotalBalance = (state) =>
  state.accounts.list.reduce((sum, account) => sum + (account.balance || 0), 0);

export const selectAccountById = (id) => (state) =>
  state.accounts.list.find((account) => account.id === id);

export const selectAccountByNumber = (accountNumber) => (state) =>
  state.accounts.list.find((account) => account.accountNumber === accountNumber);
