import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  AccountBalance,
  SwapHoriz,
  Receipt,
  Schedule,
  People,
  PendingActions,
  AdminPanelSettings,
  Person,
  AddCard,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES, ROLES } from '../../utils/constants';

const Sidebar = ({ open, onClose, width }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();

  // Menu items based on role
  const getMenuItems = () => {
    switch (role) {
      case ROLES.BANKER:
        return [
          { text: 'Dashboard', icon: <Dashboard />, path: ROUTES.BANKER_DASHBOARD },
          { text: 'Customers', icon: <People />, path: ROUTES.BANKER_CUSTOMERS },
          { text: 'Create Account', icon: <AddCard />, path: ROUTES.BANKER_CREATE_ACCOUNT },
          { text: 'Pending Approvals', icon: <PendingActions />, path: ROUTES.BANKER_PENDING },
        ];
      case ROLES.ADMIN:
        return [
          { text: 'Dashboard', icon: <Dashboard />, path: ROUTES.ADMIN_DASHBOARD },
          { text: 'User Management', icon: <AdminPanelSettings />, path: ROUTES.ADMIN_USERS },
        ];
      default: // CUSTOMER
        return [
          { text: 'Dashboard', icon: <Dashboard />, path: ROUTES.DASHBOARD },
          { text: 'Accounts', icon: <AccountBalance />, path: ROUTES.ACCOUNTS },
          { text: 'Transfer', icon: <SwapHoriz />, path: ROUTES.TRANSFER },
          { text: 'Transactions', icon: <Receipt />, path: ROUTES.TRANSACTIONS },
          { text: 'Bill Payment', icon: <Receipt />, path: ROUTES.BILL_PAY },
          { text: 'Scheduled Payments', icon: <Schedule />, path: ROUTES.SCHEDULED_PAYMENTS },
          { text: 'Profile', icon: <Person />, path: ROUTES.PROFILE },
        ];
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  const drawerContent = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalance color="primary" />
          <Typography variant="h6" noWrap color="primary">
            OBS
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'inherit' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
