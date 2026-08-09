import { formatErrorMessage } from './errors';
import {
  TOAST_DURATION_ERROR_MS,
  TOAST_DURATION_INFO_MS,
  TOAST_DURATION_SUCCESS_MS,
  TOAST_DURATION_WARNING_MS,
} from './constants';

/** @typedef {'success' | 'error' | 'warning' | 'info'} ToastType */

/** @typedef {{ message: string, type?: ToastType, duration?: number }} ToastOptions */

const DURATION_BY_TYPE = {
  success: TOAST_DURATION_SUCCESS_MS,
  error: TOAST_DURATION_ERROR_MS,
  warning: TOAST_DURATION_WARNING_MS,
  info: TOAST_DURATION_INFO_MS,
};

/**
 * Normalizes string or object input into a toast payload.
 * @param {string | ToastOptions | null | undefined} input
 * @returns {{ message: string, type: ToastType, duration: number } | null}
 */
export function normalizeToastInput(input) {
  if (input == null || input === '') return null;

  if (typeof input === 'string') {
    return {
      message: input,
      type: 'info',
      duration: DURATION_BY_TYPE.info,
    };
  }

  const type = input.type ?? 'info';
  return {
    message: input.message,
    type,
    duration: input.duration ?? DURATION_BY_TYPE[type] ?? DURATION_BY_TYPE.info,
  };
}

/**
 * @param {(input: string | ToastOptions) => void} showToast
 */
export function createToastHelpers(showToast) {
  const show = (message, type) => showToast({ message, type });

  return {
    notifySuccess: (message) => show(message, 'success'),
    notifyError: (err, fallback) => show(formatErrorMessage(err, fallback), 'error'),
    notifyWarning: (message) => show(message, 'warning'),
    notifyInfo: (message) => show(message, 'info'),
  };
}

const noop = () => {};

export const noopToastHelpers = {
  showToast: noop,
  clearToast: noop,
  notifySuccess: noop,
  notifyError: noop,
  notifyWarning: noop,
  notifyInfo: noop,
};
