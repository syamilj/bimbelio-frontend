'use client';

import uploadFileImg from '@/_assets/icon/uploadDokumen.png';
import LoadingPage from '@/components/ui/Loading-Page';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';

import { getDateForInput, getHours } from '@/lib/utils';
import { supabase } from '@/supabaseClient';
import { Category, Subcategory } from '@/types/database';
import Cookies from 'js-cookie';
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

  const [file, setFile] = useState<File | undefined>();
  const [docxUrl, setDocxUrl] = useState<File | undefined>();
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string>('');
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
    dateTo?: string;
    dateToUnlock?: string;
    description?: string;
    tokenTo?: string;
  }) => {
    await mutateGeneral('/document/editDocument', {
      payload,
      type: 'put',
      setLoading: setLoading,
      async onSuccess() {
        fetchDocument();
        await supabase.storage
          .from('dump-embedding')
          .remove([`${fileName || docxUrl?.name}`]);
        setDocxUrl(undefined);
      },
    });
  };

  useEffect(() => {
    if (editData) {
      setFileUrl(editData?.url);
      setFileName(editData?.title);
      setPremium(editData?.premium);
      setCategory(editData?.categoryId);
      setSubCategory(editData?.subCategoryId);
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
      if (!to) {
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
      } else {
        if (subCategory === '' || category === '') {
          setLoading(false);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Pilih kategori dan subkategori!',
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
            description: 'Masukan tanggal unlock try out!',
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
        // if (hourToUnlock === 0) {
        //   setLoading(false);
        //   toaster({
        //     title: 'Upss',
        //     condition: 'warning',
        //     description: 'Masukan jam unlock try out!',
        //     duration: 2000,
        //   });
        //   return;
        // }
        // if (durationTo === 0) {
        //   setLoading(false);
        //   toaster({
        //     title: 'Upss',
        //     condition: 'warning',
        //     description: 'Masukan jam unlock try out!',
        //     duration: 2000,
        //   });
        //   return;
        // }
      }
      if (fileName != `${editData?.title}`) {
        let response;
        let fileData;
        if (!file) {
          response = await fetch(
            `${env.NEXT_PUBLIC_API_URL}/document/pdf?title=${editData?.title}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
                'Content-Type': 'application/json',
              },
            },
          );
          if (!response.ok) {
            toaster({
              title: 'Gagal',
              description: `${response?.statusText}`,
              condition: 'warning',
            });
            setLoading(false);
            return;
          }
          fileData = await response.blob();
        } else {
          fileData = file;
        }
        const response2 = await fetch(
          `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/${editData?.title}`,
        );
        if (!response2.ok) {
          toaster({
            title: 'Gagal',
            description: `${response2?.statusText}`,
            condition: 'warning',
          });
          setLoading(false);
          return;
        }
        const imgData = await response2.blob();
        const { data: saveNewPdf, error: errorSaveNewPdf } =
          await supabase.storage.from('pdf').upload(fileName, fileData);
        const { data: saveNewImg, error: errorSaveNewImg } =
          await supabase.storage
            .from('img')
            .upload(fileName, !thumbnail ? imgData : thumbnail);
        if (saveNewPdf && saveNewImg) {
          await supabase.storage.from('pdf').remove([`${editData?.title}`]);
          await supabase.storage.from('img').remove([`${editData?.title}`]);
          if (!to) {
            await editDocument({
              id: editData?.id,
              title: fileName,
              categoryId: category,
              subCategoryId: subCategory,
              url: `${fileName}`,
              img: `${fileName}`,
              premium: premium,
              isDocsChange: file ? true : false,
            });
          } else {
            await editDocument({
              id: editData?.id,
              title: fileName,
              categoryId: category,
              subCategoryId: subCategory,
              url: `${fileName}`,
              img: `${fileName}`,
              premium: premium,
              dateTo,
              dateToUnlock,
              description,
              tokenTo: token,
              isDocsChange: file ? true : false,
              // hourToUnlock: parseInt(`${hourToUnlock}`),
              // durationTo: parseInt(`${durationTo}`),
            });
          }
        }
        if (errorSaveNewPdf) {
          toaster({
            title: 'Gagal',
            description: `${errorSaveNewPdf?.message}`,
            condition: 'warning',
          });
          setLoading(false);
        }
        if (errorSaveNewImg) {
          toaster({
            title: 'Gagal',
            description: `${errorSaveNewPdf?.message}`,
            condition: 'warning',
          });
          setLoading(false);
        }
      } else {
        if (!thumbnail) {
          if (file) {
            const { error: errorSaveNewPdf } = await supabase.storage
              .from('pdf')
              .update(`document/${fileName}`, file, {
                cacheControl: '3600',
                upsert: true,
              });
            if (errorSaveNewPdf) {
              toaster({
                title: 'Gagal',
                description: `${errorSaveNewPdf?.message}`,
                condition: 'warning',
              });
              setLoading(false);
              return;
            }
          }
          if (docxUrl) {
            const { error: mdError } = await supabase.storage
              .from('dump-embedding')
              .upload(`${fileName || docxUrl.name}`, docxUrl);

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
          if (!to) {
            await editDocument({
              id: editData?.id,
              title: fileName,
              categoryId: category,
              subCategoryId: subCategory,
              url: `${fileName}`,
              img: `${fileName}`,
              premium: premium,
              isDocsChange: file ? true : false,
              docxUrl: docxUrl
                ? `${fileName !== '' ? fileName : docxUrl.name}`
                : undefined,
            });
          } else {
            await editDocument({
              id: editData?.id,
              title: fileName,
              categoryId: category,
              subCategoryId: subCategory,
              url: `${fileName}`,
              img: `${fileName}`,
              premium: premium,
              dateTo,
              dateToUnlock,
              description,
              tokenTo: token,
              isDocsChange: file ? true : false,
              docxUrl: docxUrl
                ? `${fileName !== '' ? fileName : docxUrl.name}`
                : undefined,
              // hourToUnlock: parseInt(`${hourToUnlock}`),
              // durationTo: parseInt(`${durationTo}`),
            });
          }
        } else {
          if (file) {
            const { error: errorSaveNewPdf } = await supabase.storage
              .from('pdf')
              .update(`document/${fileName}`, file, {
                cacheControl: '3600',
                upsert: true,
              });
            if (errorSaveNewPdf) {
              toaster({
                title: 'Gagal',
                description: `${errorSaveNewPdf?.message}`,
                condition: 'warning',
              });
              setLoading(false);
              return;
            }
          }
          if (docxUrl) {
            const { error: mdError } = await supabase.storage
              .from('dump-embedding')
              .upload(`${fileName || docxUrl.name}`, docxUrl);

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
          const { error: errorUpdateImg } = await supabase.storage
            .from('img')
            .update(`document/${fileName}`, thumbnail, {
              cacheControl: '3600',
              upsert: true,
            });
          if (errorUpdateImg) {
            toaster({
              title: 'Gagal',
              description: `${errorUpdateImg?.message}`,
              condition: 'warning',
            });
            setLoading(false);
            return;
          }
          if (!to) {
            await editDocument({
              id: editData?.id,
              title: fileName,
              categoryId: category,
              subCategoryId: subCategory,
              url: `${fileName}`,
              img: `${fileName}`,
              premium: premium,
              isDocsChange: file ? true : false,
              docxUrl: docxUrl
                ? `${fileName !== '' ? fileName : docxUrl.name}`
                : undefined,
            });
          } else {
            await editDocument({
              id: editData?.id,
              title: fileName,
              categoryId: category,
              subCategoryId: subCategory,
              url: `${fileName}`,
              img: `${fileName}`,
              premium: premium,
              dateTo,
              dateToUnlock,
              description,
              tokenTo: token,
              isDocsChange: file ? true : false,
              docxUrl: docxUrl
                ? `${fileName !== '' ? fileName : docxUrl.name}`
                : undefined,
              // hourToUnlock: parseInt(`${hourToUnlock}`),
              // durationTo: parseInt(`${durationTo}`),
            });
          }
        }
      }
      return;
    } catch (error) {
      setLoading(false);
      return;
    }
  };

  return (
    <>
      {showEditDocument && (
        <div
          className="fixed left-0 top-0 z-[49] h-full w-full"
          onClick={() => {
            setShowEditDocument(false);
            setEditData(null);
          }}
        />
      )}
      <div
        id="tambah-dokumen"
        className={`fixed top-0 z-[50] h-full w-[400px] border border-main-gray-input bg-white duration-300 ${showEditDocument ? 'right-0' : 'right-[-420px]'} overflow-y-auto`}
      >
        {loading && <LoadingPage />}
        <div className="flex flex-col gap-[1rem] p-[2rem]">
          <h1 className="text-[1.2rem] font-semibold">Edit Material</h1>
          <div className="flex flex-col gap-[1rem] text-[.9rem] font-medium">
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
                  file={docxUrl}
                  setFile={setDocxUrl}
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
                  className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-black outline-none"
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
              <div className="flex w-full justify-between gap-[1rem]">
                <div className="flex w-full justify-between gap-[1rem]">
                  <div
                    className={`w-full cursor-pointer rounded-[.5rem] border border-main-gray-input py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${!premium && 'border-main bg-main text-white'}`}
                    onClick={() => setPremium(false)}
                  >
                    Free
                  </div>
                </div>
                <div className="flex w-full justify-between gap-[1rem]">
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
                className="flex w-full justify-start gap-[1rem] overflow-y-auto pb-[.5rem]"
              >
                {categoryAndSubCategory?.category.map((item: any, i: any) => (
                  <div
                    key={i}
                    className={`w-fit shrink-0 cursor-pointer rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${category === item.id && 'border-main bg-main text-white'}`}
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
              <div className="flex w-full justify-between gap-[1rem]">
                {subCategoryData?.map((item: any, i: any) => (
                  <div
                    key={i}
                    className={`w-full cursor-pointer rounded-[.5rem] border border-main-gray-input py-[.5rem] text-center text-main-gray-text duration-200 hover:border-transparent hover:bg-main-hover hover:text-white ${subCategory === item.id && 'border-main bg-main text-white'}`}
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
            <div
              id="action"
              className="mt-[1rem] flex gap-[1rem]"
            >
              <button
                className="w-full rounded-[.5rem] border border-main-gray-input py-[.6rem] text-main-gray-text duration-300 hover:border-transparent hover:bg-main-hover hover:text-white"
                onClick={() => {
                  setShowEditDocument(false);
                  setEditData(null);
                }}
              >
                Batalkan
              </button>
              <button
                type="submit"
                className="w-full rounded-[.5rem] border border-main bg-main py-[.6rem] text-white"
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
      <div className="relative flex flex-col gap-[1rem] rounded-[1rem] border-2 border-dashed border-main-gray-input p-[1rem]">
        {!previewImage ? (
          <>
            {/* <div className={`relative ${previewHover ? 'z-[4]' : 'z-[6]'}`}>
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
            <div className="absolute left-0 top-0 z-[5] flex h-full w-full items-center justify-center bg-[#ffffffc4] p-[1rem]">
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
            <div className={`relative ${previewHover ? 'z-[4]' : 'z-[6]'}`}>
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
            <div className="absolute left-0 top-0 z-[5] flex h-full w-full items-center justify-center bg-[#ffffffc4] p-[1rem]">
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
      <div className="relative flex flex-col gap-[1rem] rounded-[1rem] border-2 border-dashed border-main-gray-input p-[1rem]">
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
              className="w-full rounded-[.5rem] border border-main-gray-input py-[.5rem] text-[.8rem] text-main-gray-text duration-300 hover:border-main hover:bg-main hover:text-white active:bg-main-hover"
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
                  className="w-full rounded-[.5rem] border border-main-gray-input py-[.5rem] text-[.8rem] text-main-gray-text duration-300 hover:border-main hover:bg-main hover:text-white active:bg-main-hover"
                  onClick={() => {
                    document.getElementById(`${inputId}`)?.click();
                  }}
                >
                  {buttonText}
                </button>
              </>
            ) : (
              <>
                <div className={`relative ${previewHover ? 'z-[4]' : 'z-[6]'}`}>
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
                <div className="absolute left-0 top-0 z-[5] flex h-full w-full items-center justify-center bg-[#ffffffc4] p-[1rem]">
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
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-black outline-none"
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
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-black outline-none"
        onChange={(e) => setDate(e.target.value)}
        value={date ? date : ''}
      />
      <input
        type="time"
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-black outline-none"
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
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-black outline-none"
        placeholder={`${placeholder}`}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
};
