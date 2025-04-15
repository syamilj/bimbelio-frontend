"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { SetStateAction, useState } from "react";
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
// import { api } from "@/trpc/react";
import { CreateCategorySchema } from "@/types/tryout";
import { Loader2 } from "lucide-react";
import { response, responseError } from "@/lib/response";
import axiosInstance from "@/lib/axios/axiosInstance";
import { mutateGeneral } from "@/lib/fetch-helper";

const CreateCategoryModal = ({
  open,
  setOpen,
  refresh,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  refresh: () => Promise<void>;
}) => {
  // const { isOpen, onClose, type } = useModal();
  const [error, setError] = useState("");

  // const isModalOpen = isOpen && type === "createCategory";
  // const trpc = api.useUtils();

  // const { mutate: createCategoryMutate, isPending: isLoading } =
  //   api.tryoutCategory.createCategory.useMutation({
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
  const createCategoryMutate = async (data: any) => {
    mutateGeneral("/tryoutCategory/createCategory", {
      payload: data,
      type: "post",
      setLoading: setIsLoading,
      onSuccess: refresh,
      onError({ message }) {
        setError(message);
      },
    });
  };

  const form = useForm<z.infer<typeof CreateCategorySchema>>({
    resolver: zodResolver(CreateCategorySchema),
  });

  function onSubmit(values: z.infer<typeof CreateCategorySchema>) {
    console.log("values", values);
    setError("");

    createCategoryMutate({ values: values });
  }

  const handleClose = () => {
    setError("");
    form.reset();
    setOpen(false);
  };

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
            <Button type="submit" disabled={isLoading} className="w-full">
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

export default CreateCategoryModal;
