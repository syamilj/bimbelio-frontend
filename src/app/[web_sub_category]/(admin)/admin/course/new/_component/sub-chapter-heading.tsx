'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { supabase } from '@/supabaseClient';
import { Clock, Crown, FileText, Play, Video } from 'lucide-react';
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
    setSubChapter((prev) =>
      prev.filter((_, i: number) => i !== currentIndexEdit),
    );

    // Clean up files
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
              premium: sChapter.premium,
            };
          }
          return sChapter;
        }),
      );

      // Clean up old files when changing type
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
      {/* Header with Delete Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Pengaturan Sub Chapter
          </h3>
          <p className="text-sm text-gray-500">
            Konfigurasi detail dan properti sub chapter
          </p>
        </div>
        <ModalDeleteSubChapter deleteSubChapter={deleteSubChapter} />
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sub-title">Judul Sub Chapter *</Label>
              <Input
                id="sub-title"
                placeholder="Masukkan judul sub chapter..."
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
                className="focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spend-time">Estimasi Waktu (menit) *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="spend-time"
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
                  className="pl-10 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {EditSubChapter.type !== 'VIDEO' && (
            <div className="space-y-2">
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
                className="min-h-[100px] focus:ring-blue-500"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Type and Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Tipe dan Pengaturan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material-type">Tipe Materi *</Label>
              <Select
                value={EditSubChapter.type || ''}
                onValueChange={(value) => {
                  handleChangeType(
                    value as 'TRYOUT' | 'VIDEO' | 'DOCUMENT' | 'MATERI',
                  );
                }}
              >
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue placeholder="Pilih tipe materi...">
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
                      <span>Document - File PDF</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MATERI">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Materi - Rich Text Editor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="VIDEO">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span>Video - File MP4</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="TRYOUT">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      <span>Tryout - Latihan Soal</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="premium-toggle">Status Premium</Label>
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <Switch
                  id="premium-toggle"
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
                  <Label
                    htmlFor="premium-toggle"
                    className="cursor-pointer"
                  >
                    Konten Premium
                  </Label>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {EditSubChapter.premium
                  ? 'Hanya dapat diakses oleh pengguna premium'
                  : 'Dapat diakses oleh semua pengguna'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getTypeIcon(EditSubChapter.type)}
            Informasi Tipe: {EditSubChapter.type || 'Belum dipilih'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {EditSubChapter.type === 'VIDEO' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  📹 Tipe Video
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Upload file video dalam format MP4</li>
                  <li>
                    • Tambahkan deskripsi video menggunakan rich text editor
                  </li>
                  <li>
                    • Siswa dapat menonton video dan mengatur kecepatan putar
                  </li>
                </ul>
              </div>
            )}

            {EditSubChapter.type === 'DOCUMENT' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">
                  📄 Tipe Document
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Pilih dari daftar dokumen yang sudah tersedia</li>
                  <li>• Dokumen akan ditampilkan dalam viewer PDF</li>
                  <li>• Siswa dapat download dokumen untuk belajar offline</li>
                </ul>
              </div>
            )}

            {EditSubChapter.type === 'MATERI' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">
                  📚 Tipe Materi
                </h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>
                    • Buat konten pembelajaran menggunakan rich text editor
                  </li>
                  <li>
                    • Mendukung format teks, gambar, dan formula matematika
                  </li>
                  <li>• Ideal untuk penjelasan konsep dan teori</li>
                </ul>
              </div>
            )}

            {EditSubChapter.type === 'TRYOUT' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">
                  📝 Tipe Tryout
                </h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Buat soal latihan dengan berbagai tipe penilaian</li>
                  <li>• Mendukung gambar pada soal dan pilihan jawaban</li>
                  <li>• Siswa akan mendapat skor dan pembahasan</li>
                </ul>
              </div>
            )}

            {!EditSubChapter.type && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  ❓ Belum Memilih Tipe
                </h4>
                <p className="text-sm text-gray-600">
                  Pilih tipe materi terlebih dahulu untuk melanjutkan
                  konfigurasi sub chapter.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubChapterHeading;
