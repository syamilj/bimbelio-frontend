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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { getDateForInputDateTime } from '@/lib/utils';
import { storage } from '@/storageClient';
import { Crown, FileText, Play, Video } from 'lucide-react';
import React, { SetStateAction } from 'react';
import { SubChapterProps } from '../page';
import ModalDeleteSubChapter from './modal-delete';

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
  const deleteSubChapter = async () => {
    setCurrentIndexEdit(null);
    setSubChapter((prev) => prev.filter((_, i) => i !== currentIndexEdit));

    // Clean up files
    if (EditSubChapter.type === 'DOCUMENT' && EditSubChapter.document) {
      await storage.from('pdf').remove([`course/${EditSubChapter.document}`]);
    }
    if (EditSubChapter.type === 'VIDEO' && EditSubChapter.video) {
      await storage.from('video').remove([`course/${EditSubChapter.video}`]);
    }
  };

  const handleChangeType = async (
    value: 'TRYOUT' | 'VIDEO' | 'DOCUMENT' | 'MATERI' | 'PROGRESS_TEST',
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
              premium: sChapter.premium,
            };
          }
          return sChapter;
        }),
      );

      // Clean up old files
      if (EditSubChapter.type === 'DOCUMENT') {
        await storage.from('pdf').remove([`course/${EditSubChapter.document}`]);
      }
      if (EditSubChapter.type === 'VIDEO') {
        await storage.from('video').remove([`course/${EditSubChapter.video}`]);
      }
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="h-4 w-4" />;
      case 'DOCUMENT':
        return <FileText className="h-4 w-4" />;
      case 'TRYOUT':
        return <Play className="h-4 w-4" />;
      case 'MATERI':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (!EditSubChapter) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with Delete */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pengaturan Sub Chapter</h3>
        <ModalDeleteSubChapter deleteSubChapter={deleteSubChapter} />
      </div>

      {/* Basic Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Judul Sub Chapter *</Label>
            <Input
              id="title"
              placeholder="Judul sub chapter..."
              value={EditSubChapter.title || ''}
              onChange={(e) => {
                setSubChapter((prev) =>
                  prev.map((item, i) => {
                    if (i === currentIndexEdit) {
                      return { ...item, title: e.target.value };
                    }
                    return item;
                  }),
                );
              }}
            />
          </div>

          <div>
            <Label htmlFor="duration">Durasi (menit) *</Label>
            <Input
              id="duration"
              type="number"
              placeholder="30"
              value={EditSubChapter.spendTime || ''}
              onChange={(e) => {
                setSubChapter((prev) =>
                  prev.map((item, i) => {
                    if (i === currentIndexEdit) {
                      return { ...item, spendTime: e.target.value };
                    }
                    return item;
                  }),
                );
              }}
            />
          </div>
        </div>

        {EditSubChapter.type !== 'VIDEO' && (
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Deskripsi sub chapter..."
              value={EditSubChapter.description || ''}
              onChange={(e) => {
                setSubChapter((prev) =>
                  prev.map((sChapter, sIndex) => {
                    if (sIndex === currentIndexEdit) {
                      return { ...sChapter, description: e.target.value };
                    }
                    return sChapter;
                  }),
                );
              }}
              className="min-h-[100px]"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Tipe Materi *</Label>
            <Select
              value={EditSubChapter.type || ''}
              onValueChange={(value) => {
                handleChangeType(
                  value as 'TRYOUT' | 'VIDEO' | 'DOCUMENT' | 'MATERI',
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe...">
                  {EditSubChapter.type && (
                    <div className="flex items-center gap-2">
                      {getTypeIcon(EditSubChapter.type)}
                      <span>{EditSubChapter.type}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DOCUMENT">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Document
                  </div>
                </SelectItem>
                <SelectItem value="MATERI">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Materi
                  </div>
                </SelectItem>
                <SelectItem value="VIDEO">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video
                  </div>
                </SelectItem>
                <SelectItem value="TRYOUT">
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Tryout
                  </div>
                </SelectItem>
                <SelectItem value="PROGRESS_TEST">
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Uji Progress
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status Premium</Label>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <Switch
                checked={EditSubChapter.premium}
                onCheckedChange={(checked) => {
                  setSubChapter((prev) =>
                    prev.map((sChapter, index) => {
                      if (index === currentIndexEdit) {
                        return { ...sChapter, premium: checked };
                      }
                      return sChapter;
                    }),
                  );
                }}
              />
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <Label>Konten Premium</Label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {EditSubChapter.premium
                ? 'Hanya dapat diakses oleh pengguna premium'
                : 'Dapat diakses oleh semua pengguna'}
            </p>
          </div>
        </div>
        {/* Status Setting */}
        <div className="space-y-2">
          <Label htmlFor="status">Status Publikasi *</Label>
          <Select
            value={EditSubChapter.status || 'DRAFT'}
            onValueChange={(value) => {
              setSubChapter((prev) =>
                prev.map((sChapter, index) => {
                  if (index === currentIndexEdit) {
                    return {
                      ...sChapter,
                      status: value as 'DRAFT' | 'PUBLISH',
                    };
                  }
                  return sChapter;
                }),
              );
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISH">Publish</SelectItem>
              <SelectItem value="UPCOMING">Upcoming</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            {EditSubChapter.status === 'PUBLISH'
              ? 'Konten akan langsung tersedia untuk pengguna'
              : 'Konten masih dalam tahap draft dan belum dipublikasikan'}
          </p>
        </div>

        {/* Schedule Setting */}
        {EditSubChapter.status === 'PUBLISH' && (
          <div className="space-y-2">
            <Label htmlFor="schedule">Jadwal Publikasi (Opsional)</Label>
            <Input
              id="schedule"
              type="datetime-local"
              value={
                EditSubChapter.publishedAt
                  ? getDateForInputDateTime(EditSubChapter.publishedAt)
                  : ''
              }
              onChange={(e) => {
                setSubChapter((prev) =>
                  prev.map((sChapter, index) => {
                    if (index === currentIndexEdit) {
                      return {
                        ...sChapter,
                        publishedAt: e.target.value,
                      };
                    }
                    return sChapter;
                  }),
                );
              }}
            />
            <p className="text-sm text-gray-500">
              {EditSubChapter.publishedAt
                ? `Konten akan dipublikasikan pada ${new Date(EditSubChapter.publishedAt).toLocaleString('id-ID')}`
                : 'Tentukan waktu publikasi konten (kosongkan jika ingin publish sekarang)'}
            </p>
            {EditSubChapter.publishedAt && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSubChapter((prev) =>
                    prev.map((sChapter, index) => {
                      if (index === currentIndexEdit) {
                        return { ...sChapter, publishedAt: undefined };
                      }
                      return sChapter;
                    }),
                  );
                }}
              >
                Hapus Jadwal
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubChapterHeading;
