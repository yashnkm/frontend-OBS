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
import { SwapHoriz } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { fetchAccounts, transferFunds, clearTransferStatus } from '../../features/accounts/accountSlice';
import {
  selectAccounts,
  selectAccountsLoading,
  selectTransferSuccess,
  selectTransferMessage,
  selectAccountsError,
} from '../../features/accounts/accountSelectors';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';
import { HIGH_VALUE_THRESHOLD } from '../../utils/constants';

const Transfer = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  const accounts = useSelector(selectAccounts);
  const loading = useSelector(selectAccountsLoading);
  const transferSuccess = useSelector(selectTransferSuccess);
  const transferMessage = useSelector(selectTransferMessage);
  const error = useSelector(selectAccountsError);

  const [formData, setFormData] = useState({
    fromAccountNumber: '',
    toAccountNumber: '',
    amount: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    return () => {
      dispatch(clearTransferStatus());
    };
  }, [dispatch]);

  const selectedAccount = accounts.find(
    (acc) => acc.accountNumber === formData.fromAccountNumber
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    if (transferSuccess) dispatch(clearTransferStatus());
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fromAccountNumber) {
      errors.fromAccountNumber = 'Please select a source account';
    }

    if (!formData.toAccountNumber) {
      errors.toAccountNumber = 'Please enter beneficiary account number';
    } else if (!/^\d{9,18}$/.test(formData.toAccountNumber)) {
      errors.toAccountNumber = 'Account number must be 9-18 digits';
    } else if (formData.toAccountNumber === formData.fromAccountNumber) {
      errors.toAccountNumber = 'Cannot transfer to the same account';
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount)) {
      errors.amount = 'Please enter a valid amount';
    } else if (amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    } else if (selectedAccount && amount > selectedAccount.balance) {
      errors.amount = 'Insufficient balance';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(
      transferFunds({
        fromAccountNumber: formData.fromAccountNumber,
        toAccountNumber: formData.toAccountNumber,
        amount: parseFloat(formData.amount),
      })
    );
  };

  const handleReset = () => {
    setFormData({
      fromAccountNumber: '',
      toAccountNumber: '',
      amount: '',
    });
    setFormErrors({});
    dispatch(clearTransferStatus());
  };

  const isHighValue = parseFloat(formData.amount) > HIGH_VALUE_THRESHOLD;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <SwapHoriz sx={{ mr: 1, verticalAlign: 'middle' }} />
        Transfer Funds
      </Typography>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          {transferSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {transferMessage || 'Transfer initiated successfully!'}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" error={!!formErrors.fromAccountNumber}>
              <InputLabel>From Account</InputLabel>
              <Select
                name="fromAccountNumber"
                value={formData.fromAccountNumber}
                onChange={handleChange}
                label="From Account"
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.accountNumber}>
                    {maskAccountNumber(account.accountNumber)} - Balance: {formatCurrency(account.balance)}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.fromAccountNumber && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {formErrors.fromAccountNumber}
                </Typography>
              )}
            </FormControl>

            {selectedAccount && (
              <Alert severity="info" sx={{ mt: 1 }}>
                Available Balance: {formatCurrency(selectedAccount.balance)}
              </Alert>
            )}

            <TextField
              fullWidth
              label="To Account Number"
              name="toAccountNumber"
              value={formData.toAccountNumber}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.toAccountNumber}
              helperText={formErrors.toAccountNumber}
              placeholder="Enter beneficiary account number"
            />

            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.amount}
              helperText={formErrors.amount}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />

            {isHighValue && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Transfers above {formatCurrency(HIGH_VALUE_THRESHOLD)} require banker approval and will be marked as pending.
              </Alert>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Transfer Now'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={handleReset}
                disabled={loading}
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

export default Transfer;
