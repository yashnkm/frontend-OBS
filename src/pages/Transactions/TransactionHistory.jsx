import { useEffect, useState } from 'react';
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
  TablePagination,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Button,
  Skeleton,
  Alert,
} from '@mui/material';
import { Receipt, FilterList } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { fetchTransactions, setFilters, clearFilters } from '../../features/transactions/transactionSlice';
import {
  selectTransactions,
  selectTransactionsLoading,
  selectTransactionsError,
  selectTransactionFilters,
} from '../../features/transactions/transactionSelectors';
import { formatCurrency, formatDateTime, getStatusColor, maskAccountNumber } from '../../utils/formatters';
import { TRANSACTION_TYPES, TRANSACTION_STATUS } from '../../utils/constants';

const TransactionHistory = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectTransactionsLoading);
  const error = useSelector(selectTransactionsError);
  const filters = useSelector(selectTransactionFilters);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTransactions(userId));
    }
  }, [dispatch, userId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (filters.type && t.type !== filters.type) return false;
    if (filters.status && t.status !== filters.status) return false;
    return true;
  });

  // Paginate
  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
        Transaction History
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{xs:12, sm:3}}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  label="Type"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={TRANSACTION_TYPES.TRANSFER}>Transfer</MenuItem>
                  <MenuItem value={TRANSACTION_TYPES.BILL_PAYMENT}>Bill Payment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs:12, sm:3}}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={TRANSACTION_STATUS.PENDING}>Pending</MenuItem>
                  <MenuItem value={TRANSACTION_STATUS.COMPLETED}>Completed</MenuItem>
                  <MenuItem value={TRANSACTION_STATUS.REJECTED}>Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs:12, sm:3}}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Start Date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{xs:12, sm:3}}>
              <Button variant="outlined" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : filteredTransactions.length === 0 ? (
            <Alert severity="info">No transactions found.</Alert>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>From Account</TableCell>
                      <TableCell>To Account</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>{transaction.id}</TableCell>
                        <TableCell>{formatDateTime(transaction.timestamp)}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.type}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {maskAccountNumber(transaction.fromAccount)}
                          {transaction.fromUser && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {transaction.fromUser}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {maskAccountNumber(transaction.toAccount)}
                          {transaction.toUser && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {transaction.toUser}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            fontWeight="medium"
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
              <TablePagination
                component="div"
                count={filteredTransactions.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransactionHistory;
