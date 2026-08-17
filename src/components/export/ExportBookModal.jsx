import { useState } from 'react';
import { ArrowDownUp, BookImage, Languages } from 'lucide-react';
import {
  Modal,
  ModalTitleBar,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalText,
} from '../ui/ModalBase';
import { MODAL_SELECT_PROPS, Section, SectionHeader, SelectField } from '../ui/ModalFormSection';
import SelectDropdown from '../ui/SelectDropdown';
import { BOOK_DISPLAY_VARIANT_OPTIONS, EXPORT_CHAPTER_ORDER_OPTIONS, ZH_CONVERSION_OPTIONS } from '../../utils/constants';
import { runBookEpubExport, runBookTxtExport } from '../../utils/export/exportBookActions';

function ExportBookModal({
  bookId,
  bookInfo,
  defaultSortOrder = 'ascending',
  defaultConversionMode = 'tw',
  defaultDisplayVariant = 'new',
  showToast,
  onClose,
}) {
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [conversionMode, setConversionMode] = useState(defaultConversionMode);
  const [displayVariant, setDisplayVariant] = useState(defaultDisplayVariant);
  const [exporting, setExporting] = useState(null);

  const optionSections = [
    {
      icon: BookImage,
      label: 'Title and Cover',
      options: BOOK_DISPLAY_VARIANT_OPTIONS,
      value: displayVariant,
      onChange: setDisplayVariant,
      ariaLabel: 'Select Title & Cover Version',
    },
    {
      icon: ArrowDownUp,
      label: 'Chapter Order',
      options: EXPORT_CHAPTER_ORDER_OPTIONS,
      value: sortOrder,
      onChange: setSortOrder,
      ariaLabel: 'Select Chapter Order',
    },
    {
      icon: Languages,
      label: 'Chinese Conversion',
      options: ZH_CONVERSION_OPTIONS,
      value: conversionMode,
      onChange: setConversionMode,
      ariaLabel: 'Select Conversion',
    },
  ];

  const handleExportTxt = async () => {
    if (!bookId || exporting) return;
    setExporting('txt');
    try {
      await runBookTxtExport({
        bookId,
        bookInfo,
        showToast,
        sortOrder,
        conversionMode,
        displayVariant,
      });
    } finally {
      setExporting(null);
    }
  };

  const handleExportEpub = async () => {
    if (!bookId || exporting) return;
    setExporting('epub');
    try {
      await runBookEpubExport({
        bookId,
        bookInfo,
        showToast,
        sortOrder,
        conversionMode,
        displayVariant,
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <Modal onClose={onClose} maxWidth="420px">
      <ModalTitleBar title="Export Books" onClose={onClose} />
      <ModalBody>
        <ModalText>Export downloaded chapters only. Please select chapter order, title/cover version, and conversion before exporting.</ModalText>

        {optionSections.map(({ icon: Icon, label, options, value, onChange, ariaLabel }) => (
          <Section key={label}>
            <SectionHeader>
              <Icon size={16} strokeWidth={2.5} aria-hidden />
              <span>{label}</span>
            </SectionHeader>
            <SelectField>
              <SelectDropdown
                options={options}
                value={value}
                onChange={onChange}
                ariaLabel={ariaLabel}
                {...MODAL_SELECT_PROPS}
              />
            </SelectField>
          </Section>
        ))}
      </ModalBody>
      <ModalFooter $stretch>
        <ModalSecondaryButton
          type="button"
          onClick={handleExportTxt}
          disabled={Boolean(exporting)}
        >
          {exporting === 'txt' ? 'Exporting...' : 'Export TXT'}
        </ModalSecondaryButton>
        <ModalPrimaryButton
          type="button"
          onClick={handleExportEpub}
          disabled={Boolean(exporting)}
        >
          {exporting === 'epub' ? 'Exporting...' : 'Export EPUB'}
        </ModalPrimaryButton>
      </ModalFooter>
    </Modal>
  );
}

export default ExportBookModal;
