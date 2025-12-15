import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import PrivateRoute from './PrivateRoute';
import { ROUTES, ROLES } from '../utils/constants';

// Auth Pages
import { Login, Register } from '../pages/Auth';

// Customer Pages
import { Dashboard } from '../pages/Dashboard';
import { AccountList } from '../pages/Accounts';
import { Transfer, TransactionHistory } from '../pages/Transactions';
import { BillPayment, ScheduledPayments } from '../pages/BillPay';
import { Profile } from '../pages/Profile';

// Banker Pages
import { BankerDashboard, CustomerList, PendingApprovals } from '../pages/Banker';

// Admin Pages
import { AdminDashboard, UserManagement } from '../pages/Admin';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      {/* Customer Routes */}
      <Route
        element={
          <PrivateRoute allowedRoles={[ROLES.CUSTOMER, ROLES.BANKER]}>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.ACCOUNTS} element={<AccountList />} />
        <Route path={ROUTES.TRANSFER} element={<Transfer />} />
        <Route path={ROUTES.TRANSACTIONS} element={<TransactionHistory />} />
        <Route path={ROUTES.BILL_PAY} element={<BillPayment />} />
        <Route path={ROUTES.SCHEDULED_PAYMENTS} element={<ScheduledPayments />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
      </Route>

      {/* Banker Routes */}
      <Route
        element={
          <PrivateRoute allowedRoles={[ROLES.BANKER]}>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path={ROUTES.BANKER_DASHBOARD} element={<BankerDashboard />} />
        <Route path={ROUTES.BANKER_CUSTOMERS} element={<CustomerList />} />
        <Route path={ROUTES.BANKER_PENDING} element={<PendingApprovals />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <PrivateRoute allowedRoles={[ROLES.ADMIN]}>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN_USERS} element={<UserManagement />} />
      </Route>

      {/* Redirect root to login */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
};

export default AppRoutes;
