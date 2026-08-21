import React from 'react';
import styled from 'styled-components';
import { maybeConvert } from '../../utils/text/zh-convert';
import { FONT_SIZE_DEFAULT, TEXT_BRIGHTNESS_DEFAULT, LINE_HEIGHT_DEFAULT } from '../../utils/constants';
import { minViewportHeight } from '../../utils/styled/viewport';

const ReaderWrapper = styled.div`
  margin: 0 auto;
  padding: 40px 24px 100px;
  padding-top: calc(140px + env(safe-area-inset-top));
  padding-bottom: calc(100px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
  max-width: 800px;
  background: transparent;
  ${minViewportHeight}

  @media (max-width: 480px) {
    padding: 24px 16px 100px;
    padding-top: calc(130px + env(safe-area-inset-top));
    padding-bottom: calc(100px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
  }

  p {
    line-height: ${(p) => p.$lineHeight ?? LINE_HEIGHT_DEFAULT};
    font-size: ${(p) => p.$fontSize ?? FONT_SIZE_DEFAULT}px;
    color: ${(p) => p.$textColor ?? 'var(--text-color)'};
    margin-bottom: 1.8em;
    text-align: justify;
    letter-spacing: 0.05em;
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
      $textColor={readerTextColor}
    >
      {paragraphs.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </ReaderWrapper>
  );
}

export default Reader;
