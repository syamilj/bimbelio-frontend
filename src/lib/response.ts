import { toaster } from "@/components/ui/toaster";
import axiosInstance from "./axios/axiosInstance";

export const responseError = (error: any, showToast?: boolean) => {
  console.log({ error });
  if (showToast) {
    toaster({
      title: "Error",
      condition: "warning",
      description:
        (error as any).response.data.message || "Internal Server Error",
    });
  }
  return {
    error,
    message:
      ((error as any)?.response?.data?.message as string) ||
      "Internal Server Error",
    status: ((error as any)?.response?.data?.status as number) || 500,
  };
};

export const response = (
  res: any,
  showToast?: boolean
): { message: string; status: number; data?: any } => {
  console.log({ res });
  if (showToast) {
    toaster({
      title: "Successfully",
      condition: "success",
      description: res.data.message || "Succesfully",
    });
  }
  return res.data;
};
