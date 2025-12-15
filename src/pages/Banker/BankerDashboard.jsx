import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People,
  PendingActions,
  CheckCircle,
  Cancel,
  ArrowForward,
} from '@mui/icons-material';
import { fetchCustomers, fetchPendingTransactions, approveTransaction, rejectTransaction } from '../../features/customers/customerSlice';
import {
  selectCustomers,
  selectPendingTransactions,
  selectCustomersLoading,
  selectCustomersError,
} from '../../features/customers/customerSelectors';
import { formatCurrency, formatDateTime, maskAccountNumber } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';

const BankerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const customers = useSelector(selectCustomers);
  const pendingTransactions = useSelector(selectPendingTransactions);
  const loading = useSelector(selectCustomersLoading);
  const error = useSelector(selectCustomersError);

  useEffect(() => {
    dispatch(fetchCustomers());
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

  const activeCustomers = customers.filter((c) => c.active).length;
  const inactiveCustomers = customers.filter((c) => !c.active).length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Banker Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid size={{xs:12, sm:4}}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline">Pending Approvals</Typography>
                  <Typography variant="h3">{pendingTransactions.length}</Typography>
                </Box>
                <PendingActions sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12, sm:4}}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline">Active Customers</Typography>
                  <Typography variant="h3">{activeCustomers}</Typography>
                </Box>
                <People sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12, sm:4}}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline">Inactive Customers</Typography>
                  <Typography variant="h3">{inactiveCustomers}</Typography>
                </Box>
                <People sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Transactions */}
        <Grid size={{xs:12}}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  <PendingActions sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Pending Transactions for Approval
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate(ROUTES.BANKER_PENDING)}
                >
                  View All
                </Button>
              </Box>

              {loading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : pendingTransactions.length === 0 ? (
                <Alert severity="success">No pending transactions to approve.</Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>From Account</TableCell>
                        <TableCell>To Account</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingTransactions.slice(0, 5).map((transaction) => (
                        <TableRow key={transaction.id} hover>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>{formatDateTime(transaction.timestamp)}</TableCell>
                          <TableCell>
                            {maskAccountNumber(transaction.fromAccount?.accountNumber)}
                          </TableCell>
                          <TableCell>
                            {maskAccountNumber(transaction.toAccount?.accountNumber)}
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="medium" color="error.main">
                              {formatCurrency(transaction.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Approve">
                              <IconButton
                                color="success"
                                onClick={() => handleApprove(transaction.id)}
                              >
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
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
        </Grid>

        {/* Customer Overview */}
        <Grid size={{xs:12}}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  <People sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent Customers
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate(ROUTES.BANKER_CUSTOMERS)}
                >
                  View All
                </Button>
              </Box>

              {loading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customers.slice(0, 5).map((customer) => (
                        <TableRow key={customer.id} hover>
                          <TableCell>{customer.id}</TableCell>
                          <TableCell>{customer.username}</TableCell>
                          <TableCell>
                            <Chip
                              label={customer.active ? 'Active' : 'Inactive'}
                              color={customer.active ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BankerDashboard;
