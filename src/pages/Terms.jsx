import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
import PageContent from '../components/layout/PageContent';
import styled from 'styled-components';
import { retroTagCardStyles } from '../utils/styled/retro';

const Section = styled.section`
  ${retroTagCardStyles}
  margin-bottom: 28px;
  &:last-child { margin-bottom: 0; }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  color: var(--text-color);
  margin: 0 0 10px;
`;

const Paragraph = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-color-secondary);
  margin: 0 0 8px;
`;

const ExternalLink = styled.a`
  color: var(--accent-color);
`;

function Terms() {
  return (
    <NavPageLayout>
      <NavTopBar pageTitle="Terms of Use" />
      <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
        <Section>
          <SectionTitle>Project Nature</SectionTitle>
          <Paragraph>This is a non-commercial project for personal learning and technical exchange. No ads, profit, or subscriptions.</Paragraph>
        </Section>
        <Section>
          <SectionTitle>Content Source & Copyright</SectionTitle>
          <Paragraph>Content sourced from third-party public  API, for personal display and conversion only. Chapters can be cached locally for offline reading or backups. This project does not host originals or redistribute commercially. Copyright belongs to original author and Tomato Novel, please support original.</Paragraph>
        </Section>
        <Section>
          <SectionTitle>Privacy & Data Storage</SectionTitle>
          <Paragraph>Reading history, bookshelf, and downloaded chapters are only stored in local browser, not uploaded to servers.</Paragraph>
        </Section>
        <Section>
          <SectionTitle>User Responsibility</SectionTitle>
          <Paragraph>Users must comply with local laws and Tomato Novel's terms of service; legal responsibilities arising from use of this site are borne by the user.</Paragraph>
        </Section>
        <Section>
          <SectionTitle>Copyright Infringement Notice</SectionTitle>
          <Paragraph>
            If you are a copyright owner and believe content infringes your rights, please use{' '}
            <ExternalLink href="https://github.com/dafitferdidiansyah/moconovel/issues" target="_blank" rel="noreferrer">GitHub Issues</ExternalLink>{' '}
            Contact us, we will process relevant content or features ASAP.
          </Paragraph>
        </Section>
      </PageContent>
    </NavPageLayout>
  );
}

export default Terms;
