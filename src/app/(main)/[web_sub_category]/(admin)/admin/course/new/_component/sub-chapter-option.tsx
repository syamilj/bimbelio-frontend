'use client';

import BlogEditor from '@/components/ui/blog-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputImage } from '@/components/ui/input-image';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingPageStorage } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toaster } from '@/components/ui/toaster';
import { useGet } from '@/lib/fetch-helper/useGet';
import { storage } from '@/supabaseClient';
import { Document } from '@/types/database';
import 'katex/dist/katex.min.css';
import { FileText, Plus, Video } from 'lucide-react';
import React, { ChangeEvent, SetStateAction, useState } from 'react';
import ModalImportExcel from '../../_component/modal-import-excel';
import { QuestionProps, SubChapterProps } from '../page';
import SubChapterQuestion from './sub-chapter-question';

interface Props {
  EditSubChapter: SubChapterProps | null;
  setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>;
  currentIndexEdit: number | null;
  setCurrentIndexEdit: React.Dispatch<SetStateAction<number | null>>;
  showDetailSubChapter: boolean;
  setShowDetailSubChapter: React.Dispatch<SetStateAction<boolean>>;
  assessmentType: string;
  questionIndex: number;
  setQuestionIndex: React.Dispatch<SetStateAction<number>>;
}

