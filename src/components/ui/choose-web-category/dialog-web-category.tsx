'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { WebsiteCategory, WebsiteSubCategory } from '@/types/database';
import { ChevronRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../dialog';

interface Props {
  items: (WebsiteCategory & {
    WebsiteSubCategory: WebsiteSubCategory[];
  })[];
  onSelect?: (subItem: WebsiteSubCategory) => void;
  value?: string;
  first?: boolean;
}

export function DialogWebCategory({ items, onSelect, value, first }: Props) {
  useWebsiteSubCategory();
  const [realValue, setRealValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(!!first);

  const handleValueChange = useDebouncedCallback((value: string) => {
    setRealValue(value);
  }, 500);

  useEffect(() => {
    if (!value) return;
    handleValueChange(value);
  }, [value, handleValueChange]);

  const category = items.find((item) =>
    item.WebsiteSubCategory.find((item2) => item2.id === realValue),
  );
  const subCategory = category
    ? category.WebsiteSubCategory.find((item) => item.id === realValue)
    : null;

  // Filter categories and subcategories based on search query
  const filteredItems = items
    .map((cat) => ({
      ...cat,
      WebsiteSubCategory: cat.WebsiteSubCategory.filter((sub) =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter(
      (cat) =>
        cat.WebsiteSubCategory.length > 0 ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <button
          className={cn(
            'flex items-center justify-between px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 w-full bg-main hover:bg-main/90 shadow-md hover:shadow-lg',
          )}
        >
          <span className="truncate">
            {subCategory ? subCategory?.name : 'Pilih Kategori Bimbelio'}
          </span>
          <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-3xl">
        {/* Header */}
        <div className="p-6 pb-4 space-y-3 relative border-b">
          {/* Using DialogTitle for accessibility */}
          <DialogTitle className="text-center font-bold text-xl pt-2">
            Pilih Kategori Bimbelio
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm px-4">
            Silahkan pilih kategori bimbel yang kamu minati, jangan khawatir ini
            bisa diubah sewaktu-waktu
          </p>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kategori atau subkategori..."
              className="pl-10 bg-muted/30 rounded-full border-0 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories and Subcategories */}
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="divide-y">
              {filteredItems.map((cat) => (
                <div
                  key={cat.id}
                  className="py-5 px-6"
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <div
                      className="w-2 h-6 rounded-full mr-2"
                      style={{ backgroundColor: cat.main_color || '#0096FF' }}
                    ></div>
                    {cat.name}
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {cat.WebsiteSubCategory.map((sub) => {
                      // Use the subcategory's colors directly from the data
                      const gradientStyle = {
                        background: sub.secondary_color
                          ? `linear-gradient(135deg, ${sub.main_color}, ${sub.secondary_color})`
                          : sub.main_color,
                      };

                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setRealValue(sub.id);
                            if (onSelect) {
                              onSelect(sub);
                              setIsOpen(false);
                            }
                          }}
                          className="relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-md group"
                          style={gradientStyle}
                        >
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="px-4 py-3 flex items-center justify-center">
                            <span className="font-medium text-white text-center text-sm">
                              {sub.name.toUpperCase()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada kategori atau subkategori yang sesuai dengan pencarian
              Anda
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
