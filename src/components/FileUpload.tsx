import { useRef, useState, useCallback } from 'react';

export interface FileUploadProps {
  label: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  accept?: string;
  multiple?: boolean;
  helpText?: string;
  disabled?: boolean;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload({
  label,
  files,
  onFilesChange,
  required = false,
  error = false,
  errorMessage,
  accept,
  multiple = true,
  helpText,
  disabled = false,
  className = '',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      const incoming = Array.from(newFiles);
      onFilesChange(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
    },
    [files, multiple, onFilesChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleRemove = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const borderColor = error
    ? 'border-[#c3402c]'
    : isDragOver
      ? 'border-[#4a6ba6] bg-[#f0f4ff]'
      : 'border-[#d5d5d5]';

  return (
    <div className={`flex flex-col gap-1 items-start w-full ${className}`}>
      {/* Label */}
      <div className="flex gap-1 items-center">
        <p className="font-semibold leading-[22px] text-[#1a1a1a] text-[14px] tracking-[0.1px]">
          {label}
        </p>
        {required && (
          <span className="text-[#c3402c] leading-[22px]">*</span>
        )}
      </div>

      {helpText && (
        <p className="text-[13px] leading-[18px] text-[#8f8f8f] tracking-[0.25px]">
          {helpText}
        </p>
      )}

      {/* Drop zone */}
      <div
        className={`bg-white border-2 border-dashed ${borderColor} box-border flex flex-col gap-2 items-center justify-center px-6 py-8 rounded-lg w-full transition-all duration-200 ${
          disabled ? '' : 'cursor-pointer hover:border-[#4a6ba6] hover:border-opacity-30'
        }`}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); if (!disabled) handleDrop(e); }}
      >
        <svg
          className="w-8 h-8 text-[#9d9d9d]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-[14px] text-[#595555] text-center">
          <span className="font-medium text-[#4a6ba6]">Click to upload</span>{' '}
          or drag and drop
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-1 w-full mt-1">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center gap-2 bg-[#f8f8f8] rounded-lg px-3 py-2"
            >
              <svg className="w-4 h-4 text-[#595555] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-[14px] text-[#252528] flex-1 truncate">
                {file.name}
              </span>
              <span className="text-[12px] text-[#8f8f8f] shrink-0">
                {formatFileSize(file.size)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="text-[#8f8f8f] hover:text-[#c3402c] transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && errorMessage && (
        <p className="text-[#c3402c] text-[12px] leading-[16px] tracking-[0.25px]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
