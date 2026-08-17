import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import SettingsModal from './SettingsModal';

function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        type="button"
        title="Settings"
        aria-label="Settings"
        onClick={() => setOpen(true)}
      >
        <Settings size={20} strokeWidth={2.5} />
      </IconButton>
      {open && <SettingsModal onClose={() => setOpen(false)} />}
    </>
  );
}

SettingsButton.toolLabel = 'Settings';

export default SettingsButton;
