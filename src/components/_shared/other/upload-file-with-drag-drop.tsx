'use client';

import type React from 'react';

import uploadFile from '@/_assets/icon/uploadDokumen.png';
import { UploadIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const UploadFile = ({
  file,
  setFile,
  heading,
  buttonText,
  contentText,
  inputId,
  image,
}: any) => {
  const [previewHover, setPreviewHover] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  useEffect(() => {
    setPreviewImage('');
    if (image && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];

      // Validasi tipe file berdasarkan jenis upload
      if (image) {
        // Untuk image, hanya terima file gambar
        if (droppedFile.type.startsWith('image/')) {
          setFile(droppedFile);
        } else {
          alert('Hanya file gambar yang diperbolehkan untuk thumbnail');
        }
      } else if (inputId === 'documentFile') {
        // Untuk dokumen PDF
        if (droppedFile.type === 'application/pdf') {
          setFile(droppedFile);
        } else {
          alert('Hanya file PDF yang diperbolehkan');
        }
      } else if (inputId === 'docxFile') {
        // Untuk dokumen DOCX
        if (
          droppedFile.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          setFile(droppedFile);
        } else {
          alert('Hanya file DOCX yang diperbolehkan');
        }
      } else if (inputId === 'videoFile') {
        // Untuk video
        if (droppedFile.type.startsWith('video/')) {
          setFile(droppedFile);
        } else {
          alert('Hanya file video yang diperbolehkan');
        }
      } else {
        // Default: terima semua file
        setFile(droppedFile);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="relative">
      <p className="mb-[.5rem] ml-[.5rem] text-[.9rem] font-medium">
        {heading}
      </p>

      <input
        id={inputId}
        type="file"
        onChange={handleFileInputChange}
        className="absolute right-0 top-0 h-0 w-0"
        accept={
          image
            ? 'image/*'
            : inputId === 'documentFile'
              ? '.pdf'
              : inputId === 'docxFile'
                ? '.docx'
                : inputId === 'videoFile'
                  ? 'video/*'
                  : '*'
        }
      />

      <div
        className={`relative flex flex-col gap-4 rounded-2xl border-2 border-dashed p-4 transition-all duration-200 ${
          isDragOver
            ? 'border-main bg-main/10 scale-[1.02]'
            : 'border-main-gray-input hover:border-main/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay indicator */}
        {isDragOver && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-main/20 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-main">
              <div className="text-3xl">📁</div>
              <p className="font-semibold">Lepaskan file di sini</p>
            </div>
          </div>
        )}

        {!image ? (
          <>
            <div className="flex flex-col items-center gap-[.5rem] text-center">
              <Image
                src={uploadFile || '/placeholder.svg'}
                alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
              />
              <p className="text-[.8rem] text-main-gray-text">
                {!file ? (
                  <>
                    {contentText}
                    <br />
                    <span className="text-main font-medium">
                      atau seret dan lepas file di sini
                    </span>
                  </>
                ) : (
                  file.name
                )}
              </p>
            </div>

            <button
              type="button"
              className="w-full rounded-[.5rem] border border-main-gray-input py-[.5rem] text-[.8rem] text-main-gray-text duration-300 hover:border-main hover:bg-main hover:text-white active:bg-main-hover"
              onClick={() => {
                document.getElementById(inputId)?.click();
              }}
            >
              {buttonText}
            </button>
          </>
        ) : (
          <>
            {!previewImage ? (
              <>
                <div className="flex flex-col items-center gap-[.5rem] text-center">
                  <UploadIcon />
                  <p className="text-[.8rem] text-main-gray-text">
                    {!file ? (
                      <>
                        {contentText}
                        <br />
                        <span className="text-main font-medium">
                          atau seret dan lepas file di sini
                        </span>
                      </>
                    ) : (
                      file.name
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full rounded-[.5rem] border border-main-gray-input py-[.5rem] text-[.8rem] text-main-gray-text duration-300 hover:border-main hover:bg-main hover:text-white active:bg-main-hover"
                  onClick={() => {
                    document.getElementById(inputId)?.click();
                  }}
                >
                  {buttonText}
                </button>
              </>
            ) : (
              <>
                <div className={`relative ${previewHover ? 'z-4' : 'z-6'}`}>
                  <Image
                    src={previewImage || '/placeholder.svg'}
                    alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
                    layout="responsive"
                    width={500}
                    height={300}
                    onMouseOver={() => {
                      if (previewImage) {
                        setPreviewHover(true);
                      }
                    }}
                  />
                </div>

                <div className="absolute left-0 top-0 z-5 flex h-full w-full items-center justify-center bg-[#ffffffc4] p-4">
                  <div
                    className="flex h-full w-full items-center justify-center cursor-pointer"
                    onClick={() => {
                      document.getElementById(inputId)?.click();
                    }}
                    onMouseLeave={() => {
                      if (previewImage) {
                        setPreviewHover(false);
                      }
                    }}
                  >
                    <div className="flex flex-col items-center text-center text-main-gray-text">
                      <i className="bx bx-upload text-[1.5rem]" />
                      <p>Ganti Thumbnail</p>
                      <p className="text-xs mt-1">atau seret file baru</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
