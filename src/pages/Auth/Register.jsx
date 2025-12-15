import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Link,
  CircularProgress,
} from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import { registerUser, clearError, clearRegisterSuccess } from '../../features/auth/authSlice';
import {
  selectAuthLoading,
  selectAuthError,
  selectRegisterSuccess,
} from '../../features/auth/authSelectors';
import { ROLES, ROUTES } from '../../utils/constants';
import { validators } from '../../utils/validators';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const registerSuccess = useSelector(selectRegisterSuccess);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: ROLES.CUSTOMER,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (registerSuccess) {
      setTimeout(() => {
        dispatch(clearRegisterSuccess());
        navigate(ROUTES.LOGIN);
      }, 2000);
    }
  }, [registerSuccess, navigate, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearRegisterSuccess());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) dispatch(clearError());
  };

  const validateForm = () => {
    const errors = {};

    const usernameError = validators.username(formData.username);
    if (usernameError) errors.username = usernameError;

    const passwordError = validators.password(formData.password);
    if (passwordError) errors.password = passwordError;

    const confirmError = validators.confirmPassword(formData.password, formData.confirmPassword);
    if (confirmError) errors.confirmPassword = confirmError;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(
      registerUser({
        username: formData.username,
        password: formData.password,
        role: formData.role,
      })
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <AccountBalance sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Register for online banking
              </Typography>
            </Box>

            {registerSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Registration successful! Redirecting to login...
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
                error={!!formErrors.username}
                helperText={formErrors.username}
                autoFocus
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                error={!!formErrors.password}
                helperText={formErrors.password}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value={ROLES.CUSTOMER}>Customer</MenuItem>
                  <MenuItem value={ROLES.BANKER}>Banker</MenuItem>
                  <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || registerSuccess}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link component={RouterLink} to={ROUTES.LOGIN}>
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
