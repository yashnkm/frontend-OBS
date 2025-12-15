import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Skeleton,
  Alert,
} from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { fetchAccounts } from '../../features/accounts/accountSlice';
import { selectAccounts, selectAccountsLoading, selectAccountsError } from '../../features/accounts/accountSelectors';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';

const AccountList = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  const accounts = useSelector(selectAccounts);
  const loading = useSelector(selectAccountsLoading);
  const error = useSelector(selectAccountsError);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId));
    }
  }, [dispatch, userId]);

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>My Accounts</Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid size={{xs:12, md:4}} key={i}>
              <Skeleton variant="rectangular" height={150} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
        My Accounts
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {accounts.length === 0 ? (
        <Alert severity="info">
          No accounts found. Please contact your banker to create an account.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {accounts.map((account) => (
            <Grid size={{xs:12, md:4}} key={account.id}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  color: 'white',
                }}
              >
                <CardContent>
                  <Typography variant="overline" sx={{ opacity: 0.8 }}>
                    Account Number
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {maskAccountNumber(account.accountNumber)}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="overline" sx={{ opacity: 0.8 }}>
                      Available Balance
                    </Typography>
                    <Typography variant="h4">
                      {formatCurrency(account.balance)}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Account ID: {account.id}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AccountList;
