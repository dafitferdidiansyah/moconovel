import { Bookmark, Download, FileText, MessageCircle, RefreshCw } from 'lucide-react';
import BookActionBar from '../book/BookActionBar';
import LabeledIconButton from '../ui/LabeledIconButton';
import { CHAPTER_BUTTON_TITLE } from '../navigation/ChapterButton';
import { buildChapterUrl, buildCommentsUrl } from '../../utils/navigation';

function CatalogActionBar({
  bookId,
  navigate,
  hasUncachedChapters,
  downloadingAll,
  onDownloadAll,
  onRefresh,
  onExportBook,
  lastReadItemId,
}) {
  const downloadText = downloadingAll ? 'Stop Download' : hasUncachedChapters ? 'Download All' : 'Downloaded';

  return (
    <BookActionBar>
      <LabeledIconButton
        type="button"
        label={downloadText}
        title={downloadText}
        onClick={onDownloadAll}
        disabled={!hasUncachedChapters && !downloadingAll}
        $active={downloadingAll}
        aria-pressed={downloadingAll}
      >
        <Download size={20} strokeWidth={2.5} />
      </LabeledIconButton>
      <LabeledIconButton
        type="button"
        label="Export Books"
        title="Export Books"
        onClick={onExportBook}
      >
        <FileText size={20} strokeWidth={2.5} />
      </LabeledIconButton>
      <LabeledIconButton
        type="button"
        label="Refresh Index"
        title="Refresh Index"
        onClick={onRefresh}
      >
        <RefreshCw size={20} strokeWidth={2.5} />
      </LabeledIconButton>
      <LabeledIconButton
        type="button"
        label="View Comments"
        title="View Comments"
        onClick={() => navigate(buildCommentsUrl(bookId))}
      >
        <MessageCircle size={20} strokeWidth={2.5} />
      </LabeledIconButton>
      <LabeledIconButton
        type="button"
        label={CHAPTER_BUTTON_TITLE}
        title={CHAPTER_BUTTON_TITLE}
        disabled={!lastReadItemId}
        onClick={() => {
          if (!lastReadItemId) return;
          navigate(buildChapterUrl(lastReadItemId, bookId));
        }}
      >
        <Bookmark size={20} strokeWidth={2.5} />
      </LabeledIconButton>
    </BookActionBar>
  );
}

export default CatalogActionBar;
