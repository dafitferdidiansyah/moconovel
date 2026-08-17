import { useState, useCallback } from 'react';
import {
  createCollection,
  addBooksToCollection,
  removeBooksFromCollection,
  addBooksToReadingHistory,
} from '../utils/storage';

function normalizeBookIds(bookIds) {
  return (Array.isArray(bookIds) ? bookIds : [bookIds]).map(String);
}

export function useCollectionModalActions({
  collections,
  onReload,
  notifyError,
  addToReadingHistoryOnInclude = false,
  addToHistoryOnOpenIfInCollection = false,
}) {
  const [addToCollectionBookIds, setAddToCollectionBookIds] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');

  const openAddToCollection = useCallback((bookIds) => {
    const ids = normalizeBookIds(bookIds);
    setAddToCollectionBookIds(ids);
    setNewCollectionName('');
    if (addToHistoryOnOpenIfInCollection) {
      const inAnyCollection = collections.some((col) => col.bookIds.includes(ids[0]));
      if (inAnyCollection) {
        void addBooksToReadingHistory(ids).then(onReload);
      }
    }
  }, [collections, onReload, addToHistoryOnOpenIfInCollection]);

  const closeAddToCollection = useCallback(() => {
    setAddToCollectionBookIds(null);
  }, []);

  const handleToggleBooksInCollection = useCallback(async (collectionId, bookIds, shouldInclude) => {
    const ids = normalizeBookIds(bookIds);
    try {
      if (shouldInclude) {
        if (addToReadingHistoryOnInclude) {
          await Promise.all([
            addBooksToCollection(collectionId, ids),
            addBooksToReadingHistory(ids),
          ]);
        } else {
          await addBooksToCollection(collectionId, ids);
        }
      } else {
        await removeBooksFromCollection(collectionId, ids);
      }
      await onReload();
    } catch (err) {
      if (notifyError) {
        notifyError(err, 'Failed to update collection, please try again later.');
      } else {
        throw err;
      }
    }
  }, [addToReadingHistoryOnInclude, onReload, notifyError]);

  const handleCreateCollectionFromModal = useCallback(async () => {
    if (!newCollectionName.trim()) return;
    try {
      await createCollection(newCollectionName.trim());
      await onReload();
      setNewCollectionName('');
    } catch (err) {
      if (notifyError) {
        notifyError(err, 'Failed to create collection, please try again later.');
      } else {
        throw err;
      }
    }
  }, [newCollectionName, onReload, notifyError]);

  return {
    addToCollectionBookIds,
    newCollectionName,
    setNewCollectionName,
    openAddToCollection,
    closeAddToCollection,
    handleToggleBooksInCollection,
    handleCreateCollectionFromModal,
  };
}
