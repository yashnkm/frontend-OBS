import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../features/auth/authSelectors';
import { ROUTES } from '../utils/constants';

const PrivateRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard if role not allowed
    switch (userRole) {
      case 'BANKER':
        return <Navigate to={ROUTES.BANKER_DASHBOARD} replace />;
      case 'ADMIN':
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
      default:
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  return children;
};

export default PrivateRoute;
