import { useSyncExternalStore } from 'react';
import { formatErrorMessage } from '../../utils/errors';

export function createLazyResourceStore({
  fetch,
  errorMessage,
  dataKey = 'data',
  normalize = (value) => value,
  isLoaded = (state) => state[dataKey] != null,
}) {
  let storeState = {
    [dataKey]: null,
    error: null,
    loading: false,
    refreshing: false,
  };

  const listeners = new Set();
  let inflight = null;

  function getSnapshot() {
    return storeState;
  }

  function setStoreState(patch) {
    storeState = { ...storeState, ...patch };
    listeners.forEach((listener) => listener());
  }

  async function load({ isRefresh = false } = {}) {
    if (isRefresh && isLoaded(storeState)) {
      setStoreState({ refreshing: true });
    } else {
      setStoreState({ loading: true, error: null, refreshing: false });
    }

    try {
      if (!inflight) {
        inflight = fetch();
      }
      const result = await inflight;
      setStoreState({
        [dataKey]: normalize(result),
        error: null,
        loading: false,
        refreshing: false,
      });
    } catch (err) {
      if (!isLoaded(storeState)) {
        setStoreState({
          error: formatErrorMessage(err, errorMessage),
          loading: false,
          refreshing: false,
        });
      } else {
        setStoreState({ refreshing: false });
      }
    } finally {
      inflight = null;
    }
  }

  function subscribe(listener) {
    listeners.add(listener);
    if (listeners.size === 1 && !isLoaded(storeState) && !inflight && !storeState.loading) {
      load();
    }
    return () => listeners.delete(listener);
  }

  function refresh() {
    if (inflight) return inflight;
    return load({ isRefresh: isLoaded(storeState) });
  }

  function useStore() {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  }

  return { useStore, refresh, getSnapshot };
}
