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
import { cn } from '@/lib/utils';
import { Category } from '@/types/database';
import { BookOpen, FileText, Play, Plus, Trash2, Video } from 'lucide-react';
import React, { SetStateAction } from 'react';
import { ChapterProps, SubChapterProps } from '../page';

interface Props {
  chapter: ChapterProps | null;
  setChapter: React.Dispatch<SetStateAction<ChapterProps | null>>;
  subChapter: SubChapterProps[];
  setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>;
  currentIndexEdit: number | null;
  setCurrentIndexEdit: React.Dispatch<SetStateAction<number | null>>;
  setQuestionIndex: React.Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  resetCourse: ({ deleteFile }: { deleteFile: boolean }) => void;
  category: Category[] | null;
}

const typeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  VIDEO: {
    icon: <Video className="h-3.5 w-3.5" />,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    label: 'Video',
  },
  DOCUMENT: {
    icon: <FileText className="h-3.5 w-3.5" />,
    color: 'text-green-600 bg-green-50 border-green-100',
    label: 'Dokumen',
  },
  TRYOUT: {
    icon: <Play className="h-3.5 w-3.5" />,
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    label: 'TryOut',
  },
  MATERI: {
    icon: <BookOpen className="h-3.5 w-3.5" />,
    color: 'text-orange-600 bg-orange-50 border-orange-100',
    label: 'Materi',
  },
  PROGRESS_TEST: {
    icon: <Play className="h-3.5 w-3.5" />,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    label: 'Uji Progress',
  },
};

const ChapterOption = ({
  chapter,
  setChapter,
  subChapter,
  setSubChapter,
  currentIndexEdit,
  setCurrentIndexEdit,
  setQuestionIndex,
  isLoading,
  resetCourse,
  category,
}: Props) => {
  const addSubChapter = () => {
    const newIndex = subChapter.length;
    setSubChapter((prev) => [
      ...prev,
      {
        title: '',
        description: '',
        spendTime: '',
        premium: false,
        status: 'DRAFT',
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

  return (
    <div className="space-y-5">
      {/* Basic Info */}
      <div className="space-y-3">
        <div>
          <Label
            htmlFor="title"
            className="text-xs font-medium text-gray-600 uppercase tracking-wide"
          >
            Judul Kursus *
          </Label>
          <Input
            id="title"
            placeholder="Masukkan judul..."
            value={chapter?.title || ''}
            onChange={(e) =>
              setChapter((prev) => ({ ...prev, title: e.target.value }))
            }
            className="mt-1 rounded-xl border-gray-200"
          />
        </div>

        <div>
          <Label
            htmlFor="category"
            className="text-xs font-medium text-gray-600 uppercase tracking-wide"
          >
            Kategori *
          </Label>
          <Select
            value={chapter?.categoryId || ''}
            onValueChange={(value) =>
              setChapter((prev) => ({ ...prev, categoryId: value }))
            }
          >
            <SelectTrigger className="mt-1 rounded-xl border-gray-200">
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label
              htmlFor="number"
              className="text-xs font-medium text-gray-600 uppercase tracking-wide"
            >
              Urutan
            </Label>
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
              className="mt-1 rounded-xl border-gray-200"
            />
          </div>
          <div>
            <Label
              htmlFor="status"
              className="text-xs font-medium text-gray-600 uppercase tracking-wide"
            >
              Status
            </Label>
            <Select
              value={chapter?.status || ''}
              onValueChange={(value) =>
                setChapter((prev) => ({
                  ...prev,
                  status: value as 'PUBLIC' | 'PRIVATE',
                }))
              }
            >
              <SelectTrigger className="mt-1 rounded-xl border-gray-200">
                <SelectValue placeholder="Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sub Chapters */}
      {chapter?.categoryId && (
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Sub Chapters ({subChapter.length})
            </span>
            <Button
              onClick={addSubChapter}
              size="sm"
              variant="outline"
              disabled={isLoading}
              className="h-7 px-2.5 text-xs rounded-lg border-gray-200"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah
            </Button>
          </div>

          {subChapter.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-sm text-gray-400 mb-2">
                Belum ada sub chapter
              </p>
              <Button
                onClick={addSubChapter}
                size="sm"
                variant="outline"
                disabled={isLoading}
                className="h-7 px-3 text-xs rounded-lg"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Tambah Sub Chapter
              </Button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {subChapter.map((item, index) => {
                const tc = item.type ? typeConfig[item.type] : null;
                return (
                  <div
                    key={index}
                    className={cn(
                      'group flex items-center gap-2.5 p-2.5 border rounded-xl cursor-pointer transition-all',
                      currentIndexEdit === index
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50',
                    )}
                    onClick={() => {
                      setCurrentIndexEdit(index);
                      setQuestionIndex(0);
                    }}
                  >
                    {/* Number */}
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0',
                        currentIndexEdit === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-500',
                      )}
                    >
                      {index + 1}
                    </div>

                    {/* Type indicator */}
                    {tc && (
                      <div
                        className={cn(
                          'flex items-center justify-center w-6 h-6 rounded-lg border shrink-0',
                          tc.color,
                        )}
                      >
                        {tc.icon}
                      </div>
                    )}

                    {/* Title + meta */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate leading-tight">
                        {item.title || `Sub Chapter ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {tc ? tc.label : 'Tipe belum dipilih'}
                        {item.spendTime ? ` · ${item.spendTime} menit` : ''}
                        {item.type === 'TRYOUT' && item.Questions?.length
                          ? ` · ${item.Questions.length} soal`
                          : ''}
                      </p>
                    </div>

                    {/* Status chip */}
                    {item.status && (
                      <span
                        className={cn(
                          'text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0',
                          item.status === 'PUBLISH'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'UPCOMING'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-500',
                        )}
                      >
                        {item.status}
                      </span>
                    )}

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSubChapter(index);
                      }}
                      className="h-6 w-6 p-0 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      {!chapter?.categoryId && (
        <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-100 p-3 rounded-xl">
          <span className="mt-0.5">💡</span>
          <span>
            Pilih kategori terlebih dahulu untuk menambahkan sub chapter
          </span>
        </div>
      )}
    </div>
  );
};

export default ChapterOption;
