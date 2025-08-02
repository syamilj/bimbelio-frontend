'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { WebsiteCategory, WebsiteSubCategory } from '@/types/database';
import { Check, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../dialog';

interface Props {
  items: (WebsiteCategory & {
    WebsiteSubCategory: WebsiteSubCategory[];
  })[];
  onSelect?: (subItem: WebsiteSubCategory) => void;
  value?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialogWebCategory({
  items,
  onSelect,
  value,
  isOpen = false,
  onOpenChange,
}: Props) {
  useWebsiteSubCategory();
  const [realValue, setRealValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl w-full sm:space-x-2 p-0 overflow-hidden bg-background border shadow-xl">
        {/* Header */}
        <DialogHeader className="relative p-6 pb-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                Pilih Kategori Bimbelio
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Pilih kategori yang sesuai dengan tujuan belajarmu
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kategori..."
              className="pl-10 h-10 bg-muted/30 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-offset-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="max-h-[70vh] overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="p-4 space-y-6">
              {filteredItems.map((cat) => (
                <div
                  key={cat.id}
                  className="space-y-3"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1 h-6 rounded-full"
                      style={{ backgroundColor: cat.main_color || '#0096FF' }}
                    />
                    <h3 className="font-bold text-lg text-foreground">
                      {cat.name}
                    </h3>
                  </div>

                  {/* Subcategories Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-4">
                    {cat.WebsiteSubCategory.map((sub) => {
                      const isSelected = realValue === sub.id;

                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setRealValue(sub.id);
                            if (onSelect) {
                              onSelect(sub);
                              if (onOpenChange) {
                                onOpenChange(false);
                              }
                            }
                          }}
                          className={cn(
                            'group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 hover:shadow-md border',
                            isSelected
                              ? 'border-transparent shadow-lg scale-[1.02]'
                              : 'border-gray-200 hover:border-gray-300 dark:hover:border-gray-700',
                          )}
                          style={{
                            backgroundColor: isSelected
                              ? sub.main_color
                              : 'transparent',
                          }}
                        >
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundColor: isSelected
                                  ? 'white'
                                  : sub.main_color,
                              }}
                            />
                          </div>

                          {/* Content */}
                          <div className="relative z-10 flex items-center justify-between">
                            <div className="flex-1">
                              <h4
                                className={cn(
                                  'font-semibold text-sm transition-colors',
                                  isSelected
                                    ? 'text-white'
                                    : 'text-foreground group-hover:text-foreground',
                                )}
                              >
                                {sub.name}
                              </h4>
                              <p
                                className={cn(
                                  'text-xs mt-1 transition-colors',
                                  isSelected
                                    ? 'text-white/80'
                                    : 'text-muted-foreground',
                                )}
                              >
                                Kategori pembelajaran terbaik
                              </p>
                            </div>

                            {/* Selection Indicator */}
                            <div
                              className={cn(
                                'flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200',
                                isSelected
                                  ? 'bg-white border-white'
                                  : 'border-gray-300 group-hover:border-gray-400',
                              )}
                            >
                              {isSelected && (
                                <Check
                                  className="w-3 h-3 text-current"
                                  style={{ color: sub.main_color }}
                                />
                              )}
                            </div>
                          </div>

                          {/* Hover Effect */}
                          <div
                            className={cn(
                              'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity',
                              !isSelected && 'bg-current',
                            )}
                            style={{ color: sub.main_color }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground text-sm">
                Tidak ada kategori yang sesuai dengan pencarian Anda
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>💡 Kategori dapat diubah sewaktu-waktu</span>
            <span>
              {filteredItems.reduce(
                (acc, cat) => acc + cat.WebsiteSubCategory.length,
                0,
              )}{' '}
              kategori tersedia
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
