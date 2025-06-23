'use client';

import BlogEditor from '@/components/ui/blog-editor';
import { LoadingPopUp } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import {
  IconDown,
  IconFullscreen,
  IconMinimizeScreen,
  IconPlus,
  IconUp,
  IconUploadImage,
} from '@/styles/icon';
import { supabase } from '@/supabaseClient';
import { Document } from '@/types/database';
import 'katex/dist/katex.min.css';
import React, { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import ModalImportExcel from '../../../_component/modal-import-excel';
import { QuestionProps, SubChapterProps } from '../page';
import SubChapterHeading from './sub-chapter-heading';
import SubChapterQuestion from './sub-chapter-question';

// const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
//   ssr: false,
// });

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

  const [headingSessionHeight, setHeadingSessionHeight] = useState<number>(0);
  const [showHeadingSession, setShowHeadingSession] = useState<boolean>(true);

  const [listQuestionHeight, setListQuestionHeight] = useState<number>(0);
  const [showListQuestion, setShowListQuestion] = useState<boolean>(true);

  const remarkMathOptions = {
    singleDollarTextMath: false,
  };

  const addQuestion = () => {
    if (EditSubChapter === null) return;
    const div = document.querySelector(
      '#tryout-admin #numberList',
    ) as HTMLDivElement;
    div.style.height = 'auto';
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

  // const handleChangeDocument = async (e: ChangeEvent<HTMLInputElement>) => {
  //   setLoading(true);
  //   if (e.target.files) {
  //     const file = e.target.files[0];
  //     const nameFile =
  //       EditSubChapter?.document === undefined
  //         ? `${crypto.randomUUID()}`
  //         : EditSubChapter?.document;
  //     if (file.type !== 'application/pdf') {
  //       toaster({
  //         title: 'Error',
  //         condition: 'warning',
  //         description: 'File yang di-upload tidak sesuai',
  //         duration: 3000,
  //       });
  //       setLoading(false);
  //       return;
  //     }
  //     // if (EditSubChapter?.document && EditSubChapter.document.length > 0) {
  //     //     const { data, error } = await supabase.storage.from("pdf").remove([`course/${EditSubChapter?.document}`])
  //     //     if (error) {
  //     //         toaster({
  //     //             title: "Error",
  //     //             condition: "warning",
  //     //             description: "Gagal mengupload file, silahkan coba lagi",
  //     //             duration: 3000
  //     //         })
  //     //         setLoading(false)
  //     //         return
  //     //     }
  //     //     if (data.length === 0) {
  //     //         toaster({
  //     //             title: "Error",
  //     //             condition: "warning",
  //     //             description: "Gagal mengupload file, silahkan coba lagi",
  //     //             duration: 3000
  //     //         })
  //     //         setLoading(false)
  //     //         return
  //     //     }
  //     // }
  //     if (EditSubChapter?.document !== undefined) {
  //       const { error } = await supabase.storage
  //         .from('pdf')
  //         .update(`course/${nameFile}`, file);

  //       if (error) {
  //         toaster({
  //           title: 'Error',
  //           condition: 'warning',
  //           description: 'Gagal mengubah file, silahkan coba lagi',
  //           duration: 3000,
  //         });
  //         setSubChapter(prev =>
  //           prev.map((sChapter, sIndex) => {
  //             if (sIndex === currentIndexEdit) {
  //               return {
  //                 ...sChapter,
  //                 title: sChapter.title,
  //                 description: sChapter.description,
  //                 spendTime: sChapter.spendTime,
  //                 type: sChapter.type,
  //                 document: sChapter.document,
  //               };
  //             }
  //             return { ...sChapter };
  //           }),
  //         );
  //         setLoading(false);
  //         return;
  //       }
  //     } else {
  //       const { error } = await supabase.storage
  //         .from('pdf')
  //         .upload(`course/${nameFile}`, file);

  //       if (error) {
  //         toaster({
  //           title: 'Error',
  //           condition: 'warning',
  //           description: 'Gagal mengubah file, silahkan coba lagi',
  //           duration: 3000,
  //         });
  //         setSubChapter(prev =>
  //           prev.map((sChapter, sIndex) => {
  //             if (sIndex === currentIndexEdit) {
  //               return {
  //                 ...sChapter,
  //                 title: sChapter.title,
  //                 description: sChapter.description,
  //                 spendTime: sChapter.spendTime,
  //                 type: sChapter.type,
  //                 document: sChapter.document,
  //               };
  //             }
  //             return { ...sChapter };
  //           }),
  //         );
  //         setLoading(false);
  //         return;
  //       }
  //     }

  //     setSubChapter(prev =>
  //       prev.map((sChapter, sIndex) => {
  //         if (sIndex === currentIndexEdit) {
  //           return {
  //             ...sChapter,
  //             document: nameFile,
  //           };
  //         }
  //         return { ...sChapter };
  //       }),
  //     );
  //   }
  //   setLoading(false);
  // };

  const handleChangeVideo = async (e: ChangeEvent<HTMLInputElement>) => {
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
      if (EditSubChapter?.video && EditSubChapter?.video.length > 0) {
        const { data, error } = await supabase.storage
          .from('video')
          .remove([`course/${EditSubChapter?.video}`]);
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
      const { error } = await supabase.storage
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

  useEffect(() => {});

  if (!EditSubChapter || currentIndexEdit === null) {
    return null;
  }

  return (
    <div className="absolute left-0 top-0 flex h-full w-full flex-col gap-[1rem] overflow-y-auto border-l p-[1rem] pb-[100px] text-[.9rem]">
      {loading && <LoadingPopUp title="Sedang Mengupload File..." />}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[1rem]">
          <h1 className="text-[1.2rem] font-medium">
            Sub Chapter {currentIndexEdit + 1}
          </h1>
          {showDetailSubChapter ? (
            <div
              className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
              onClick={() => {
                setShowDetailSubChapter(false);
              }}
            >
              <IconFullscreen w={15} />
            </div>
          ) : (
            <div
              className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
              onClick={() => {
                setShowDetailSubChapter(true);
              }}
            >
              <IconMinimizeScreen w={15} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ModalImportExcel
            setSubChapter={setSubChapter}
            assessmentType="+5/0"
            currentIndexEdit={currentIndexEdit}
          />
          <div
            className="cursor-pointer text-main-gray-text duration-300 md:hover:text-black"
            onClick={() => {
              const div = document.querySelector(
                '#tryout-admin #heading',
              ) as HTMLDivElement;
              if (div) {
                if (div.clientHeight !== 0) {
                  div.style.height = `${div.clientHeight}px`;
                  setHeadingSessionHeight(div.clientHeight);
                  setShowHeadingSession(false);
                } else {
                  setShowHeadingSession(true);
                }
                div.style.height =
                  div.clientHeight === 0 ? `${headingSessionHeight}px` : '0px';
                div.style.overflow = 'hidden';
                div.style.transition = 'height 0.3s ease';
              }
            }}
          >
            {showHeadingSession ? <IconUp /> : <IconDown />}
          </div>
        </div>
      </div>
      <SubChapterHeading
        EditSubChapter={EditSubChapter}
        setSubChapter={setSubChapter}
        currentIndexEdit={currentIndexEdit}
        setCurrentIndexEdit={setCurrentIndexEdit}
      />
      <div className="my-[.5rem] h-[1px] w-full shrink-0 bg-main-gray-disabled/60" />
      {EditSubChapter.type === 'VIDEO' ? (
        <VideoType
          EditSubChapter={EditSubChapter}
          setSubChapter={setSubChapter}
          handleChangeVideo={handleChangeVideo}
          currentIndexEdit={currentIndexEdit}
        />
      ) : EditSubChapter.type === 'DOCUMENT' ? (
        <DocumentType
          EditSubChapter={EditSubChapter}
          setSubChapter={setSubChapter}
          currentIndexEdit={currentIndexEdit}
        />
      ) : EditSubChapter.type === 'TRYOUT' ? (
        <>
          <div className="mb-[.5rem] flex w-full items-center justify-between">
            <h1 className="text-[1.1rem] font-medium">Daftar soal</h1>

            <div
              className="cursor-pointer text-main-gray-text duration-300 md:hover:text-black"
              onClick={() => {
                const div = document.querySelector(
                  '#tryout-admin #numberList',
                ) as HTMLDivElement;
                if (div) {
                  if (div.clientHeight !== 0) {
                    div.style.height = `${div.clientHeight}px`;
                    setListQuestionHeight(div.clientHeight);
                    setShowListQuestion(false);
                  } else {
                    setShowListQuestion(true);
                  }
                  div.style.height =
                    div.clientHeight === 0 ? `${listQuestionHeight}px` : '0px';
                  div.style.overflow = 'hidden';
                  div.style.transition = 'height 0.3s ease';
                }
              }}
            >
              {showListQuestion ? <IconUp /> : <IconDown />}
            </div>
          </div>
          <div
            id="numberList"
            className="mt-[-1rem] flex shrink-0 flex-wrap items-center justify-start gap-[.5rem]"
          >
            {EditSubChapter.Questions &&
              EditSubChapter.Questions?.length > 0 &&
              EditSubChapter.Questions?.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className={cn(
                    'flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[.8rem] bg-white font-medium text-main-gray-text duration-300 md:hover:bg-main-gray-input md:active:shadow-default',
                    qIndex === questionIndex &&
                      'bg-main text-white md:hover:bg-main',
                  )}
                  onClick={() => setQuestionIndex(qIndex)}
                >
                  {question.number}
                </div>
              ))}
            <div
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[.8rem] bg-blue-100 font-medium text-blue-600 duration-300 md:hover:bg-blue-200 md:hover:shadow-default md:active:bg-blue-100"
              onClick={addQuestion}
            >
              <IconPlus w={15} />
            </div>
          </div>
          <div id="question">
            <SubChapterQuestion
              EditSubChapter={EditSubChapter}
              questionIndex={questionIndex}
              setQuestionIndex={setQuestionIndex}
              currentIndexEdit={currentIndexEdit}
              assessmentType={assessmentType}
              setSubChapter={setSubChapter}
            />
          </div>
        </>
      ) : EditSubChapter.type === 'MATERI' ? (
        <div
          id="blog-admin"
          className="rounded-lg ml-6"
        >
          <BlogEditor
            value={EditSubChapter.materi}
            onChange={(value) => {
              setSubChapter((prev) =>
                prev.map((sChapter, sIndex) => {
                  if (sIndex === currentIndexEdit) {
                    return {
                      ...sChapter,
                      materi: value,
                    };
                  }
                  return sChapter;
                }),
              );
            }}
          />
          {/* <MDEditor
            value={EditSubChapter.materi}
            height={'70vh'}
            onChange={(val) => {
              const processedValue = replaceLatexNotation(val ?? '');
              // setValue(processedValue);
              setSubChapter((prev) =>
                prev.map((sChapter, sIndex) => {
                  if (sIndex === currentIndexEdit) {
                    return {
                      ...sChapter,
                      materi: processedValue,
                    };
                  }
                  return sChapter;
                }),
              );
            }}
            previewOptions={{
              remarkPlugins: [[remarkMath, remarkMathOptions], remarkGfm],
              rehypePlugins: [rehypeKatex, rehypeRaw],
              className: 'ReactMarkdown',
            }}
          /> */}
        </div>
      ) : null}
    </div>
  );
};

const VideoType = ({
  EditSubChapter,
  handleChangeVideo,
  setSubChapter,
  currentIndexEdit,
}: {
  EditSubChapter: SubChapterProps;
  handleChangeVideo: (e: ChangeEvent<HTMLInputElement>) => void;
  setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>;
  currentIndexEdit: number | null;
}) => {
  const remarkMathOptions = {
    singleDollarTextMath: false,
  };
  return (
    <div className="flex flex-col gap-[.5rem]">
      <p className="ml-[1rem]">Video</p>
      <div className="flex w-full flex-col gap-[1rem] rounded-[1rem] border-2 border-dashed border-main-gray-input p-[1rem]">
        <div className="flex w-full justify-center">
          <IconUploadImage
            className="text-main"
            w={26}
          />
        </div>
        {!EditSubChapter.video ? (
          <p className="text-center text-main-gray-text">
            Pilih video untuk di-upload (.mp4)
          </p>
        ) : (
          <p className="text-center text-main-gray-text">
            {EditSubChapter?.video}.mp4
          </p>
        )}

        {EditSubChapter.video && (
          <a
            href={`${env.NEXT_PUBLIC_SUPABASE_VIDEO_URL}/course/${EditSubChapter.video}`}
            target="_blank"
            className="font-regular relative mt-[-.5rem] flex w-full cursor-pointer select-none justify-center rounded-[.8rem] border-2 py-[.5rem] text-center text-main-gray-text duration-300 md:hover:bg-main-gray-input md:active:bg-white"
          >
            Lihat Video
          </a>
        )}
        <div
          className="font-regular relative mt-[-.5rem] flex w-full cursor-pointer select-none justify-center rounded-[.8rem] border-2 py-[.5rem] text-center text-main-gray-text duration-300 md:hover:bg-main-gray-input md:active:bg-white"
          onClick={() => {
            const input = document.getElementById(
              'sub-chapter-upload-video',
            ) as HTMLInputElement;
            input.click();
          }}
        >
          {EditSubChapter.video ? 'Upload Ulang' : 'Upload'} Video
          <div className="absolute top-[100%]">
            <div className="absolute left-0 top-0 h-full w-full bg-workspace"></div>
            <input
              id="sub-chapter-upload-video"
              type="file"
              className="h-1 w-1 p-0"
              required={EditSubChapter.video ? false : true}
              onChange={(e) => {
                handleChangeVideo(e);
              }}
            />
          </div>
        </div>
      </div>

      <div
        id="blog-admin"
        className="rounded-lg ml-6"
      >
        <BlogEditor
          value={EditSubChapter.description}
          onChange={(value) => {
            setSubChapter((prev) =>
              prev.map((sChapter, sIndex) => {
                if (sIndex === currentIndexEdit) {
                  return {
                    ...sChapter,
                    description: value,
                  };
                }
                return sChapter;
              }),
            );
          }}
        />
        {/* <MDEditor
          value={EditSubChapter.description}
          height={'70vh'}
          onChange={(val) => {
            const processedValue = replaceLatexNotation(val ?? '');
            // setValue(processedValue);
            setSubChapter((prev) =>
              prev.map((sChapter, sIndex) => {
                if (sIndex === currentIndexEdit) {
                  return {
                    ...sChapter,
                    description: processedValue,
                  };
                }
                return sChapter;
              }),
            );
          }}
          previewOptions={{
            remarkPlugins: [[remarkMath, remarkMathOptions], remarkGfm],
            rehypePlugins: [rehypeKatex, rehypeRaw],
            className: 'ReactMarkdown',
          }}
        /> */}
      </div>
    </div>
  );
};

const DocumentType = ({
  EditSubChapter,
  setSubChapter,
  currentIndexEdit,
}: {
  EditSubChapter: SubChapterProps;
  setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>;
  currentIndexEdit: number | null;
}) => {
  const [inputData, setInputData] = useState<{
    id: string;
    name: string;
    disabled: boolean;
  }>({
    id: '',
    name: '',
    disabled: false,
  });
  const [showSearchData, setShowSearchData] = useState<boolean>(false);

  // const { data: searchData } = api.document.getDocumentAdminCourse.useQuery(
  //   { title: inputData.name },
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   },
  // );

  const { data: searchData } = useGet<Document[]>(
    '/document/getDocumentAdminCourse',
    {
      params: { title: inputData.name },
      useEffectDependencies: [inputData],
    },
  );

  useEffect(() => {
    if (EditSubChapter.document && EditSubChapter.document.length > 0) {
      setInputData((prev) => ({
        ...prev,
        name: EditSubChapter.documentTitle || '',
        id: EditSubChapter.document || '',
        disabled: true,
      }));
    }
  }, [EditSubChapter]);

  return (
    <div className="flex flex-col gap-[.5rem]">
      <p className="ml-[1rem]">Document</p>
      <div className="relative">
        {inputData.disabled && (
          <div
            className="absolute bottom-[calc(100%+.5rem)] left-[6rem] cursor-pointer rounded-[.5rem] bg-main px-[1rem] py-[.2rem] text-[.7rem] text-white hover:bg-main-hover active:bg-main"
            onClick={() => {
              setInputData((prev) => ({
                ...prev,
                id: '',
                disabled: false,
              }));
            }}
          >
            <p>Change</p>
          </div>
        )}
        <input
          type="text"
          placeholder={`Input Name...`}
          className="border-main-gray-border w-full rounded-[.5rem] border px-[1rem] py-[.7rem] outline-none"
          onChange={(e) => {
            setInputData((prev) => ({ ...prev, name: e.target.value }));
          }}
          value={inputData.name}
          disabled={inputData.disabled}
          required={true}
          onFocus={() => {
            setShowSearchData(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowSearchData(false);
            }, 100);
          }}
        />
        {showSearchData && (
          <div className="absolute left-0 top-[100%] flex h-fit w-full flex-col rounded-[.5rem] border bg-white">
            {searchData?.map((document, index) => (
              <div
                key={index}
                className="p-[.5rem] hover:bg-main-hover hover:text-white"
                onClick={() => {
                  setInputData((prev) => ({
                    ...prev,
                    name: document.title,
                    id: document.id,
                    disabled: true,
                  }));
                  setSubChapter((prev) =>
                    prev.map((sChapter, sIndex) => {
                      if (sIndex === currentIndexEdit) {
                        return {
                          ...sChapter,
                          document: document.id,
                          documentTitle: document.title,
                        };
                      }
                      return { ...sChapter };
                    }),
                  );
                }}
              >
                {document.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubChapterOption;
