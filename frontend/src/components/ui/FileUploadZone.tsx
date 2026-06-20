import { useState, useRef } from 'react';
import { DocumentArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FileUploadZoneProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  helperText?: string;
}

const FileUploadZone = ({ label, onFileSelect, accept = "image/*,application/pdf", helperText = "PDF, JPG, PNG up to 10MB" }: FileUploadZoneProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      onFileSelect(selected);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-gray-700">{label}</label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer text-center group
          ${file ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept={accept}
          onChange={handleFileChange}
        />
        
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-md shrink-0">
                <DocumentIcon className="h-6 w-6" />
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-bold text-blue-900 truncate">{file.name}</p>
                <p className="text-[10px] text-blue-500 font-semibold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={handleClear}
              className="p-1.5 hover:bg-blue-200 rounded-md text-blue-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="p-3 bg-gray-100 text-gray-400 rounded-full group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors mb-3">
              <DocumentArrowUpIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-gray-700 mb-1">Click to upload document</p>
            <p className="text-xs text-gray-400">{helperText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;
