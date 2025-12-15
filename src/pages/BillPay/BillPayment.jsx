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
  Tabs,
  Tab,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import { Receipt } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { fetchAccounts } from '../../features/accounts/accountSlice';
import { payBill, scheduleRecurringPayment, clearPaymentStatus } from '../../features/billPayments/billPaymentSlice';
import { selectAccounts } from '../../features/accounts/accountSelectors';
import {
  selectBillPaymentLoading,
  selectBillPaymentError,
  selectPaymentSuccess,
  selectPaymentMessage,
} from '../../features/billPayments/billPaymentSelectors';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';
import { FREQUENCY } from '../../utils/constants';

const BillPayment = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  const accounts = useSelector(selectAccounts);
  const loading = useSelector(selectBillPaymentLoading);
  const error = useSelector(selectBillPaymentError);
  const paymentSuccess = useSelector(selectPaymentSuccess);
  const paymentMessage = useSelector(selectPaymentMessage);

  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    accountNumber: '',
    billerName: '',
    amount: '',
    frequency: FREQUENCY.MONTHLY,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    return () => {
      dispatch(clearPaymentStatus());
    };
  }, [dispatch]);

  const selectedAccount = accounts.find((acc) => acc.accountNumber === formData.accountNumber);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    handleReset();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    if (paymentSuccess) dispatch(clearPaymentStatus());
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.accountNumber) {
      errors.accountNumber = 'Please select an account';
    }

    if (!formData.billerName || formData.billerName.trim().length < 2) {
      errors.billerName = 'Please enter a valid biller name';
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      errors.amount = 'Please enter a valid amount';
    } else if (selectedAccount && amount > selectedAccount.balance) {
      errors.amount = 'Insufficient balance';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      accountNumber: formData.accountNumber,
      billerName: formData.billerName,
      amount: parseFloat(formData.amount),
    };

    if (tabValue === 0) {
      dispatch(payBill(payload));
    } else {
      dispatch(scheduleRecurringPayment({ ...payload, frequency: formData.frequency }));
    }
  };

  const handleReset = () => {
    setFormData({
      accountNumber: '',
      billerName: '',
      amount: '',
      frequency: FREQUENCY.MONTHLY,
    });
    setFormErrors({});
    dispatch(clearPaymentStatus());
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
        Bill Payment
      </Typography>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Immediate Payment" />
            <Tab label="Schedule Recurring" />
          </Tabs>

          {paymentSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {paymentMessage || 'Payment processed successfully!'}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" error={!!formErrors.accountNumber}>
              <InputLabel>Select Account</InputLabel>
              <Select
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                label="Select Account"
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.accountNumber}>
                    {maskAccountNumber(account.accountNumber)} - Balance: {formatCurrency(account.balance)}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.accountNumber && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {formErrors.accountNumber}
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
              label="Biller Name"
              name="billerName"
              value={formData.billerName}
              onChange={handleChange}
              margin="normal"
              error={!!formErrors.billerName}
              helperText={formErrors.billerName}
              placeholder="e.g., Electricity Board, Internet Provider"
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

            {tabValue === 1 && (
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Payment Frequency</FormLabel>
                <RadioGroup
                  row
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                >
                  <FormControlLabel value={FREQUENCY.DAILY} control={<Radio />} label="Daily" />
                  <FormControlLabel value={FREQUENCY.WEEKLY} control={<Radio />} label="Weekly" />
                  <FormControlLabel value={FREQUENCY.MONTHLY} control={<Radio />} label="Monthly" />
                </RadioGroup>
              </FormControl>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : tabValue === 0 ? (
                  'Pay Now'
                ) : (
                  'Schedule Payment'
                )}
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

export default BillPayment;
