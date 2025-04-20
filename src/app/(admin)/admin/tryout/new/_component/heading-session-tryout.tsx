"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toaster } from "@/components/ui/toaster";

import { Loader2 } from "lucide-react";
import React, { SetStateAction, useState } from "react";
import { Category, SessionProps } from "../page";
import ModalDeleteSession from "./modal-delete";
import axiosInstance from "@/lib/axios/axiosInstance";
import { response, responseError } from "@/lib/response";
// import { toaster } from "@/lib/utils";
// import { useCompletion } from "ai/react";

interface Props {
  EditSession: SessionProps;
  category: Category[] | undefined;
  assessmentType: string;
  setAssesmentType: React.Dispatch<SetStateAction<string>>;
  setSessions: React.Dispatch<SetStateAction<SessionProps[]>>;
  currentIndexEdit: number | null;
  setCurrentIndexEdit: React.Dispatch<SetStateAction<number | null>>;
}

type QuestionProps = {
  number: number;
  question: string;
  image?: string;
  explanation?: string;
  subCategory?: string;
  Answers: AnswerProps[];
};
type AnswerProps = {
  answer: string;
  value: number;
};

const HeadingSessionTryout = ({
  EditSession,
  category,
  assessmentType,
  setAssesmentType,
  setSessions,
  currentIndexEdit,
  setCurrentIndexEdit,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  console.log("EditSession2", EditSession);

  // const { mutateAsync: generateTryout } = api.tryout.generateTryout.useMutation(
  //   {
  //     onSuccess() {
  //       toaster({
  //         title: "Berhasil",
  //         condition: "success",
  //         description: "Berhasil generate soal",
  //         duration: 3000,
  //       });
  //       setLoading(false);
  //     },
  //     onError() {
  //       toaster({
  //         title: "Error",
  //         condition: "warning",
  //         description: "Gagal generate soal",
  //         duration: 3000,
  //       });
  //       setLoading(false);
  //     },
  //   }
  // );

  const generateTryout = async (context: string) => {
    try {
      const res = await axiosInstance.post("/tryout/generateTryout", {
        context,
      });
      const resData = response(res, true);
      return resData.data as QuestionProps[];
    } catch (error) {
      responseError(error, true);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    const input = document.getElementById(
      "context-for-generate-ai"
    ) as HTMLTextAreaElement;
    if (input.value.length < 10) {
      toaster({
        title: "Gagal",
        condition: "warning",
        description: "Masukan Conteks untuk generate soal tryout",
        duration: 3000,
      });
      return;
    }
    setLoading(true);
    const res = await generateTryout(input.value);
    const data = res;
    setSessions((prev) =>
      prev.map((session) => {
        console.log("=========================", session.assessmentType);
        return {
          ...session,
          Questions: [
            ...session.Questions,
            ...data.map((quest) => {
              return {
                number: quest.number + session.Questions.length,
                question: quest.question,
                Answers: quest.Answers.map((answer) => {
                  let value = 0;
                  if (session.assessmentType === "1-5") {
                    value = answer.value;
                  } else if (session.assessmentType === "+5/0") {
                    if (answer.value === 5) value = 5;
                    else value = 0;
                  } else if (session.assessmentType === "IRT") {
                    if (answer.value === 5) value = 5;
                    else value = 0;
                  } else if (session.assessmentType === "+4/-1/0") {
                    if (answer.value === 5) value = 4;
                    else value = -1;
                  }
                  return {
                    answer: answer.answer,
                    value,
                  };
                }),
              };
            }),
          ],
        };
      })
    );
    console.log("data", data);
  };

  const onChangeCategory = (value: string) => {
    if (value === "") {
      setSessions((prev) =>
        prev.map((item, i: number) => {
          if (i === currentIndexEdit) {
            return {
              ...item,
              categoryId: "",
              category: "",
            };
          }
          return { ...item };
        })
      );
    }
    const categoryId = value.split("-")[0];
    const category = value.split("-")[1];
    setSessions((prev) =>
      prev.map((item, i: number) => {
        if (i === currentIndexEdit) {
          return {
            ...item,
            categoryId,
            category,
            subCategory: "",
            subCategoryId: "",
          };
        }
        return { ...item };
      })
    );
  };

  const onChangeSubCategory = (value: string) => {
    if (value === "") {
      setSessions((prev) =>
        prev.map((item, i: number) => {
          if (i === currentIndexEdit) {
            return {
              ...item,
              subCategoryId: "",
              subCategory: "",
            };
          }
          return { ...item };
        })
      );
    }
    const subCategoryId = value.split("-")[0];
    const subCategory = value.split("-")[1];
    setSessions((prev) =>
      prev.map((item, i: number) => {
        if (i === currentIndexEdit) {
          return {
            ...item,
            subCategoryId,
            subCategory,
          };
        }
        return { ...item };
      })
    );
  };

  const onChangeDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setSessions((prev) =>
        prev.map((item, i: number) => {
          if (i === currentIndexEdit) {
            return {
              ...item,
              duration: "",
            };
          }
          return { ...item };
        })
      );
      return;
    }
    setSessions((prev) =>
      prev.map((item, i: number) => {
        if (i === currentIndexEdit) {
          return {
            ...item,
            duration: parseInt(e.target.value),
          };
        }
        return { ...item };
      })
    );
  };

  const changeQuestionAssestmentType = (assessmentType: string) => {
    if (EditSession === null) return;
    if (assessmentType === "1-5") {
      console.log("jalan 1-5");
      setSessions((prev) =>
        prev.map((item, sessionIndex: number) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2) => {
                if (item2.Answers && item2.Answers.length > 4) {
                  let value = 0;
                  return {
                    ...item2,
                    Answers: item2.Answers?.map((answer) => {
                      if (item.assessmentType === "+4/-1/0") {
                        if (answer.value !== 4) {
                          value = value + 1;
                          return { ...answer, value: value };
                        }
                        return { ...answer, value: 5 };
                      } else {
                        if (answer.value !== 5) {
                          value = value + 1;
                          return { ...answer, value: value };
                        }
                        return { ...answer, value: 5 };
                      }
                    }),
                  };
                }
                return item2;
              }),
            };
          }
          return { ...item };
        })
      );
      return;
    } else if (assessmentType === "+5/0") {
      console.log("jalan +5/0");
      setSessions((prev) =>
        prev.map((item, sessionIndex: number) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2) => {
                if (item2.Answers && item2.Answers.length > 4) {
                  return {
                    ...item2,
                    Answers: item2.Answers?.map((answer) => {
                      if (item.assessmentType === "+4/-1/0") {
                        if (answer.value !== 4) {
                          return { ...answer, value: 0 };
                        }
                        return { ...answer, value: 5 };
                      } else {
                        if (answer.value !== 5) {
                          return { ...answer, value: 0 };
                        }
                        return { ...answer, value: 5 };
                      }
                    }),
                  };
                }
                return item2;
              }),
            };
          }
          return { ...item };
        })
      );
      return;
    } else if (assessmentType === "IRT") {
      console.log("jalan IRT");
      setSessions((prev) =>
        prev.map((item, sessionIndex: number) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2) => {
                if (item2.Answers && item2.Answers.length > 4) {
                  return {
                    ...item2,
                    Answers: item2.Answers?.map((answer) => {
                      if (item.assessmentType === "+4/-1/0") {
                        if (answer.value !== 4) {
                          return { ...answer, value: 0 };
                        }
                        return { ...answer, value: 5 };
                      } else {
                        if (answer.value !== 5) {
                          return { ...answer, value: 0 };
                        }
                        return { ...answer, value: 5 };
                      }
                    }),
                  };
                }
                return item2;
              }),
            };
          }
          return { ...item };
        })
      );
      return;
    } else if (assessmentType === "+4/-1/0") {
      console.log("+4/-1/0");
      setSessions((prev) =>
        prev.map((item, sessionIndex: number) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2) => {
                if (item2.Answers && item2.Answers.length > 4) {
                  return {
                    ...item2,
                    Answers: item2.Answers?.map((answer) => {
                      if (answer.value !== 5) {
                        return { ...answer, value: -1 };
                      }
                      return { ...answer, value: 4 };
                    }),
                  };
                }
                return item2;
              }),
            };
          }
          return { ...item };
        })
      );
      return;
    }
  };

  const deleteSession = () => {
    setCurrentIndexEdit(null);
    setSessions((prev) =>
      prev.filter((_, i: number) => i !== currentIndexEdit)
    );
  };

  if (!EditSession) {
    return null;
  }

  return (
    <>
      <div
        id="heading"
        className="flex shrink-0 flex-col gap-[1rem] overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-[.5rem]">
            <div className="relative w-full overflow-visible rounded-[.8rem] border border-transparent bg-white duration-300 md:hover:shadow-default">
              <input
                type="text"
                value={
                  EditSession.categoryId
                    ? `${EditSession.categoryId}-${EditSession.category}`
                    : ""
                }
                required
                className="absolute bottom-0 left-[1rem] h-1 w-1 p-0 text-transparent outline-none"
              />
              <Select
                value={
                  EditSession.categoryId
                    ? `${EditSession.categoryId}-${EditSession.category}`
                    : "placeholder"
                }
                onValueChange={(value) => {
                  onChangeCategory(value);
                }}
              >
                <SelectTrigger className="h-full w-full rounded-[.8rem] border-none bg-white shadow-none outline-none">
                  <SelectValue placeholder="Tes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>
                    Tes
                  </SelectItem>
                  {category?.map((item) => (
                    <SelectItem key={item.id} value={`${item.id}-${item.name}`}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {EditSession.categoryId && EditSession.categoryId?.length > 0 && (
              <div className="relative w-full overflow-visible rounded-[.8rem] border border-transparent bg-white duration-300 md:hover:shadow-default">
                <input
                  type="text"
                  value={
                    EditSession.subCategoryId
                      ? `${EditSession.subCategoryId}-${EditSession.subCategory}`
                      : ""
                  }
                  required
                  className="absolute bottom-0 left-[1rem] h-1 w-1 p-0 text-transparent outline-none"
                />
                <Select
                  value={
                    EditSession.subCategoryId
                      ? `${EditSession.subCategoryId}-${EditSession.subCategory}`
                      : "placeholder"
                  }
                  onValueChange={(value) => {
                    onChangeSubCategory(value);
                  }}
                >
                  <SelectTrigger className="h-full w-full rounded-[.8rem] border-none bg-white shadow-none outline-none">
                    <SelectValue placeholder="Sub Tes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>
                      Sub Tes
                    </SelectItem>
                    {category
                      ?.find((item) => item.id === EditSession.categoryId)
                      ?.TryoutSubCategory.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={`${item.id}-${item.name}`}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <input
              type="number"
              placeholder="Durasi waktu"
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] text-[.9rem] outline-none duration-100 focus:shadow-default md:hover:shadow-default"
              required
              value={EditSession.duration === 0 ? "" : EditSession.duration}
              onChange={(e) => onChangeDuration(e)}
            />

            <div className="w-full overflow-visible rounded-[.8rem] border border-transparent bg-white duration-300 md:hover:shadow-default">
              <input
                type="text"
                defaultValue={assessmentType !== "" ? `${assessmentType}` : ""}
                required
                className="absolute bottom-0 left-[1rem] h-1 w-1 p-0 text-transparent outline-none"
              />
              <Select
                value={
                  assessmentType !== "" ? `${assessmentType}` : "placeholder"
                }
                onValueChange={(value) => {
                  setAssesmentType(value);
                  changeQuestionAssestmentType(value);
                }}
              >
                <SelectTrigger className="h-full w-full rounded-[.8rem] border-none bg-white shadow-none outline-none">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>
                    Penilain
                  </SelectItem>
                  <SelectItem value="1-5">1-5</SelectItem>
                  <SelectItem value="+5/0">+5/0</SelectItem>
                  <SelectItem value="IRT">IRT</SelectItem>
                  <SelectItem value="+4/-1/0">+4/-1/0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ModalDeleteSession deleteSession={deleteSession} />
        </div>
        <div className="grid w-full grid-cols-2 gap-[1rem]">
          <div className="flex w-full flex-col gap-[.5rem]">
            <p className="font-medium">Judul sesi</p>
            <input
              type="text"
              placeholder="Judul sesi...."
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] text-[.9rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              required
              value={EditSession.name}
              onChange={(e) => {
                setSessions((prev) =>
                  prev.map((item, i) => {
                    if (i === currentIndexEdit) {
                      return { ...item, name: e.target.value };
                    }
                    return { ...item };
                  })
                );
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-[.5rem]">
            <p className="font-medium">
              Ambang batas{" "}
              <span className="text-main-gray-text2">(optional)</span>
            </p>
            <input
              type="number"
              placeholder="Ambang batas...."
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] text-[.9rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              value={
                EditSession.thresholdValue === 0
                  ? ""
                  : EditSession.thresholdValue
              }
              onChange={(e) => {
                setSessions((prev) =>
                  prev.map((item, i) => {
                    if (i === currentIndexEdit) {
                      return {
                        ...item,
                        thresholdValue: parseInt(e.target.value),
                      };
                    }
                    return { ...item };
                  })
                );
              }}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-[.5rem] pb-[.8rem]">
          <div className="flex w-full items-center justify-between">
            <p className="font-medium">Generate soal</p>
            <div
              className="shrink-0 cursor-pointer rounded-[.4rem] bg-blue-100 px-[1rem] py-[.2rem] text-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
              onClick={() => {
                handleGenerate();
              }}
            >
              Generate
            </div>
          </div>
          <textarea
            id="context-for-generate-ai"
            placeholder="Conteks.."
            className="w-full shrink-0 rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
          />
        </div>
      </div>
      {loading && (
        <Dialog open={true}>
          <DialogContent
            className="overflow-hidden border-none bg-[#fff0] p-0 shadow-none"
            classOverlay="bg-[#ffffffe3]"
            hideClose
          >
            <div className="z-[100000000] flex items-center justify-center p-[1.5rem]">
              <div className="flex flex-col items-center">
                <Loader2 className="h-[2rem] w-[2rem] animate-spin" />
                <p className="text-center text-[1.1rem] font-medium">
                  AI Sedang Generate soal Tryout{" "}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default HeadingSessionTryout;
