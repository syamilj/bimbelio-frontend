'use client';

import uploadFileImg from '@/_assets/icon/uploadDokumen.png';
import LoadingPage from '@/components/ui/Loading-Page';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';

import { MultiSelectVisibleAt } from '@/components/ui/multi-select-visibleAt';
import { LoadingPageStorage } from '@/components/ui/spinner';
import { getDateForInput, getHours } from '@/lib/utils';
import { storage } from '@/supabaseClient';
import { Category, Subcategory } from '@/types/database';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useProvider } from '../../provider';

export default function EditDocument() {
  const {
    showEditDocument,
    setShowEditDocument,
    useCatAndSubCat: { categoryAndSubCategory },
    editData,
    setEditData,
    useDocument: { fetchDocument },
  } = useProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [visibleAtWebSubIds, setVisibleAtWebSubIds] = useState<string[]>([]);

  const [file, setFile] = useState<File | undefined>();
  const [docxFile, setDocxFile] = useState<File | undefined>();
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string>('');
  const [video, setVideo] = useState<File | undefined>();
  const [videoName, setVideoName] = useState<string>('');
  const [option, setOption] = useState<'doc' | 'video'>('doc');
  const [category, setCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [premium, setPremium] = useState<boolean>(false);
  const [to, setTo] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<File | undefined>();

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

  // if (subCategoryData) {
  // }
  useEffect(() => {
    if (category.length === 0) return;
    fetchSubCategories(category);
  }, [category]);

  const editDocument = async (payload: {
    id: string;
    title: string;
    categoryId: string;
    subCategoryId: string;
    url: string;
    docxUrl?: string;
    isDocsChange: boolean;
    img: string;
    premium: boolean;
    titleVideo?: string;
    urlVideo?: string;
    visibleAtWebSubIds?: string[];
  }) => {
    await mutateGeneral('/document/editDocument', {
      payload,
      type: 'put',
      setLoading: setLoading,
      async onSuccess() {
        fetchDocument();
        await storage
          .from('dump-embedding')
          .remove([`${fileName || docxFile?.name}`]);
        setDocxFile(undefined);
        setVideo(undefined);
        setFile(undefined);
        setThumbnail(undefined);
      },
    });
  };

  useEffect(() => {
    if (editData) {
      console.log({ editData });
      setFileUrl(editData?.url);
      setFileName(editData?.title);
      setPremium(editData?.premium);
      setCategory(editData?.categoryId);
      setSubCategory(editData?.subCategoryId);
      if (editData?.visibleAtWebSubIds) {
        setVisibleAtWebSubIds(editData?.visibleAtWebSubIds || []);
      }
      if (editData?.video) {
        setVideoName(editData?.video?.title);
        setOption('video');
      } else {
        setVideoName('');
        setOption('doc');
      }
      if (editData?.dateTo) {
        setTo(true);
        // setDateTo(editData?.dateTo);
        setDescription(editData?.description);
        setToken(editData?.tokenTo);
        setDateTo(editData?.dateTo);
        // setDateToUnlock(getDateForInput(editData?.dateToUnlock));
        setDateToUnlock(editData?.dateToUnlock);
        // setHourToUnlock(editData?.hourToUnlock);
        // setDurationTo(editData?.durationTo);
      } else {
        setTo(false);
      }
    }
  }, [editData]);

  const EditDocument = async () => {
    try {
      setLoading(true);
      if (fileName === '') {
        setLoading(false);
        toaster({
          title: 'Upss',
          condition: 'warning',
          description: 'Pilih kategori dan subkategori!',
          duration: 2000,
        });
        return;
      }
      if (category === '' || subCategory === '') {
        setLoading(false);
        toaster({
          title: 'Upss',
          condition: 'warning',
          description: 'Pilih kategori dan subkategori!',
          duration: 2000,
        });
        return;
      }

      setLoadingTitle('[1/5] Mengupload PDF...');
      if (file) {
        await storage.from('pdf').remove([`document/${editData?.title}`]);
        await storage.from('pdf').upload(`document/${fileName}`, file);
      } else {
        await storage
          .from('pdf')
          .move(`document/${editData?.title}`, `document/${fileName}`);
      }
      setLoadingTitle('[2/5] Mengupload Thumbnail...');
      if (thumbnail) {
        await storage.from('img').remove([`document/${editData?.title}`]);
        await storage.from('img').upload(`document/${fileName}`, thumbnail);
      } else {
        await storage
          .from('img')
          .move(`document/${editData?.title}`, `document/${fileName}`);
      }

      setLoadingTitle('[3/5] Mengupload Video...');
      if (video && option === 'video') {
        console.log(editData?.video?.title, ' | ', videoName);
        const deleted = await storage
          .from('video')
          .remove([`document/${editData?.video?.title}`]);
        const data = await storage
          .from('video')
          .upload(`document/${videoName}`, video);
        console.log({ data, deleted });
      } else if (!video && option === 'video') {
        console.log(editData?.video?.title, ' | ', videoName);
        await storage
          .from('video')
          .move(`document/${editData?.video?.title}`, `document/${videoName}`);
      }

      setLoadingTitle('[4/5] Mengupload Docx...');
      if (option === 'doc' && editData?.video) {
        await storage
          .from('video')
          .remove([`document/${editData?.video?.title}`]);
      }

      setLoadingTitle('[5/5] Menyimpan Data...');
      await editDocument({
        id: editData?.id,
        title: fileName,
        categoryId: category,
        subCategoryId: subCategory,
        url: `${fileName}`,
        img: `${fileName}`,
        premium: premium,
        isDocsChange: file ? true : false,
        titleVideo:
          option === 'doc'
            ? undefined
            : videoName !== ''
              ? videoName
              : editData.video?.title,
        urlVideo:
          option === 'doc'
            ? undefined
            : videoName !== ''
              ? videoName
              : editData.video?.title,
        docxUrl: docxFile
          ? `${fileName !== '' ? fileName : docxFile?.name}`
          : undefined,
        visibleAtWebSubIds:
          visibleAtWebSubIds.length > 0 ? visibleAtWebSubIds : undefined,
      });
      setLoadingTitle('');
    } catch (error) {
      setLoading(false);
      setLoadingTitle('');
      return;
    }
  };

  return (
    <>
      {showEditDocument && (
        <div
          className="fixed left-0 top-0 z-49 h-full w-full"
          onClick={() => {
            setShowEditDocument(false);
            setEditData(null);
          }}
        />
      )}
      <div
        id="tambah-dokumen"
        className={`fixed top-0 z-50 flex flex-col h-full w-[480px] border-l border-gray-200 bg-white shadow-2xl duration-300 ${showEditDocument ? 'right-0' : 'right-[-500px]'} overflow-hidden`}
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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <div>
            <h1 className="text-base font-bold text-gray-900">Edit Material</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Perbarui informasi dokumen
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowEditDocument(false);
              setEditData(null);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-3xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-col gap-5 p-6 overflow-y-auto flex-1">
          <div className="flex flex-col gap-5 text-sm">
            <MultiSelectVisibleAt
              value={visibleAtWebSubIds}
              onValuesChange={setVisibleAtWebSubIds}
            />
            <div id="file">
              <UploadFile
                heading="Dokumen"
                contentText={
                  fileUrl
                    ? `${fileUrl}.pdf`
                    : 'Pilih dokumen untuk diupload (.pdf)'
                }
                inputId="editDocumentFile"
                buttonText="Ubah Dokumen"
                file={file}
                setFile={setFile}
              />
            </div>
            {file && (
              <div id="file">
                <UploadFile
                  heading="Docx (optional)"
                  contentText="Pilih docx untuk diupload (.pdf)"
                  inputId="editDocxFile"
                  buttonText="Upload md"
                  file={docxFile}
                  setFile={setDocxFile}
                />
              </div>
            )}
            {!to && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Judul Dokumen{' '}
                  <span className="normal-case text-gray-400 font-normal">
                    (opsional)
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-3xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-50 focus:border-main transition"
                  placeholder="Masukan judul dokumen"
                  onChange={(e) => setFileName(e.target.value)}
                  value={fileName}
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Akses
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPremium(false)}
                  className={`flex-1 py-2 rounded-3xl text-sm font-semibold border cursor-pointer transition ${
                    !premium
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  Free
                </button>
                <button
                  type="button"
                  onClick={() => setPremium(true)}
                  className={`flex-1 py-2 rounded-3xl text-sm font-semibold border cursor-pointer transition ${
                    premium
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  Premium
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Kategori
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categoryAndSubCategory?.category.map((item: any, i: any) => (
                  <button
                    type="button"
                    key={i}
                    className={`shrink-0 px-3 py-1.5 rounded-3xl text-xs font-semibold border cursor-pointer transition whitespace-nowrap ${
                      category === item.id
                        ? 'border-main bg-main text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setCategory(item.id);
                      setSubCategory('');
                      setTo(item.to);
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Subkategori
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {subCategoryData?.map((item: any, i: any) => (
                  <button
                    type="button"
                    key={i}
                    className={`shrink-0 px-3 py-1.5 rounded-3xl text-xs font-semibold border cursor-pointer transition whitespace-nowrap ${
                      subCategory === item.id
                        ? 'border-main bg-main text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSubCategory(item.id)}
                  >
                    {item.name}
                  </button>
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
                {/* <InputNumber
                  heading="Jam Unlock Pembahasan"
                  placeholder="Masukan jam (0-24)"
                  setValue={setHourToUnlock}
                  value={hourToUnlock}
                />
                <InputNumber
                  heading="Duration"
                  placeholder="Masukan duration (menit)"
                  setValue={setDurationTo}
                  value={durationTo}
                /> */}
              </>
            )}
            <div className="border-t border-gray-100" />

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Tipe Konten
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-3xl text-sm font-semibold border cursor-pointer transition ${
                    option === 'doc'
                      ? 'border-main bg-main text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                  onClick={() => setOption('doc')}
                >
                  Dokumen
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-3xl text-sm font-semibold border cursor-pointer transition ${
                    option === 'video'
                      ? 'border-main bg-main text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                  onClick={() => setOption('video')}
                >
                  Video
                </button>
              </div>
            </div>
            <div id="thumbnail">
              {fileName && (
                <UploadImage
                  heading="Thumbnail Dokumen"
                  inputId="editThumbnail"
                  file={thumbnail}
                  image
                  fileName={fileName}
                  setFile={setThumbnail}
                />
              )}
            </div>
            {option === 'video' && (
              <>
                <div id="video">
                  <UploadFile
                    heading="Video"
                    contentText={
                      videoName
                        ? videoName
                        : 'Pilih video untuk diupload (.mp4, max 20mb)'
                    }
                    inputId="videoFile"
                    buttonText="Ubah Video"
                    file={video}
                    setFile={setVideo}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Judul Video{' '}
                    <span className="normal-case text-gray-400 font-normal">
                      (opsional)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-3xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-50 focus:border-main transition"
                    placeholder="Masukan judul video"
                    onChange={(e) => setVideoName(e.target.value)}
                    value={videoName}
                  />
                </div>
              </>
            )}
            <div className="border-t border-gray-100 pt-4 flex gap-3">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-3xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                onClick={() => {
                  setShowEditDocument(false);
                  setEditData(null);
                }}
              >
                Batalkan
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-3xl bg-main text-white text-sm font-semibold hover:opacity-90 transition"
                onClick={() => EditDocument()}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const UploadImage = ({ file, setFile, heading, inputId, fileName }: any) => {
  const [previewHover, setPreviewHover] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    setPreviewImage('');
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewImage(
        `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/document/${fileName}`,
      );
    }
  }, [file]);

  return (
    <div className="relative">
      <p className="mb-[.5rem] ml-[.5rem] text-[.9rem] font-medium">
        {heading}
      </p>
      <input
        id={`${inputId}`}
        type="file"
        onChange={(e: any) => {
          setFile(e.target.files[0]);
        }}
        className="absolute right-0 top-0 h-0 w-0"
      />
      <div className="relative flex flex-col gap-4 rounded-3xl border-2 border-dashed border-main-gray-input p-4">
        {!previewImage ? (
          <>
            {/* <div className={`relative ${previewHover ? 'z-4' : 'z-6'}`}>
              <Image
                src={previewImage}
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
            </div> */}
            <div className="absolute left-0 top-0 z-5 flex h-full w-full items-center justify-center bg-[#ffffffc4] p-4">
              <div
                className="flex h-full w-full items-center justify-center"
                onClick={() => {
                  document.getElementById(`${inputId}`)?.click();
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
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={`relative ${previewHover ? 'z-4' : 'z-6'}`}>
              <Image
                src={previewImage}
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
                className="flex h-full w-full items-center justify-center"
                onClick={() => {
                  document.getElementById(`${inputId}`)?.click();
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
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const UploadFile = ({
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

  return (
    <div className="relative">
      <p className="mb-[.5rem] ml-[.5rem] text-[.9rem] font-medium">
        {heading}
      </p>
      <input
        id={`${inputId}`}
        type="file"
        onChange={(e: any) => setFile(e.target.files[0])}
        className="absolute right-0 top-0 h-0 w-0"
      />
      <div className="relative flex flex-col gap-3 rounded-3xl border-2 border-dashed border-gray-200 p-4 hover:border-gray-300 transition">
        {!image ? (
          <>
            <div className="flex flex-col items-center gap-2 text-center">
              <Image
                src={uploadFileImg}
                alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
              />
              <p className="text-xs text-gray-500">
                {!file ? contentText : file.name}
              </p>
            </div>
            <button
              type="button"
              className="w-full rounded-3xl border border-dashed border-gray-300 py-2 text-xs font-medium text-gray-500 hover:border-main hover:text-main hover:bg-blue-50 transition"
              onClick={() => {
                document.getElementById(`${inputId}`)?.click();
              }}
            >
              {buttonText}
            </button>
          </>
        ) : (
          <>
            {!previewImage ? (
              <>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Image
                    src={uploadFileImg}
                    alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
                  />
                  <p className="text-xs text-gray-500">
                    {!file ? contentText : file.name}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full rounded-3xl border border-dashed border-gray-300 py-2 text-xs font-medium text-gray-500 hover:border-main hover:text-main hover:bg-blue-50 transition"
                  onClick={() => {
                    document.getElementById(`${inputId}`)?.click();
                  }}
                >
                  {buttonText}
                </button>
              </>
            ) : (
              <>
                <div className={`relative ${previewHover ? 'z-4' : 'z-6'}`}>
                  <Image
                    src={previewImage}
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
                    className="flex h-full w-full items-center justify-center"
                    onClick={() => {
                      document.getElementById(`${inputId}`)?.click();
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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {heading}{' '}
        <span className="normal-case text-gray-400 font-normal">(Try-Out)</span>
      </label>
      <input
        type="text"
        className="w-full rounded-3xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-50 focus:border-main transition"
        placeholder={placeholder}
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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {heading}{' '}
        <span className="normal-case text-gray-400 font-normal">(Try-Out)</span>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          className="w-full rounded-3xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-50 focus:border-main transition"
          onChange={(e) => setDate(e.target.value)}
          value={date ? date : ''}
        />
        <input
          type="time"
          className="w-full rounded-3xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-50 focus:border-main transition"
          onChange={(e) => setTime(e.target.value)}
          value={time ? time : ''}
        />
      </div>
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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {heading}{' '}
        <span className="normal-case text-gray-400 font-normal">(Try-Out)</span>
      </label>
      <textarea
        rows={3}
        className="w-full rounded-3xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-50 focus:border-main transition resize-none"
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
};
