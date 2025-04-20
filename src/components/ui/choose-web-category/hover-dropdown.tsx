"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { WebsiteCategory, WebsiteSubCategory } from "@/types/database";
import { cn } from "@/lib/utils";
import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";

type SubItem = {
  id: string;
  name: string;
  main_color: string;
  gradient_color: string;
  secondary_color: string;
};

type MenuItem = {
  id: string;
  name: string;
  sub: SubItem[];
};

interface HoverDropdownProps {
  items: (WebsiteCategory & {
    WebsiteSubCategory: WebsiteSubCategory[];
  })[];
  onSelect?: (subItem: WebsiteSubCategory) => void;
  value?: string;
}

export function HoverDropdown({ items, onSelect, value }: HoverDropdownProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [realValue, setRealValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="relative w-full">
      <button
        className={cn(
          "flex items-center justify-between px-6 py-3 rounded-xl text-white font-medium transition-colors bg-blue-500 hover:bg-blue-200 duration-300 w-full"
        )}
        style={{
          backgroundColor: websiteSubCategory?.main_color,
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span>{subCategory ? subCategory?.name : "Select Option"}</span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((category) => (
              <div key={category.id}>
                <div className="px-4 py-2 text-sm font-bold text-gray-700">
                  {category.name}
                </div>
                {category.WebsiteSubCategory.map((subItem) => (
                  <button
                    key={subItem.id}
                    className="w-full text-left px-8 py-2 text-sm hover:bg-gray-100"
                    style={{
                      borderLeft: `4px solid ${subItem.main_color}`,
                    }}
                    onClick={() => {
                      setRealValue(subItem.id);
                      if (onSelect) onSelect(subItem);
                    }}
                    role="menuitem"
                  >
                    {subItem.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
