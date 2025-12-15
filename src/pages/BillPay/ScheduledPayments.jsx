import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Skeleton,
  Alert,
  Tooltip,
} from '@mui/material';
import { Schedule, Cancel } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { fetchScheduledPayments, cancelScheduledPayment } from '../../features/billPayments/billPaymentSlice';
import {
  selectScheduledPayments,
  selectBillPaymentLoading,
  selectBillPaymentError,
} from '../../features/billPayments/billPaymentSelectors';
import { formatCurrency, formatDateTime, getStatusColor } from '../../utils/formatters';

const ScheduledPayments = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  const scheduledPayments = useSelector(selectScheduledPayments);
  const loading = useSelector(selectBillPaymentLoading);
  const error = useSelector(selectBillPaymentError);

  useEffect(() => {
    if (userId) {
      dispatch(fetchScheduledPayments(userId));
    }
  }, [dispatch, userId]);

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this scheduled payment?')) {
      dispatch(cancelScheduledPayment(id));
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
        Scheduled Payments
      </Typography>

      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {loading ? (
            <Skeleton variant="rectangular" height={300} />
          ) : scheduledPayments.length === 0 ? (
            <Alert severity="info">
              No scheduled payments found. You can schedule recurring payments from the Bill Payment page.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Biller Name</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Next Payment</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scheduledPayments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.billerName}</TableCell>
                      <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Chip label={payment.frequency} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{formatDateTime(payment.nextPaymentDate)}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          color={getStatusColor(payment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {payment.status === 'PENDING' && (
                          <Tooltip title="Cancel Payment">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleCancel(payment.id)}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ScheduledPayments;
