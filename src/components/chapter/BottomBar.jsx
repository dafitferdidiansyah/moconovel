import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, List, Settings, Play, Pause } from 'lucide-react';
import styled from 'styled-components';
import { buildChapterUrl } from '../../utils/navigation';

const FloatingBar = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%) translateY(${(p) => (p.$show ? '0' : '150%')});
  bottom: calc(16px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
  height: 52px;
  background: var(--card-bg, #1e1e1e);
  color: var(--text-color, #ffffff);
  border: 1px solid var(--border-color, #333);
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  gap: 8px;
  z-index: 1000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 92%;
  width: 440px;
`;

const NavButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--text-color, #fff);
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: var(--accent-color, #e06c75);
  }

  &.disabled {
    opacity: 0.3;
    pointer-events: none;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-color, #333);
  color: var(--text-color, #fff);
  height: 38px;
  padding: 0 14px;
  border-radius: 19px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: var(--accent-color, #e06c75);
  }

  &.icon-only {
    padding: 0;
    width: 38px;
    border-radius: 50%;
  }

  &.active {
    background: var(--accent-color, #e06c75);
    border-color: var(--accent-color, #e06c75);
    color: #fff;
  }
`;

function BottomBar({
  chapterData,
  bookId,
  show = true,
  onOpenJumpModal,
  onOpenSettings,
  isAutoScrolling,
  onToggleAutoScroll,
}) {
  if (!chapterData) return null;

  const { pre_item_id, next_item_id, title } = chapterData.novel_data ?? {};

  return (
    <FloatingBar $show={show}>
      {/* Prev Chapter */}
      {pre_item_id ? (
        <NavButton to={buildChapterUrl(pre_item_id, bookId)} title="Bab Sebelumnya">
          <ChevronLeft size={22} />
        </NavButton>
      ) : (
        <NavButton to="#" className="disabled" title="Bab Pertama">
          <ChevronLeft size={22} />
        </NavButton>
      )}

      {/* Chapter Jump Dropdown */}
      <ActionButton onClick={onOpenJumpModal} title="Buka Daftar Bab">
        <List size={16} />
        <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title ? title : 'Daftar Bab'}
        </span>
      </ActionButton>

      {/* Auto Scroll Toggle */}
      {onToggleAutoScroll && (
        <ActionButton
          className={`icon-only ${isAutoScrolling ? 'active' : ''}`}
          onClick={onToggleAutoScroll}
          title={isAutoScrolling ? 'Hentikan Auto-Scroll' : 'Mulai Auto-Scroll'}
        >
          {isAutoScrolling ? <Pause size={16} /> : <Play size={16} />}
        </ActionButton>
      )}

      {/* Settings Panel */}
      {onOpenSettings && (
        <ActionButton className="icon-only" onClick={onOpenSettings} title="Pengaturan Tampilan Reader">
          <Settings size={18} />
        </ActionButton>
      )}

      {/* Next Chapter */}
      {next_item_id ? (
        <NavButton to={buildChapterUrl(next_item_id, bookId)} title="Bab Selanjutnya">
          <ChevronRight size={22} />
        </NavButton>
      ) : (
        <NavButton to="#" className="disabled" title="Bab Terakhir">
          <ChevronRight size={22} />
        </NavButton>
      )}
    </FloatingBar>
  );
}

export default BottomBar;