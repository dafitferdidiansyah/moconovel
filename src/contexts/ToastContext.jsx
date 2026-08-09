import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import Toast from '../components/ui/Toast';
import { createToastHelpers, normalizeToastInput, noopToastHelpers } from '../utils/toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((input) => {
    const normalized = normalizeToastInput(input);
    if (normalized) setToast(normalized);
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const helpers = useMemo(
    () => createToastHelpers(showToast),
    [showToast],
  );

  const value = useMemo(
    () => ({
      showToast,
      clearToast,
      ...helpers,
    }),
    [showToast, clearToast, helpers],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toast={toast} onExpire={clearToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return noopToastHelpers;
  return ctx;
}
