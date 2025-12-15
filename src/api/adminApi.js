import axiosInstance from './axiosConfig';

export const adminApi = {
  getAllUsers: () =>
    axiosInstance.get('/admin/users'),

  deleteUser: (id) =>
    axiosInstance.delete(`/admin/users/${id}`),
};
