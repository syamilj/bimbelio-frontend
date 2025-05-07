'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { SetStateAction, useState } from 'react';
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
import { mutateGeneral } from '@/lib/fetch-helper';
import { CreateSubCategorySchema } from '@/types/tryout';
import { Loader2 } from 'lucide-react';
import { CategoryWithSessions } from './tab';

const CreateSubCategoryModal = ({
  open,
  setOpen,
  categories,
  refresh,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  categories: CategoryWithSessions[] | undefined;
  refresh: () => Promise<void>;
}) => {
  // const { isOpen, onClose, type } = useModal();
  const [error, setError] = useState('');

  // const isModalOpen = isOpen && type === "createCategory";
  // const trpc = api.useUtils();

  // const { mutate: createSubCategoryMutate, isPending: isLoading } =
  //   api.tryoutCategory.createSubCategory.useMutation({
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
  const createSubCategoryMutate = async (data: any) => {
    mutateGeneral('/tryoutCategory/createSubCategory', {
      payload: data,
      type: 'post',
      setLoading: setIsLoading,
      onSuccess: refresh,
      onError({ message }) {
        setError(message);
      },
    });
  };

  const form = useForm<z.infer<typeof CreateSubCategorySchema>>({
    resolver: zodResolver(CreateSubCategorySchema),
  });

  function onSubmit(values: z.infer<typeof CreateSubCategorySchema>) {
    console.log('values', values);
    setError('');

    createSubCategoryMutate({ values: values });
  }

  const handleClose = () => {
    setError('');
    form.reset();
    setOpen(false);
  };

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
              disabled={isLoading}
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

export default CreateSubCategoryModal;
