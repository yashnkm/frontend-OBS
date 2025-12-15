export const selectAllUsers = (state) => state.users.list;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

// By role
export const selectUsersByRole = (role) => (state) =>
  state.users.list.filter((u) => u.role === role);

export const selectCustomerCount = (state) =>
  state.users.list.filter((u) => u.role === 'CUSTOMER').length;

export const selectBankerCount = (state) =>
  state.users.list.filter((u) => u.role === 'BANKER').length;

export const selectAdminCount = (state) =>
  state.users.list.filter((u) => u.role === 'ADMIN').length;
