// Currency formatter for Indian Rupees
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '₹0.00';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format large numbers with commas (Indian format)
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(number);
};

// Date formatter
export const formatDate = (date, format = 'long') => {
  if (!date) return '';

  const dateObj = new Date(date);

  const options = format === 'long'
    ? { year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' };

  return dateObj.toLocaleDateString('en-IN', options);
};

// DateTime formatter
export const formatDateTime = (date) => {
  if (!date) return '';

  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Time only formatter
export const formatTime = (date) => {
  if (!date) return '';

  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Mask account number (show only last 4 digits)
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  const last4 = accountNumber.slice(-4);
  return `****${last4}`;
};

// Format account number with spaces
export const formatAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  return accountNumber.replace(/(.{4})/g, '$1 ').trim();
};

// Get status color for transactions
export const getStatusColor = (status) => {
  const colors = {
    PENDING: 'warning',
    APPROVED: 'info',
    COMPLETED: 'success',
    REJECTED: 'error',
    FAILED: 'error',
    CANCELLED: 'default',
  };
  return colors[status] || 'default';
};

// Get transaction direction label
export const getTransactionDirection = (transaction, userId) => {
  if (transaction.fromUser?.id === userId) {
    return 'Sent';
  }
  return 'Received';
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text with ellipsis
export const truncate = (str, length = 20) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};
