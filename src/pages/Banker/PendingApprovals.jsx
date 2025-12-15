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
  IconButton,
  Tooltip,
  Skeleton,
  Alert,
} from '@mui/material';
import { PendingActions, CheckCircle, Cancel } from '@mui/icons-material';
import { fetchPendingTransactions, approveTransaction, rejectTransaction } from '../../features/customers/customerSlice';
import {
  selectPendingTransactions,
  selectCustomersLoading,
  selectCustomersError,
} from '../../features/customers/customerSelectors';
import { formatCurrency, formatDateTime, maskAccountNumber } from '../../utils/formatters';

const PendingApprovals = () => {
  const dispatch = useDispatch();

  const pendingTransactions = useSelector(selectPendingTransactions);
  const loading = useSelector(selectCustomersLoading);
  const error = useSelector(selectCustomersError);

  useEffect(() => {
    dispatch(fetchPendingTransactions());
  }, [dispatch]);

  const handleApprove = (id) => {
    if (window.confirm('Are you sure you want to approve this transaction?')) {
      dispatch(approveTransaction(id));
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this transaction?')) {
      dispatch(rejectTransaction(id));
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <PendingActions sx={{ mr: 1, verticalAlign: 'middle' }} />
        Pending Approvals
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Transactions above ₹1,00,000 require your approval before processing.
      </Alert>

      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : pendingTransactions.length === 0 ? (
            <Alert severity="success">No pending transactions to approve.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>From Account</TableCell>
                    <TableCell>To Account</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingTransactions.map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{formatDateTime(transaction.timestamp)}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        {maskAccountNumber(transaction.fromAccount?.accountNumber)}
                        <Typography variant="caption" display="block" color="text.secondary">
                          {transaction.fromAccount?.user?.username}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {maskAccountNumber(transaction.toAccount?.accountNumber)}
                        <Typography variant="caption" display="block" color="text.secondary">
                          {transaction.toAccount?.user?.username}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold" color="error.main">
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Approve Transaction">
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(transaction.id)}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Transaction">
                          <IconButton
                            color="error"
                            onClick={() => handleReject(transaction.id)}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
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

export default PendingApprovals;
