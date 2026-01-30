'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { cn } from '@/lib/utils';
import { storage } from '@/supabaseClient';
import { Category } from '@/types/database';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
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

  const { mutate: deleteChapter } = useMutation(
    '/course/deleteChapter',
    'delete',
  );

  const addSubChapter = () => {
    const newIndex = subChapter.length;
    setSubChapter((prev) => [
      ...prev,
      {
        title: '',
        description: '',
        spendTime: '',
        premium: false,
        Questions: [],
      },
    ]);
    setCurrentIndexEdit(newIndex);
  };

  const removeSubChapter = (index: number) => {
    setSubChapter((prev) => prev.filter((_, i) => i !== index));
    if (currentIndexEdit === index) {
      setCurrentIndexEdit(null);
    } else if (currentIndexEdit && currentIndexEdit > index) {
      setCurrentIndexEdit(currentIndexEdit - 1);
    }
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

    // Clean up files
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
      await storage.from('pdf').remove(fileDocument);
    }
    if (fileVideo.length > 0) {
      await storage.from('video').remove(fileVideo);
    }

    router.push(`/${website_sub_category_id}/admin/course`);
  };

  return (
    <div className="space-y-6">
      <ModalDeleteChapter
        onClick={handleDeleteChapter}
        open={openDelete}
        setOpen={setOpenDelete}
        isLoading={loadingDelete}
      />

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Judul Kursus *</Label>
          <Input
            id="title"
            placeholder="Masukkan judul..."
            value={chapter?.title || ''}
            onChange={(e) =>
              setChapter((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="category">Kategori *</Label>
          <Select
            value={chapter?.categoryId || ''}
            onValueChange={(value) =>
              setChapter((prev) => ({ ...prev, categoryId: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori..." />
            </SelectTrigger>
            <SelectContent>
              {category?.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="number">Urutan</Label>
            <Input
              id="number"
              type="number"
              placeholder="1"
              value={chapter?.number || ''}
              onChange={(e) =>
                setChapter((prev) => ({
                  ...prev,
                  number: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={chapter?.status || ''}
              onValueChange={(value) =>
                setChapter((prev) => ({
                  ...prev,
                  status: value as 'PUBLIC' | 'PRIVATE',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="PRIVATE">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    Private
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sub Chapters */}
      {chapter?.categoryId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Sub Chapters ({subChapter.length})</Label>
            <Button
              onClick={addSubChapter}
              size="sm"
              variant="outline"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-1" />
              Tambah
            </Button>
          </div>

          {subChapter.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-3xl">
              <p className="text-sm">Belum ada sub chapter</p>
              <Button
                onClick={addSubChapter}
                size="sm"
                className="mt-2"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah Sub Chapter
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {subChapter.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-3 border rounded-3xl cursor-pointer transition-all hover:shadow-sm',
                    currentIndexEdit === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200',
                  )}
                  onClick={() => {
                    setCurrentIndexEdit(index);
                    setQuestionIndex(0);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">
                        {item.title || `Sub Chapter ${index + 1}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.type || 'Tipe belum dipilih'}
                        {item.spendTime && ` • ${item.spendTime} menit`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.type === 'TRYOUT' && item.Questions && (
                        <span className="text-xs text-gray-500">
                          {item.Questions.length} soal
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSubChapter(index);
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => setOpenDelete(true)}
          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Hapus Kursus
        </Button>
      </div>

      {/* Helper Text */}
      {!chapter?.categoryId && (
        <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-3xl">
          💡 Pilih kategori terlebih dahulu untuk menambahkan sub chapter
        </div>
      )}
    </div>
  );
};

export default ChapterOption;
