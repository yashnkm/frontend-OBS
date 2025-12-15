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
  Button,
  TextField,
  InputAdornment,
  Skeleton,
  Alert,
} from '@mui/material';
import { People, Search } from '@mui/icons-material';
import { fetchCustomers, activateCustomer, deactivateCustomer } from '../../features/customers/customerSlice';
import {
  selectCustomers,
  selectCustomersLoading,
  selectCustomersError,
} from '../../features/customers/customerSelectors';

const CustomerList = () => {
  const dispatch = useDispatch();

  const customers = useSelector(selectCustomers);
  const loading = useSelector(selectCustomersLoading);
  const error = useSelector(selectCustomersError);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleActivate = (id) => {
    dispatch(activateCustomer(id));
  };

  const handleDeactivate = (id) => {
    if (window.confirm('Are you sure you want to deactivate this customer?')) {
      dispatch(deactivateCustomer(id));
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <People sx={{ mr: 1, verticalAlign: 'middle' }} />
        Customer Management
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : filteredCustomers.length === 0 ? (
            <Alert severity="info">No customers found.</Alert>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCustomers.map((customer) => (
                      <TableRow key={customer.id} hover>
                        <TableCell>{customer.id}</TableCell>
                        <TableCell>{customer.username}</TableCell>
                        <TableCell>
                          <Chip label={customer.role} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={customer.active ? 'Active' : 'Inactive'}
                            color={customer.active ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {customer.active ? (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDeactivate(customer.id)}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              onClick={() => handleActivate(customer.id)}
                            >
                              Activate
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredCustomers.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerList;
