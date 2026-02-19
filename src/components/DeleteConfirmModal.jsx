import { useState } from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import Modal from './Modal';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={deleting}>
            Cancel
          </button>
          <button onClick={handleConfirm} className="btn-danger flex-1" disabled={deleting}>
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
