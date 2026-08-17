import styled from 'styled-components';
import SettingsButton from '../settings/SettingsButton';

const Header = styled.header`
  width: min(100%, 800px);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: calc(76px + env(safe-area-inset-top));
  margin-bottom: 24px;
  animation: fadeInUp 0.5s ease backwards;

  @media (max-width: 480px) {
    padding: calc(44px + env(safe-area-inset-top)) 16px 0;
    margin-bottom: 18px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--display-font-family);
  font-size: clamp(32px, 6vw, 52px);
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1.15;
`;

const Subtitle = styled.p`
  margin: 12px 0 0;
  color: var(--text-color-secondary);
  font-size: 15px;
  letter-spacing: 0.04em;
`;

const SettingsButtonSlot = styled.div`
  position: fixed;
  top: calc(12px + env(safe-area-inset-top));
  right: calc(24px + env(safe-area-inset-right));
  z-index: 99;

  @media (max-width: 480px) {
    top: calc(10px + env(safe-area-inset-top));
    right: calc(16px + env(safe-area-inset-right));
  }
`;

function HomeHeader() {
  return (
    <>
      <SettingsButtonSlot>
        <SettingsButton />
      </SettingsButtonSlot>
      <Header>
        <Title>Reader</Title>
        <Subtitle>Leave some quiet time, read the story you want.</Subtitle>
      </Header>
    </>
  );
}

export default HomeHeader;
