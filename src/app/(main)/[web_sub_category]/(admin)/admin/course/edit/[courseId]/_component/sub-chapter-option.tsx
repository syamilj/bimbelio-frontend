'use client';

import BlogEditor from '@/components/ui/blog-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingPopUp } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { storage } from '@/supabaseClient';
import { Document } from '@/types/database';
import 'katex/dist/katex.min.css';
import { FileText, Plus, Video, X } from 'lucide-react';
import React, { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import ModalImportExcel from '../../../_component/modal-import-excel';
import { QuestionProps, SubChapterProps } from '../page';
import SubChapterHeading from './sub-chapter-heading';
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
  const [activeTab, setActiveTab] = useState<string>('details');

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
    } else {
      // Default case
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

  const handleVideoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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
        if (data.length === 0) {
          toaster({
            title: 'Error',
            condition: 'warning',
            description: 'Gagal mengupload file, silahkan coba lagi',
            duration: 3000,
          });
          setLoading(false);
          return;
        }
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
        setSubChapter((prev) =>
          prev.map((sChapter, sIndex) => {
            if (sIndex === currentIndexEdit) {
              return {
                ...sChapter,
                title: sChapter.title,
                description: sChapter.description,
                spendTime: sChapter.spendTime,
                type: sChapter.type,
                video: sChapter.video,
              };
            }
            return { ...sChapter };
          }),
        );
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

  useEffect(() => {
    if (EditSubChapter?.type) {
      switch (EditSubChapter.type) {
        case 'TRYOUT':
          setActiveTab('questions');
          break;
        case 'VIDEO':
          setActiveTab('video');
          break;
        case 'DOCUMENT':
          setActiveTab('document');
          break;
        case 'MATERI':
          setActiveTab('content');
          break;
        default:
          setActiveTab('details');
      }
    }
  }, [EditSubChapter?.type]);

  if (!EditSubChapter || currentIndexEdit === null) {
    return null;
  }

  return (
    <Card>
      {loading && <LoadingPopUp title="Mengupload..." />}

      <CardHeader>
        <CardTitle>Edit Sub Chapter {currentIndexEdit + 1}</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Detail</TabsTrigger>
            <TabsTrigger
              value="questions"
              disabled={
                EditSubChapter.type !== 'TRYOUT' &&
                EditSubChapter.type !== 'PROGRESS_TEST'
              }
            >
              Soal
            </TabsTrigger>
            <TabsTrigger
              value="video"
              disabled={EditSubChapter.type !== 'VIDEO'}
            >
              Video
            </TabsTrigger>
            <TabsTrigger
              value="document"
              disabled={EditSubChapter.type !== 'DOCUMENT'}
            >
              Dokumen
            </TabsTrigger>
            <TabsTrigger
              value="content"
              disabled={EditSubChapter.type !== 'MATERI'}
            >
              Konten
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="details"
            className="mt-6"
          >
            <SubChapterHeading
              EditSubChapter={EditSubChapter}
              setSubChapter={setSubChapter}
              currentIndexEdit={currentIndexEdit}
              setCurrentIndexEdit={setCurrentIndexEdit}
            />
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
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
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
            value="video"
            className="mt-6"
          >
            <VideoEditor
              EditSubChapter={EditSubChapter}
              setSubChapter={setSubChapter}
              currentIndexEdit={currentIndexEdit}
              setLoading={setLoading}
              handleVideoUpload={handleVideoUpload}
            />
          </TabsContent>

          <TabsContent
            value="document"
            className="mt-6"
          >
            <DocumentSelector
              EditSubChapter={EditSubChapter}
              setSubChapter={setSubChapter}
              currentIndexEdit={currentIndexEdit}
            />
          </TabsContent>

          <TabsContent
            value="content"
            className="mt-6"
          >
            <ArticleEditor
              EditSubChapter={EditSubChapter}
              setSubChapter={setSubChapter}
              currentIndexEdit={currentIndexEdit}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Fixed component editors with proper typing
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
  handleVideoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="space-y-4">
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      {EditSubChapter.video ? (
        <div>
          <p className="text-green-600 mb-2">✓ Video sudah diupload</p>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById('video-upload')?.click()}
            >
              Ganti Video
            </Button>
            {EditSubChapter.video && (
              <div>
                <a
                  href={`${env.NEXT_PUBLIC_SUPABASE_VIDEO_URL}/course/${EditSubChapter.video}`}
                  target="_blank"
                  className="inline-block text-blue-600 hover:text-blue-800 text-sm"
                >
                  Lihat Video
                </a>
              </div>
            )}
          </div>
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
        onChange={handleVideoUpload}
      />
    </div>

    <div>
      <Label>Deskripsi Video</Label>
      <BlogEditor
        value={EditSubChapter.description}
        onChange={(value) => {
          setSubChapter((prev) =>
            prev.map((sChapter, sIndex) => {
              if (sIndex === currentIndexEdit) {
                return { ...sChapter, description: value };
              }
              return sChapter;
            }),
          );
        }}
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
        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 "
      >
        <div className="flex items-center gap-3 relative">
          <FileText className="h-5 w-5 text-gray-400" />
          <span>{selectedDoc?.title}</span>
          <X
            className="absolute right-2 w-4 h-4 hover:bg-gray-500 hover:text-white rounded-full"
            onClick={() => {
              setSubChapter((prev) =>
                prev.map((sChapter, sIndex) => {
                  if (sIndex === currentIndexEdit) {
                    return {
                      ...sChapter,
                      document: undefined,
                      documentTitle: undefined,
                    };
                  }
                  return sChapter;
                }),
              );
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Cari Dokumen</Label>
        <Input
          placeholder="Cari dokumen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="max-h-64 overflow-y-auto space-y-2">
        {documents?.map((doc) => (
          <div
            key={doc.id}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
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
  <div>
    <Label>Editor Materi</Label>
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
  </div>
);

export default SubChapterOption;
