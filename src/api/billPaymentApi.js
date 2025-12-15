import axiosInstance from './axiosConfig';

export const billPaymentApi = {
  payBill: (data) =>
    axiosInstance.post('/accounts/billpay', data),

  scheduleRecurring: (data) =>
    axiosInstance.post('/accounts/billpay/schedule', data),

  getScheduledPayments: (userId) =>
    axiosInstance.get(`/accounts/billpay/scheduled/${userId}`),

  cancelScheduledPayment: (id) =>
    axiosInstance.delete(`/accounts/billpay/${id}`),

  getBillHistory: (accountId) =>
    axiosInstance.get(`/billpay/history/${accountId}`),
};
