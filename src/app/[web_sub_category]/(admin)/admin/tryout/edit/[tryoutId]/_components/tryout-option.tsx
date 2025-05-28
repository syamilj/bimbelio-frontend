'use client';

import { useEditTryoutContext } from '@/app/[web_sub_category]/(admin)/admin/tryout/_component/provider-edit-tryout';
import { InputImage } from '@/components/ui/input-image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response, responseError } from '@/lib/response';
import { cn } from '@/lib/utils';
import {
  IconDown,
  IconFullscreen,
  IconMinimizeScreen,
  IconUp,
} from '@/styles/icon';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ModalDeleteTryout from './modal-delete-tryout';
// import Image from 'next/image';
// import { env } from '@/env.mjs';
// import { supabase } from '@/servers/supabase/supabaseClient';

const TryoutOption = () => {
  const {
    tryout,
    sessions,
    setSessions,
    setTryout,
    startDate,
    setStartDate,
    startDateTime,
    setStartDateTime,
    endDate,
    setEndDate,
    endDateTime,
    setEndDateTime,
    resultDate,
    setResultDate,
    resultDateTime,
    setResultDateTime,
    currentIndexEdit,
    setCurrentIndexEdit,
    setQuestionIndex,
    setAssesmentType,
  } = useEditTryoutContext();

  const router = useRouter();

  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const [dateTryoutHeight, setDateTryoutHeight] = useState<number>(0);
  const [showDateTryout, setShowDateTryout] = useState<boolean>(true);
  const [prevIndexEdit, setPrevIndexEdit] = useState<number | null>(null);

  const [loadingDeleteTryout, setIsLoadingDeleteTryout] =
    useState<boolean>(false);

  const deleteTryout = async ({ id }: { id: string }) => {
    try {
      setIsLoadingDeleteTryout(true);
      const res = await axiosInstance.delete(`/tryout/deleteTryout?id=${id}`);
      router.push(`/${website_sub_category_id}/admin/try-out`);
      return response(res, true);
    } catch (error) {
      return responseError(error, true);
    } finally {
      setIsLoadingDeleteTryout(false);
    }
  };

  const addSesi = () => {
    setSessions((prev) => {
      return [
        ...prev,
        {
          categoryId: '',
          name: '',
          description: '',
          duration: 0,
          thresholdValue: 0,
          assessmentType: '1-5',
          Questions: [],
        },
      ];
    });
  };

  const handleDeleteTryout = () => {
    if (tryout?.id) {
      deleteTryout({ id: tryout?.id });
    }
    return;
  };

  return (
    <div className="flex w-full flex-col gap-[1rem] p-[1rem] text-[.9rem]">
      <ModalDeleteTryout
        isLoading={loadingDeleteTryout}
        open={openDelete}
        setOpen={setOpenDelete}
        onClick={handleDeleteTryout}
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[1rem]">
          <h1 className="text-[1.2rem] font-medium">Detail Try out</h1>
          {currentIndexEdit !== null ? (
            <div
              className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
              onClick={() => {
                setCurrentIndexEdit(null);
                if (currentIndexEdit !== null)
                  setPrevIndexEdit(currentIndexEdit);
              }}
            >
              <IconFullscreen w={15} />
            </div>
          ) : (
            <div
              className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
              onClick={() => {
                if (prevIndexEdit !== null) setCurrentIndexEdit(prevIndexEdit);
                else setCurrentIndexEdit(0);
              }}
            >
              <IconMinimizeScreen w={15} />
            </div>
          )}
        </div>
        <div
          className="cursor-pointer text-main-gray-text duration-300 md:hover:text-black"
          onClick={() => {
            const div = document.querySelector(
              '#tryout-admin #date',
            ) as HTMLDivElement;
            if (div) {
              if (div.clientHeight !== 0) {
                div.style.height = `${div.clientHeight}px`;
                setDateTryoutHeight(div.clientHeight);
                setShowDateTryout(false);
              } else {
                setShowDateTryout(true);
              }
              div.style.height =
                div.clientHeight === 0 ? `${dateTryoutHeight}px` : '0px';
              div.style.overflow = 'hidden';
              div.style.transition = 'height 0.3s ease';
            }
          }}
        >
          {showDateTryout ? <IconUp /> : <IconDown />}
        </div>
      </div>
      <div
        id="date"
        className="flex flex-col gap-[1rem]"
      >
        <div className="flex flex-col gap-[.5rem]">
          <p className="font-medium">Judul tryout</p>
          <input
            type="text"
            placeholder="Judul try out"
            className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
            required
            value={tryout?.title ? tryout?.title : ''}
            onChange={(e) => {
              setTryout((prev) => ({ ...prev, title: e.target.value }));
            }}
          />
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col gap-[.5rem]">
            <p className="font-medium">Thumbnail</p>
            <InputImage
              preview={
                tryout?.image && tryout.image !== ''
                  ? `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/tryout/${tryout?.image}`
                  : undefined
              }
              onChange={async (image) => {
                const imageNow = tryout?.image;
                if (!image) return;
                const filename = `tryout-${crypto.randomUUID()}`;
                const upload = await supabase?.storage
                  .from('img')
                  .upload(`tryout/${filename}`, image);

                // .upload(`tryout/${filename}`, image);

                if (upload?.data) {
                }
                if (upload?.error) {
                  if (upload.error.message === 'The resource already exists') {
                    const update = await supabase?.storage
                      .from('img')
                      .update(`tryout/${filename}`, image);
                    if (update?.data) {
                    }
                    if (update?.error) {
                    }
                  }
                }

                if (imageNow) {
                  await supabase.storage
                    .from('img')
                    .remove([`tryout/${imageNow}`]);
                }

                setTryout((prev) => ({ ...prev, image: filename }));
              }}
            />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-[.5rem]">
              <p className="font-medium">
                Postingan Instagram{' '}
                <span className="text-gray-500">(optional)</span>
              </p>
              <input
                type="text"
                placeholder="Link postingan instagram"
                className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
                value={tryout?.instagram ? tryout?.instagram : ''}
                onChange={(e) => {
                  setTryout((prev) => ({ ...prev, instagram: e.target.value }));
                }}
              />
            </div>
            {/* <div className="flex flex-col gap-[.5rem]">
              <p className="font-medium">
                Postingan Tiktok{' '}
                <span className="text-gray-500">(optional)</span>
              </p>
              <input
                type="text"
                placeholder="Link postingan tiktok"
                className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
                value={tryout?.tiktok ? tryout?.tiktok : ''}
                onChange={(e) => {
                  setTryout((prev) => ({ ...prev, tiktok: e.target.value }));
                }}
              />
            </div> */}
          </div>
        </div>
        <div className="flex flex-col gap-[.5rem]">
          <p className="font-medium">Waktu mulai tryout</p>
          <div className="grid w-full grid-cols-2 gap-[1rem]">
            <input
              type="date"
              placeholder="Judul try out"
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
              required
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
            <input
              type="time"
              placeholder="Judul try out"
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
              required
              value={startDateTime}
              onChange={(e) => {
                setStartDateTime(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[.5rem]">
          <p className="font-medium">Pelaksanaan berakhir</p>
          <div className="grid w-full grid-cols-2 gap-[1rem]">
            <input
              type="date"
              placeholder="Judul try out"
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
              required
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
            <input
              type="time"
              placeholder="Judul try out"
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
              required
              value={endDateTime}
              onChange={(e) => {
                setEndDateTime(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[.5rem]">
          <p className="font-medium">Waktu pembagian hasil tryout</p>
          <div className="grid w-full grid-cols-2 gap-[1rem]">
            <input
              type="date"
              placeholder="Judul try out"
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
              required
              value={resultDate}
              onChange={(e) => {
                setResultDate(e.target.value);
              }}
            />
            <input
              type="time"
              placeholder="Judul try out"
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
              required
              value={resultDateTime}
              onChange={(e) => {
                setResultDateTime(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      {/* <div id="thumbnail" className="w-[300px]">
        <UploadImage
          heading="Thumbnail Tryout"
          inputId="tryoutThumbnail"
          file={thumbnail}
          image
          fileName={thumbnailName}
          setFile={setThumbnail}
        />
      </div> */}
      <div className="my-[1rem] h-[1px] w-full bg-main-gray-disabled/60" />
      <div
        id="session"
        className="flex flex-col gap-[.5rem]"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-[1.1rem] font-medium">Sesi Tryout</h1>
          <div
            className="cursor-pointer rounded-[.8rem] bg-main px-[1rem] py-[.8rem] text-white duration-300  hover:bg-main/85 md:active:bg-main"
            onClick={addSesi}
          >
            Tambah sesi
          </div>
        </div>
        {sessions?.map((item, sessionIndex: number) => (
          <div
            key={sessionIndex}
            className="flex w-full gap-[1rem]"
          >
            <div className="overflow-visible rounded-[.8rem] border border-transparent bg-white duration-300 md:hover:shadow-default">
              <input
                type="text"
                defaultValue={`${sessionIndex + 1}`}
                required
                className="absolute bottom-0 left-[1rem] h-1 w-1 p-0 text-transparent outline-none"
              />
              <Select
                value={`${sessionIndex + 1}`}
                onValueChange={(value) => {
                  const fixValue = parseInt(value) - 1;

                  const currentSessions = [...sessions];

                  const [movedSession] = currentSessions.splice(
                    sessionIndex,
                    1,
                  );

                  currentSessions.splice(fixValue, 0, movedSession);

                  setSessions([...currentSessions]);
                }}
              >
                <SelectTrigger className="h-full min-w-[63px] rounded-[.8rem] border-none bg-white shadow-none outline-none">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="placeholder"
                    disabled
                  >
                    Urutan Sesi
                  </SelectItem>
                  {Array.from({ length: sessions.length }).map((_, index) => (
                    <SelectItem
                      key={index}
                      value={`${index + 1}`}
                    >
                      {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full items-center justify-between rounded-[.8rem] bg-white px-[1rem] py-[.8rem]">
              {item.categoryId !== '' ? (
                <div className="flex items-center">
                  <div className="rounded-[1rem] bg-main px-[.5rem] py-[.2rem] text-[.8rem] text-white">
                    <p>
                      {item.category === 'Tes Potensi Skolastik (TPS)' && 'TPS'}
                      {item.category === 'Tes Literasi Bahasa' && 'Literasi'}
                      {item.category === 'Tes Penalaran Matematika' &&
                        'Matematika'}
                    </p>
                  </div>
                  <div className="rounded-[1rem] bg-main-gray-input2 px-[.5rem] py-[.2rem] text-[.8rem] text-black ml-2">
                    <p>{item.subCategory}</p>
                  </div>
                </div>
              ) : (
                <p>.....</p>
              )}
              <p>{item.Questions ? item.Questions.length : 0} soal</p>
              <p>{item.duration === '' ? 0 : item.duration} menit</p>
            </div>
            <div
              className="shrink-0 cursor-pointer px-[1rem] py-[.8rem] text-main-gray-text duration-300 md:hover:text-black"
              onClick={() => {
                setCurrentIndexEdit(sessionIndex);
                setQuestionIndex(0);
                if (item.assessmentType) setAssesmentType(item.assessmentType);
              }}
            >
              Edit
            </div>
          </div>
        ))}
        <div className="flex w-full items-center gap-[1rem]">
          <div className="flex w-full items-center justify-between py-[.8rem] font-medium">
            Waktu istirahat (menit)
          </div>
          <input
            type="number"
            placeholder="Durasi istirahat"
            className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
            value={tryout?.restTime ? tryout?.restTime : ''}
            onChange={(e) => {
              setTryout((prev) => ({
                ...prev,
                restTime: parseInt(e.target.value),
              }));
            }}
          />
        </div>
      </div>
      <div className="my-[1rem] h-[1px] w-full bg-main-gray-disabled/60" />
      <button
        type="button"
        className={cn(
          'flex w-full shrink-0 cursor-pointer items-center justify-center rounded-[.8rem] bg-red-100 py-[.8rem] font-medium text-red-700 duration-300 md:hover:bg-red-200 md:active:bg-red-100',
          loadingDeleteTryout && 'cursor-default md:hover:bg-red-100',
        )}
        onClick={() => {
          localStorage.removeItem(`temporary-edit-tryout-${tryout?.id}`);
          window.location.reload();
        }}
      >
        Reset Temporary Data
      </button>
      <div className="grid w-full grid-cols-2 gap-[1rem]">
        <div
          className={cn(
            'flex w-full shrink-0 cursor-pointer items-center justify-center rounded-[.8rem] bg-red-100 py-[.8rem] font-medium text-red-700 duration-300 md:hover:bg-red-200 md:active:bg-red-100',
            loadingDeleteTryout && 'cursor-default md:hover:bg-red-100',
          )}
          onClick={() => setOpenDelete(true)}
        >
          Hapus
        </div>
        {/* <select className="outline-none rounded-[.8rem] px-[1rem] py-[.8rem] w-full border border-transparent focus:shadow-default md:hover:shadow-default duration-300 " required value={tryout?.status ? tryout?.status : ""} onChange={(e) => {
                    setTryout((prev) => ({ ...prev, status: e.target.value as "PUBLIC" | "PRIVATE" | "DRAFT" }))
                }}>
                    <option value="">Status</option>
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="PRIVATE">PRIVATE</option>
                    <option value="DRAFT">DRAFT</option>
                </select> */}
        <div className="relative w-full overflow-visible rounded-[.8rem] border border-transparent bg-white duration-300 md:hover:shadow-default">
          <input
            type="text"
            defaultValue={tryout?.status ? `${tryout?.status}` : ''}
            required
            className="absolute bottom-0 left-[1rem] h-1 w-1 p-0 text-transparent outline-none"
          />
          <Select
            value={tryout?.status ? `${tryout?.status}` : 'placeholder'}
            onValueChange={(value) => {
              if (value)
                setTryout((prev) => ({
                  ...prev,
                  status: value as 'PUBLIC' | 'PRIVATE' | 'DRAFT',
                }));
            }}
          >
            <SelectTrigger className="h-full w-full rounded-[.8rem] border-none bg-white shadow-none outline-none">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="placeholder"
                disabled
              >
                Status
              </SelectItem>
              <SelectItem value="PUBLIC">PUBLIC</SelectItem>
              <SelectItem value="PRIVATE">PRIVATE</SelectItem>
              <SelectItem value="DRAFT">DRAFT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex h-[45px] w-full items-center justify-center">
        <button
          type="submit"
          className="h-full w-full rounded-[.8rem] bg-main text-white duration-300  hover:bg-main/85 md:active:bg-main"
        >
          Edit Tryout
        </button>
        {/* {isLoading ? (
          <Loader2 className="h-[1.5rem] w-[1.5rem] animate-spin" />
        ) : (
          <button
            type="submit"
            className="h-full w-full rounded-[.8rem] bg-main text-white duration-300  hover:bg-main/85 md:active:bg-main"
          >
            Edit Tryout
          </button>
        )} */}
      </div>
    </div>
  );
};

export default TryoutOption;

// const UploadImage = ({ file, setFile, heading, inputId, fileName }: any) => {
//   const [previewHover, setPreviewHover] = useState<boolean>(false);
//   const [previewImage, setPreviewImage] = useState<string>('');

//   useEffect(() => {
//     setPreviewImage('');
//     if (file) {
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         const result = reader.result as string;
//         setPreviewImage(result);
//       };

//       reader.readAsDataURL(file);
//     } else {
//       setPreviewImage(`${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/tryout/${fileName}`);
//     }
//   }, [file, fileName]);

//   return (
//     <div className="relative">
//       <p className="font-medium text-[.9rem] mb-[.5rem]">{heading}</p>
//       <div className="absolute bottom-[-1rem] left-[1rem]">
//         <input
//           id={`${inputId}`}
//           type="file"
//           onChange={(e: any) => {
//             setFile(e.target.files[0]);
//           }}
//           className="border-transparent p-0 w-0 h-0 bg-transparent text-transparent"
//         />
//         <input
//           type="text"
//           value={fileName}
//           className="border-transparent p-0 w-1 h-1 bg-transparent text-transparent outline-none"
//           required
//         />
//         <div className="absolute top-0 left-0 w-full h-full bg-workspace" />
//       </div>
//       <div className="border-2 border-main-gray-input border-dashed rounded-[1rem] overflow-hidden p-[1rem] flex flex-col gap-[1rem] relative">
//         {!previewImage ? (
//           <>
//             <div className={`relative ${previewHover ? 'z-[4]' : 'z-[6]'}`}>
//               <Image
//                 src={previewImage}
//                 alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
//                 layout="responsive"
//                 width={500}
//                 height={300}
//                 onMouseOver={() => {
//                   if (previewImage) {
//                     setPreviewHover(true);
//                   }
//                 }}
//               />
//             </div>
//             <div className="absolute top-0 left-0 w-full h-full bg-[#ffffffc4] flex justify-center items-center z-[5] p-[1rem]">
//               <div
//                 className="w-full h-full flex justify-center items-center"
//                 onClick={() => {
//                   document.getElementById(`${inputId}`)?.click();
//                 }}
//                 onMouseLeave={() => {
//                   if (previewImage) {
//                     setPreviewHover(false);
//                   }
//                 }}
//               >
//                 <div className="flex flex-col items-center text-center text-main-gray-text">
//                   <i className="bx bx-upload text-[1.5rem]" />
//                   <p>Ganti Thumbnail</p>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className={`relative ${previewHover ? 'z-[4]' : 'z-[6]'}`}>
//               <Image
//                 src={previewImage}
//                 alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
//                 layout="responsive"
//                 width={500}
//                 height={300}
//                 onMouseOver={() => {
//                   if (previewImage) {
//                     setPreviewHover(true);
//                   }
//                 }}
//               />
//             </div>
//             <div className="absolute top-0 left-0 w-full h-full bg-[#ffffffc4] flex justify-center items-center z-[5] p-[1rem]">
//               <div
//                 className="w-full h-full flex justify-center items-center"
//                 onClick={() => {
//                   document.getElementById(`${inputId}`)?.click();
//                 }}
//                 onMouseLeave={() => {
//                   if (previewImage) {
//                     setPreviewHover(false);
//                   }
//                 }}
//               >
//                 <div className="flex flex-col items-center text-center text-main-gray-text">
//                   <i className="bx bx-upload text-[1.5rem]" />
//                   <p>Ganti Thumbnail</p>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };
