import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNotification,
  removeNotification,
  clearNotifications,
} from '../features/ui/uiSlice';
import { selectNotifications } from '../features/ui/uiSelectors';

export const useNotification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  const showSuccess = useCallback(
    (message) => {
      dispatch(
        addNotification({
          type: 'success',
          message,
        })
      );
    },
    [dispatch]
  );

  const showError = useCallback(
    (message) => {
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
    },
    [dispatch]
  );

  const showWarning = useCallback(
    (message) => {
      dispatch(
        addNotification({
          type: 'warning',
          message,
        })
      );
    },
    [dispatch]
  );

  const showInfo = useCallback(
    (message) => {
      dispatch(
        addNotification({
          type: 'info',
          message,
        })
      );
    },
    [dispatch]
  );

  const remove = useCallback(
    (id) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    remove,
    clear,
  };
};

export default useNotification;
