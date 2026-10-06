import { useEffect, useLayoutEffect, useCallback, useState } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import ChapterTopBar from '../components/chapter/ChapterTopBar';
import BottomBar from '../components/chapter/BottomBar';
import Reader from '../components/chapter/Reader';
import ReaderControlsPanel from '../components/chapter/ReaderControlsPanel';
import ChapterJumpModal from '../components/chapter/ChapterJumpModal';
import AutoScrollControl from '../components/chapter/AutoScrollControl';
import Error from '../components/ui/Error';
import Loading from '../components/ui/Loading';
import PageWrapper from '../components/layout/PageWrapper';
import ScrollToTop from '../components/ui/ScrollToTop';
import { useConversionMode } from '../hooks/useConversionMode';
import {
  useFontSize,
  useLineHeight,
  useFontFamily,
  useReaderBackground,
  useReaderWidth,
} from '../hooks/useTextSettings';
import { useChapterLoader } from '../hooks/book/useChapterLoader';
import { buildCatalogUrl, buildChapterUrl, ROUTES } from '../utils/navigation';

function Chapter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemId = searchParams.get('itemId');
  const bookId = searchParams.get('bookId');

  const { error, chapterData, bookInfo, loading, loadChapter } = useChapterLoader(itemId, bookId);
  const [fontSize, handleFontSizeChange] = useFontSize();
  const [lineHeight, handleLineHeightChange] = useLineHeight();
  const [fontFamily, handleFontFamilyChange] = useFontFamily();
  const [readerWidth, handleReaderWidthChange] = useReaderWidth();

  const {
    readerBackground,
    readerBackgroundColor,
    readerTextColor,
    handleReaderBackgroundChange,
  } = useReaderBackground();
  const [conversionMode] = useConversionMode();
  const [readerControlsOpen, setReaderControlsOpen] = useState(false);
  const [jumpModalOpen, setJumpModalOpen] = useState(false);
  const [showToolbars, setShowToolbars] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Auto-scroll state
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(2);

  const handleRefresh = useCallback(() => {
    loadChapter(true);
  }, [loadChapter]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [itemId]);

  useEffect(() => {
    setReaderControlsOpen(false);
    setJumpModalOpen(false);
    setIsAutoScrolling(false);
    setShowToolbars(true);
    setShowScrollTop(false);
  }, [itemId]);

  // Keyboard navigation (ArrowLeft = prev, ArrowRight = next)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if typing inside an input/textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const { pre_item_id, next_item_id } = chapterData?.novel_data ?? {};

      if (e.key === 'ArrowLeft' && pre_item_id) {
        navigate(buildChapterUrl(pre_item_id, bookId));
      } else if (e.key === 'ArrowRight' && next_item_id) {
        navigate(buildChapterUrl(next_item_id, bookId));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapterData, bookId, navigate]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY + 60) {
        setShowToolbars(false);
      }

      if (currentScrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!itemId) {
    return bookId ? <Navigate to={buildCatalogUrl(bookId)} replace /> : <Navigate to={ROUTES.home} replace />;
  }

  if (error) {
    return <Error message={error} href={bookId ? buildCatalogUrl(bookId) : '/'} />;
  }

  const isInitialLoad = loading && !chapterData;

  return (
    <PageWrapper $withBottomPadding={false} $backgroundColor={isInitialLoad ? undefined : readerBackgroundColor}>
      {isInitialLoad ? (
        <Loading onAbort={() => navigate(bookId ? buildCatalogUrl(bookId) : '/')} />
      ) : (
        <>
          {chapterData && (
            <>
              <ChapterTopBar
                show={showToolbars}
                chapterData={chapterData}
                bookInfo={bookInfo}
                bookId={bookId}
                itemId={itemId}
                conversionMode={conversionMode}
                readerControlsOpen={readerControlsOpen}
                onReaderControlsToggle={() => setReaderControlsOpen((open) => !open)}
              />

              <ReaderControlsPanel
                open={readerControlsOpen}
                onClose={() => setReaderControlsOpen(false)}
                onRefresh={handleRefresh}
                fontSize={fontSize}
                onFontSizeChange={handleFontSizeChange}
                lineHeight={lineHeight}
                onLineHeightChange={handleLineHeightChange}
                fontFamily={fontFamily}
                onFontFamilyChange={handleFontFamilyChange}
                readerWidth={readerWidth}
                onReaderWidthChange={handleReaderWidthChange}
                readerBackground={readerBackground}
                onReaderBackgroundChange={handleReaderBackgroundChange}
              />

              <ChapterJumpModal
                isOpen={jumpModalOpen}
                onClose={() => setJumpModalOpen(false)}
                bookId={bookId}
                currentItemId={itemId}
              />

              {isAutoScrolling && (
                <AutoScrollControl
                  isScrolling={isAutoScrolling}
                  onToggleScroll={setIsAutoScrolling}
                  speed={autoScrollSpeed}
                  onSpeedChange={setAutoScrollSpeed}
                />
              )}

              <div
                onClick={() => {
                  if (window.getSelection().toString().length > 0) return;
                  setShowToolbars((prev) => !prev);
                }}
              >
                <Reader
                  chapterData={chapterData}
                  fontSize={fontSize}
                  lineHeight={lineHeight}
                  fontFamily={fontFamily}
                  readerWidth={readerWidth}
                  readerTextColor={readerTextColor}
                  conversionMode={conversionMode}
                />
              </div>

              <ScrollToTop visible={showScrollTop} showBottomBar={showToolbars} onClick={scrollToTop} />

              <BottomBar
                show={showToolbars}
                chapterData={chapterData}
                bookId={bookId}
                onOpenJumpModal={() => setJumpModalOpen(true)}
                onOpenSettings={() => setReaderControlsOpen(true)}
                isAutoScrolling={isAutoScrolling}
                onToggleAutoScroll={() => setIsAutoScrolling((prev) => !prev)}
              />
            </>
          )}
        </>
      )}
    </PageWrapper>
  );
}

export default Chapter;