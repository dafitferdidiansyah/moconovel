import { useEffect, useLayoutEffect, useCallback, useState } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import ChapterTopBar from '../components/chapter/ChapterTopBar';
import BottomBar from '../components/chapter/BottomBar';
import Reader from '../components/chapter/Reader';
import ReaderControlsPanel from '../components/chapter/ReaderControlsPanel';
import Error from '../components/ui/Error';
import Loading from '../components/ui/Loading';
import PageWrapper from '../components/layout/PageWrapper';
import ScrollToTop from '../components/ui/ScrollToTop';
import { useConversionMode } from '../hooks/useConversionMode';
import { useFontSize, useLineHeight, useFontFamily, useTextBrightness, useReaderBackground } from '../hooks/useTextSettings';
import { useChapterLoader } from '../hooks/book/useChapterLoader';
import { buildCatalogUrl, ROUTES } from '../utils/navigation';

function Chapter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemId = searchParams.get('itemId');
  const bookId = searchParams.get('bookId');
  
  const { error, chapterData, bookInfo, loading, loadChapter } = useChapterLoader(itemId, bookId);
  const [fontSize, handleFontSizeChange] = useFontSize();
  const [lineHeight, handleLineHeightChange] = useLineHeight();
  const [fontFamily, handleFontFamilyChange] = useFontFamily();
  const {
    readerBackground,
    readerBackgroundColor,
    readerTextColor,
    readerCustomBg,
    readerCustomText,
    handleReaderBackgroundChange,
    handleCustomBgChange,
    handleCustomTextChange,
  } = useReaderBackground();
  const [conversionMode] = useConversionMode();
  const [readerControlsOpen, setReaderControlsOpen] = useState(false);
  const [showToolbars, setShowToolbars] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    setShowToolbars(true);
    setShowScrollTop(false);
  }, [itemId]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we scroll down more than 50px, hide toolbars
      if (currentScrollY > lastScrollY + 50) {
        setShowToolbars(false);
      }
      
      // Show scroll-to-top when scrolled down more than 500px
      if (currentScrollY > 500) {
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
                readerBackground={readerBackground}
                onReaderBackgroundChange={handleReaderBackgroundChange}
                readerCustomBg={readerCustomBg}
                readerCustomText={readerCustomText}
                onCustomBgChange={handleCustomBgChange}
                onCustomTextChange={handleCustomTextChange}
              />
              <div 
                onClick={(e) => {
                  // Only toggle if they aren't selecting text
                  if (window.getSelection().toString().length > 0) return;
                  setShowToolbars((prev) => !prev);
                }}
              >
                <Reader
                  chapterData={chapterData}
                  fontSize={fontSize}
                  lineHeight={lineHeight}
                  fontFamily={fontFamily}
                  readerTextColor={readerTextColor}
                  conversionMode={conversionMode}
                />
              </div>
              <ScrollToTop 
                visible={showScrollTop} 
                showBottomBar={showToolbars} 
                onClick={scrollToTop} 
              />
              <BottomBar show={showToolbars} chapterData={chapterData} bookId={bookId} />
            </>
          )}
        </>
      )}
    </PageWrapper>
  );
}

export default Chapter;
