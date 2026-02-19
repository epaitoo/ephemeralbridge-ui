import { useState, useEffect } from 'react';
import {
  Upload,
  FolderOpen,
  Download,
  Trash2,
  MoreVertical,
  File,
  FileImage,
  FileVideo,
  FileText,
  FileArchive,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { filesApi } from '../services/api';
import EmptyState from '../components/EmptyState';
import UploadModal from '../components/UploadModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const getFileIcon = (filename) => {
  if (!filename) return File;
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];

  if (imageExts.includes(ext)) return FileImage;
  if (videoExts.includes(ext)) return FileVideo;
  if (docExts.includes(ext)) return FileText;
  if (archiveExts.includes(ext)) return FileArchive;
  return File;
};

const formatFileSize = (bytes) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, file: null });
  const [activeMenu, setActiveMenu] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const fetchFiles = async () => {
    try {
      const data = await filesApi.getAll();
      setFiles(data.files || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleDownload = async (file) => {
    setDownloading(file.id);
    try {
      const data = await filesApi.getDownloadUrl(file.id);
      window.open(data.download_url, '_blank');
      toast.success('Download started');
      // Refresh files to update expiry status
      fetchFiles();
    } catch (error) {
      toast.error(error.message || 'Download failed');
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async () => {
    try {
      await filesApi.delete(deleteModal.file.id);
      toast.success('File deleted');
      fetchFiles();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
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
          <h1 className="text-2xl font-semibold text-slate-900">Files</h1>
          <p className="text-slate-500 mt-1">
            {files.length} file{files.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchFiles} className="btn-ghost">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setUploadModalOpen(true)} className="btn-primary">
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Content */}
      {files.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FolderOpen}
            title="No files found"
            description="Click the upload button to add your first file."
            action={
              <button onClick={() => setUploadModalOpen(true)} className="btn-primary">
                <Upload className="w-4 h-4" />
                Upload
              </button>
            }
          />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">
                  Name
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">
                  Size
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">
                  Expires
                </th>
                <th className="w-20 px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.filename);
                const isExpired = file.expires_at && new Date(file.expires_at) < new Date();

                return (
                  <tr
                    key={file.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isExpired ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
                          <FileIcon className="w-5 h-5 text-brand-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 truncate max-w-xs">
                            {file.filename || 'Unnamed file'}
                          </p>
                          {isExpired && (
                            <span className="text-xs text-red-500">Expired</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatFileSize(file.size_bytes)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {file.expires_at ? formatDate(file.expires_at) : 'Never downloaded'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === file.id ? null : file.id);
                          }}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenu === file.id && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                            <button
                              onClick={() => {
                                handleDownload(file);
                                setActiveMenu(null);
                              }}
                              disabled={isExpired || downloading === file.id}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {downloading === file.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                              Download
                            </button>
                            <button
                              onClick={() => {
                                setDeleteModal({ open: true, file });
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={fetchFiles}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, file: null })}
        onConfirm={handleDelete}
        title="Delete File"
        message={`Are you sure you want to delete "${deleteModal.file?.filename || 'this file'}"? This action cannot be undone.`}
      />
    </div>
  );
}
