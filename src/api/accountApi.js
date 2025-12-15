import axiosInstance from './axiosConfig';

export const accountApi = {
  getAccounts: (userId) =>
    axiosInstance.get(`/accounts/${userId}`),

  createAccount: (data) =>
    axiosInstance.post('/accounts', data),

  transfer: (transferData) =>
    axiosInstance.post('/accounts/transfer', transferData),

  getTransactions: (userId) =>
    axiosInstance.get(`/accounts/transactions/${userId}`),

  getTransactionsWithFilters: (params) =>
    axiosInstance.get('/accounts/transactions', { params }),
};
