import axiosInstance from './axiosConfig';

export const bankerApi = {
  getCustomers: () =>
    axiosInstance.get('/banker/customers'),

  activateCustomer: (id) =>
    axiosInstance.post(`/banker/customers/${id}/activate`),

  deactivateCustomer: (id) =>
    axiosInstance.post(`/banker/customers/${id}/deactivate`),

  getPendingTransactions: () =>
    axiosInstance.get('/banker/transactions/pending'),

  approveTransaction: (id) =>
    axiosInstance.post(`/banker/transactions/${id}/approve`),

  rejectTransaction: (id) =>
    axiosInstance.post(`/banker/transactions/${id}/reject`),
};
