import { useState, useEffect } from 'react';
import { Save, Loader2, Copy, Check } from 'lucide-react';
import Modal from './Modal';
import { textsApi } from '../services/api';
import { toast } from 'sonner';

export default function TextModal({ isOpen, onClose, onSuccess, editText = null }) {
  const [name, setName] = useState('');
  const [textDetails, setTextDetails] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const isEditing = !!editText;

  useEffect(() => {
    if (editText) {
      setName(editText.name || '');
      setTextDetails(editText.text_details || '');
    } else {
      setName('');
      setTextDetails('');
    }
  }, [editText, isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textDetails);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleSave = async () => {
    if (!textDetails.trim()) {
      toast.error('Text content is required');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await textsApi.update(editText.id, { name, text_details: textDetails });
        toast.success('Text updated successfully');
      } else {
        await textsApi.create({ name, text_details: textDetails });
        toast.success('Text created successfully');
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setName('');
      setTextDetails('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Text' : 'New Text'}
      size="lg"
    >
      <div className="space-y-4">
        {/* Name field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Name <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Give it a name..."
            className="input"
          />
        </div>

        {/* Text content */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-slate-700">Content</label>
            {textDetails && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
          <textarea
            value={textDetails}
            onChange={(e) => setTextDetails(e.target.value)}
            placeholder="Paste or type your text here..."
            rows={10}
            className="textarea font-mono text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={handleClose} className="btn-secondary" disabled={saving}>
          Cancel
        </button>
        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditing ? 'Update' : 'Save'}
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
