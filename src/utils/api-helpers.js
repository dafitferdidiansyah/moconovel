import { fetchBookDirectory, fetchBookDetail } from '../services/api';
import { directoryCache, detailCache } from './cache';

export async function getCachedOrFetchDirectory(bookId) {
  let directory = await directoryCache.get(bookId);
  if (!directory?.item_data_list?.length) {
    directory = await fetchBookDirectory(bookId);
  }
  return directory;
}

async function resolveSettledWithCache(settled, cache, bookId, label, emptyFallback) {
  if (settled.status === 'fulfilled') {
    return { value: settled.value, hadCache: false };
  }
  console.error(`${label}:`, bookId, settled.reason);
  const cached = await cache.get(bookId);
  return { value: cached ?? emptyFallback, hadCache: cached != null };
}

export async function fetchBookDetailAndDirectory(bookId, { forceRefresh = false, catalogOnly = false, signal } = {}) {
  const refreshDirectory = forceRefresh;
  const refreshDetail = forceRefresh && !catalogOnly;
  const [dirSettled, detailSettled] = await Promise.allSettled([
    fetchBookDirectory(bookId, { forceRefresh: refreshDirectory, signal }),
    fetchBookDetail(bookId, { forceRefresh: refreshDetail, signal }),
  ]);

  const { value: bookData, hadCache: hadDirectoryCache } = await resolveSettledWithCache(
    dirSettled,
    directoryCache,
    bookId,
    'Failed to get book index',
    { item_data_list: [] },
  );

  const { value: detail, hadCache: hadDetailCache } = await resolveSettledWithCache(
    detailSettled,
    detailCache,
    bookId,
    'Failed to get book details',
    {},
  );

  if (
    dirSettled.status === 'rejected' &&
    detailSettled.status === 'rejected' &&
    !hadDirectoryCache &&
    !hadDetailCache
  ) {
    throw dirSettled.reason ?? detailSettled.reason;
  }

  if (
    dirSettled.status === 'rejected' &&
    !hadDirectoryCache &&
    !(bookData.item_data_list?.length)
  ) {
    throw dirSettled.reason ?? new Error('Failed to get book index, please check bookId is correct, or try again later.');
  }

  const merged = {
    ...bookData,
    book_info: { ...detail },
  };

  let partialLoadMessage = null;
  if (!signal?.aborted) {
    const dirFail = dirSettled.status === 'rejected' && dirSettled.reason?.name !== 'AbortError';
    const detailFail = detailSettled.status === 'rejected' && detailSettled.reason?.name !== 'AbortError';

    if (dirFail && detailFail) {
      partialLoadMessage = 'Index and details could not update, showing cached content';
    } else if (dirFail) {
      partialLoadMessage = hadDirectoryCache ? 'Index could not update, showing cached chapters' : 'Failed to load index';
    } else if (detailFail) {
      partialLoadMessage = hadDetailCache ? 'Book details could not update, showing cached info' : 'Failed to load book details';
    }
  }

  return { merged, partialLoadMessage };
}
