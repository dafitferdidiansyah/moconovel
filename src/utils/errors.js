import { AUTO_BAN_DURATION_MINUTES } from './constants';

export class HttpError extends Error {
  constructor(message, { status } = {}) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Builds an HttpError from a non-OK fetch Response (body is consumed). */
export async function httpErrorFromResponse(res) {
  let detail = null;
  try {
    const json = await res.json();
    detail = json?.error ?? json?.detail ?? json?.message;
  } catch {
    // ignore non-JSON bodies
  }
  return new HttpError(detail || `HTTP ${res.status}`, { status: res.status });
}

/**
 * Formats an error for user display. Handles known API/network error types
 * and falls back to the provided default message.
 */
export function formatErrorMessage(error, defaultMessage) {
  if (!error) return defaultMessage;
  const msg = error.message ?? '';
  const name = error.name ?? '';

  if (error.status === 429) {
    return 'Requests too frequent, please try again later.';
  }

  if (error.status === 403) {
    return `Requests too frequent, you have been temporarily banned ${AUTO_BAN_DURATION_MINUTES}  minutes, please try again later.`;
  }

  if (msg.includes('timed out')) {
    return `Request timed out, please try again later.`;
  }
  if (msg.includes('Invalid book ID') || msg.includes('book not found')) {
    return 'Books ID Invalid or book not found, please check and try again.';
  }
  if (msg.includes('Failed to decode')) {
    return 'Invalid response data, please try again later.';
  }
  if (
    msg.includes('Failed to fetch') ||
    msg.includes('Invalid response from server') ||
    msg.includes('Load failed') ||
    msg.includes('network') ||
    name === 'NetworkError'
  ) {
    return 'Request failed, please try again later.';
  }
  if (name === 'SyntaxError' || msg.includes('Unexpected token')) {
    return 'Response format error, please try again later.';
  }
  return defaultMessage;
}
