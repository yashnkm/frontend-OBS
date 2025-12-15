import axiosInstance from './axiosConfig';

export const authApi = {
  login: (credentials) =>
    axiosInstance.post('/auth/login', credentials),

  register: (userData) =>
    axiosInstance.post('/auth/register', userData),

  refreshToken: (refreshToken) =>
    axiosInstance.post('/auth/refresh', { refreshToken }),
};
