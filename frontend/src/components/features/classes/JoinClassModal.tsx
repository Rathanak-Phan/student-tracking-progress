"use client";

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import api from '@/lib/axios';

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialCode?: string;
}

const JoinClassModal = ({ isOpen, onClose, onSuccess, initialCode = '' }: JoinClassModalProps) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    try {
      setLoading(true);
      setError('');
      await api.post('/classes/join', { code: code.toUpperCase() });
      onSuccess();
      onClose();
      setCode('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid class code or already enrolled');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join a Class">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-4">
          <p className="text-gray-500 text-sm">Enter the 6-character code provided by your instructor to join their class.</p>
        </div>
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm font-medium border border-red-100">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 text-center block w-full">Class Code</label>
          <input
            type="text"
            required
            maxLength={6}
            className="w-full px-5 py-5 rounded-md bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center text-3xl font-black tracking-widest text-gray-900 placeholder:text-gray-200"
            placeholder="XXXXXX"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="w-full py-4 rounded-md bg-gray-900 text-white font-bold shadow-xl shadow-gray-200 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Joining...' : 'Join Class'}
        </button>
      </form>
    </Modal>
  );
};

export default JoinClassModal;
