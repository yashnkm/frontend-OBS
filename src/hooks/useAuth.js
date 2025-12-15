import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import {
  selectUser,
  selectIsAuthenticated,
  selectUserRole,
  selectUserId,
  selectAuthLoading,
  selectAuthError,
  selectIsActive,
} from '../features/auth/authSelectors';
import { loginUser, logout, clearError } from '../features/auth/authSlice';
import { ROLES, ROUTES } from '../utils/constants';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const userId = useSelector(selectUserId);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isActive = useSelector(selectIsActive);

  const login = useCallback(
    async (credentials) => {
      const result = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(result)) {
        // Redirect based on role
        const userRole = result.payload.user.role;
        switch (userRole) {
          case ROLES.BANKER:
            navigate(ROUTES.BANKER_DASHBOARD);
            break;
          case ROLES.ADMIN:
            navigate(ROUTES.ADMIN_DASHBOARD);
            break;
          default:
            navigate(ROUTES.DASHBOARD);
        }
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  }, [dispatch, navigate]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const isCustomer = role === ROLES.CUSTOMER;
  const isBanker = role === ROLES.BANKER;
  const isAdmin = role === ROLES.ADMIN;

  return {
    user,
    userId,
    isAuthenticated,
    role,
    loading,
    error,
    isActive,
    isCustomer,
    isBanker,
    isAdmin,
    login,
    logout: handleLogout,
    clearError: clearAuthError,
  };
};

export default useAuth;
