import { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  Edit3,
  Trash2,
  MoreVertical,
  Copy,
  Check,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { textsApi } from '../services/api';
import EmptyState from '../components/EmptyState';
import TextModal from '../components/TextModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function TextsPage() {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [editingText, setEditingText] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, text: null });
  const [activeMenu, setActiveMenu] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchTexts = async () => {
    try {
      const data = await textsApi.getAll();
      setTexts(data.texts || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load texts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text.text_details);
      setCopiedId(text.id);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleEdit = (text) => {
    setEditingText(text);
    setTextModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = async () => {
    try {
      await textsApi.delete(deleteModal.text.id);
      toast.success('Text deleted');
      fetchTexts();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const handleModalClose = () => {
    setTextModalOpen(false);
    setEditingText(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Texts</h1>
          <p className="text-slate-500 mt-1">
            {texts.length} text{texts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchTexts} className="btn-ghost">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setTextModalOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            New Text
          </button>
        </div>
      </div>

      {/* Content */}
      {texts.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FileText}
            title="No texts found"
            description="Click the New Text button to create your first text snippet."
            action={
              <button onClick={() => setTextModalOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4" />
                New Text
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {texts.map((text) => (
            <div key={text.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {text.name || 'Untitled'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {formatDate(text.updated_At || text.created_At)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 font-mono bg-slate-50 rounded-lg p-3 break-all">
                    {truncateText(text.text_details, 200)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(text)}
                    className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedId === text.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === text.id ? null : text.id);
                      }}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenu === text.id && (
                      <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                        <button
                          onClick={() => handleEdit(text)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteModal({ open: true, text });
                            setActiveMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <TextModal
        isOpen={textModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchTexts}
        editText={editingText}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, text: null })}
        onConfirm={handleDelete}
        title="Delete Text"
        message={`Are you sure you want to delete "${deleteModal.text?.name || 'this text'}"? This action cannot be undone.`}
      />
    </div>
  );
}
