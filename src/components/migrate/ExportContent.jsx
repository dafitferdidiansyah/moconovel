import { useState } from 'react';
import PageContent from '../layout/PageContent';
import { GrayButton } from '../ui/GrayButton';
import HostCodeList from '../settings/HostCodeList';
import { useToast } from '../../contexts/ToastContext';
import {
  CANONICAL_IMPORT_URL,
  CANONICAL_HOSTNAME,
  CANONICAL_SITE_URL,
  DATA_BACKUP_EXTENSION,
  LEGACY_HOSTNAMES,
} from '../../utils/constants';
import { exportUserData, isLegacyOrigin } from '../../utils/dataMigration';
import { ActionRow, Hint, Section, SectionTitle, StepCard } from './styles';

function ExportContent() {
  const { notifyError, notifyInfo, notifySuccess } = useToast();
  const [exporting, setExporting] = useState(false);
  const onLegacySite = isLegacyOrigin();

  const handleExport = async () => {
    setExporting(true);
    try {
      const summary = await exportUserData();
      if (summary.totalKeys === 0) {
        notifyInfo('Backup downloaded, but no data to migrate.');
      } else {
        notifySuccess(
          `Backup file exported (${summary.chapters}  chapters, ${summary.directories}  indexes, ${summary.details}  books).`,
        );
      }
    } catch (err) {
      notifyError(err, 'Export failed, please try again later.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <Section>
        <SectionTitle>Data Migration — Export</SectionTitle>

        <StepCard>
          <b>Who needs to export?</b>
          <p>
            If you have ever in <HostCodeList hostnames={LEGACY_HOSTNAMES} />{' '}
            If you've read books and want to keep history/downloads, you need to export. If you are already at{' '}
            <code>{CANONICAL_HOSTNAME}</code> started using, no need to export.
          </p>
        </StepCard>

        <StepCard>
          <b>Step 1: Download backup from old site</b>
          <ol>
            <li>
              Please go back to your<strong>Original reading</strong>'s old site (
              <HostCodeList hostnames={LEGACY_HOSTNAMES} />）。
            </li>
            <li>Enter this page (<code>/export</code>) or click "Go to Export Data" from Home.</li>
            <li>Click "Export Data" below, browser will download a <code>{DATA_BACKUP_EXTENSION}</code> backup file.</li>
          </ol>
          {!onLegacySite && (
            <Hint>
              Reminder: You aren't on the old site! Please go back to your original reading URL to export, otherwise you'll only backup current empty data.
            </Hint>
          )}
          <ActionRow>
            <GrayButton type="button" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Packaging...' : 'Export Data'}
            </GrayButton>
          </ActionRow>
        </StepCard>

        <StepCard>
          <b>Step 2: Import to new site</b>
          <ol>
            <li>
              Go to New Site{' '}
              <a href={CANONICAL_SITE_URL} target="_blank" rel="noopener noreferrer">
                {CANONICAL_HOSTNAME}
              </a>
              {' '}import page.
            </li>
            <li>Upload recently downloaded <code>{DATA_BACKUP_EXTENSION}</code> file.</li>
            <li>After successful import, refresh your bookshelf to continue reading!</li>
          </ol>
          <ActionRow>
            <GrayButton
              type="button"
              onClick={() => window.open(CANONICAL_IMPORT_URL, '_blank', 'noopener,noreferrer')}
            >
              Go to {CANONICAL_HOSTNAME} Import
            </GrayButton>
          </ActionRow>
        </StepCard>
      </Section>
    </PageContent>
  );
}

export default ExportContent;
