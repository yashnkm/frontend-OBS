// User Roles
export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  BANKER: 'BANKER',
  ADMIN: 'ADMIN',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  TRANSFER: 'TRANSFER',
  BILL_PAYMENT: 'BILL_PAYMENT',
};

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
};

// Payment Types
export const PAYMENT_TYPES = {
  IMMEDIATE: 'IMMEDIATE',
  RECURRING: 'RECURRING',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

// Frequency Options
export const FREQUENCY = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
};

// High value transfer threshold
export const HIGH_VALUE_THRESHOLD = 100000;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  ACCOUNTS: {
    BASE: '/accounts',
    TRANSFER: '/accounts/transfer',
    BY_USER: (userId) => `/accounts/${userId}`,
    TRANSACTIONS: (userId) => `/accounts/transactions/${userId}`,
  },
  BILL_PAYMENT: {
    PAY: '/accounts/billpay',
    SCHEDULE: '/accounts/billpay/schedule',
    SCHEDULED: (userId) => `/accounts/billpay/scheduled/${userId}`,
    CANCEL: (id) => `/accounts/billpay/${id}`,
  },
  BANKER: {
    CUSTOMERS: '/banker/customers',
    ACTIVATE: (id) => `/banker/customers/${id}/activate`,
    DEACTIVATE: (id) => `/banker/customers/${id}/deactivate`,
    PENDING: '/banker/transactions/pending',
    APPROVE: (id) => `/banker/transactions/${id}/approve`,
    REJECT: (id) => `/banker/transactions/${id}/reject`,
  },
  ADMIN: {
    USERS: '/admin/users',
    DELETE_USER: (id) => `/admin/users/${id}`,
  },
};

// Routes
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Customer
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAILS: '/accounts/:id',
  TRANSFER: '/transfer',
  TRANSACTIONS: '/transactions',
  BILL_PAY: '/billpay',
  SCHEDULED_PAYMENTS: '/billpay/scheduled',
  PROFILE: '/profile',

  // Banker
  BANKER_DASHBOARD: '/banker/dashboard',
  BANKER_CUSTOMERS: '/banker/customers',
  BANKER_PENDING: '/banker/pending',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};
