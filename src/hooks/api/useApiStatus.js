import { fetchApiStatus } from '../../services/api';
import { createLazyResourceStore } from './createLazyResourceStore';

const { useStore, refresh } = createLazyResourceStore({
  fetch: fetchApiStatus,
  errorMessage: 'Failed to load API Status',
  dataKey: 'data',
  isLoaded: (state) => Boolean(state.data),
});

export const refreshApiStatus = refresh;
export const useApiStatusStore = useStore;

export function useApiStatus() {
  const { data } = useApiStatusStore();
  const statusByApi = {};
  for (const api of data?.apis ?? []) {
    statusByApi[api.id] = api.overall;
  }
  return statusByApi;
}
