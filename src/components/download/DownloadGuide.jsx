import styled from 'styled-components';
import {
  MAX_CONCURRENT_DOWNLOADS,
  BATCH_COOLDOWN_MS,
  RATE_LIMIT_RPM,
} from '../../utils/constants';
import { retroTagCardStyles } from '../../utils/styled/retro';
import { Section, SectionTitle } from '../../utils/styled/sections';

const InfoCard = styled.div`
  ${retroTagCardStyles}

  ul {
    margin: 8px 0 0;
    padding-left: 1.2em;
  }

  li + li {
    margin-top: 6px;
  }
`;

const batchCooldownSec = BATCH_COOLDOWN_MS / 1000;

const GUIDE_ITEMS = [
  {
    tag: 'Download All',
    body: 'Only one book can be scheduled at a time! If you click "Download All" on another book, it will replace the current schedule.',
  },
  {
    tag: 'Single Chapter Download',
    body: `For manual single chapter downloads, maximum concurrent is ${MAX_CONCURRENT_DOWNLOADS}  chapters, can be downloaded across different books.`,
  },
  {
    tag: 'Rate Limit',
    body: `To ensure smooth use for everyone, maximum requests per minute is ${RATE_LIMIT_RPM}  times. When using "Download All", each batch will rest briefly ${batchCooldownSec}  seconds.`,
  },
  {
    tag: 'Offline Reading',
    body: 'Downloaded chapters are safely stored on your device, no need to worry about browser storage!',
  },
  {
    tag: 'Export Books',
    body: 'You can export downloaded chapters as .txt Or .epub file. Before exporting, select chapter order, title/cover version, and conversion.',
  },
  {
    tag: 'Use Gently',
    body: 'Downloads go through a shared server. Please download reasonably and save bandwidth for others!',
  },
];

function DownloadGuide() {
  return (
    <Section>
      <SectionTitle>Instructions</SectionTitle>
      {GUIDE_ITEMS.map((item) => (
        <InfoCard key={item.tag}>
          <b>{item.tag}</b> {item.body}
        </InfoCard>
      ))}
    </Section>
  );
}

export default DownloadGuide;
