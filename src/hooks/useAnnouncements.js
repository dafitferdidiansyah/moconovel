import { fetchAnnouncements } from '../services/api';
import { createLazyResourceStore } from './api/createLazyResourceStore';

const { useStore, refresh } = createLazyResourceStore({
  fetch: fetchAnnouncements,
  errorMessage: '無法載入公告',
  dataKey: 'announcements',
  normalize: (items) => (Array.isArray(items) ? items : []),
  isLoaded: (state) => state.announcements !== null,
});

export const refreshAnnouncements = refresh;

export function useAnnouncements() {
  const { announcements, loading, error } = useStore();
  const pinnedNotices = announcements?.filter((item) => item.pin) ?? [];
  return { announcements, pinnedNotices, loading, error };
}
