import { ArrowDownZA, ArrowUpAZ } from 'lucide-react';
import { BtnLabel, SortTrailingBtn } from './BookToolbarStyles';

function SortDirectionButton({ sortDirection, onToggle }) {
  return (
    <SortTrailingBtn
      type="button"
      onClick={onToggle}
      title={sortDirection === 'desc' ? 'High to Low (Click to toggle)' : 'Low to High (Click to toggle)'}
      aria-label={sortDirection === 'desc' ? 'Sort Descending' : 'Sort Ascending'}
    >
      {sortDirection === 'desc' ? <ArrowDownZA /> : <ArrowUpAZ />}
      <BtnLabel>{sortDirection === 'desc' ? 'Descending' : 'Ascending'}</BtnLabel>
    </SortTrailingBtn>
  );
}

export default SortDirectionButton;
