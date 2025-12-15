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
  Skeleton,
  Alert,
} from '@mui/material';
import {
  People,
  AdminPanelSettings,
  AccountBalance,
  ArrowForward,
} from '@mui/icons-material';
import { fetchAllUsers } from '../../features/users/userSlice';
import {
  selectAllUsers,
  selectUsersLoading,
  selectUsersError,
  selectCustomerCount,
  selectBankerCount,
  selectAdminCount,
} from '../../features/users/userSelectors';
import { ROUTES } from '../../utils/constants';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector(selectAllUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const customerCount = useSelector(selectCustomerCount);
  const bankerCount = useSelector(selectBankerCount);
  const adminCount = useSelector(selectAdminCount);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      icon: <People sx={{ fontSize: 48 }} />,
      color: 'primary.main',
    },
    {
      label: 'Customers',
      value: customerCount,
      icon: <AccountBalance sx={{ fontSize: 48 }} />,
      color: 'success.main',
    },
    {
      label: 'Bankers',
      value: bankerCount,
      icon: <AdminPanelSettings sx={{ fontSize: 48 }} />,
      color: 'warning.main',
    },
    {
      label: 'Admins',
      value: adminCount,
      icon: <AdminPanelSettings sx={{ fontSize: 48 }} />,
      color: 'error.main',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {loading ? (
          stats.map((_, index) => (
            <Grid size={{xs:12, sm:6, md:3}} key={index}>
              <Skeleton variant="rectangular" height={150} />
            </Grid>
          ))
        ) : (
          stats.map((stat) => (
            <Grid size={{xs:12, sm:6, md:3}} key={stat.label}>
              <Card sx={{ bgcolor: stat.color, color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="overline">{stat.label}</Typography>
                      <Typography variant="h3">{stat.value}</Typography>
                    </Box>
                    <Box sx={{ opacity: 0.8 }}>{stat.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}

        <Grid size={{xs:12}}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">User Management</Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and manage all system users
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate(ROUTES.ADMIN_USERS)}
                >
                  Manage Users
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
