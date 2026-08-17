import { useRef, useState } from 'react';
import PageContent from '../layout/PageContent';
import { GrayButton } from '../ui/GrayButton';
import HostCodeList from '../settings/HostCodeList';
import { useToast } from '../../contexts/ToastContext';
import {
  CANONICAL_HOSTNAME,
  CANONICAL_IMPORT_URL,
  DATA_BACKUP_EXTENSION,
  LEGACY_HOSTNAMES,
} from '../../utils/constants';
import { importUserData, isCanonicalOrigin, hasBackupExtension } from '../../utils/dataMigration';
import { ActionRow, FileInput, FileLabel, Hint, Section, SectionTitle, StepCard } from './styles';

function ImportContent() {
  const { notifyError, notifySuccess, notifyWarning } = useToast();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const onCanonicalSite = isCanonicalOrigin();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!hasBackupExtension(file.name)) {
      notifyWarning(`Please select ${DATA_BACKUP_EXTENSION} ending backup file.`);
      event.target.value = '';
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      notifyWarning('Please select a backup file first.');
      return;
    }
    setImporting(true);
    try {
      const summary = await importUserData(selectedFile);
      notifySuccess(
        `Import Complete:${summary.chapters}  chapters, ${summary.directories}  indexes, ${summary.details}  books.`,
      );
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      notifyError(null, error?.message || 'Import failed, please ensure the file is correct.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <Section>
        <SectionTitle>Data Migration — Import</SectionTitle>

        <StepCard>
          <b>Reminder Before Importing</b>
          <ol>
            <li>
              Please confirm you are on the old site (<HostCodeList hostnames={LEGACY_HOSTNAMES} />) downloaded backup file.
            </li>
            <li>The backup file extension should be <code>{DATA_BACKUP_EXTENSION}</code>。</li>
            <li>
              We suggest you <code>{CANONICAL_HOSTNAME}</code> Proceed with import, data will then be written to new site!
            </li>
          </ol>
          {!onCanonicalSite && (
            <Hint>
              Reminder: You are currently not in {CANONICAL_HOSTNAME}. Importing here will only write data to<strong>Current URL</strong>; if moving to new site, please at{' '}
              {CANONICAL_IMPORT_URL.replace('https://', '')} open this page.
            </Hint>
          )}
        </StepCard>

        <StepCard>
          <b>Upload Backup File</b>
          <p>Select backup file downloaded from old site. After import, matching book data will be overwritten (reading settings will not be changed).</p>
          <ActionRow>
            <GrayButton type="button" onClick={() => fileInputRef.current?.click()}>
              Select File
            </GrayButton>
            <GrayButton type="button" onClick={handleImport} disabled={!selectedFile || importing}>
              {importing ? 'Transferring...' : 'Start Import'}
            </GrayButton>
          </ActionRow>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept={DATA_BACKUP_EXTENSION}
            onChange={handleFileChange}
          />
          {selectedFile && <FileLabel>Selected: {selectedFile.name}</FileLabel>}
        </StepCard>
      </Section>
    </PageContent>
  );
}

export default ImportContent;
