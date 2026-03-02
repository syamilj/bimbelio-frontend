'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { cn } from '@/lib/utils';
import type { WebsiteCategory, WebsiteSubCategory } from '@/types/database';
import { Check } from 'lucide-react';
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

  const handleValueChange = useDebouncedCallback((value: string) => {
    setRealValue(value);
  }, 500);

  useEffect(() => {
    if (!value) return;
    handleValueChange(value);
  }, [value, handleValueChange]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="md:max-w-2xl w-full p-0 overflow-hidden bg-background border shadow-xl rounded-3xl gap-0">
        {/* Header */}
        <DialogHeader className="relative px-6 py-5 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Pilih Kategori
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1.5">
                Pilih yang sesuai dengan tujuan belajarmu
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Categories List */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {items.length > 0 ? (
            <div className="space-y-6">
              {items.map((cat) => (
                <div
                  key={cat.id}
                  className="space-y-3"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1 h-7 rounded-full"
                      style={{ backgroundColor: cat.main_color || '#0096FF' }}
                    />
                    <h3 className="font-bold text-2xl text-foreground tracking-tight">
                      {cat.name}
                    </h3>
                  </div>

                  {/* Subcategories Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cat.WebsiteSubCategory.map((sub) => {
                      const isSelected = realValue === sub.id;
                      const hasImage = Boolean(sub.image);

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
                            'group relative overflow-hidden rounded-3xl p-0 text-left transition-all duration-300 border h-[112px] bg-white',
                            isSelected
                              ? 'border-transparent shadow-lg scale-[1.02] ring-2 ring-offset-2 ring-offset-background'
                              : 'border-gray-200 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md',
                          )}
                          style={{
                            backgroundColor: hasImage ? undefined : `${sub.main_color}10`,
                          }}
                        >
                          {hasImage && (
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className="absolute inset-0 h-full w-full object-contain bg-white"
                            />
                          )}

                          <div
                            className={cn(
                              'absolute inset-0',
                              hasImage
                                ? 'bg-transparent'
                                : 'bg-gradient-to-t from-black/20 via-transparent to-transparent',
                            )}
                            style={{
                              opacity: isSelected ? 0.95 : 1,
                              backgroundImage: hasImage
                                ? undefined
                                : `linear-gradient(to top, ${sub.main_color}55, transparent)`,
                            }}
                          />

                          <div className="relative z-10 flex h-full flex-col justify-start p-3">
                            <div className="flex justify-end">
                              <div
                                className={cn(
                                  'flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-200',
                                  isSelected
                                    ? 'bg-white border-white'
                                    : 'border-white/60 bg-white/20 backdrop-blur-xs',
                                )}
                              >
                                {isSelected && (
                                  <Check
                                    className="w-3.5 h-3.5 text-current"
                                    style={{ color: sub.main_color }}
                                  />
                                )}
                              </div>
                            </div>
                            {!hasImage && (
                              <div className="flex-1 flex items-center justify-center px-4">
                                <span className="text-xl font-bold text-foreground text-center leading-tight">
                                  {sub.name}
                                </span>
                              </div>
                            )}
                          </div>

                          {isSelected && (
                            <div
                              className="absolute inset-0 border-2 rounded-3xl pointer-events-none"
                              style={{ borderColor: sub.main_color }}
                            />
                          )}

                          <div
                            className={cn(
                              'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none',
                            )}
                          >
                            <div
                              className="h-full w-full"
                              style={{
                                backgroundColor: hasImage
                                  ? 'rgba(0,0,0,0.04)'
                                  : `${sub.main_color}14`,
                              }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="font-semibold text-lg mb-2">Belum ada kategori</h3>
              <p className="text-muted-foreground text-sm">
                Kategori belum tersedia untuk ditampilkan
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-sm">💡 Kategori dapat diubah sewaktu-waktu</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
