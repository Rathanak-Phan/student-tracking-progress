"use client";

import { ReactNode, useEffect } from 'react';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

type DialogType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface DialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
}

const iconMap: Record<DialogType, ReactNode> = {
  success: <CheckCircleIcon className="h-10 w-10 text-green-500" />,
  error: <XCircleIcon className="h-10 w-10 text-red-500" />,
  warning: <ExclamationTriangleIcon className="h-10 w-10 text-amber-500" />,
  info: <InformationCircleIcon className="h-10 w-10 text-blue-500" />,
  confirm: <ExclamationTriangleIcon className="h-10 w-10 text-amber-500" />,
};

const bgMap: Record<DialogType, string> = {
  success: 'bg-green-50',
  error: 'bg-red-50',
  warning: 'bg-amber-50',
  info: 'bg-blue-50',
  confirm: 'bg-amber-50',
};

const confirmBtnMap: Record<DialogType, string> = {
  success: 'bg-green-600 hover:bg-green-700 shadow-green-200',
  error: 'bg-red-600 hover:bg-red-700 shadow-red-200',
  warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
  info: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
  confirm: 'bg-red-600 hover:bg-red-700 shadow-red-200',
  danger: 'bg-red-600 hover:bg-red-700 shadow-red-200',
} as Record<string, string>;

const DialogModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  children
}: DialogModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isConfirm = type === 'confirm' || type === 'danger';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-md shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-gray-400" />
        </button>

        {/* Icon + content */}
        <div className="p-8 text-center">
          <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full ${bgMap[type] || 'bg-red-50'} mb-5 mx-auto`}>
            {iconMap[type] || <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />}
          </div>
          {title && (
            <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
          )}
          <p className="text-gray-500 font-medium leading-relaxed">{message}</p>
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className={`px-6 pb-6 flex gap-3 ${isConfirm ? '' : 'justify-center'}`}>
          {isConfirm && (
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-md border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className={`${isConfirm ? 'flex-1' : 'px-10'} py-3 rounded-md text-white font-bold transition-all shadow-lg ${confirmBtnMap[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogModal;
