"use client";

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { ClipboardDocumentIcon, CheckIcon, LinkIcon, QrCodeIcon, HashtagIcon } from '@heroicons/react/24/outline';

interface InviteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classCode: string;
  className: string;
}

type TabType = 'code' | 'link' | 'qr';

const InviteStudentModal = ({ isOpen, onClose, classCode, className }: InviteStudentModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('code');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInviteLink(`${window.location.origin}/classes?join=${classCode}`);
    }
  }, [classCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Students">
      <div className="space-y-6">
        <p className="text-sm text-gray-500 text-center px-4">
          Share access to <strong className="text-gray-800">{className}</strong> with your students.
        </p>

        {/* Tabs */}
        <div className="flex p-1 bg-gray-50 rounded-md border border-gray-100">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-sm transition-all ${
              activeTab === 'code' ? 'bg-white text-blue-600 shadow-sm border border-gray-100/50' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <HashtagIcon className="h-4 w-4" />
            Class Code
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-sm transition-all ${
              activeTab === 'link' ? 'bg-white text-blue-600 shadow-sm border border-gray-100/50' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            Invite Link
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-sm transition-all ${
              activeTab === 'qr' ? 'bg-white text-blue-600 shadow-sm border border-gray-100/50' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <QrCodeIcon className="h-4 w-4" />
            QR Code
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[220px] flex flex-col items-center justify-center">
          {activeTab === 'code' && (
            <div className="w-full bg-blue-50/50 p-6 rounded-md border border-blue-100 animate-in fade-in zoom-in-95 duration-200">
              <h4 className="text-center text-sm font-bold text-blue-800 mb-2">Share this code with your students</h4>
              <p className="text-center text-xs text-blue-600/80 mb-6">
                Students can enter this code in their dashboard to join.
              </p>
              
              <div className="flex items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <span className="font-mono font-black text-3xl tracking-widest text-gray-900">{classCode}</span>
                <button
                  onClick={handleCopyCode}
                  className={`p-3 rounded-md flex items-center justify-center transition-all ${
                    copiedCode 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                  title="Copy to clipboard"
                >
                  {copiedCode ? (
                    <CheckIcon className="h-6 w-6" />
                  ) : (
                    <ClipboardDocumentIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
              {copiedCode && <p className="text-center text-xs text-green-600 font-bold mt-3 transition-opacity">Copied to clipboard!</p>}
            </div>
          )}

          {activeTab === 'link' && (
            <div className="w-full bg-indigo-50/50 p-6 rounded-md border border-indigo-100 animate-in fade-in zoom-in-95 duration-200">
              <h4 className="text-center text-sm font-bold text-indigo-800 mb-2">Share a direct link</h4>
              <p className="text-center text-xs text-indigo-600/80 mb-6">
                Students clicking this link will be prompted to join the class.
              </p>
              
              <div className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200 shadow-sm gap-2 overflow-hidden">
                <div className="flex-1 overflow-x-auto no-scrollbar py-2 px-3">
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{inviteLink}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-md flex items-center justify-center transition-all text-xs font-bold uppercase tracking-widest ${
                    copiedLink 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {copiedLink && <p className="text-center text-xs text-green-600 font-bold mt-3 transition-opacity">Link copied to clipboard!</p>}
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="w-full flex flex-col items-center bg-gray-50/80 p-6 rounded-md border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
               <h4 className="text-center text-sm font-bold text-gray-800 mb-2">Scan to join</h4>
               <p className="text-center text-xs text-gray-500 mb-6">
                 Students can scan this code with their mobile device.
               </p>
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm inline-block">
                 <img 
                   src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteLink)}`} 
                   alt="QR Code to join class"
                   className="w-48 h-48"
                 />
               </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InviteStudentModal;
