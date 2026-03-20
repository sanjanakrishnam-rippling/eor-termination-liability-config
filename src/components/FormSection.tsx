interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormSection({
  title,
  description,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <section className={`flex flex-col gap-5 w-full ${className}`}>
      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] font-bold leading-[26px] text-[#1a1a1a] tracking-[0.1px]">
          {title}
        </h2>
        {description && (
          <p className="text-[14px] leading-[20px] text-[#6b7280] tracking-[0.1px]">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {children}
      </div>
    </section>
  );
}
