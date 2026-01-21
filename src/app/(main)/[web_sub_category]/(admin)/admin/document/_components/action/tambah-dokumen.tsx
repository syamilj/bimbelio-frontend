'use client';

import type React from 'react';

import { useSession } from '@/components/provider/provider-session-auth';
import LoadingPage from '@/components/ui/Loading-Page';
import { MultiSelectVisibleAt } from '@/components/ui/multi-select-visibleAt';
import { LoadingPageStorage } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { responseError } from '@/lib/response';
import { getDateForInput, getHours } from '@/lib/utils';
import { storage } from '@/supabaseClient';
import type { Category, Subcategory } from '@/types/database';
import { UploadIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useProvider } from '../../provider';

export default function TambahDokumen() {
  const {
    setShowAddDocument,
    showAddDocument,
    useCatAndSubCat: { categoryAndSubCategory },
    useDocument: { fetchDocument },
  } = useProvider();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleAtWebSubIds, setVisibleAtWebSubIds] = useState<string[]>([]);
  const [file, setFile] = useState<File | undefined>();
  const [docxFile, setDocxFile] = useState<File | undefined>();
  const [thumbnail, setThumbnail] = useState<File | undefined>();
  const [video, setVideo] = useState<File | undefined>();
  const [fileName, setFileName] = useState<string>('');
  const [videoName, setVideoName] = useState<string>('');
  const [option, setOption] = useState<'doc' | 'video'>('doc');
  const [category, setCategory] = useState<string>('');
  const [to, setTo] = useState<boolean>(false);
  const [subCategory, setSubCategory] = useState<string>('');
  const [premium, setPremium] = useState<boolean>(false);
  // Try-out
  const [description, setDescription] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [dateToUnlock, setDateToUnlock] = useState<string>('');
  const [subCategoryData, setSubCategoryData] = useState<
    (Subcategory & { category: Category })[]
  >([]);

  const [loadingTitle, setLoadingTitle] = useState<string>('');

  const fetchSubCategories = async (categoryId: string) => {
    await getGeneral(
      `/category/getAllSubcategoryByCategoryId?categoryId=${categoryId}`,
      {
        setData: setSubCategoryData,
      },
    );
  };

  useEffect(() => {
    if (category.length === 0) return;
    fetchSubCategories(category);
  }, [category]);

  // ... (rest of your existing functions remain the same)
  const addDokumen = async (payload: {
    title: string;
    categoryId: string;
    subCategoryId: string;
    url: string;
    docxUrl?: string;
    img: string;
    premium: boolean;
    dateTo?: string;
    dateToUnlock?: string;
    description?: string;
    tokenTo?: string;
    visibleAtWebSubIds?: string[];
  }) => {
    await mutateGeneral('/document/addDocument', {
      payload: {
        userId: session?.user.id,
        ...payload,
      },
      type: 'post',
      setLoading: setLoading,
      async onSuccess({ data }) {
        fetchDocument();
        setShowAddDocument(false);
        setFile(undefined);
        setThumbnail(undefined);
        setCategory('');
        setSubCategory('');
        setOption('doc');
        setFileName('');
        setPremium(false);
        setTo(false);
        setDateTo('');
        setDescription('');
        setToken('');
        setDateTo('');
        setDateToUnlock('');
        await storage
          .from('dump-embedding')
          .remove([`${fileName || docxFile?.name}`]);
        setDocxFile(undefined);
      },
      async onError() {
        if (file && thumbnail && option === 'doc') {
          const documentFileName = fileName || file.name;
          await storage.from('pdf').remove([`document/${documentFileName}`]);
          await storage.from('img').remove([`document/${documentFileName}`]);
          await storage
            .from('dump-embedding')
            .remove([`${fileName || docxFile?.name}`]);
        }
      },
    });
  };

  const addDocumentWithVideo = async (payload: {
    titleDocs: string;
    categoryId: string;
    subCategoryId: string;
    urlDocs: string;
    docxUrl?: string;
    img: string;
    titleVideo: string;
    urlVideo: string;
    premium: boolean;
    dateTo?: string;
    dateToUnlock?: string;
    description?: string;
    tokenTo?: string;
    visibleAtWebSubIds?: string[];
  }) => {
    await mutateGeneral('/document/addDocumentWithVideo', {
      payload: {
        userId: session?.user.id,
        ...payload,
      },
      type: 'post',
      setLoading: setLoading,
      onSuccess() {
        fetchDocument();
        setShowAddDocument(false);
        setFile(undefined);
        setThumbnail(undefined);
        setVideo(undefined);
        setCategory('');
        setSubCategory('');
        setOption('doc');
        setFileName('');
        setVideoName('');
        setPremium(false);
        setTo(false);
        setDateTo('');
        setDescription('');
        setToken('');
        setDateTo('');
        setDateToUnlock('');
      },
      async onError() {
        if (file && thumbnail && video && option === 'video') {
          const documentFileName = fileName || file.name;
          await storage.from('pdf').remove([`document/${documentFileName}`]);
          await storage.from('img').remove([`document/${documentFileName}`]);
          await storage
            .from('video')
            .remove([`document/${videoName || video.name}`]);
          setLoading(false);
        }
      },
    });
  };

  const AddDokumen = async () => {
    try {
      setLoading(true);

      if (!to) {
        if (!file) {
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Dokumen belum diupload!',
            duration: 2000,
          });
          setLoading(false);
          return;
        }

        if (category === '' || subCategory === '') {
          setLoading(false);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Pilih kategory dan subkategori!',
            duration: 2000,
          });
          return;
        }

        if (!thumbnail) {
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Thumbnail belum di upload!',
            duration: 2000,
          });
          setLoading(false);
          return;
        }
      } else {
        if (!file) {
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Dokumen belum diupload!',
            duration: 2000,
          });
          setLoading(false);
          return;
        }

        if (subCategory === '') {
          setLoading(false);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Pilih subkategori!',
            duration: 2000,
          });
          return;
        }

        if (fileName === '') {
          setLoading(false);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Masukan title try out!',
            duration: 2000,
          });
          return;
        }

        if (description === '') {
          setLoading(false);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Masukan deskripsi try out!',
            duration: 2000,
          });
          return;
        }

        if (token === '') {
          setLoading(false);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Masukan id try out!',
            duration: 2000,
          });
          return;
        }

        if (dateTo === '') {
          setLoading(false);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Masukan tanggal try out berakhir!',
            duration: 2000,
          });
          return;
        }

        if (dateTo.includes('none')) {
          const string = dateTo.split('-');
          setLoading(false);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: `${string[1]}`,
            duration: 2000,
          });
          return;
        }

        if (dateToUnlock === '') {
          setLoading(false);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Masukan tanggal unlock pembahasan!',
            duration: 2000,
          });
          return;
        }

        if (dateToUnlock.includes('none')) {
          const string = dateToUnlock.split('-');
          setLoading(false);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: `${string[1]}`,
            duration: 2000,
          });
          return;
        }

        if (!thumbnail) {
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Thumbnail belum diupload!',
            duration: 2000,
          });
          setLoading(false);
          return;
        }
      }

      if (option === 'video' && !video) {
        toaster({
          title: 'Upss',
          condition: 'warning',
          description: 'Video belum diupload!',
          duration: 2000,
        });
        setLoading(false);
        return;
      }

      if (file && thumbnail && option === 'doc') {
        const documentFileName = fileName || file.name;

        const { data: pdf, error: pdfError } = await storage
          .from('pdf')
          .upload(`document/${documentFileName}`, file);

        const { data: img, error: imgError } = await storage
          .from('img')
          .upload(`document/${documentFileName}`, thumbnail);

        if (docxFile) {
          const { error: mdError } = await storage
            .from('dump-embedding')
            .upload(`${fileName || docxFile.name}`, docxFile);

          if (mdError) {
            toaster({
              title: 'Gagal',
              description: `${mdError?.message}`,
              condition: 'warning',
            });
            setLoading(false);
            return;
          }
        }

        if (pdf && img) {
          await addDokumen({
            title: fileName !== '' ? fileName : file.name,
            categoryId: category,
            subCategoryId: subCategory,
            url: `${fileName !== '' ? fileName : file.name}`,
            img: `${fileName !== '' ? fileName : file.name}`,
            docxUrl: docxFile
              ? `${fileName !== '' ? fileName : docxFile.name}`
              : undefined,
            premium: premium,
            visibleAtWebSubIds:
              visibleAtWebSubIds.length > 0 ? visibleAtWebSubIds : undefined,
          });
        }

        if (pdfError) {
          toaster({
            title: 'Gagal',
            description: `${pdfError?.message}`,
            condition: 'warning',
          });
          setLoading(false);
          return;
        }

        if (imgError) {
          toaster({
            title: 'Gagal',
            description: `${imgError?.message}`,
            condition: 'warning',
          });
          setLoading(false);
          return;
        }
      }

      if (file && thumbnail && video && option === 'video') {
        const documentFileName = fileName || file.name;

        setLoadingTitle('[1/5] Mengupload PDF...');
        const { data: pdf, error: pdfError } = await storage
          .from('pdf')
          .upload(`document/${documentFileName}`, file);

        setLoadingTitle('[2/5] Mengupload Thumbnail...');
        const { data: img, error: imgError } = await storage
          .from('img')
          .upload(`document/${documentFileName}`, thumbnail);

        setLoadingTitle('[3/5] Mengupload Video...');
        const { data: videoSave, error: videoSaveError } = await storage
          .from('video')
          .upload(`document/${videoName || video.name}`, video);

        if (docxFile) {
          setLoadingTitle('[4/5] Mengupload Docx...');
          const { error: mdError } = await storage
            .from('dump-embedding')
            .upload(`${fileName || docxFile.name}`, docxFile);

          if (mdError) {
            toaster({
              title: 'Gagal',
              description: `${mdError?.message}`,
              condition: 'warning',
            });

            setLoadingTitle('');
            setLoading(false);
            return;
          }
        }

        if (pdf && img && videoSave) {
          setLoadingTitle('[5/5] Menyimpan Data...');
          await addDocumentWithVideo({
            titleDocs: fileName !== '' ? fileName : file.name,
            categoryId: category,
            subCategoryId: subCategory,
            urlDocs: `${fileName !== '' ? fileName : file.name}`,
            docxUrl: docxFile
              ? `${fileName !== '' ? fileName : docxFile.name}`
              : undefined,
            img: `${fileName !== '' ? fileName : file.name}`,
            titleVideo: videoName !== '' ? videoName : video.name,
            urlVideo: `${videoName !== '' ? videoName : video.name}`,
            premium: premium,
            visibleAtWebSubIds:
              visibleAtWebSubIds.length > 0 ? visibleAtWebSubIds : undefined,
          });
        }

        if (pdfError) {
          toaster({
            title: 'Gagal',
            description: `${pdfError?.message}`,
            condition: 'warning',
          });
          setLoadingTitle('');
          setLoading(false);
        }

        if (imgError) {
          toaster({
            title: 'Gagal',
            description: `${imgError?.message}`,
            condition: 'warning',
          });
          setLoadingTitle('');
          setLoading(false);
        }

        if (videoSaveError) {
          toaster({
            title: 'Gagal',
            description: `${videoSaveError?.message}`,
            condition: 'warning',
          });
          setLoadingTitle('');
          setLoading(false);
        }

        setLoadingTitle('');
        setLoading(false);
      }

      return;
    } catch (error) {
      console.log({ error });
      responseError(error, true);
      setLoadingTitle('');
      setLoading(false);
      return;
    }
  };

  return (
    <>
      {showAddDocument && (
        <div
          className="fixed left-0 top-0 z-49 h-full w-full"
          onClick={() => {
            setShowAddDocument(false);
          }}
        />
      )}
      <div
        id="tambah-dokumen"
        className={`fixed top-0 z-50 h-full w-[400px] border border-main-gray-input bg-white duration-300 ${showAddDocument ? 'right-0' : 'right-[-420px]'} overflow-y-auto`}
      >
        {loading && option === 'doc' && <LoadingPage />}
        {loading && option === 'video' && (
          <LoadingPageStorage
            loading={loading}
            heading={
              loadingTitle.length > 0 ? loadingTitle : 'Menyimpan Data...'
            }
          />
        )}

        <div className="flex flex-col gap-4 p-8">
          <h1 className="text-[1.2rem] font-semibold">Tambah Material</h1>

          <div className="flex flex-col gap-4 text-[.9rem] font-medium">
            <MultiSelectVisibleAt
              value={visibleAtWebSubIds}
              onValuesChange={setVisibleAtWebSubIds}
            />
            <div id="file">
              <UploadFile
                heading="Pdf"
                contentText="Pilih Pdf untuk diupload (.pdf)"
                inputId="documentFile"
                buttonText="Upload Pdf"
                file={file}
                setFile={setFile}
              />
            </div>

            <div id="file">
              <UploadFile
                heading="Docx (optional)"
                contentText="Pilih Docx untuk diupload (.docx)"
                inputId="docxFile"
                buttonText="Upload Docx"
                file={docxFile}
                setFile={setDocxFile}
              />
            </div>

            {!to && (
              <div
                id="name-file"
                className="flex flex-col gap-[.5rem]"
              >
                <p>
                  Judul dokumen{' '}
                  <span className="text-main-gray-text">(opsional)</span>
                </p>
                <input
                  type="text"
                  className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
                  placeholder="Masukan judul dokumen"
                  onChange={(e) => setFileName(e.target.value)}
                  value={fileName}
                />
              </div>
            )}

            <div
              id="category"
              className="flex flex-col gap-[.5rem]"
            >
              <p>Fitur</p>
              <div className="flex w-full justify-between gap-4">
                <div className="flex w-full justify-between gap-4">
                  <div
                    className={`w-full cursor-pointer rounded-[.5rem] border border-main-gray-input py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${!premium && 'border-main bg-main text-white'}`}
                    onClick={() => setPremium(false)}
                  >
                    Free
                  </div>
                </div>
                <div className="flex w-full justify-between gap-4">
                  <div
                    className={`w-full cursor-pointer rounded-[.5rem] border border-main-gray-input py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${premium && 'border-main bg-main text-white'}`}
                    onClick={() => setPremium(true)}
                  >
                    Premium
                  </div>
                </div>
              </div>
            </div>

            <div
              id="category"
              className="flex flex-col gap-[.5rem]"
            >
              <p>Kategori</p>
              <div
                id="row"
                className="flex w-full justify-start gap-4 overflow-y-auto pb-[.5rem]"
              >
                {categoryAndSubCategory?.category?.map((item: any, i: any) => (
                  <div
                    key={i}
                    className={`w-fit shrink-0 cursor-pointer rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${category === item.id && 'border-main bg-main text-white'}`}
                    onClick={() => {
                      setCategory(item.id);
                      setSubCategory('');
                      setTo(item.to);
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            <div
              id="subCategory"
              className="flex flex-col gap-[.5rem]"
            >
              <p>Subkategori</p>
              <div
                id="row"
                className="flex w-full justify-start gap-4 overflow-y-auto pb-[.5rem]"
              >
                {subCategoryData?.map((item: any, i: any) => (
                  <div
                    key={i}
                    className={`w-fit shrink-0 cursor-pointer rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${subCategory === item.id && 'border-main bg-main text-white'}`}
                    onClick={() => setSubCategory(item.id)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            {to && (
              <>
                <InputText
                  heading="Title"
                  placeholder="Masukan title"
                  setValue={setFileName}
                  value={fileName}
                />

                <InputTextarea
                  heading="Deskripsi"
                  placeholder="Masukan deskripsi"
                  setValue={setDescription}
                  value={description}
                />

                <InputText
                  heading="ID Tryout"
                  placeholder="Masukan id tryout"
                  setValue={setToken}
                  value={token}
                />

                <InputDateAndTime
                  heading="Tanggal berakhir"
                  setValue={setDateTo}
                  value={dateTo}
                  warning="Tryout berakhir"
                />

                <InputDateAndTime
                  heading="Tanggal Unlock Pembahasan"
                  setValue={setDateToUnlock}
                  value={dateToUnlock}
                  warning="Unlock Pembahasan"
                />
              </>
            )}

            <div
              id="line"
              className="my-[0] h-px w-full bg-main-gray-input"
            />

            <div className="flex w-full justify-between gap-4">
              <div
                className={`w-full cursor-pointer rounded-[.5rem] border border-main-gray-input py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${option === 'doc' && 'border-main bg-main text-white'}`}
                onClick={() => setOption('doc')}
              >
                Dokumen
              </div>
              <div
                className={`w-full cursor-pointer rounded-[.5rem] border border-main-gray-input py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${option === 'video' && 'border-main bg-main text-white'}`}
                onClick={() => setOption('video')}
              >
                Video
              </div>
            </div>

            {option === 'doc' && (
              <div id="thumbnail">
                <UploadFile
                  heading="Thumbnail Dokumen"
                  contentText="Pilih thumbnail untuk diupload (.jpg, max 5MB)"
                  inputId="thumbnailFile"
                  buttonText="Upload Thumbnail"
                  file={thumbnail}
                  image
                  setFile={setThumbnail}
                />
              </div>
            )}

            {option === 'video' && (
              <>
                <div id="thumbnail">
                  <UploadFile
                    heading="Thumbnail Dokumen"
                    contentText="Pilih thumbnail untuk diupload (.jpg, max 5MB)"
                    inputId="thumbnailFile"
                    buttonText="Upload Thumbnail"
                    file={thumbnail}
                    image
                    setFile={setThumbnail}
                  />
                </div>

                <div id="video">
                  <UploadFile
                    heading="Video"
                    contentText="Pilih video untuk diupload (.mp4, max 20mb)"
                    inputId="videoFile"
                    buttonText="Upload Video"
                    file={video}
                    setFile={setVideo}
                  />
                </div>

                <div
                  id="judul-video"
                  className="flex flex-col gap-[.5rem]"
                >
                  <p>
                    Judul Video{' '}
                    <span className="text-main-gray-text">(opsional)</span>
                  </p>
                  <input
                    type="text"
                    className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
                    placeholder="Masukan judul dokumen"
                    onChange={(e) => setVideoName(e.target.value)}
                    value={videoName}
                  />
                </div>
              </>
            )}

            <div
              id="action"
              className="mt-4 flex gap-4"
            >
              <button
                className="w-full rounded-[.5rem] border border-main-gray-input py-[.6rem] text-main-gray-text duration-300 hover:border-transparent hover:bg-main-hover hover:text-white"
                onClick={() => {
                  setShowAddDocument(false);
                }}
              >
                Batalkan
              </button>
              <button
                type="submit"
                className="w-full rounded-[.5rem] border border-main bg-main py-[.6rem] text-white"
                onClick={() => AddDokumen()}
              >
                Tambah material
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced UploadFile component with drag and drop
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
        className={`relative flex flex-col gap-4 rounded-3xl border-2 border-dashed p-4 transition-all duration-200 ${
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
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-main/20 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-main">
              <div className="text-3xl">📁</div>
              <p className="font-semibold">Lepaskan file di sini</p>
            </div>
          </div>
        )}

        {!image ? (
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

const InputText = ({
  heading,
  placeholder,
  setValue,
  value,
}: {
  heading: string;
  placeholder: string;
  setValue: any;
  value: string;
}) => {
  return (
    <div
      id="name-file"
      className="flex flex-col gap-[.5rem]"
    >
      <p>
        {heading} <span className="text-main-gray-text">(Try-Out)</span>
      </p>
      <input
        type="text"
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
        placeholder={`${placeholder}`}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
};

const InputDateAndTime = ({
  heading,
  setValue,
  value,
  warning,
}: {
  heading: string;
  setValue: any;
  value: string;
  warning: string;
}) => {
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (value !== '') {
      const date = getDateForInput(new Date(value));
      const time = getHours(new Date(value));
      setDate(date);
      setTime(time);
    }
  }, []);

  useEffect(() => {
    if (date || time) {
      if (date === '' || date === null) {
        setValue(`none-Masukan tanggal ${warning}`);
      } else if (time === '' || time === null) {
        setValue(`none-Masukan waktu ${warning}`);
      } else if (
        date !== '' ||
        (date !== null && time !== '') ||
        time !== null
      ) {
        setValue(`${date}T${time}`);
      }
    }
  }, [date, time]);

  return (
    <div
      id="name-file"
      className="flex flex-col gap-[.5rem]"
    >
      <p>
        {heading} <span className="text-main-gray-text">(Try-Out)</span>
      </p>
      <input
        type="date"
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
        onChange={(e) => setDate(e.target.value)}
        value={date ? date : ''}
      />
      <input
        type="time"
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
        onChange={(e) => setTime(e.target.value)}
        value={time ? time : ''}
      />
    </div>
  );
};

const InputTextarea = ({
  heading,
  placeholder,
  setValue,
  value,
}: {
  heading: string;
  placeholder: string;
  setValue: any;
  value: string;
}) => {
  return (
    <div
      id="name-file"
      className="flex flex-col gap-[.5rem]"
    >
      <p>
        {heading} <span className="text-main-gray-text">(Try-Out)</span>
      </p>
      <textarea
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
        placeholder={`${placeholder}`}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
};
