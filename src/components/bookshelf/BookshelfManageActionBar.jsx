import {
  SquareCheckBig,
  SquareX,
  FolderInput,
  FolderMinus,
  Trash2,
  Download,
  FileText,
  RefreshCw,
  Loader2,
  X,
} from 'lucide-react';
import { CardSpinningIcon } from '../book/CardActionButton';
import { getDeleteLocalDataLabel, getRemoveFromCollectionLabel } from '../book/BookQuickActions';
import { ALL_TAB } from './constants';
import {
  BookshelfManageActionBar as BookshelfManageActionBarRoot,
  BookshelfManageSelectionRow,
  BookshelfManageActionCount,
  BookshelfManageSelectionButtons,
  BookshelfManageSelectionButton,
  BookshelfManageActionButtons,
  BookshelfManageBarButton,
} from './styles';

function BookshelfManageActionBar({
  activeTab,
  selectedCount,
  allBooksSelected,
  selectableBookIds,
  onSelectAll,
  onDeselectAll,
  onBulkAddToCollection,
  onGoToDownload,
  onGoToExport,
  onBulkRefresh,
  onBulkDelete,
  onBulkDeleteLocalData,
  isRefreshing,
  onExitManageMode,
}) {
  const isAllTab = activeTab === ALL_TAB;
  const bulkDeleteLabel = isAllTab ? 'Delete Selected Books' : getRemoveFromCollectionLabel();
  const bulkDeleteLocalDataLabel = getDeleteLocalDataLabel();

  return (
    <BookshelfManageActionBarRoot>
      <BookshelfManageSelectionRow>
        <BookshelfManageActionCount>{selectedCount} Selected</BookshelfManageActionCount>
        <BookshelfManageSelectionButtons>
          <BookshelfManageSelectionButton
            type="button"
            disabled={allBooksSelected || selectableBookIds.length === 0}
            onClick={onSelectAll}
            title="Select All"
            aria-label="Select All"
          >
            <SquareCheckBig />
          </BookshelfManageSelectionButton>
          <BookshelfManageSelectionButton
            type="button"
            disabled={selectedCount === 0}
            onClick={onDeselectAll}
            title="Deselect All"
            aria-label="Deselect All"
          >
            <SquareX />
          </BookshelfManageSelectionButton>
        </BookshelfManageSelectionButtons>
      </BookshelfManageSelectionRow>
      <BookshelfManageActionButtons>
        <BookshelfManageBarButton
          type="button"
          $variant="collection"
          disabled={selectedCount === 0}
          onClick={onBulkAddToCollection}
          title="Add to Collection"
          aria-label="Add to Collection"
        >
          <FolderInput />
        </BookshelfManageBarButton>
        {selectedCount === 1 && (
          <>
            <BookshelfManageBarButton
              type="button"
              $variant="download"
              onClick={onGoToDownload}
              title="Download All"
              aria-label="Download All"
            >
              <Download />
            </BookshelfManageBarButton>
            <BookshelfManageBarButton
              type="button"
              $variant="export"
              onClick={onGoToExport}
              title="Export Books"
              aria-label="Export Books"
            >
              <FileText />
            </BookshelfManageBarButton>
          </>
        )}
        <BookshelfManageBarButton
          type="button"
          $variant="refresh"
          disabled={selectedCount === 0 || isRefreshing}
          onClick={onBulkRefresh}
          title="Refresh Index and Book Data"
          aria-label="Refresh Index and Book Data"
        >
          {isRefreshing ? (
            <CardSpinningIcon><Loader2 size={18} /></CardSpinningIcon>
          ) : (
            <RefreshCw />
          )}
        </BookshelfManageBarButton>
        {!isAllTab && onBulkDeleteLocalData && (
          <BookshelfManageBarButton
            type="button"
            $variant="delete"
            disabled={selectedCount === 0}
            onClick={onBulkDeleteLocalData}
            title={bulkDeleteLocalDataLabel}
            aria-label={bulkDeleteLocalDataLabel}
          >
            <Trash2 />
          </BookshelfManageBarButton>
        )}
        <BookshelfManageBarButton
          type="button"
          $variant={isAllTab ? 'delete' : 'collection'}
          disabled={selectedCount === 0}
          onClick={onBulkDelete}
          title={bulkDeleteLabel}
          aria-label={bulkDeleteLabel}
        >
          {isAllTab ? <Trash2 /> : <FolderMinus />}
        </BookshelfManageBarButton>
        <BookshelfManageBarButton
          type="button"
          onClick={onExitManageMode}
          title="Exit Manage"
          aria-label="Exit Manage"
        >
          <X strokeWidth={2.25} />
        </BookshelfManageBarButton>
      </BookshelfManageActionButtons>
    </BookshelfManageActionBarRoot>
  );
}

export default BookshelfManageActionBar;
