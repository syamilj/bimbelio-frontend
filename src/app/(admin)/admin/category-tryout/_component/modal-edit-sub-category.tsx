'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { SetStateAction, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormError from '@/components/ui/form-error';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response, responseError } from '@/lib/response';
import {
  TryoutAnswer,
  TryoutQuestion,
  TryoutSubCategory,
} from '@/types/database';
import { CreateSubCategorySchema } from '@/types/tryout';
import { Loader2 } from 'lucide-react';
import { CategoryWithSessions } from './tab';

interface QuestionWithAnswers extends TryoutQuestion {
  answers: TryoutAnswer[];
}

interface SubCategory {
  id?: string;
  subCategory?: TryoutSubCategory;
  question?: QuestionWithAnswers;
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  data: SubCategory;
  categories: CategoryWithSessions[] | undefined;
  refresh: () => Promise<void>;
}

const ModalEditSubCategory = ({
  open,
  setOpen,
  data,
  categories,
  refresh,
}: Props) => {
  // const { isOpen, onClose, type, data } = useModal();
  const [error, setError] = useState('');

  // const isModalOpen = isOpen && type === "editCategory";

  const { subCategory } = data || {};

  const form = useForm<z.infer<typeof CreateSubCategorySchema>>({
    resolver: zodResolver(CreateSubCategorySchema),
  });

  const {
    formState: { isDirty },
  } = form;

  useLayoutEffect(() => {
    if (subCategory) {
      form.setValue('name', subCategory.name);
      form.setValue('categoryId', subCategory.categoryId || '');
    }
  }, [subCategory, form]);
  // const trpc = api.useUtils();

  // const { mutate: updateCategoryMutate, isPending: isLoading } =
  //   api.tryoutCategory.updateSubCategory.useMutation({
  //     onSuccess() {
  //       trpc.tryoutCategory.getSubCategory.invalidate();
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
        `/tryoutCategory/updateSubCategory`,
        data,
      );
      await refresh();
      return response(res, true);
    } catch (error) {
      return responseError(error, true);
    } finally {
      setIsLoading(false);
    }
  };

  function onSubmit(values: z.infer<typeof CreateSubCategorySchema>) {
    setError('');

    const id = subCategory?.id;

    if (!id) {
      setError('Category id missing!');
      return null;
    }
    updateCategoryMutate({ values, id });
  }

  const handleClose = () => {
    setError('');
    form.reset();
    setOpen(false);
  };

  if (!data) {
    return null;
  }

  console.log({ subCategory });

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={`${item.id}`}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default ModalEditSubCategory;
