import { FolderInput, FolderMinus, Download, FileText, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { CardActionButton, CardSpinningIcon } from './CardActionButton';

export function getDeleteLocalDataLabel() {
  return "Delete this book's local data";
}

export function getRemoveFromCollectionLabel() {
  return 'Remove from Collection';
}

export function getDeleteActionLabel(isAllTab) {
  return isAllTab ? getDeleteLocalDataLabel() : getRemoveFromCollectionLabel();
}

/**
 * Renders per-book quick action buttons for card overlays and manage bars.
 * Accepts any button component that supports CardActionButton props (e.g. ManageBarButton).
 */
export function BookQuickActions({
  ButtonComponent = CardActionButton,
  bookId,
  bookInfo,
  isAllTab = true,
  isRefreshing = false,
  showCollection = true,
  showDownload = true,
  showExport = true,
  stopPropagation = true,
  onAddToCollection,
  onDownload,
  onExport,
  onRefreshClick,
  refetch,
  onDeleteClick,
  onDeleteLocalDataClick,
}) {
  const wrapClick = (handler) => {
    if (!handler) return undefined;
    if (!stopPropagation) return handler;
    return (e) => {
      e.stopPropagation();
      handler(e);
    };
  };

  const deleteLabel = getDeleteActionLabel(isAllTab);
  const deleteLocalDataLabel = getDeleteLocalDataLabel();

  return (
    <>
      {showCollection && onAddToCollection && (
        <ButtonComponent
          type="button"
          $variant="collection"
          onClick={wrapClick(() => onAddToCollection(bookId))}
          title="Add to Collection"
          aria-label="Add to Collection"
        >
          <FolderInput />
        </ButtonComponent>
      )}
      {showDownload && onDownload && (
        <ButtonComponent
          type="button"
          $variant="download"
          onClick={wrapClick(() => onDownload(bookId))}
          title="Download All"
          aria-label="Download All"
        >
          <Download />
        </ButtonComponent>
      )}
      {showExport && onExport && (
        <ButtonComponent
          type="button"
          $variant="export"
          onClick={wrapClick(() => onExport(bookId))}
          title="Export Books"
          aria-label="Export Books"
        >
          <FileText />
        </ButtonComponent>
      )}
      <ButtonComponent
        type="button"
        $variant="refresh"
        disabled={isRefreshing}
        onClick={wrapClick((e) => (onRefreshClick ?? refetch)(e, bookId))}
        title="Refresh Index and Book Data"
        aria-label="Refresh Index and Book Data"
      >
        {isRefreshing ? (
          <CardSpinningIcon><Loader2 size={18} /></CardSpinningIcon>
        ) : (
          <RefreshCw />
        )}
      </ButtonComponent>
      {!isAllTab && onDeleteLocalDataClick && (
        <ButtonComponent
          type="button"
          $variant="delete"
          onClick={wrapClick((e) => onDeleteLocalDataClick(e, bookId, bookInfo))}
          title={deleteLocalDataLabel}
          aria-label={deleteLocalDataLabel}
        >
          <Trash2 />
        </ButtonComponent>
      )}
      <ButtonComponent
        type="button"
        $variant={isAllTab ? 'delete' : 'collection'}
        onClick={wrapClick((e) => onDeleteClick?.(e, bookId, bookInfo))}
        title={deleteLabel}
        aria-label={deleteLabel}
      >
        {isAllTab ? <Trash2 /> : <FolderMinus />}
      </ButtonComponent>
    </>
  );
}
