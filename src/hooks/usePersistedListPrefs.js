import { useState } from 'react';

export function usePersistedListPrefs({
  getViewMode,
  setViewMode,
  getSort,
  setSort,
  getSortDirection,
  setSortDirection,
  onSortChange,
}) {
  const [viewMode, setViewModeState] = useState(getViewMode);
  const [sortBy, setSortByState] = useState(getSort);
  const [sortDirection, setSortDirectionState] = useState(getSortDirection);

  const handleViewModeChange = (mode) => {
    setViewModeState(mode);
    setViewMode(mode);
  };

  const handleSortChange = (next) => {
    setSortByState(next);
    setSort(next);
    onSortChange?.(next);
  };

  const handleSortDirectionToggle = () => {
    const next = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirectionState(next);
    setSortDirection(next);
  };

  return {
    viewMode,
    sortBy,
    sortDirection,
    handleViewModeChange,
    handleSortChange,
    handleSortDirectionToggle,
  };
}
