import { useState, useCallback, useEffect } from 'react';
import { getCollections, getReadingHistory } from '../utils/storage';

export function useCollectionsWithHistory() {
  const [collections, setCollections] = useState([]);
  const [allBookIds, setAllBookIds] = useState([]);

  const reload = useCallback(async () => {
    const [cols, history] = await Promise.all([getCollections(), getReadingHistory()]);
    setCollections(cols);
    setAllBookIds(history.map((e) => e.bookId));
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { collections, allBookIds, reload };
}
