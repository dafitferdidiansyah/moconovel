import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
import PageContent from '../components/layout/PageContent';
import styled from 'styled-components';

const Section = styled.section`
  margin-bottom: 28px;
  &:last-child { margin-bottom: 0; }
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
      <NavTopBar pageTitle="使用條款" />
      <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
        <Section>
          <SectionTitle>專案性質</SectionTitle>
          <Paragraph>本專案為非商業性質之個人學習與技術交流專案，不含廣告，亦不進行任何形式的營利或訂閱收費。</Paragraph>
        </Section>
        <Section>
          <SectionTitle>內容來源與著作權</SectionTitle>
          <Paragraph>本站內容取自第三方公開 API，僅供個人閱讀時顯示與繁簡轉換。章節可按需要暫存於本機，以便離線閱讀或匯出個人備份。本專案不會在伺服器託管小說原文，亦不作任何商業再散佈。所有小說內容之著作權均歸原作者及番茄小說所有，請支持正版閱讀。</Paragraph>
        </Section>
        <Section>
          <SectionTitle>隱私與資料儲存</SectionTitle>
          <Paragraph>閱讀紀錄、書架及已下載章節等資料僅儲存於使用者本機瀏覽器，不會上傳至本專案伺服器。</Paragraph>
        </Section>
        <Section>
          <SectionTitle>使用者責任</SectionTitle>
          <Paragraph>使用者應自行遵守當地法律法規及番茄小說服務條款，因使用本站所生之法律責任由使用者自行承擔。</Paragraph>
        </Section>
        <Section>
          <SectionTitle>著作權侵權通知</SectionTitle>
          <Paragraph>
            若您是著作權人並認為本站內容侵害您的權益，請透過{' '}
            <ExternalLink href="https://github.com/denniemok/fanqie-novel-reader/issues" target="_blank" rel="noreferrer">GitHub Issues</ExternalLink>{' '}
            與我們聯繫，我們將儘速處理相關內容或功能。
          </Paragraph>
        </Section>
      </PageContent>
    </NavPageLayout>
  );
}

export default Terms;
