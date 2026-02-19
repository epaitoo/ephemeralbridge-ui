import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Loader2 } from 'lucide-react';
import Modal from './Modal';
import { filesApi } from '../services/api';
import { toast } from 'sonner';

export default function UploadModal({ isOpen, onClose, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      await filesApi.upload(files);
      toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`);
      setFiles([]);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Files" size="md">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-brand-500 bg-brand-50'
            : 'border-slate-200 hover:border-brand-400 hover:bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-7 h-7 text-brand-600" />
        </div>
        <p className="text-slate-700 font-medium mb-1">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-slate-500 text-sm">or click to browse (max 10MB per file)</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                <File className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={handleClose} className="btn-secondary" disabled={uploading}>
          Cancel
        </button>
        <button
          onClick={handleUpload}
          className="btn-primary"
          disabled={files.length === 0 || uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload {files.length > 0 && `(${files.length})`}
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
