"use client";

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import FileUploadZone from '@/components/ui/FileUploadZone';
import api from '@/lib/axios';

interface SubmitAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assignmentId: string;
  assignmentTitle: string;
}

const SubmitAssignmentModal = ({ isOpen, onClose, onSuccess, assignmentId, assignmentTitle }: SubmitAssignmentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to submit');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('assignment_id', assignmentId);
      formData.append('file', file);

      await api.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFile(null);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Assignment">
      <div className="mb-4">
        <p className="text-sm text-gray-500 font-medium">You are submitting for:</p>
        <p className="font-bold text-gray-800">{assignmentTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <FileUploadZone 
          label="ASSIGNMENT FILE" 
          onFileSelect={setFile}
          accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png"
          helperText="PDF, DOCX, ZIP, RAR, JPG, PNG up to 10MB"
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
            disabled={loading || !file}
            className="flex-1 py-4 rounded-md bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubmitAssignmentModal;
