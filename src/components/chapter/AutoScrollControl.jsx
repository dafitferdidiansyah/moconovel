import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Play, Pause, FastForward } from 'lucide-react';

const FloatWidget = styled.div`
  position: fixed;
  right: 20px;
  bottom: calc(75px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
  z-index: 990;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--card-bg, #1e1e1e);
  color: var(--text-color, #ffffff);
  border: 1px solid var(--border-color, #333);
  padding: 6px 12px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  font-size: 0.82rem;
  backdrop-filter: blur(10px);

  button {
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  .speed-label {
    font-weight: 600;
    min-width: 28px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }
`;

export default function AutoScrollControl({ isScrolling, onToggleScroll, speed, onSpeedChange }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isScrolling) {
      if (scrollRef.current) clearInterval(scrollRef.current);
      return;
    }

    const intervalMs = Math.max(20, Math.floor(60 / speed));

    scrollRef.current = setInterval(() => {
      window.scrollBy({ top: 1, behavior: 'instant' });
      // Stop scrolling if reached bottom
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        onToggleScroll(false);
      }
    }, intervalMs);

    return () => {
      if (scrollRef.current) clearInterval(scrollRef.current);
    };
  }, [isScrolling, speed, onToggleScroll]);

  const cycleSpeed = () => {
    const speeds = [1, 2, 3, 4, 5];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    onSpeedChange(speeds[nextIdx]);
  };

  return (
    <FloatWidget>
      <button onClick={() => onToggleScroll(!isScrolling)} title={isScrolling ? 'Pause Scroll' : 'Start Auto Scroll'}>
        {isScrolling ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <span className="speed-label" onClick={cycleSpeed} title="Klik untuk ganti kecepatan">
        {speed}x
      </span>

      <button onClick={cycleSpeed} title="Ganti Kecepatan">
        <FastForward size={14} />
      </button>
    </FloatWidget>
  );
}