import { useState } from 'react';

export interface TextAreaProps {
  id?: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export default function TextArea({
  id,
  label,
  value = '',
  onChange,
  placeholder,
  required = false,
  error = false,
  errorMessage,
  disabled = false,
  rows = 4,
  className = '',
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getBorderClasses = () => {
    if (disabled) return 'border-[#e0dede] bg-[#fafafa]';
    if (error) return 'border-[#c3402c]';
    if (isFocused) return 'border-[#4a6ba6]';
    if (isHovered) return 'border-[#4a6ba6] border-opacity-30';
    return 'border-[#d5d5d5]';
  };

  return (
    <div className={`flex flex-col gap-1 items-start w-full ${className}`}>
      <div className="flex gap-1 items-center">
        <p className="font-semibold leading-[22px] text-[#1a1a1a] text-[14px] tracking-[0.1px]">
          {label}
        </p>
        {required && (
          <span className="text-[#c3402c] leading-[22px]">*</span>
        )}
      </div>

      <div
        className={`bg-white border border-solid box-border flex items-start px-4 py-[9px] rounded-lg w-full transition-all duration-200 ${getBorderClasses()}`}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className="flex-1 font-normal text-[15px] leading-[22px] text-black tracking-[0.5px] bg-transparent border-0 outline-0 w-full resize-vertical"
        />
      </div>

      {error && errorMessage && (
        <p className="text-[#c3402c] text-[12px] leading-[16px] tracking-[0.25px]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
