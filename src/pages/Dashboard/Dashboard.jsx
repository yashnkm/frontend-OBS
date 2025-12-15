import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  AccountBalance,
  SwapHoriz,
  Receipt,
  Schedule,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { fetchAccounts } from '../../features/accounts/accountSlice';
import { fetchTransactions } from '../../features/transactions/transactionSlice';
import { fetchScheduledPayments } from '../../features/billPayments/billPaymentSlice';
import {
  selectAccounts,
  selectAccountsLoading,
  selectTotalBalance,
} from '../../features/accounts/accountSelectors';
import { selectRecentTransactions, selectTransactionsLoading } from '../../features/transactions/transactionSelectors';
import { selectActiveScheduledPayments } from '../../features/billPayments/billPaymentSelectors';
import { formatCurrency, formatDateTime, getStatusColor, maskAccountNumber } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userId } = useAuth();

  const accounts = useSelector(selectAccounts);
  const accountsLoading = useSelector(selectAccountsLoading);
  const totalBalance = useSelector(selectTotalBalance);
  const recentTransactions = useSelector(selectRecentTransactions);
  const transactionsLoading = useSelector(selectTransactionsLoading);
  const scheduledPayments = useSelector(selectActiveScheduledPayments);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId));
      dispatch(fetchTransactions(userId));
      dispatch(fetchScheduledPayments(userId));
    }
  }, [dispatch, userId]);

  const quickActions = [
    { label: 'Transfer Funds', icon: <SwapHoriz />, path: ROUTES.TRANSFER },
    { label: 'Pay Bills', icon: <Receipt />, path: ROUTES.BILL_PAY },
    { label: 'View Transactions', icon: <Receipt />, path: ROUTES.TRANSACTIONS },
    { label: 'Scheduled Payments', icon: <Schedule />, path: ROUTES.SCHEDULED_PAYMENTS },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.username}!
      </Typography>

      <Grid container spacing={3}>
        {/* Account Summary Card */}
        <Grid size={{xs:12, md:8}}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Account Summary
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate(ROUTES.ACCOUNTS)}
                >
                  View All
                </Button>
              </Box>

              {accountsLoading ? (
                <Skeleton variant="rectangular" height={100} />
              ) : accounts.length === 0 ? (
                <Alert severity="info">No accounts found. Contact your banker to create an account.</Alert>
              ) : (
                <>
                  <Grid container spacing={2}>
                    {accounts.slice(0, 3).map((account) => (
                      <Grid size={{xs:12, sm:4}} key={account.id}>
                        <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                          <Typography variant="body2">
                            {maskAccountNumber(account.accountNumber)}
                          </Typography>
                          <Typography variant="h5">
                            {formatCurrency(account.balance)}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Balance
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {formatCurrency(totalBalance)}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions Card */}
        <Grid size={{xs:12, md:4}}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outlined"
                    startIcon={action.icon}
                    onClick={() => navigate(action.path)}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid size={{xs:12}}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Transactions</Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate(ROUTES.TRANSACTIONS)}
                >
                  View All
                </Button>
              </Box>

              {transactionsLoading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : recentTransactions.length === 0 ? (
                <Alert severity="info">No transactions yet.</Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>From / To</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentTransactions.map((transaction) => (
                        <TableRow key={transaction.id} hover>
                          <TableCell>{formatDateTime(transaction.timestamp)}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>
                            {maskAccountNumber(transaction.fromAccount)} → {maskAccountNumber(transaction.toAccount)}
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              color={transaction.direction === 'Sent' ? 'error.main' : 'success.main'}
                            >
                              {transaction.direction === 'Sent' ? '-' : '+'}
                              {formatCurrency(transaction.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.status}
                              color={getStatusColor(transaction.status)}
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

        {/* Scheduled Payments */}
        {scheduledPayments.length > 0 && (
          <Grid size={{xs:12}}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Upcoming Scheduled Payments</Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(ROUTES.SCHEDULED_PAYMENTS)}
                  >
                    Manage
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Biller</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Next Payment</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scheduledPayments.slice(0, 3).map((payment) => (
                        <TableRow key={payment.id} hover>
                          <TableCell>{payment.billerName}</TableCell>
                          <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>{payment.frequency}</TableCell>
                          <TableCell>{formatDateTime(payment.nextPaymentDate)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
