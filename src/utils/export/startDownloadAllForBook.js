import { getCachedOrFetchDirectory } from '../api-helpers';
import { getUncachedItemIds } from '../storage';
import { createToastHelpers } from '../toast';

export async function getUncachedChaptersForBook(bookId) {
  const directory = await getCachedOrFetchDirectory(bookId);
  const list = directory?.item_data_list ?? [];
  if (!list.length) {
    return { ok: false, uncachedItemIds: [], uncachedCount: 0 };
  }

  const uncachedItemIds = await getUncachedItemIds(list.map((item) => item.item_id));
  return { ok: true, uncachedItemIds, uncachedCount: uncachedItemIds.length };
}

/**
 * Resolves uncached chapter IDs for a book and starts batch download if needed.
 * @returns {{ started: boolean, uncachedCount: number, ok: boolean }}
 */
export async function startDownloadAllForBook({ bookId, startDownloadAll, showToast }) {
  const { notifyError, notifyInfo } = createToastHelpers(showToast ?? (() => {}));
  const { ok, uncachedItemIds, uncachedCount } = await getUncachedChaptersForBook(bookId);
  if (!ok) {
    notifyError(null, '無法取得章節目錄');
    return { started: false, uncachedCount: 0, ok: false };
  }

  if (uncachedCount > 0) {
    startDownloadAll(bookId, uncachedItemIds);
  } else {
    notifyInfo('所有章節已下載');
  }

  return { started: uncachedCount > 0, uncachedCount, ok: true };
}

/**
 * Same as startDownloadAllForBook but wraps errors with a toast.
 */
export async function startDownloadAllForBookSafe({
  bookId,
  startDownloadAll,
  showToast,
  errorMessage = '無法開始下載，請稍後再試。',
}) {
  const { notifyError } = createToastHelpers(showToast ?? (() => {}));
  try {
    return await startDownloadAllForBook({ bookId, startDownloadAll, showToast });
  } catch (err) {
    notifyError(err, errorMessage);
    return { started: false, uncachedCount: 0, ok: false };
  }
}
