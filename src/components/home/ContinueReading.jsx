import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRight, Compass } from 'lucide-react';
import { getReadingHistory } from '../../utils/storage';
import { useBookLoader } from '../../hooks/book/useBookLoader';
import { resolveBookDisplay } from '../../utils/book/bookInfo';
import { buildCatalogUrl, buildChapterUrl, buildDefaultDiscoverUrl } from '../../utils/navigation';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';
import { useConversionMode } from '../../hooks/useConversionMode';
import { useConvertedText } from '../../hooks/useConvertedText';
import BookCoverImg from '../book/BookCoverImg';

const Hero = styled.section`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 148px;
  gap: 24px;
  min-height: 218px;
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--surface-raised);
  box-shadow: var(--panel-shadow);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  overflow: hidden;
  animation: homeCardEntrance 0.52s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both;
  @media (max-width: 480px) { grid-template-columns: minmax(0, 1fr) 100px; gap: 16px; min-height: 194px; padding: 18px; }
`;
const HeroContent = styled.div`display: flex; flex-direction: column; align-items: flex-start; justify-content: center; min-width: 0;`;
const Eyebrow = styled.p`margin: 0 0 8px; color: var(--accent-color); font-size: 12px; font-weight: 700; letter-spacing: 0.08em;`;
const Heading = styled.h2`
  margin: 0;
  font-family: var(--display-font-family);
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 600;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Meta = styled.p`margin: 10px 0 20px; color: var(--text-color-secondary); font-size: 14px;`;
const ContinueButton = styled.button`
  display: inline-flex; align-items: center; gap: 8px; border: 0; border-radius: 999px; padding: 10px 16px;
  color: var(--text-on-accent); background: var(--accent-color); font: inherit; font-weight: 700; cursor: pointer; transition: var(--transition-default);
  &:hover { background: var(--accent-hover); transform: translateY(-1px); }
  svg { width: 17px; height: 17px; }
`;
const Cover = styled.img`width: 148px; height: 100%; max-height: 220px; object-fit: cover; align-self: center; border-radius: var(--border-radius-xs); box-shadow: var(--retro-shadow); background: var(--cover-bg); @media (max-width: 480px) { width: 100px; max-height: 160px; }`;

function formatLastRead(timestamp) {
  if (!timestamp) return 'Added to Bookshelf';
  const days = Math.floor((Date.now() - timestamp) / 86400000);
  if (days <= 0) return 'Read Today';
  if (days === 1) return 'Read Yesterday';
  return `${days}  days ago`;
}

function pickMostRecentEntry(history) {
  if (!Array.isArray(history) || history.length === 0) return null;
  return history.reduce((latest, entry) => {
    if (!latest) return entry;
    return (entry.lastReadAt || 0) > (latest.lastReadAt || 0) ? entry : latest;
  }, null);
}

function ContinueReading() {
  const navigate = useNavigate();
  const { variant } = useBookDisplayVariant();
  const [conversionMode] = useConversionMode();
  const [entry, setEntry] = useState(null);
  useEffect(() => {
    getReadingHistory().then((history) => setEntry(pickMostRecentEntry(history)));
  }, []);
  const { bookInfo } = useBookLoader(entry?.bookId, { detailOnly: true });
  const info = bookInfo?.book_info || bookInfo || {};
  const { book_name: bookName, thumb_url: thumbUrl, fallback_thumb_url: fallbackThumbUrl } = resolveBookDisplay(info, variant, entry?.bookId);
  const convertedBookName = useConvertedText(bookName, conversionMode);
  const hasHistory = Boolean(entry);
  const handleContinue = () => {
    if (!entry) return navigate(buildDefaultDiscoverUrl());
    return navigate(entry.itemId ? buildChapterUrl(entry.itemId, entry.bookId) : buildCatalogUrl(entry.bookId));
  };
  return (
    <Hero>
      <HeroContent>
        <Eyebrow>{hasHistory ? 'Continue Reading' : 'Private Bookshelf'}</Eyebrow>
        <Heading>{hasHistory ? (convertedBookName || 'Recently Read') : 'Start with a story'}</Heading>
        <Meta>{hasHistory ? formatLastRead(entry.lastReadAt) : 'Search title or enter book ID, create your private bookshelf.'}</Meta>
        <ContinueButton type="button" onClick={handleContinue}>{hasHistory ? 'Continue Reading' : 'Start Finding Books'}{hasHistory ? <ArrowRight aria-hidden /> : <Compass aria-hidden />}</ContinueButton>
      </HeroContent>
      {hasHistory && thumbUrl && <BookCoverImg url={thumbUrl} fallbackUrl={fallbackThumbUrl} ImgComponent={Cover} alt="" />}
    </Hero>
  );
}

export default ContinueReading;
