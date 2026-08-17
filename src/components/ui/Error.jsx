import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { GrayButton } from './GrayButton';
import { viewportHeight } from '../../utils/styled/viewport';

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${viewportHeight}
  gap: 16px;
  background-color: var(--background-color);
  padding: 16px;
`;

const ErrorText = styled.p`
  font-size: 1rem;
  color: var(--text-color);
  text-align: center;
  word-break: break-word;
`;

const StyledHomeButton = styled(GrayButton)`
  margin-top: 8px;
`;

function getBackLabel(href) {
  if (href === '/') return 'Back to Home';
  if (/^\/catalog\/.+/.test(href)) return 'Back to Index';
  return 'Back';
}

function Error({ message, href = '/' }) {
  const navigate = useNavigate();
  return (
    <ErrorWrapper role="alert">
      <ErrorText>{message}</ErrorText>
      <StyledHomeButton type="button" onClick={() => navigate(href)}>
        {getBackLabel(href)}
      </StyledHomeButton>
    </ErrorWrapper>
  );
}

export default Error;
