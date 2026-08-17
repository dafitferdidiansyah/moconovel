import { useState } from 'react';
import styled from 'styled-components';
import { Check, Loader2, RefreshCw, Settings, X } from 'lucide-react';
import PageContent from '../layout/PageContent';
import { GrayButton } from '../ui/GrayButton';
import { CardSpinningIcon } from '../book/CardActionButton';
import SettingsModal from '../settings/SettingsModal';
import { refreshApiStatus, useApiStatusStore } from '../../hooks/api/useApiStatus';
import { retroDashedCardStyles } from '../../utils/styled/retro';
import { Section } from '../../utils/styled/sections';
import { thinScrollbarStyles } from '../../utils/styled/scrollbars';
import ApiOverallBadge from '../settings/ApiOverallBadge';

const ENDPOINTS = [
  { key: 'detail', label: 'Details' },
  { key: 'directory', label: 'Index' },
  { key: 'content', label: 'Chapter' },
  { key: 'comment', label: 'Comments' },
];

const MetaCard = styled.div`
  ${retroDashedCardStyles}
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color-secondary);
`;

const MetaRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const CheckedAt = styled.span`
  color: var(--accent-color);
  font-weight: 600;
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const MetaActionButton = styled(GrayButton)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 14px;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: var(--retro-shadow);
  }
`;

const TableWrap = styled.div`
  ${retroDashedCardStyles}
  padding: 0;
  max-width: 100%;

  @media (max-width: 480px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    ${thinScrollbarStyles}

    &::-webkit-scrollbar {
      height: 4px;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 10px 8px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    vertical-align: top;
    width: calc(100% / 6);
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 14%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 19%;
  }

  th:nth-child(n + 3),
  td:nth-child(n + 3) {
    width: calc(67% / 4);
  }

  th {
    font-family: var(--display-font-family);
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.04em;
    color: var(--text-color-secondary);
    background: color-mix(in srgb, var(--background-color2) 70%, transparent);
  }

  tr:last-child td {
    border-bottom: none;
  }

  td.num {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    table-layout: fixed;
    width: 720px;
    min-width: 720px;
    font-size: 12px;

    th,
    td {
      padding: 8px 10px;
      box-sizing: border-box;
      width: 120px;
    }

    th:nth-child(1),
    td:nth-child(1) {
      width: 104px;
    }

    th:nth-child(2),
    td:nth-child(2) {
      width: 136px;
    }

    th:nth-child(n + 3),
    td:nth-child(n + 3) {
      width: 120px;
    }

    th {
      font-size: 11px;
      letter-spacing: 0.02em;
    }
  }
`;

const ApiName = styled.span`
  font-weight: 600;
  font-family: var(--display-font-family);
  font-size: 12px;
  letter-spacing: 0.02em;
  word-break: break-all;
`;

const STATUS_GREEN = '#4a9a4a';

const EndpointCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const StatusRow = styled.div`
  display: inline-flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ $ok }) => ($ok ? STATUS_GREEN : 'color-mix(in srgb, #e55 85%, var(--text-color))')};
  cursor: ${({ $hasError }) => ($hasError ? 'help' : 'default')};

  svg {
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

const Latency = styled.span`
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  color: var(--text-color-secondary);
  line-height: 1.3;
`;

function formatCheckedAt(iso) {
  if (!iso) return 'Not Yet Checked';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function StatusContent() {
  const { data, refreshing } = useApiStatusStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const apis = data?.apis ?? [];
  const intervalMin = Math.round((data?.interval_seconds ?? 300) / 60);

  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <Section>
        <MetaCard>
          <MetaRow>
            <span>
              Backend every  {intervalMin}  minutes to send details, index, chapter, and comment requests to mirror sources.
              <br />
              Click "Settings" to switch mirror sources.
              <br />
              Last Check: <CheckedAt>{formatCheckedAt(data?.checked_at)}</CheckedAt>
            </span>
            <ControlsRow>
              <MetaActionButton
                type="button"
                title="Settings"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings size={16} strokeWidth={2.5} />
                Settings
              </MetaActionButton>
              <MetaActionButton
                type="button"
                disabled={refreshing}
                onClick={() => refreshApiStatus()}
              >
                {refreshing ? (
                  <CardSpinningIcon>
                    <Loader2 size={16} />
                  </CardSpinningIcon>
                ) : (
                  <RefreshCw size={16} strokeWidth={2.5} />
                )}
                Refresh
              </MetaActionButton>
            </ControlsRow>
          </MetaRow>
        </MetaCard>
        {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>API</th>
                <th>Overall</th>
                {ENDPOINTS.map((ep) => (
                  <th key={ep.key}>{ep.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apis.length === 0 ? (
                <tr>
                  <td colSpan={2 + ENDPOINTS.length} style={{ textAlign: 'center', color: 'var(--text-color-secondary)' }}>
                    Initial check in progress, please wait...
                  </td>
                </tr>
              ) : (
                apis.map((api) => (
                  <tr key={api.id}>
                    <td><ApiName>{api.id}</ApiName></td>
                    <td>
                      <ApiOverallBadge status={api.overall} />
                    </td>
                    {ENDPOINTS.map((ep) => {
                      const result = api.endpoints?.[ep.key];
                      const ok = result?.ok;
                      const errorDetail = !ok ? result?.error : null;
                      return (
                        <td key={ep.key}>
                          <EndpointCell>
                            <StatusRow
                              $ok={ok}
                              $hasError={Boolean(errorDetail)}
                              title={errorDetail || undefined}
                            >
                              {ok ? <Check size={14} strokeWidth={2.5} color={STATUS_GREEN} /> : <X size={14} strokeWidth={2.5} />}
                              {ok ? 'Normal' : 'Failed'}
                            </StatusRow>
                            {result?.latency_ms != null && (
                              <Latency>{result.latency_ms} ms</Latency>
                            )}
                          </EndpointCell>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableWrap>
      </Section>
    </PageContent>
  );
}

export default StatusContent;
