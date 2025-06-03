'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/supabaseClient';
import React, { SetStateAction } from 'react';
import { SubChapterProps } from '../page';
import ModalDeleteSubChapter from './modal-delete';
// import { toaster } from "@/lib/utils";
// import { useCompletion } from "ai/react";

interface Props {
  EditSubChapter: SubChapterProps;
  setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>;
  currentIndexEdit: number | null;
  setCurrentIndexEdit: React.Dispatch<SetStateAction<number | null>>;
}

const SubChapterHeading = ({
  EditSubChapter,
  setSubChapter,
  currentIndexEdit,
  setCurrentIndexEdit,
}: Props) => {
  // const [loading, setLoading] = useState<boolean>(false)

  const deleteSubChapter = async () => {
    setCurrentIndexEdit(null);
    setSubChapter((prev) =>
      prev.filter((_, i: number) => i !== currentIndexEdit),
    );
    if (EditSubChapter.type === 'DOCUMENT' && EditSubChapter.document) {
      await supabase.storage
        .from('pdf')
        .remove([`course/${EditSubChapter.document}`]);
    }
    if (EditSubChapter.type === 'VIDEO' && EditSubChapter.video) {
      await supabase.storage
        .from('video')
        .remove([`course/${EditSubChapter.video}`]);
    }
  };

  const handleChangeType = async (
    value: 'TRYOUT' | 'VIDEO' | 'DOCUMENT' | 'MATERI',
  ) => {
    if (!value || value.length === 0) return;
    if (value !== EditSubChapter.type) {
      setSubChapter((prev) =>
        prev.map((sChapter, index) => {
          if (index === currentIndexEdit) {
            return {
              title: sChapter.title,
              description: sChapter.description,
              number: sChapter.number,
              spendTime: sChapter.spendTime,
              Questions: sChapter.Questions,
              type: value,
            };
          }
          return {
            ...sChapter,
          };
        }),
      );
      if (EditSubChapter.type === 'DOCUMENT') {
        await supabase.storage
          .from('pdf')
          .remove([`course/${EditSubChapter.document}`]);
      }
      if (EditSubChapter.type === 'VIDEO') {
        await supabase.storage
          .from('video')
          .remove([`course/${EditSubChapter.video}`]);
      }
    }
    if (!EditSubChapter.type) {
      setSubChapter((prev) =>
        prev.map((sChapter, index) => {
          if (index === currentIndexEdit) {
            return {
              ...sChapter,
              type: value,
            };
          }
          return {
            ...sChapter,
          };
        }),
      );
    }
  };

  if (!EditSubChapter) {
    return null;
  }

  return (
    <>
      <div
        id="heading"
        className="flex shrink-0 flex-col gap-[1rem] overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <ModalDeleteSubChapter deleteSubChapter={deleteSubChapter} />
        </div>
        <div className="grid w-full grid-cols-2 gap-[1rem]">
          <div className="flex w-full flex-col gap-[.5rem]">
            <p className="font-regular">Judul sub chapter</p>
            <input
              type="text"
              placeholder="Judul sub chapter...."
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] text-[.9rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              required
              value={EditSubChapter.title}
              onChange={(e) => {
                setSubChapter((prev) =>
                  prev.map((item, i) => {
                    if (i === currentIndexEdit) {
                      return { ...item, title: e.target.value };
                    }
                    return { ...item };
                  }),
                );
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-[.5rem]">
            <p className="font-regular">Lama belajar (menit)</p>
            <input
              type="number"
              placeholder="Lama Belajar...."
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] text-[.9rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              required
              value={EditSubChapter.spendTime}
              onChange={(e) => {
                setSubChapter((prev) =>
                  prev.map((item, i) => {
                    if (i === currentIndexEdit) {
                      return { ...item, spendTime: e.target.value };
                    }
                    return { ...item };
                  }),
                );
              }}
            />
          </div>
        </div>
        {EditSubChapter.type !== 'VIDEO' && (
          <div className="flex w-full flex-col gap-[.5rem] pb-[.8rem]">
            <p className="font-regular">Deskripsi</p>
            <textarea
              placeholder="Deskripsi Sub Chapter...."
              className="w-full shrink-0 rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              value={EditSubChapter.description}
              onChange={(e) => {
                setSubChapter((prev) =>
                  prev.map((sChapter, sIndex) => {
                    if (sIndex === currentIndexEdit) {
                      return {
                        ...sChapter,
                        description: e.target.value,
                      };
                    }
                    return {
                      ...sChapter,
                    };
                  }),
                );
              }}
            />
          </div>
        )}
        <div className="flex w-full gap-[1rem] pb-[.8rem]">
          <div className="flex w-full flex-col gap-[.5rem]">
            <p className="font-regular">Tipe Materi</p>
            <Select
              value={`${EditSubChapter.type || 'placeholder'}`}
              onValueChange={(value) => {
                handleChangeType(
                  value as 'TRYOUT' | 'VIDEO' | 'DOCUMENT' | 'MATERI',
                );
              }}
            >
              <SelectTrigger className="h-[45px] w-full rounded-[.8rem] border-none bg-white text-main-gray-text shadow-none outline-none">
                <SelectValue placeholder="Tipe Materi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="placeholder"
                  disabled
                >
                  Tipe Materi
                </SelectItem>
                <SelectItem value="DOCUMENT">Document</SelectItem>
                <SelectItem value="MATERI">Materi</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="TRYOUT">Tryout</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit flex-col gap-[.5rem]">
            <p className="font-regular">Premium</p>
            <div className="h-full flex justify-center items-center">
              <Switch
                className="data-[state=checked]:bg-main"
                checked={EditSubChapter.premium}
                onCheckedChange={(checked) => {
                  setSubChapter((prev) =>
                    prev.map((sChapter, index) => {
                      if (index === currentIndexEdit) {
                        return {
                          ...sChapter,
                          premium: checked,
                        };
                      }
                      return {
                        ...sChapter,
                      };
                    }),
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* {loading && (
                <Dialog open={true}>
                    <DialogContent className="p-0 overflow-hidden border-none shadow-none bg-[#fff0]" classOverlay="bg-[#ffffffe3]" hideClose >
                        <div className="flex justify-center items-center z-[100000000] p-[1.5rem]">
                            <div className="flex flex-col items-center">
                                <Loader2 className='animate-spin h-[2rem] w-[2rem]' />
                                <p className='text-[1.1rem] font-medium text-center'>AI Sedang Generate soal Tryout </p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )} */}
    </>
  );
};

export default SubChapterHeading;
