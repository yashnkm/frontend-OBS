// Validation helper functions
export const validators = {
  required: (value) =>
    value && value.toString().trim() ? '' : 'This field is required',

  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address',

  phone: (value) =>
    /^[6-9]\d{9}$/.test(value) ? '' : 'Invalid phone number (10 digits starting with 6-9)',

  pan: (value) =>
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) ? '' : 'Invalid PAN number',

  accountNumber: (value) =>
    /^\d{9,18}$/.test(value) ? '' : 'Account number must be 9-18 digits',

  ifsc: (value) =>
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value) ? '' : 'Invalid IFSC code',

  amount: (value, min = 1) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'Please enter a valid amount';
    if (num < min) return `Amount must be at least ₹${min}`;
    return '';
  },

  maxAmount: (value, max, balance) => {
    const num = parseFloat(value);
    if (num > balance) return `Insufficient balance. Available: ₹${balance}`;
    if (max && num > max) return `Amount cannot exceed ₹${max}`;
    return '';
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain a number';
    if (!/[!@#$%^&*]/.test(value)) return 'Password must contain a special character (!@#$%^&*)';
    return '';
  },

  confirmPassword: (password, confirmPassword) =>
    password === confirmPassword ? '' : 'Passwords do not match',

  username: (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 20) return 'Username cannot exceed 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  },

  billerName: (value) => {
    if (!value) return 'Biller name is required';
    if (value.length < 2) return 'Biller name must be at least 2 characters';
    if (value.length > 100) return 'Biller name cannot exceed 100 characters';
    return '';
  },
};

// Validate entire form
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach((field) => {
    const rules = validationRules[field];
    const value = formData[field];

    for (const rule of rules) {
      const error = rule(value, formData);
      if (error) {
        errors[field] = error;
        isValid = false;
        break;
      }
    }
  });

  return { errors, isValid };
};

// Common validation rule sets
export const loginValidationRules = {
  username: [(v) => validators.required(v)],
  password: [(v) => validators.required(v)],
  role: [(v) => validators.required(v)],
};

export const registerValidationRules = {
  username: [(v) => validators.username(v)],
  password: [(v) => validators.password(v)],
  confirmPassword: [(v, form) => validators.confirmPassword(form.password, v)],
  role: [(v) => validators.required(v)],
};

export const transferValidationRules = {
  fromAccountNumber: [(v) => validators.required(v)],
  toAccountNumber: [(v) => validators.accountNumber(v)],
  amount: [(v) => validators.amount(v, 1)],
};

export const billPaymentValidationRules = {
  accountNumber: [(v) => validators.required(v)],
  billerName: [(v) => validators.billerName(v)],
  amount: [(v) => validators.amount(v, 1)],
};

export const recurringPaymentValidationRules = {
  ...billPaymentValidationRules,
  frequency: [(v) => validators.required(v)],
};
