import React from 'react';
import styled from 'styled-components';
import { maybeConvert } from '../../utils/text/zh-convert';
import { FONT_SIZE_DEFAULT, TEXT_BRIGHTNESS_DEFAULT, LINE_HEIGHT_DEFAULT } from '../../utils/constants';
import { minViewportHeight } from '../../utils/styled/viewport';

const ReaderWrapper = styled.div`
  margin: 0 auto;
  padding: 40px 24px 100px;
  padding-top: calc(100px + env(safe-area-inset-top));
  padding-bottom: calc(120px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
  max-width: ${(p) => p.$readerWidth || '800px'};
  width: 100%;
  background: transparent;
  transition: max-width 0.2s ease;
  ${minViewportHeight}

  @media (max-width: 480px) {
    padding: 20px 14px 100px;
    padding-top: calc(85px + env(safe-area-inset-top));
    padding-bottom: calc(110px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
  }

  p {
    line-height: ${(p) => p.$lineHeight ?? LINE_HEIGHT_DEFAULT};
    font-size: ${(p) => p.$fontSize ?? FONT_SIZE_DEFAULT}px;
    color: ${(p) => p.$textColor ?? 'var(--text-color)'};
    margin-bottom: 1.6em;
    text-align: justify;
    letter-spacing: 0.03em;
    font-family: ${(p) => p.$fontFamily ?? "'Noto Serif TC', 'Noto Serif SC', sans-serif"};
  }

  br {
    display: none;
  }
`;

function Reader({
  chapterData,
  fontSize = FONT_SIZE_DEFAULT,
  lineHeight = LINE_HEIGHT_DEFAULT,
  fontFamily = "'Noto Serif TC', 'Noto Serif SC', sans-serif",
  readerWidth = '800px',
  readerTextColor,
  conversionMode = 'tw',
}) {
  if (!chapterData || !chapterData.content) return null;

  const convertedContent = maybeConvert(chapterData.content, conversionMode);

  const paragraphs = convertedContent
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <ReaderWrapper
      $fontSize={fontSize}
      $lineHeight={lineHeight}
      $fontFamily={fontFamily}
      $readerWidth={readerWidth}
      $textColor={readerTextColor}
    >
      {paragraphs.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </ReaderWrapper>
  );
}

export default Reader;
