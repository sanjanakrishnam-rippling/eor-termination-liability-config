import FileUpload from './FileUpload';

export default function CensusCsvUploadSection({
  title,
  templatePath,
  standardValuesPath,
  files,
  onFilesChange,
  error,
  errorMessage,
  fieldId,
}: {
  title: string;
  templatePath: string;
  standardValuesPath: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  error: boolean;
  errorMessage: string | undefined;
  fieldId: string;
}) {
  return (
    <div id={fieldId} className="border border-[#e5e7eb] rounded-lg p-5 flex flex-col gap-4">
      <h3 className="text-[16px] font-bold text-[#1a1a1a]">{title}</h3>

      <h4 className="text-[15px] font-bold text-[#1a1a1a]">Instructions</h4>

      <div className="flex flex-col gap-4 text-[14px] leading-[20px] text-[#1a1a1a]">
        <div className="flex flex-col gap-2">
          <p className="font-semibold">1. Download the CSV template</p>
          <a
            href={templatePath}
            download
            className="inline-flex items-center gap-2 rounded-lg border border-[#d5d5d5] bg-white px-4 py-2 text-[14px] font-medium text-[#1a1a1a] w-fit hover:bg-[#f9fafb] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download CSV template
          </a>
          <p className="text-[13px] text-[#6b7280]">
            Not sure about accepted values?{' '}
            <a
              href={standardValuesPath}
              download
              className="text-[#4a6ba6] font-medium hover:underline"
            >
              standard value file
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-semibold">2. Enter the hire profile details into the CSV worksheet</p>
          <p className="text-[#6b7280]">
            Fill out the required fields and any optional fields that you would like to include in your
            worksheet.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-semibold">3. Upload the completed CSV file into Rippling</p>
          <p className="text-[#6b7280]">
            You can review and make changes to the data in Rippling spreadsheet after you upload the file.
            Rippling will automatically validate your data, highlight any errors, and guide you toward
            resolving those errors.
          </p>
        </div>
      </div>

      <FileUpload
        label=""
        files={files}
        onFilesChange={onFilesChange}
        accept=".csv"
        multiple={false}
        error={error}
        errorMessage={errorMessage}
        selectPrompt={
          <span className="font-medium text-[#4a6ba6]">Drop or select (.csv)</span>
        }
      />
    </div>
  );
}