const SubChapterOption = ({
  currentIndexEdit,
  setCurrentIndexEdit,
  showDetailSubChapter,
  setShowDetailSubChapter,
  EditSubChapter,
  assessmentType,
  setSubChapter,
  questionIndex,
  setQuestionIndex,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const addQuestion = () => {
    if (EditSubChapter === null) return;

    let newQuestion: QuestionProps;
    if (assessmentType === '1-5') {
      newQuestion = {
        number: EditSubChapter.Questions?.length
          ? EditSubChapter.Questions?.length + 1
          : 1,
        question: '',
        Answers: [
          { answer: '', value: 1 },
          { answer: '', value: 2 },
          { answer: '', value: 3 },
          { answer: '', value: 4 },
          { answer: '', value: 5 },
        ],
      };
    } else if (assessmentType === '+5/0') {
      newQuestion = {
        number: EditSubChapter.Questions?.length
          ? EditSubChapter.Questions?.length + 1
          : 1,
        question: '',
        Answers: [
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 5 },
        ],
      };
    } else if (assessmentType === 'IRT') {
      newQuestion = {
        number: EditSubChapter.Questions?.length
          ? EditSubChapter.Questions?.length + 1
          : 1,
        question: '',
        Answers: [
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 5 },
        ],
      };
    } else if (assessmentType === '+4/-1/0') {
      newQuestion = {
        number: EditSubChapter.Questions?.length
          ? EditSubChapter.Questions?.length + 1
          : 1,
        question: '',
        Answers: [
          { answer: '', value: -1 },
          { answer: '', value: -1 },
          { answer: '', value: -1 },
          { answer: '', value: -1 },
          { answer: '', value: 4 },
        ],
      };
    }
    setSubChapter((prev) =>
      prev.map((item, i: number) => {
        if (currentIndexEdit === i) {
          if (item.Questions && item.Questions?.length > 0) {
            return { ...item, Questions: [...item.Questions, newQuestion] };
          } else {
            return { ...item, Questions: [newQuestion] };
          }
        }
        return { ...item };
      }),
    );
  };

  const handleChangeType = async (
    value: 'TRYOUT' | 'VIDEO' | 'DOCUMENT' | 'MATERI' | 'PROGRESS_TEST',
  ) => {
    if (!value || value.length === 0) return;

    if (value !== EditSubChapter?.type) {
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
      if (EditSubChapter?.type === 'DOCUMENT' && EditSubChapter.document) {
        await storage.from('pdf').remove([`course/${EditSubChapter.document}`]);
      }
      if (EditSubChapter?.type === 'VIDEO' && EditSubChapter.video) {
        await storage.from('video').remove([`course/${EditSubChapter.video}`]);
      }
    }
  };

  const handleVideoUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>,
    currentIndexEdit: number | null,
    setLoading: React.Dispatch<SetStateAction<boolean>>,
  ) => {
    setLoading(true);
    if (e.target.files) {
      const file = e.target.files[0];
      const nameFile = `${crypto.randomUUID()}`;
      if (file.type !== 'video/mp4') {
        toaster({
          title: 'Error',
          condition: 'warning',
          description: 'File yang di-upload tidak sesuai',
          duration: 3000,
        });
        setLoading(false);
        return;
      }

      // Remove old video if exists
      if (EditSubChapter?.video && EditSubChapter.video.length > 0) {
        const { data, error } = await storage
          .from('video')
          .remove([`course/${EditSubChapter.video}`]);
        // if (error) {
        //   toaster({
        //     title: 'Error',
        //     condition: 'warning',
        //     description: 'Gagal mengupload file, silahkan coba lagi',
        //     duration: 3000,
        //   });
        //   setLoading(false);
        //   return;
        // }
      }

      // Upload new video
      const { error } = await storage
        .from('video')
        .upload(`course/${nameFile}`, file);

      if (error) {
        toaster({
          title: 'Error',
          condition: 'warning',
          description: 'Gagal mengupload file, silahkan coba lagi',
          duration: 3000,
        });
        setLoading(false);
        return;
      }

      setSubChapter((prev) =>
        prev.map((sChapter, sIndex) => {
          if (sIndex === currentIndexEdit) {
            return {
              ...sChapter,
              video: nameFile,
            };
          }
          return { ...sChapter };
        }),
      );
    }
    setLoading(false);
  };

  if (!EditSubChapter || currentIndexEdit === null) {
    return null;
  }

  return (
    <Card>
      {/* {loading && <LoadingPopUp title="Mengupload..." />} */}

      <LoadingPageStorage
        loading={loading}
        heading="Mengupload Video..."
      />

      <CardHeader>
        <CardTitle>Edit Sub Chapter {currentIndexEdit + 1}</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="basic"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="content">Konten</TabsTrigger>
            <TabsTrigger
              value="questions"
              disabled={
                EditSubChapter.type !== 'TRYOUT' &&
                EditSubChapter.type !== 'PROGRESS_TEST'
              }
            >
              Soal
            </TabsTrigger>
            <TabsTrigger value="settings">Setting</TabsTrigger>
          </TabsList>

          <TabsContent
            value="basic"
            className="space-y-4 mt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sub-title">Judul *</Label>
                <Input
                  id="sub-title"
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

            <div>
              <Label htmlFor="type">Tipe Materi *</Label>
              <Select
                value={EditSubChapter.type || ''}
                onValueChange={(value) => handleChangeType(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="DOCUMENT">Dokumen</SelectItem>
                  <SelectItem value="MATERI">Artikel</SelectItem>
                  <SelectItem value="TRYOUT">Try Out</SelectItem>
                  <SelectItem value="PROGRESS_TEST">Uji Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              />
            </div>
            {EditSubChapter.type === 'PROGRESS_TEST' && (
              <div className="flex flex-col gap-2">
                <Label>
                  Upload Thumbnail{' '}
                  <span className="text-gray-400 text-sm">(Optional)</span>
                </Label>

                <InputImage
                  preview={
                    EditSubChapter.image ? EditSubChapter.image : undefined
                  }
                  imageFile={EditSubChapter.imageFile}
                  onChange={async (image) => {
                    if (image) {
                      setSubChapter((prev) =>
                        prev.map((sChapter, index) => {
                          if (index === currentIndexEdit) {
                            return {
                              ...sChapter,
                              imageFile: image,
                            };
                          }
                          return sChapter;
                        }),
                      );
                    }
                  }}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="content"
            className="mt-6"
          >
            {EditSubChapter.type === 'VIDEO' && (
              <VideoEditor
                EditSubChapter={EditSubChapter}
                setSubChapter={setSubChapter}
                currentIndexEdit={currentIndexEdit}
                setLoading={setLoading}
                handleVideoUpload={handleVideoUpload}
              />
            )}

            {EditSubChapter.type === 'DOCUMENT' && (
              <DocumentSelector
                EditSubChapter={EditSubChapter}
                setSubChapter={setSubChapter}
                currentIndexEdit={currentIndexEdit}
              />
            )}

            {EditSubChapter.type === 'MATERI' && (
              <ArticleEditor
                EditSubChapter={EditSubChapter}
                setSubChapter={setSubChapter}
                currentIndexEdit={currentIndexEdit}
              />
            )}

            {!EditSubChapter.type && (
              <div className="text-center py-8 text-gray-500">
                <p>Pilih tipe materi di tab Basic terlebih dahulu</p>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="questions"
            className="mt-6"
          >
            {EditSubChapter.type === 'TRYOUT' ||
            EditSubChapter.type === 'PROGRESS_TEST' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Soal ({EditSubChapter.Questions?.length || 0})
                  </h3>
                  <div className="flex gap-2">
                    <ModalImportExcel
                      setSubChapter={setSubChapter}
                      currentIndexEdit={currentIndexEdit}
                      assessmentType={assessmentType}
                    />
                    <Button
                      onClick={addQuestion}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Tambah Soal
                    </Button>
                  </div>
                </div>

                {EditSubChapter.Questions &&
                EditSubChapter.Questions.length > 0 ? (
                  <>
                    <div className="flex gap-2 flex-wrap">
                      {EditSubChapter.Questions.map((quest, qIndex) => (
                        <Button
                          key={qIndex}
                          variant={
                            qIndex === questionIndex ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => setQuestionIndex(qIndex)}
                          className="w-8 h-8 p-0"
                        >
                          {quest.number}
                        </Button>
                      ))}
                    </div>

                    <SubChapterQuestion
                      EditSubChapter={EditSubChapter}
                      questionIndex={questionIndex}
                      setQuestionIndex={setQuestionIndex}
                      currentIndexEdit={currentIndexEdit}
                      assessmentType={assessmentType}
                      setSubChapter={setSubChapter}
                    />
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-3xl">
                    <p>Belum ada soal</p>
                    <Button
                      onClick={addQuestion}
                      size="sm"
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Tambah Soal Pertama
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Fitur soal hanya tersedia untuk tipe Try Out</p>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="settings"
            className="mt-6"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="premium"
                    checked={EditSubChapter.premium}
                    onChange={(e) => {
                      setSubChapter((prev) =>
                        prev.map((sChapter, index) => {
                          if (index === currentIndexEdit) {
                            return { ...sChapter, premium: e.target.checked };
                          }
                          return sChapter;
                        }),
                      );
                    }}
                  />
                  <Label htmlFor="premium">Konten Premium</Label>
                </div>
                <p className="text-sm text-gray-500">
                  {EditSubChapter.premium
                    ? 'Hanya bisa diakses pengguna premium'
                    : 'Dapat diakses semua pengguna'}
                </p>
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
                    <SelectItem value="PUBLISH">Publish</SelectItem>{' '}
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
                        ? typeof EditSubChapter.publishedAt === 'string'
                          ? EditSubChapter.publishedAt
                          : new Date(EditSubChapter.publishedAt)
                              .toISOString()
                              .slice(0, 16)
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Simplified component editors
const VideoEditor = ({
  EditSubChapter,
  setSubChapter,
  currentIndexEdit,
  setLoading,
  handleVideoUpload,
}: {
  EditSubChapter: SubChapterProps;
  setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>;
  currentIndexEdit: number | null;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  handleVideoUpload: (
    e: ChangeEvent<HTMLInputElement>,
    setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>,
    currentIndexEdit: number | null,
    setLoading: React.Dispatch<SetStateAction<boolean>>,
  ) => void;
}) => (
  <div className="space-y-4">
    <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center">
      <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      {EditSubChapter.video ? (
        <div>
          <p className="text-green-600 mb-2">✓ Video sudah diupload</p>
          <Button
            variant="outline"
            onClick={() => document.getElementById('video-upload')?.click()}
          >
            Ganti Video
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-gray-500 mb-4">Upload file MP4</p>
          <Button
            onClick={() => document.getElementById('video-upload')?.click()}
          >
            Pilih Video
          </Button>
        </div>
      )}
      <input
        id="video-upload"
        type="file"
        accept="video/mp4"
        className="hidden"
        onChange={(e) =>
          handleVideoUpload(e, setSubChapter, currentIndexEdit, setLoading)
        }
      />
    </div>
  </div>
);

const DocumentSelector = ({
  EditSubChapter,
  setSubChapter,
  currentIndexEdit,
}: {
  EditSubChapter: SubChapterProps;
  setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>;
  currentIndexEdit: number | null;
}) => {
  const [search, setSearch] = useState('');
  const { data: documents } = useGet<Document[]>(
    '/document/getDocumentAdminCourse',
    {
      params: { title: search },
      useEffectDependencies: [search],
    },
  );

  const selectedDoc = documents?.find(
    (item) => item.id === EditSubChapter.document,
  );

  if (EditSubChapter.document) {
    return (
      <div
        key={selectedDoc?.id}
        className="p-3 border rounded-3xl cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-gray-400" />
          <span>{selectedDoc?.title}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Cari dokumen..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="max-h-64 overflow-y-auto space-y-2">
        {documents?.map((doc) => (
          <div
            key={doc.id}
            className="p-3 border rounded-3xl cursor-pointer hover:bg-gray-50"
            onClick={() => {
              setSubChapter((prev) =>
                prev.map((sChapter, sIndex) => {
                  if (sIndex === currentIndexEdit) {
                    return {
                      ...sChapter,
                      document: doc.id,
                      documentTitle: doc.title,
                    };
                  }
                  return sChapter;
                }),
              );
            }}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <span>{doc.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArticleEditor = ({
  EditSubChapter,
  setSubChapter,
  currentIndexEdit,
}: {
  EditSubChapter: SubChapterProps;
  setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>;
  currentIndexEdit: number | null;
}) => (
  <BlogEditor
    value={EditSubChapter.materi}
    onChange={(value) => {
      setSubChapter((prev) =>
        prev.map((sChapter, sIndex) => {
          if (sIndex === currentIndexEdit) {
            return { ...sChapter, materi: value };
          }
          return sChapter;
        }),
      );
    }}
  />
);

export default SubChapterOption;
