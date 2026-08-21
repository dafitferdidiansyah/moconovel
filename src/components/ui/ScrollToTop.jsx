import React from 'react';
import styled from 'styled-components';
import { ArrowUp } from 'lucide-react';

const ScrollToTopBtn = styled.button`
  position: fixed;
  bottom: ${(p) => (p.$showBottomBar ? '80px' : '24px')};
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--accent-color);
  color: var(--text-on-accent, #fff);
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transform: translateY(${(p) => (p.$visible ? '0' : '20px')});
  transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease, bottom 0.3s ease;

  &:hover {
    background-color: var(--accent-hover, var(--accent-color));
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 480px) {
    right: 16px;
    bottom: ${(p) => (p.$showBottomBar ? '70px' : '16px')};
  }
`;

export default function ScrollToTop({ visible, showBottomBar, onClick }) {
  return (
    <ScrollToTopBtn
      type="button"
      $visible={visible}
      $showBottomBar={showBottomBar}
      onClick={onClick}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUp />
    </ScrollToTopBtn>
  );
}
