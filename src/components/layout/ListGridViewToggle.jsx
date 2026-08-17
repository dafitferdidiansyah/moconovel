import { Grid2X2, LayoutList } from 'lucide-react';
import { BtnLabel, ToggleBtn, ViewToggle } from './BookToolbarStyles';

function ListGridViewToggle({ viewMode, onViewModeChange }) {
  return (
    <ViewToggle>
      <ToggleBtn
        type="button"
        $active={viewMode === 'list'}
        onClick={() => onViewModeChange('list')}
        title="List View"
        aria-label="List View"
      >
        <LayoutList />
        <BtnLabel>List</BtnLabel>
      </ToggleBtn>
      <ToggleBtn
        type="button"
        $active={viewMode === 'grid'}
        onClick={() => onViewModeChange('grid')}
        title="Grid View"
        aria-label="Grid View"
      >
        <Grid2X2 />
        <BtnLabel>Grid</BtnLabel>
      </ToggleBtn>
    </ViewToggle>
  );
}

export default ListGridViewToggle;
