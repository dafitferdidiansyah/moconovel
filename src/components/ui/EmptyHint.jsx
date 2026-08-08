import styled from 'styled-components';

const EmptyHint = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  color: var(--text-color-secondary);
  opacity: 0.6;
  text-align: center;
  padding: ${(p) => (p.$compact ? '32px' : '40px')} 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: var(--surface-muted);
  backdrop-filter: blur(12px);
`;

export default EmptyHint;
