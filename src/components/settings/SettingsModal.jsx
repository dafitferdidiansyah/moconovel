import React from 'react';
import styled from 'styled-components';
import { Activity, BookImage, Globe, Languages, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalTitleBar, ModalBody, ModalText } from '../ui/ModalBase';
import { MODAL_SELECT_PROPS, Section, SectionHeader, SelectField } from '../ui/ModalFormSection';
import SelectDropdown from '../ui/SelectDropdown';
import ApiOverallBadge from './ApiOverallBadge';
import { useApiBase } from '../../hooks/api/useApiBase';
import { useApiStatus } from '../../hooks/api/useApiStatus';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';
import { useBookshelfQuickAction } from '../../contexts/BookshelfQuickActionContext';
import { useConversionMode } from '../../hooks/useConversionMode';
import { useTheme } from '../../contexts/ThemeContext';
import {
  API_OPTIONS,
  BOOK_DISPLAY_VARIANT_OPTIONS,
  BOOKSHELF_QUICK_ACTION_OPTIONS,
  ZH_CONVERSION_OPTIONS,
} from '../../utils/constants';
import { ROUTES } from '../../utils/navigation';

const ApiOptionRow = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-width: 0;
`;

const ThemeOptionRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const StatusLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
  padding: 10px 12px;
  text-align: left;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-color-secondary);
  background: var(--background-color);
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius-xs);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  svg {
    flex-shrink: 0;
    color: var(--accent-color);
  }

  @media (hover: hover) {
    &:hover {
      background: var(--hover-background-color);
      color: var(--accent-color);
      border-color: var(--accent-color);
    }
  }
`;

const THEME_OPTIONS = [
  { value: 'light', label: 'Light Mode', icon: Sun },
  { value: 'dark', label: 'Dark Mode', icon: Moon },
];

function renderThemeOption(opt) {
  const Icon = opt.icon;
  return (
    <ThemeOptionRow>
      <Icon size={16} strokeWidth={2.5} aria-hidden />
      {opt.label}
    </ThemeOptionRow>
  );
}

function SettingsModal({ onClose }) {
  const navigate = useNavigate();
  const [apiBase, handleApiChange] = useApiBase();
  const statusByApi = useApiStatus();
  const { variant, setVariant } = useBookDisplayVariant();
  const { enabled: bookshelfQuickAction, setEnabled: setBookshelfQuickAction } = useBookshelfQuickAction();
  const [conversionMode, setConversionMode] = useConversionMode();
  const { theme, setTheme } = useTheme();

  const apiOptions = API_OPTIONS.map((opt) => ({
    ...opt,
    status: statusByApi[opt.value],
  }));

  return (
    <Modal onClose={onClose} maxWidth="420px">
      <ModalTitleBar title="Settings" onClose={onClose} />
      <ModalBody>
        <Section>
          <SectionHeader>
            <BookImage size={16} strokeWidth={2.5} aria-hidden />
            <span>Show</span>
          </SectionHeader>
          <SelectField>
            <SelectDropdown
              options={BOOK_DISPLAY_VARIANT_OPTIONS}
              value={variant}
              onChange={setVariant}
              attachedLabel="Title and Cover"
              ariaLabel="Select Title & Cover Version"
              {...MODAL_SELECT_PROPS}
            />
          </SelectField>
          <SelectField>
            <SelectDropdown
              options={BOOKSHELF_QUICK_ACTION_OPTIONS}
              value={bookshelfQuickAction}
              onChange={setBookshelfQuickAction}
              attachedLabel="Bookshelf Shortcuts"
              ariaLabel="Select Bookshelf Shortcut"
              {...MODAL_SELECT_PROPS}
            />
          </SelectField>
        </Section>

        <Section>
          <SectionHeader>
            <Globe size={16} strokeWidth={2.5} aria-hidden />
            <span>API Services</span>
          </SectionHeader>
          <SelectField>
            <SelectDropdown
              options={apiOptions}
              value={apiBase}
              onChange={handleApiChange}
              ariaLabel="Select API Services"
              {...MODAL_SELECT_PROPS}
              renderOption={(opt) => (
                <ApiOptionRow>
                  <span>{opt.label}</span>
                  {opt.status && <ApiOverallBadge status={opt.status} compact />}
                </ApiOptionRow>
              )}
              renderValue={(opt) => (
                <ApiOptionRow>
                  <span>{opt.label}</span>
                  {opt.status && <ApiOverallBadge status={opt.status} compact />}
                </ApiOptionRow>
              )}
            />
          </SelectField>
          <StatusLink
            type="button"
            onClick={() => {
              onClose();
              navigate(ROUTES.status);
            }}
          >
            <Activity size={16} strokeWidth={2.5} aria-hidden />
            API Status
          </StatusLink>
        </Section>

        <Section>
          <SectionHeader>
            <Languages size={16} strokeWidth={2.5} aria-hidden />
            <span>Chinese Conversion</span>
          </SectionHeader>
          <SelectField>
            <SelectDropdown
              options={ZH_CONVERSION_OPTIONS}
              value={conversionMode}
              onChange={setConversionMode}
              ariaLabel="Select Conversion"
              {...MODAL_SELECT_PROPS}
            />
          </SelectField>
          <ModalText>Only affects reading content (title, text, comments, etc.), interface remains unchanged.</ModalText>
        </Section>

        <Section>
          <SectionHeader>
            <Moon size={16} strokeWidth={2.5} aria-hidden />
            <span>Theme</span>
          </SectionHeader>
          <SelectField>
            <SelectDropdown
              options={THEME_OPTIONS}
              value={theme}
              onChange={setTheme}
              ariaLabel="Select Theme"
              {...MODAL_SELECT_PROPS}
              renderOption={renderThemeOption}
              renderValue={renderThemeOption}
            />
          </SelectField>
        </Section>

      </ModalBody>
    </Modal>
  );
}

export default SettingsModal;
