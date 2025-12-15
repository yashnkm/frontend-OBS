import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { AccountBalance, Add } from '@mui/icons-material';
import { fetchCustomers } from '../../features/customers/customerSlice';
import { createAccount, clearAccountError } from '../../features/accounts/accountSlice';
import { selectCustomers, selectCustomersLoading } from '../../features/customers/customerSelectors';
import { selectAccountsLoading, selectAccountsError } from '../../features/accounts/accountSelectors';

const CreateAccount = () => {
  const dispatch = useDispatch();

  const customers = useSelector(selectCustomers);
  const customersLoading = useSelector(selectCustomersLoading);
  const accountLoading = useSelector(selectAccountsLoading);
  const accountError = useSelector(selectAccountsError);

  const [formData, setFormData] = useState({
    userId: '',
    accountNumber: '',
    balance: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearAccountError());
    };
  }, [dispatch]);

  const generateAccountNumber = () => {
    const prefix = '1000';
    const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    setFormData((prev) => ({ ...prev, accountNumber: prefix + random }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccessMessage('');
    if (accountError) dispatch(clearAccountError());
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.userId) {
      errors.userId = 'Please select a customer';
    }

    if (!formData.accountNumber) {
      errors.accountNumber = 'Account number is required';
    } else if (!/^\d{12}$/.test(formData.accountNumber)) {
      errors.accountNumber = 'Account number must be 12 digits';
    }

    const balance = parseFloat(formData.balance);
    if (!formData.balance || isNaN(balance)) {
      errors.balance = 'Please enter initial balance';
    } else if (balance < 0) {
      errors.balance = 'Balance cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await dispatch(
      createAccount({
        userId: parseInt(formData.userId),
        accountNumber: formData.accountNumber,
        balance: parseFloat(formData.balance),
      })
    );

    if (createAccount.fulfilled.match(result)) {
      setSuccessMessage('Account created successfully!');
      setFormData({ userId: '', accountNumber: '', balance: '' });
    }
  };

  const handleReset = () => {
    setFormData({ userId: '', accountNumber: '', balance: '' });
    setFormErrors({});
    setSuccessMessage('');
    dispatch(clearAccountError());
  };

  // Filter only active customers
  const activeCustomers = customers.filter((c) => c.active);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Add sx={{ mr: 1, verticalAlign: 'middle' }} />
        Create New Account
      </Typography>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a new bank account for an existing customer.
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {accountError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {accountError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" error={!!formErrors.userId}>
              <InputLabel>Select Customer</InputLabel>
              <Select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                label="Select Customer"
                disabled={customersLoading}
              >
                {activeCustomers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.username} (ID: {customer.id})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.userId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {formErrors.userId}
                </Typography>
              )}
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                margin="normal"
                error={!!formErrors.accountNumber}
                helperText={formErrors.accountNumber || '12-digit account number'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalance />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                onClick={generateAccountNumber}
                sx={{ mt: 2, minWidth: 120 }}
              >
                Generate
              </Button>
            </Box>

            <TextField
              fullWidth
              label="Initial Balance"
              name="balance"
              type="number"
              value={formData.balance}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.balance}
              helperText={formErrors.balance}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={accountLoading}
                fullWidth
                startIcon={accountLoading ? <CircularProgress size={20} color="inherit" /> : <Add />}
              >
                {accountLoading ? 'Creating...' : 'Create Account'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={handleReset}
                disabled={accountLoading}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateAccount;
