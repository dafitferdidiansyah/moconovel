import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Archive, BookOpen, Compass, Download, FileText, Github, Megaphone, MessageCircleWarning, Activity } from 'lucide-react';
import { GITHUB_ISSUES_URL, GITHUB_REPO_URL } from '../../utils/constants';
import { ROUTES, buildDefaultDiscoverUrl } from '../../utils/navigation';

const Section = styled.section`
  width: 100%;
  margin-top: 24px;
`;

const SectionLabel = styled.h2`
  margin: 0 0 10px;
  font-family: var(--display-font-family);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  > *:nth-child(1) { animation-delay: 0.14s; }
  > *:nth-child(2) { animation-delay: 0.2s; }
  > *:nth-child(3) { animation-delay: 0.26s; }

  @media (max-width: 480px) { gap: 8px; }
`;

const UtilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  > *:nth-child(1) { animation-delay: 0.34s; }
  > *:nth-child(2) { animation-delay: 0.39s; }
  > *:nth-child(3) { animation-delay: 0.44s; }
  > *:nth-child(4) { animation-delay: 0.49s; }
  > *:nth-child(5) { animation-delay: 0.54s; }
  > *:nth-child(6) { animation-delay: 0.59s; }

  @media (max-width: 480px) { grid-template-columns: repeat(2, 1fr); }
`;

const sharedCard = `
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  color: var(--text-color);
  text-decoration: none;
  cursor: pointer;
  font-family: var(--ui-font-family);
  transition: var(--transition-default);
  background: var(--surface-muted);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  animation: homeCardEntrance 0.46s cubic-bezier(0.22, 1, 0.36, 1) both;
  &:hover { border-color: color-mix(in srgb, var(--accent-color) 58%, var(--border-color)); background: var(--surface-raised); transform: translateY(-2px); box-shadow: var(--retro-shadow); }
  svg { flex-shrink: 0; color: var(--accent-color); }
`;

const QuickButton = styled.button`
  ${sharedCard}
  min-height: 86px;
  padding: 16px;
  text-align: left;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  svg { width: 22px; height: 22px; }
  strong { font-family: var(--display-font-family); font-size: 17px; font-weight: 600; }
  span { color: var(--text-color-secondary); font-size: 12px; line-height: 1.35; }
  @media (max-width: 480px) { min-height: 76px; padding: 12px; strong { font-size: 15px; } span { display: none; } }
`;

const UtilityButton = styled.button`${sharedCard} padding: 11px 12px; font-size: 13px; background: var(--surface-muted);`;
const UtilityLink = styled.a`${sharedCard} padding: 11px 12px; font-size: 13px; background: var(--surface-muted);`;

function NavGrid() {
  const navigate = useNavigate();
  return (
    <>
      <Section>
        <SectionLabel>Common Features</SectionLabel>
        <QuickGrid>
          <QuickButton type="button" onClick={() => navigate(ROUTES.bookshelf)}><BookOpen aria-hidden /><strong>Bookshelf</strong><span>Reading History & Collections</span></QuickButton>
          <QuickButton type="button" onClick={() => navigate(buildDefaultDiscoverUrl())}><Compass aria-hidden /><strong>Find Book</strong><span>Start a new reading</span></QuickButton>
          <QuickButton type="button" onClick={() => navigate(ROUTES.download)}><Download aria-hidden /><strong>Download</strong><span>Offline Reading & Management</span></QuickButton>
        </QuickGrid>
      </Section>
      <Section>
        <SectionLabel>Tools & Info</SectionLabel>
        <UtilityGrid>
          <UtilityButton type="button" onClick={() => navigate(ROUTES.announcements)}><Megaphone aria-hidden />Announcement</UtilityButton>
          <UtilityButton type="button" onClick={() => navigate(ROUTES.status)}><Activity aria-hidden />API Status</UtilityButton>
          <UtilityButton type="button" onClick={() => navigate(ROUTES.export)}><Archive aria-hidden />Backup</UtilityButton>
          <UtilityButton type="button" onClick={() => navigate(ROUTES.terms)}><FileText aria-hidden />Terms of Use</UtilityButton>
          <UtilityLink href={GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer"><MessageCircleWarning aria-hidden />Report Issue</UtilityLink>
          <UtilityLink href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer"><Github aria-hidden />Source Code</UtilityLink>
        </UtilityGrid>
      </Section>
    </>
  );
}

export default NavGrid;
