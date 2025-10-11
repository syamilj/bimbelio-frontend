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
import { Plus, Trash2 } from 'lucide-react';
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
    <div className="space-y-6">
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
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
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
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
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
                    'p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm',
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

      {/* Helper Text */}
      {!chapter?.categoryId && (
        <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
          💡 Pilih kategori terlebih dahulu untuk menambahkan sub chapter
        </div>
      )}
    </div>
  );
};

export default ChapterOption;
