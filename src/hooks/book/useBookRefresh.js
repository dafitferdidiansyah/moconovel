import { useState, useCallback } from 'react';
import { fetchBookDetailAndDirectory } from '../../utils/api-helpers';
import { formatErrorMessage } from '../../utils/errors';

async function refreshSingleBook(bookId) {
  const { partialLoadMessage } = await fetchBookDetailAndDirectory(bookId, { forceRefresh: true });
  return {
    bookId,
    ok: !partialLoadMessage,
    partialLoadMessage,
    error: null,
  };
}

/** Manages per-book refresh state for bookshelf and similar multi-book views. */
export function useBookRefresh() {
  const [refreshingBookIds, setRefreshingBookIds] = useState(() => new Set());
  const [bookDataVersions, setBookDataVersions] = useState({});
  const [bookRefreshErrors, setBookRefreshErrors] = useState({});

  const clearBookRefreshErrors = useCallback((bookIds) => {
    setBookRefreshErrors((prev) => {
      const ids = (Array.isArray(bookIds) ? bookIds : [bookIds]).map(String);
      if (ids.length === 0) return prev;
      const next = { ...prev };
      ids.forEach((bookId) => delete next[bookId]);
      return next;
    });
  }, []);

  const bumpBookDataVersion = useCallback((bookId) => {
    setBookDataVersions((prev) => ({
      ...prev,
      [bookId]: (prev[bookId] || 0) + 1,
    }));
  }, []);

  const applyRefreshOutcome = useCallback((bookId, partialLoadMessage, errorMessage) => {
    if (partialLoadMessage || !errorMessage) {
      bumpBookDataVersion(bookId);
    }
    if (partialLoadMessage) {
      setBookRefreshErrors((prev) => ({ ...prev, [bookId]: partialLoadMessage }));
    } else if (errorMessage) {
      setBookRefreshErrors((prev) => ({ ...prev, [bookId]: errorMessage }));
    }
  }, [bumpBookDataVersion]);

  const handleBookRefresh = useCallback(async (_e, bookId) => {
    if (refreshingBookIds.has(bookId)) return;

    setRefreshingBookIds((prev) => new Set(prev).add(bookId));
    setBookRefreshErrors((prev) => {
      const next = { ...prev };
      delete next[bookId];
      return next;
    });

    try {
      const outcome = await refreshSingleBook(bookId);
      applyRefreshOutcome(bookId, outcome.partialLoadMessage, null);
    } catch (err) {
      applyRefreshOutcome(
        bookId,
        null,
        formatErrorMessage(err, 'Refresh failed, please try again later.'),
      );
    } finally {
      setRefreshingBookIds((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
    }
  }, [refreshingBookIds, applyRefreshOutcome]);

  const handleBulkRefresh = useCallback(async (bookIds, { notifySuccess, notifyError, notifyWarning }) => {
    if (bookIds.length === 0 || refreshingBookIds.size > 0) return;

    setRefreshingBookIds(new Set(bookIds));
    setBookRefreshErrors((prev) => {
      const next = { ...prev };
      bookIds.forEach((bookId) => delete next[bookId]);
      return next;
    });

    const outcomes = await Promise.all(
      bookIds.map(async (bookId) => {
        try {
          const outcome = await refreshSingleBook(bookId);
          applyRefreshOutcome(bookId, outcome.partialLoadMessage, null);
          return outcome;
        } catch (err) {
          applyRefreshOutcome(
            bookId,
            null,
            formatErrorMessage(err, 'Refresh failed, please try again later.'),
          );
          return { bookId, ok: false, partialLoadMessage: null, error: err };
        } finally {
          setRefreshingBookIds((prev) => {
            const next = new Set(prev);
            next.delete(bookId);
            return next;
          });
        }
      }),
    );

    const succeeded = outcomes.filter((o) => o.ok).length;
    const failed = outcomes.length - succeeded;

    if (failed === 0) {
      notifySuccess(`Refreshed ${bookIds.length}  books`);
    } else if (succeeded === 0) {
      notifyError(null, `All ${failed}  failed to refresh`);
    } else {
      notifyWarning(`${succeeded}  successfully refreshed, ${failed}  failed`);
    }
  }, [refreshingBookIds, applyRefreshOutcome]);

  const resetRefreshingOnManageExit = useCallback(() => {
    setRefreshingBookIds(new Set());
  }, []);

  return {
    refreshingBookIds,
    bookDataVersions,
    bookRefreshErrors,
    clearBookRefreshErrors,
    handleBookRefresh,
    handleBulkRefresh,
    resetRefreshingOnManageExit,
  };
}
