import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Minus, Plus, Type, Palette, RefreshCw, X, Maximize2, Monitor } from 'lucide-react';
import {
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  LINE_HEIGHT_MIN,
  LINE_HEIGHT_MAX,
  CHINESE_FONTS,
  READER_BACKGROUND_OPTIONS,
  READER_WIDTH_OPTIONS,
} from '../../utils/constants';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1050;
`;

const Modal = styled.div`
  position: fixed;
  left: 50%;
  bottom: calc(75px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
  transform: translateX(-50%);
  width: 92%;
  max-width: 520px;
  background: var(--card-bg, #1a1a1a);
  color: var(--text-color, #ffffff);
  border: 1px solid var(--border-color, #333);
  border-radius: 16px;
  padding: 18px 20px;
  z-index: 1060;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
  }

  button {
    background: transparent;
    border: none;
    color: var(--text-color-secondary, #888);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  .label {
    font-size: 0.88rem;
    color: var(--text-color-secondary, #aaa);
    min-width: 100px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;

  button {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid var(--border-color, #333);
    color: var(--text-color, #fff);
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.82rem;
    transition: all 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.16);
    }

    &.active {
      background: var(--accent-color, #e06c75);
      border-color: var(--accent-color, #e06c75);
      color: #fff;
      font-weight: 600;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
`;

const ThemeSwatches = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  .swatch {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: transform 0.15s ease, border-color 0.15s ease;

    &:hover {
      transform: scale(1.1);
    }

    &.active {
      border-color: var(--accent-color, #e06c75);
      transform: scale(1.15);
      box-shadow: 0 0 8px rgba(224, 108, 117, 0.5);
    }
  }
`;

const Select = styled.select`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-color, #333);
  color: var(--text-color, #fff);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  outline: none;
`;

export default function ReaderControlsPanel({
  open,
  onClose,
  onRefresh,
  fontSize,
  onFontSizeChange,
  lineHeight,
  onLineHeightChange,
  fontFamily,
  onFontFamilyChange,
  readerWidth = '800px',
  onReaderWidthChange,
  readerBackground,
  onReaderBackgroundChange,
}) {
  if (!open) return null;

  return createPortal(
    <>
      <Overlay onClick={onClose} />
      <Modal>
        <Header>
          <h4>Pengaturan Pembaca (WTR-Lab Tools)</h4>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </Header>

        {/* Font Size */}
        <Row>
          <span className="label">
            <Type size={16} /> Ukuran Font
          </span>
          <ButtonGroup>
            <button disabled={fontSize <= FONT_SIZE_MIN} onClick={() => onFontSizeChange(-1)}>
              <Minus size={14} />
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: 32, textAlign: 'center' }}>
              {fontSize}px
            </span>
            <button disabled={fontSize >= FONT_SIZE_MAX} onClick={() => onFontSizeChange(1)}>
              <Plus size={14} />
            </button>
          </ButtonGroup>
        </Row>

        {/* Reading Width */}
        {onReaderWidthChange && (
          <Row>
            <span className="label">
              <Maximize2 size={16} /> Lebar Teks
            </span>
            <ButtonGroup>
              {READER_WIDTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={readerWidth === opt.value ? 'active' : ''}
                  onClick={() => onReaderWidthChange(opt.value)}
                >
                  {opt.label.split(' ')[0]}
                </button>
              ))}
            </ButtonGroup>
          </Row>
        )}

        {/* Font Family */}
        {onFontFamilyChange && (
          <Row>
            <span className="label">
              <Monitor size={16} /> Jenis Font
            </span>
            <Select value={fontFamily} onChange={(e) => onFontFamilyChange(e.target.value)}>
              {CHINESE_FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </Select>
          </Row>
        )}

        {/* Reading Themes */}
        {onReaderBackgroundChange && (
          <Row>
            <span className="label">
              <Palette size={16} /> Tema Warna
            </span>
            <ThemeSwatches>
              {READER_BACKGROUND_OPTIONS.filter((opt) => opt.value !== 'custom').map((opt) => (
                <div
                  key={opt.value}
                  className={`swatch ${readerBackground === opt.value ? 'active' : ''}`}
                  style={{ background: opt.value }}
                  title={opt.label}
                  onClick={() => onReaderBackgroundChange(opt.value)}
                />
              ))}
            </ThemeSwatches>
          </Row>
        )}

        {/* Refresh Chapter */}
        {onRefresh && (
          <Row style={{ paddingTop: 8, borderTop: '1px solid var(--border-color, #333)' }}>
            <span className="label">Ulangi Muat Bab</span>
            <button
              onClick={onRefresh}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.85rem',
              }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </Row>
        )}
      </Modal>
    </>,
    document.body,
  );
}