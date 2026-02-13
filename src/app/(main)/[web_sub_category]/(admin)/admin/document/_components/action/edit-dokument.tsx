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
        className={`fixed top-0 z-50 h-full w-[400px] border border-main-gray-input bg-white duration-300 ${showEditDocument ? 'right-0' : 'right-[-420px]'} overflow-y-auto`}
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
          <h1 className="text-[1.2rem] font-semibold">Edit Material</h1>
          <div className="flex flex-col gap-4 text-[.9rem] font-medium">
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
                  className="font-regular w-full rounded-3xl border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
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
                    className={`w-full cursor-pointer rounded-3xl border border-main-gray-input py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${!premium && 'border-main bg-main text-white'}`}
                    onClick={() => setPremium(false)}
                  >
                    Free
                  </div>
                </div>
                <div className="flex w-full justify-between gap-4">
                  <div
                    className={`w-full cursor-pointer rounded-3xl border border-main-gray-input py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${premium && 'border-main bg-main text-white'}`}
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
                {categoryAndSubCategory?.category.map((item: any, i: any) => (
                  <div
                    key={i}
                    className={`w-fit shrink-0 cursor-pointer rounded-3xl border border-main-gray-input px-4 py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${category === item.id && 'border-main bg-main text-white'}`}
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
                    className={`w-fit shrink-0 cursor-pointer rounded-3xl border border-main-gray-input px-4 py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${subCategory === item.id && 'border-main bg-main text-white'}`}
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
            <div
              id="line"
              className="my-[0] h-px w-full bg-main-gray-input"
            />

            <div className="flex w-full justify-between gap-4">
              <div
                className={`w-full cursor-pointer rounded-3xl border border-main-gray-input py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${option === 'doc' && 'border-main bg-main text-white'}`}
                onClick={() => setOption('doc')}
              >
                Dokumen
              </div>
              <div
                className={`w-full cursor-pointer rounded-3xl border border-main-gray-input py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${option === 'video' && 'border-main bg-main text-white'}`}
                onClick={() => setOption('video')}
              >
                Video
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
                    className="font-regular w-full rounded-3xl border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
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
                className="w-full rounded-3xl border border-main-gray-input py-[.6rem] text-main-gray-text duration-300 hover:border-transparent hover:bg-main-hover hover:text-white"
                onClick={() => {
                  setShowEditDocument(false);
                  setEditData(null);
                }}
              >
                Batalkan
              </button>
              <button
                type="submit"
                className="w-full rounded-3xl border border-main bg-main py-[.6rem] text-white"
                onClick={() => {
                  EditDocument();
                }}
              >
                Edit material
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
      <div className="relative flex flex-col gap-4 rounded-3xl border-2 border-dashed border-main-gray-input p-4">
        {!image ? (
          <>
            <div className="flex flex-col items-center gap-[.5rem] text-center">
              <Image
                src={uploadFileImg}
                alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
              />
              <p className="text-[.8rem] text-main-gray-text">
                {!file ? `${contentText}` : `${file.name}`}
              </p>
            </div>
            <button
              className="w-full rounded-3xl border border-main-gray-input py-[.5rem] text-[.8rem] text-main-gray-text duration-300 hover:border-main hover:bg-main hover:text-white active:bg-main-hover"
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
                <div className="flex flex-col items-center gap-[.5rem] text-center">
                  <Image
                    src={uploadFileImg}
                    alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
                  />
                  <p className="text-[.8rem] text-main-gray-text">
                    {!file ? `${contentText}` : `${file.name}`}
                  </p>
                </div>
                <button
                  className="w-full rounded-3xl border border-main-gray-input py-[.5rem] text-[.8rem] text-main-gray-text duration-300 hover:border-main hover:bg-main hover:text-white active:bg-main-hover"
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
    <div
      id="name-file"
      className="flex flex-col gap-[.5rem]"
    >
      <p>
        {heading} <span className="text-main-gray-text">(Try-Out)</span>
      </p>
      <input
        type="text"
        className="font-regular w-full rounded-3xl border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
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
        className="font-regular w-full rounded-3xl border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
        onChange={(e) => setDate(e.target.value)}
        value={date ? date : ''}
      />
      <input
        type="time"
        className="font-regular w-full rounded-3xl border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
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
        className="font-regular w-full rounded-3xl border border-main-gray-input px-4 py-[.5rem] text-black outline-none"
        placeholder={`${placeholder}`}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
};
