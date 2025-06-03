'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import {
  IconDown,
  IconFullscreen,
  IconMinimizeScreen,
  IconUp,
} from '@/styles/icon';
import { supabase } from '@/supabaseClient';
import { Category } from '@/types/database';
import { useRouter } from 'next/navigation';
import React, { SetStateAction, useState } from 'react';
import { ChapterProps, SubChapterProps } from '../page';
import ModalDeleteChapter from './modal-delete-chapter';

interface Props {
  chapter: ChapterProps | null;
  setChapter: React.Dispatch<SetStateAction<ChapterProps | null>>;
  subChapter: SubChapterProps[];
  setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>;
  currentIndexEdit: number | null;
  setCurrentIndexEdit: React.Dispatch<SetStateAction<number | null>>;
  setQuestionIndex: React.Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  category: Category[] | null;
}

const ChapterOption = ({
  chapter,
  setChapter,
  subChapter,
  setSubChapter,
  currentIndexEdit,
  setCurrentIndexEdit,
  setQuestionIndex,
  isLoading,
  category,
}: Props) => {
  const router = useRouter();

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const [dateTryoutHeight, setDateTryoutHeight] = useState<number>(0);
  const [showDateTryout, setShowDateTryout] = useState<boolean>(true);
  const [prevIndexEdit, setPrevIndexEdit] = useState<number | null>(null);
  // const [thumbnail, setThumbnail] = useState<File | undefined>();
  // const [thumbnailName, setThumbnailName] = useState<string>('');

  // const { mutateAsync: deleteChapter } = api.course.deleteChapter.useMutation();

  const { mutate: deleteChapter } = useMutation(
    '/course/deleteChapter',
    'delete',
  );

  const addSesi = () => {
    setSubChapter((prev) => {
      return [
        ...prev,
        {
          title: '',
          description: '',
          spendTime: '',
          premium: true,
          assessmentType: '1-5',
          Questions: [],
        },
      ];
    });
  };

  const handleDeleteChapter = async () => {
    setLoadingDelete(true);
    if (!chapter?.id) {
      toaster({
        title: 'Error',
        description: 'ID Chapter tidak ditemukan',
        condition: 'warning',
        duration: 3000,
      });
      setLoadingDelete(false);
      return;
    }
    const success = await deleteChapter({ params: { chapterId: chapter?.id } });
    if (!success) {
      setLoadingDelete(false);
      return;
    }
    const fileDocument: string[] = [];
    const fileVideo: string[] = [];
    subChapter.forEach((sChapter) => {
      if (sChapter.document && sChapter.document.length > 0) {
        fileDocument.push(`course/${sChapter.document}`);
      }
      if (sChapter.video && sChapter.video.length > 0) {
        fileVideo.push(`course/${sChapter.video}`);
      }
    });
    if (fileDocument.length > 0) {
      await supabase.storage.from('pdf').remove(fileDocument);
    }
    if (fileVideo.length > 0) {
      await supabase.storage.from('video').remove(fileVideo);
    }
    router.push(`${website_sub_category_id}/admin/course`);
  };

  return (
    <div className="flex w-full flex-col gap-[1rem] p-[1rem] text-[.9rem]">
      <ModalDeleteChapter
        onClick={handleDeleteChapter}
        open={openDelete}
        setOpen={setOpenDelete}
        isLoading={loadingDelete}
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[1rem]">
          <h1 className="text-[1.2rem] font-medium">Detail Chapter</h1>
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
              console.log('height', div.clientHeight);
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
      <div className="grid grid-cols-2 gap-[1rem]">
        <div className="flex flex-col gap-[.5rem]">
          <p className="font-medium">Judul Chapter</p>
          <input
            type="text"
            placeholder="Judul Chapter"
            className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
            required
            value={chapter?.title ? chapter?.title : ''}
            onChange={(e) => {
              setChapter((prev) => ({ ...prev, title: e.target.value }));
            }}
          />
        </div>
        <div className="flex flex-col gap-[.5rem]">
          <p className="font-medium">Kategori</p>
          <Select
            value={chapter?.categoryId || ''}
            onValueChange={(value) =>
              value && setChapter((prev) => ({ ...prev, categoryId: value }))
            }
          >
            <SelectTrigger className="h-full min-w-[63px] rounded-[.8rem] border-none bg-white shadow-none outline-none">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="placeholder"
                disabled
              >
                Kategori
              </SelectItem>
              {category?.map((item, index) => (
                <SelectItem
                  key={index}
                  value={item.id}
                >
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-[.5rem]">
        <p className="font-medium">Urutan Chapter</p>
        <input
          type="number"
          placeholder="Urutan Chapter"
          className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default2"
          required
          value={chapter?.number ? chapter?.number : ''}
          onChange={(e) => {
            setChapter((prev) => ({
              ...prev,
              number: parseInt(e.target.value),
            }));
          }}
        />
      </div>
      <div className="my-[1rem] h-[1px] w-full bg-main-gray-disabled/60" />
      {chapter?.categoryId && (
        <>
          <div
            id="session"
            className="flex flex-col gap-[.5rem]"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-[1.1rem] font-medium">Daftar Sub-chapter</h1>
              <div
                className="cursor-pointer rounded-[.8rem] bg-main px-[1rem] py-[.8rem] text-white duration-300 md:hover:bg-main-hover md:active:bg-main"
                onClick={addSesi}
              >
                Tambah sub-chapter
              </div>
            </div>
            {subChapter?.map((item, sessionIndex: number) => (
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

                      const currentSessions = [...subChapter];

                      const [movedSession] = currentSessions.splice(
                        sessionIndex,
                        1,
                      );
                      console.log(currentSessions, movedSession);

                      currentSessions.splice(fixValue, 0, movedSession);

                      setSubChapter([...currentSessions]);
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
                      {Array.from({ length: subChapter.length }).map(
                        (_, index) => (
                          <SelectItem
                            key={index}
                            value={`${index + 1}`}
                          >
                            {index + 1}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-full items-center justify-between rounded-[.8rem] bg-white px-[1rem] py-[.8rem]">
                  <p>
                    {!item.title || item.title === '' ? '.....' : item.title}
                  </p>
                  <p>{!item.type ? '.....' : item.type}</p>
                </div>
                <div
                  className="shrink-0 cursor-pointer px-[1rem] py-[.8rem] text-main-gray-text duration-300 md:hover:text-black"
                  onClick={() => {
                    setCurrentIndexEdit(sessionIndex);
                    setQuestionIndex(0);
                    // if (item.assessmentType) setAssesmentType(item.assessmentType);
                  }}
                >
                  Edit
                </div>
              </div>
            ))}
          </div>
          <div className="my-[1rem] h-[1px] w-full bg-main-gray-disabled/60" />
          <div className="grid w-full grid-cols-2 gap-[1rem]">
            <div
              className="flex w-full shrink-0 cursor-pointer items-center justify-center rounded-[.8rem] bg-red-100 py-[.8rem] font-medium text-red-700 duration-300 md:hover:bg-red-200 md:active:bg-red-100"
              onClick={() => {
                setOpenDelete(true);
              }}
            >
              Hapus
            </div>
            <div className="relative w-full overflow-visible rounded-[.8rem] border border-transparent bg-white duration-300 md:hover:shadow-default">
              <input
                type="text"
                defaultValue={chapter?.status ? `${chapter?.status}` : ''}
                required
                className="absolute bottom-0 left-[1rem] h-1 w-1 p-0 text-transparent outline-none"
              />
              <Select
                value={chapter?.status ? `${chapter?.status}` : 'placeholder'}
                onValueChange={(value) => {
                  setChapter((prev) => ({
                    ...prev,
                    status: value as 'PUBLIC' | 'PRIVATE',
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
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex h-[45px] w-full items-center justify-center">
            <button
              type="submit"
              className="h-full w-full rounded-[.8rem] bg-main text-white duration-300 md:hover:bg-main-hover md:active:bg-main"
              disabled={isLoading}
            >
              Simpan
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChapterOption;
