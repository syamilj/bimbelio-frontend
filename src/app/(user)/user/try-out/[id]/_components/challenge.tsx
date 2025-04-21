import { cn } from "@/lib/utils";
import { QuestionTypeEnum, TryoutAnswer } from "@/types/database";
import { Dispatch, SetStateAction } from "react";
import Card from "./card";

interface ChallengeProps {
  answers: TryoutAnswer[];
  onInput: (value: string) => void;
  inputValue?: string;
  status: "correct" | "wrong" | "none" | "complete";
  selectedOption?: string;
  selectedOptions?: string[];
  disabled?: boolean;
  type: QuestionTypeEnum;
  setSessionAnswer: Dispatch<SetStateAction<any>>;
  index: number;
  sessionAnswer: any;
}

const Challenge = ({
  answers,
  onInput,
  status,
  inputValue,
  selectedOption,
  disabled,
  type,
  selectedOptions,
  setSessionAnswer,
  index,
  sessionAnswer,
}: ChallengeProps) => {
  const handleSelect = (id: string, answer: string, index: number) => {
    // if (type === "MCQ" || "TRUE_FALSE") {
    //   onSelect(id);
    // } else {
    // }
    if (sessionAnswer[index].answerId === id) {
      setSessionAnswer((prev: any) =>
        prev.map((item: any, i: number) =>
          i === index ? { ...item, answerId: "", answer: "", type: type } : item
        )
      );
    } else {
      setSessionAnswer((prev: any) =>
        prev.map((item: any, i: number) =>
          i === index
            ? { ...item, answerId: id, answer: answer, type: type }
            : item
        )
      );
    }
  };

  return (
    <div className={cn("grid grid-cols-1 gap-[1rem]")}>
      {answers?.map((answer, i) => (
        <Card
          key={answer.id}
          // id={answer.id}
          text={answer.answer}
          shortcut={i + 1}
          inputValue={inputValue}
          onClick={() => handleSelect(answer.id, answer.answer, index)}
          type={type}
          status={status}
          selected={
            type === "OBJECTIVE_5" || type === "TRUE_FALSE"
              ? selectedOption === answer.id
              : selectedOptions?.includes(answer.id)
          }
          disabled={disabled}
          onInput={onInput}
        />
      ))}
    </div>
  );
};

export default Challenge;
