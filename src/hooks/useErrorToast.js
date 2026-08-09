import { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

/** Shows an error toast whenever `error` becomes truthy. */
export function useErrorToast(error) {
  const { notifyError } = useToast();

  useEffect(() => {
    if (error) notifyError(null, error);
  }, [error, notifyError]);
}
