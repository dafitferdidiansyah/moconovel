import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, X, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildChapterUrl } from '../../utils/navigation';
import { directoryCache } from '../../utils/cache';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  z-index: 1100;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: max(60px, env(safe-area-inset-top));
  padding-bottom: 20px;
`;

const Container = styled.div`
  background: var(--card-bg, #1a1a1a);
  color: var(--text-color, #ffffff);
  border: 1px solid var(--border-color, #333);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-color, #333);

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  button {
    background: transparent;
    border: none;
    color: var(--text-color-secondary, #888);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    border-radius: 4px;

    &:hover {
      color: var(--text-color, #fff);
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const SearchBox = styled.div`
  padding: 12px 18px;
  border-bottom: 1px solid var(--border-color, #333);
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2);

  input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-color, #fff);
    font-size: 0.95rem;

    &::placeholder {
      color: var(--text-color-secondary, #777);
    }
  }
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-color, #444);
    border-radius: 3px;
  }
`;

const Item = styled.div`
  padding: 12px 18px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(p) => (p.$active ? 'var(--accent-color, #e06c75)' : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : 'var(--text-color, #ccc)')};
  transition: background 0.15s ease;

  &:hover {
    background: ${(p) => (p.$active ? 'var(--accent-color, #e06c75)' : 'rgba(255, 255, 255, 0.08)')};
  }

  .title {
    font-size: 0.92rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80%;
  }

  .index {
    font-size: 0.8rem;
    opacity: 0.7;
  }
`;

export default function ChapterJumpModal({ isOpen, onClose, bookId, currentItemId }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen || !bookId) return;

    directoryCache.get(bookId).then((dir) => {
      if (dir && dir.item_data_list) {
        setItems(dir.item_data_list);
      }
    });
  }, [isOpen, bookId]);

  if (!isOpen) return null;

  const filteredItems = items.filter((item, index) => {
    if (!filter) return true;
    const query = filter.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(query);
    const indexMatch = String(index + 1).includes(query);
    return titleMatch || indexMatch;
  });

  const handleSelect = (itemId) => {
    onClose();
    navigate(buildChapterUrl(itemId, bookId));
  };

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <h3>
            <BookOpen size={18} /> Daftar Bab ({items.length})
          </h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </Header>

        <SearchBox>
          <Search size={18} color="var(--text-color-secondary, #888)" />
          <input
            type="text"
            placeholder="Cari nomor atau judul bab..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />
        </SearchBox>

        <List>
          {filteredItems.length === 0 ? (
            <Item style={{ textAlign: 'center', opacity: 0.6 }}>Bab tidak ditemukan</Item>
          ) : (
            filteredItems.map((item, idx) => (
              <Item
                key={item.item_id || idx}
                $active={String(item.item_id) === String(currentItemId)}
                onClick={() => handleSelect(item.item_id)}
              >
                <span className="title">{item.title || `Bab ${idx + 1}`}</span>
                <span className="index">#{idx + 1}</span>
              </Item>
            ))
          )}
        </List>
      </Container>
    </Overlay>
  );
}