import { Category, Instructor, LiveClass, LiveClassAgenda, LiveClassReference } from "@/types/database";

export type LiveClassAvailableType = LiveClass & {
  Instructor: Instructor;
  Category: Category;
  LiveClassReference: LiveClassReference[];
  LiveClassAgenda: LiveClassAgenda[];
  endDate: string;
  status: string;
};
