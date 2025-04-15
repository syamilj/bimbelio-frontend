"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { SetStateAction, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormError from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateCategorySchema } from "@/types/tryout";
import { TryoutAnswer, TryoutCategory, TryoutQuestion } from "@/types/database";
import { Loader2 } from "lucide-react";
import { response, responseError } from "@/lib/response";
import axiosInstance from "@/lib/axios/axiosInstance";

interface QuestionWithAnswers extends TryoutQuestion {
  answers: TryoutAnswer[];
}

interface Category {
  id?: string;
  category?: TryoutCategory;
  question?: QuestionWithAnswers;
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  data: Category;
  refresh: () => Promise<void>;
}

const ModalEditCategory = ({ open, setOpen, data, refresh }: Props) => {
  // const { isOpen, onClose, type, data } = useModal();
  const [error, setError] = useState("");

  // const isModalOpen = isOpen && type === "editCategory";

  const { category } = data || {};

  const form = useForm<z.infer<typeof CreateCategorySchema>>({
    resolver: zodResolver(CreateCategorySchema),
  });

  const {
    formState: { isDirty },
  } = form;

  useLayoutEffect(() => {
    if (category) {
      form.setValue("name", category.name);
      form.setValue("description", category.description || "");
      form.setValue("image", category.image || "");
    }
  }, [category, form]);
  // const trpc = api.useUtils();

  // const { mutate: updateCategoryMutate, isPending: isLoading } =
  //   api.tryoutCategory.updateCategory.useMutation({
  //     onSuccess() {
  //       trpc.tryoutCategory.getCategoryWithTryoutSession.refetch();
  //       // toast({
  //       //     variant: "success",
  //       //     title: 'Success',
  //       // });
  //       setError("");
  //       form.reset();
  //       setOpen(false);
  //     },
  //     onError(error) {
  //       setError(`${error.message}`);
  //     },
  //   });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateCategoryMutate = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.put(
        `/tryoutCategory/updateCategory`,
        data
      );
      await refresh();
      return response(res, true);
    } catch (error) {
      return responseError(error, true);
    } finally {
      setIsLoading(false);
    }
  };

  function onSubmit(values: z.infer<typeof CreateCategorySchema>) {
    setError("");

    const id = category?.id;

    if (!id) {
      setError("Category id missing!");
      return null;
    }
    updateCategoryMutate({ values, id });
  }

  const handleClose = () => {
    setError("");
    form.reset();
    setOpen(false);
  };

  if (!data) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Create Category(HCIP Storage, HCIP Datacom Advanced Routing &
            Switching Technology)
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        /> */}
            <FormError message={error} />
            <Button
              type="submit"
              disabled={isLoading || !isDirty}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <span>Save</span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditCategory;
