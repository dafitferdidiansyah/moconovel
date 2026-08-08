import styled from 'styled-components';
import { spin } from '../../utils/styled/animations';

function actionVariantColor(variant) {
  if (variant === 'delete') return '#c15f6a';
  if (variant === 'refresh') return '#6397b9';
  if (variant === 'collection') return '#b18045';
  if (variant === 'download') return '#5f9974';
  if (variant === 'export') return '#8772b2';
  return 'var(--text-color-secondary)';
}

export const CardActionButton = styled.button`
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  border-radius: ${(p) => (p.$compact ? 'var(--border-radius-xs)' : 'var(--border-radius-sm)')};
  border: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition-default);
  background: transparent;
  color: ${(p) => actionVariantColor(p.$variant)};
  box-shadow: none;

  &:hover {
    transform: none;
    background: var(--accent-soft);
    color: ${(p) => actionVariantColor(p.$variant)};
  }

  &:active {
    transform: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: ${(p) => (p.$compact ? 0.6 : 0.7)};
  }

  svg {
    width: ${(p) => (p.$compact ? '16px' : '18px')};
    height: ${(p) => (p.$compact ? '16px' : '18px')};
  }
`;

export const CardSpinningIcon = styled.span`
  display: flex;
  will-change: transform;
  animation: ${spin} ${(p) => p.$duration ?? '0.8s'} linear infinite;
`;

export const CardLoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--background-color) 88%, transparent);
  backdrop-filter: blur(4px);
  border-radius: var(--border-radius-sm);
  z-index: 10;

  svg {
    width: ${(p) => p.$iconSize ?? 40}px;
    height: ${(p) => p.$iconSize ?? 40}px;
    color: var(--accent-color);
    will-change: transform;
    animation: ${spin} 0.8s linear infinite;
  }
`;
