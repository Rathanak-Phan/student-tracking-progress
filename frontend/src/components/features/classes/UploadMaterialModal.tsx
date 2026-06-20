"use client";

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import FileUploadZone from '@/components/ui/FileUploadZone';
import api from '@/lib/axios';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classId: string;
}

const UploadMaterialModal = ({ isOpen, onClose, onSuccess, classId }: UploadMaterialModalProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      setError('Please provide a title and select a file');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('class_id', classId);
      formData.append('file', file);

      await api.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setTitle('');
      setDescription('');
      setFile(null);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Learning Material">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Material Title</label>
          <input 
            type="text" 
            className="w-full px-5 py-4 rounded-md bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-800 font-medium"
            placeholder="e.g. Chapter 1 Notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Description (Optional)</label>
          <textarea 
            className="w-full px-5 py-4 rounded-md bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-800 font-medium min-h-[80px]"
            placeholder="Brief description of the material..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <FileUploadZone 
          label="DOCUMENT FILE" 
          onFileSelect={setFile}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png,.zip"
          helperText="PDF, DOCX, PPTX, JPG, PNG, ZIP up to 10MB"
        />

        <div className="flex gap-4 pt-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 rounded-md border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading || !file || !title}
            className="flex-1 py-4 rounded-md bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Material'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadMaterialModal;
