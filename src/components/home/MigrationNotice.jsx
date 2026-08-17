import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CANONICAL_HOSTNAME, CANONICAL_SITE_URL } from '../../utils/constants';
import { isLegacyOrigin } from '../../utils/dataMigration';
import { ROUTES } from '../../utils/navigation';
import { GrayButton } from '../ui/GrayButton';
import { HomeNotice, HomeNoticeLabel } from './HomeNotice';

const Notice = styled(HomeNotice)`
  margin-top: 12px;
`;

const Message = styled.p`
  margin: 0 0 12px;
`;

const SiteLink = styled.a`
  color: var(--accent-color);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--accent-color) 40%, transparent);

  &:hover {
    border-bottom-color: var(--accent-color);
  }
`;

function MigrationNotice() {
  const navigate = useNavigate();

  if (!isLegacyOrigin()) return null;

  return (
    <Notice role="status">
      <HomeNoticeLabel>Site has moved!</HomeNoticeLabel>
      <Message>
        We have moved to{' '}
        <SiteLink href={CANONICAL_SITE_URL} target="_blank" rel="noopener noreferrer">
          {CANONICAL_HOSTNAME}
        </SiteLink>
        . Remember to export data first, then import it to the new site so your bookshelf and reading history move with you!
      </Message>
      <GrayButton type="button" onClick={() => navigate(ROUTES.export)}>
        Go to Export Data
      </GrayButton>
    </Notice>
  );
}

export default MigrationNotice;
