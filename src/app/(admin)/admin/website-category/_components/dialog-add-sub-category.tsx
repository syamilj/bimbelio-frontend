"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "@/components/ui/color-picker";
import { useAdminWebCategory } from "../page";
import { mutateGeneral } from "@/lib/fetch-helper";
import { Loader2 } from "lucide-react";

type WebsiteCategory = {
  id: string;
  name: string;
  main_color: string;
  secondary_color: string;
  createdAt: Date;
  updatedAt: Date;
};

interface Props {
  children: React.ReactNode;
  categories: WebsiteCategory[];
}

export function DialogAddSubCategory({ categories, children }: Props) {
  const { getData } = useAdminWebCategory();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mainColor, setMainColor] = useState("#0062FA");
  const [secondaryColor, setSecondaryColor] = useState("#0091FF");

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    const category = categories.find((c) => c.id === value);
    if (category) {
      setMainColor(category.main_color);
      setSecondaryColor(category.secondary_color);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateGeneral("/website-category/createSubCategory", {
      payload: {
        name,
        website_category_id: categoryId,
        main_color: mainColor,
        secondary_color: secondaryColor,
      },
      type: "post",
      onSuccess: async () => {
        setOpen(false);
        setMainColor("#FFFFFF");
        setSecondaryColor("#FFFFFF");
        await getData();
      },
      setLoading: setIsLoading,
    });
  };

  return (
    <Dialog open={isLoading ? true : open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Sub Web Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="sub-name">Name</Label>
            <Input
              id="sub-name"
              placeholder="Sub category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="web-category">Web Category</Label>
            <Select
              value={categoryId}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sub-main-color">Main Color</Label>
            <ColorPicker value={mainColor} onChange={setMainColor} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sub-secondary-color">Secondary Color</Label>
            <ColorPicker value={secondaryColor} onChange={setSecondaryColor} />
          </div>
          <Button type="submit" disabled={isLoading} className="mt-2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Sub Category"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
