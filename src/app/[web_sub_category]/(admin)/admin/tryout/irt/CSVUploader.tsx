import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function CSVUploader({
  onDataUploaded,
}: {
  onDataUploaded: (data: File) => void;
}) {
  const [error] = useState<string | null>(null);

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     Papa.parse(file, {
  //       complete: (results) => {
  //         if (results.data && results.data.length > 0) {
  //           const headers = results.data[0] as string[];
  //           const data = results.data.slice(1) as string[][];
  //           const processedData = data.map((row) => {
  //             const rowData: Record<string, string> = {};
  //             headers.forEach((header, index) => {
  //               rowData[header] = row[index];
  //             });
  //             return rowData;
  //           });
  //           // onDataUploaded(processedData);
  //           setError(null);
  //         } else {
  //           setError('No data found in CSV file');
  //         }
  //       },
  //       error: (error) => {
  //         setError(`Error parsing CSV: ${error.message}`);
  //       },
  //     });
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center justify-center w-full">
        {/* <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">CSV file only</p>
          </div>
          <Input
            id="dropzone-file"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                onDataUploaded(file);
              }
            }}
          />
        </label> */}
        <Input
          id="dropzone-file"
          type="file"
          accept=".csv"
          className=""
          onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (file) {
              onDataUploaded(file);
            }
          }}
        />
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default CSVUploader;
