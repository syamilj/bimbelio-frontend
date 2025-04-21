"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Globe,
  GraduationCap,
  Languages,
} from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { WebsiteCategory, WebsiteSubCategory } from "@/types/database";
import { cn } from "@/lib/utils";
import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { IconLeft, IconTailedArrowPrev } from "@/styles/icon";
import { useAppContext } from "@/components/provider/provider-app";

interface Props {
  items: (WebsiteCategory & {
    WebsiteSubCategory: WebsiteSubCategory[];
  })[];
  onSelect?: (subItem: WebsiteSubCategory) => void;
  value?: string;
  first?: boolean;
}

export function DialogWebCategory({ items, onSelect, value, first }: Props) {
  const { setMinimizeSidebar } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [realValue, setRealValue] = useState<string>("");

  const [webCatId, setWebCatId] = useState<string>("");

  const handleValueChange = useDebouncedCallback((value: string) => {
    setRealValue(value);
  }, 500);

  useEffect(() => {
    if (!value) return;
    handleValueChange(value);
  }, [value]);

  const category = items.find((item) =>
    item.WebsiteSubCategory.find((item2) => item2.id == realValue)
  );

  const subCategory = category
    ? category.WebsiteSubCategory.find((item) => item.id == realValue)
    : null;

  const selectedCategory = items.find((item) => item.id === webCatId);

  console.log({ items });

  return (
    <Dialog open={first || undefined}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-between px-6 py-3 rounded-xl text-white font-medium transition-colors duration-300 w-full bg-main hover:bg-main/80"
          )}
        >
          <span>{subCategory ? subCategory?.name : "Select Option"}</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            <div
              className={cn(
                "flex w-full justify-center",
                selectedCategory && "justify-start gap-4 items-center"
              )}
            >
              {selectedCategory && (
                <div
                  className="hover:-translate-x-1 duration-200 cursor-pointer"
                  onClick={() => setWebCatId("")}
                >
                  <IconTailedArrowPrev />
                </div>
              )}
              <p>
                {selectedCategory
                  ? selectedCategory.name
                  : "Pilih Kategori Bimbelio"}
              </p>
            </div>
          </DialogTitle>
          {!selectedCategory && (
            <p className="text-center text-muted-foreground text-sm px-4">
              Silahkan pilih kategori bimbel yang kamu minati, jangan khawatir
              ini bisa diubah sewaktu-waktu
            </p>
          )}
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          {webCatId.length === 0 &&
            items.map((cat) => {
              return (
                <button
                  key={cat.id}
                  className={cn(
                    "flex items-center justify-between px-6 py-6 rounded-3xl text-white"
                  )}
                  onClick={() => setWebCatId(cat.id)}
                  style={{
                    background: `linear-gradient(145deg, ${cat?.secondary_color}, ${cat?.main_color})`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5" />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>
              );
            })}
          {webCatId.length > 0 &&
            selectedCategory?.WebsiteSubCategory.map((sub) => {
              return (
                <button
                  key={sub.id}
                  className={cn(
                    "flex items-center justify-between px-6 py-6 rounded-3xl text-white "
                  )}
                  onClick={() => {
                    setRealValue(sub.id);
                    if (onSelect) onSelect(sub);
                  }}
                  style={{
                    background: `linear-gradient(145deg, ${sub?.secondary_color}, ${sub?.main_color})`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5" />
                    <span className="font-medium">{sub.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
