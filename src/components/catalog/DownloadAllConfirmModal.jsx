import React from 'react';
import {
  Modal,
  ModalTitleBar,
  ModalBody,
  ModalText,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from '../ui/ModalBase';

function DownloadAllConfirmModal({
  chapterCount,
  onStay,
  onGoToDownloadPage,
  onClose,
  stayLabel = 'Stay on Index',
}) {
  return (
    <Modal onClose={onClose}>
      <ModalTitleBar title="Start Download All" onClose={onClose} />
      <ModalBody>
        <ModalText>
          Starting Download <strong>{chapterCount}</strong>  uncached chapters. Download All schedules one book at a time, check progress on download page.
          {'\n\n'}
          Go to download page?
        </ModalText>
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton type="button" onClick={onStay}>
          {stayLabel}
        </ModalSecondaryButton>
        <ModalPrimaryButton type="button" onClick={onGoToDownloadPage}>
          Go to Download Page
        </ModalPrimaryButton>
      </ModalFooter>
    </Modal>
  );
}

export default DownloadAllConfirmModal;
