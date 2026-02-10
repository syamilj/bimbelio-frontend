'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Calendar,
  FileText,
  Filter,
  Package,
  Sparkles,
  Star,
  TrendingUp,
  Video,
  Wallet,
} from 'lucide-react';
import type { PaymentFilters } from './usePaymentFilters';

interface CategoryOption {
  id: string;
  name: string;
}

interface PaymentFilterDropdownProps {
  filters: PaymentFilters;
  mainColor: string;
  secondaryColor: string;
  categoryOptions: CategoryOption[];
  resultCount: number;
}

export function PaymentFilterDropdown({
  filters,
  mainColor,
  secondaryColor,
  categoryOptions,
  resultCount,
}: PaymentFilterDropdownProps) {
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedCategories,
    selectedPlanTypes,
    selectedDurations,
    selectedFeatures,
    priceRange,
    setPriceRange,
    filterTabActive,
    setFilterTabActive,
    isFilterOpen,
    setIsFilterOpen,
    filterDropdownRef,
    activeFiltersCount,
    priceMinMax,
    toggleCategory,
    togglePlanType,
    toggleDuration,
    toggleFeature,
    clearPlanTypes,
    clearCategories,
    clearDurations,
    clearFeatures,
    resetAllFilters,
  } = filters;

  return (
    <Card
      className="mb-8 border-2 shadow-lg bg-white rounded-3xl overflow-visible"
      style={{ borderColor: `${mainColor}20` }}
    >
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
        }}
      />

      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-3 rounded-3xl"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <TrendingUp
              className="w-6 h-6"
              style={{ color: mainColor }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-900">
              Cari & Filter Paket
            </h3>
            <p className="text-sm text-gray-600">
              Hasil:{' '}
              <span
                className="font-bold"
                style={{ color: mainColor }}
              >
                {resultCount} paket
              </span>{' '}
              ditemukan
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-end flex-wrap sm:flex-nowrap">
          <div className="flex-1 w-full sm:w-auto min-w-0">
            <Label
              htmlFor="search-paket"
              className="mb-2 block font-bold text-gray-900"
            >
              Cari Paket
            </Label>
            <Input
              id="search-paket"
              type="text"
              placeholder="Cari berdasarkan nama atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-3xl border-2"
              style={{ borderColor: `${mainColor}20` }}
            />
          </div>

          <div
            className="relative z-30 w-full sm:w-auto"
            ref={filterDropdownRef}
          >
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-white whitespace-nowrap rounded-3xl font-bold shadow-md hover:shadow-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Filter size={18} />
              Filter Lanjutan
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-white text-gray-900 font-black"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {isFilterOpen && (
              <div
                className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 w-auto sm:w-[420px] bg-white rounded-3xl shadow-2xl border-2 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-10rem)] overflow-y-auto"
                style={{ borderColor: `${mainColor}20` }}
              >
                <div
                  className="h-2 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                  }}
                />

                <div className="absolute top-3 right-3 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                    className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                  >
                    ✕
                  </Button>
                </div>

                <Tabs
                  value={filterTabActive}
                  onValueChange={setFilterTabActive}
                  className="w-full"
                >
                  <div className="overflow-x-auto">
                    <TabsList className="w-full sm:grid sm:grid-cols-5 flex p-2 bg-gray-50 rounded-none min-w-max sm:min-w-0">
                      <TabsTrigger
                        value="type"
                        className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-white data-[state=inactive]:text-gray-600 whitespace-nowrap"
                      >
                        <Package className="w-3 h-3 mr-1" />
                        Tipe
                      </TabsTrigger>
                      <TabsTrigger
                        value="category"
                        className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-white data-[state=inactive]:text-gray-600 whitespace-nowrap"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Kategori
                      </TabsTrigger>
                      <TabsTrigger
                        value="price"
                        className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-white data-[state=inactive]:text-gray-600 whitespace-nowrap"
                      >
                        <Wallet className="w-3 h-3 mr-1" />
                        Harga
                      </TabsTrigger>
                      <TabsTrigger
                        value="duration"
                        className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-white data-[state=inactive]:text-gray-600 whitespace-nowrap"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Durasi
                      </TabsTrigger>
                      <TabsTrigger
                        value="features"
                        className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-white data-[state=inactive]:text-gray-600 whitespace-nowrap"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Fitur
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Type Tab */}
                  <TabsContent
                    value="type"
                    className="p-4 space-y-3"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-black text-gray-900 flex items-center gap-2">
                        <Package
                          className="w-4 h-4"
                          style={{ color: mainColor }}
                        />
                        Pilih Tipe Paket
                      </Label>
                      <div className="space-y-2">
                        {[
                          {
                            id: 'bundle',
                            label: 'Bundle',
                            desc: 'Paket bundel',
                          },
                          {
                            id: 'subscription',
                            label: 'Subscription',
                            desc: 'Akses berlangganan',
                          },
                          {
                            id: 'topping',
                            label: 'Koin',
                            desc: 'Tambahan coin',
                          },
                        ].map((type) => (
                          <Button
                            key={type.id}
                            variant={
                              selectedPlanTypes.includes(type.id)
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() => togglePlanType(type.id)}
                            className="w-full justify-start font-bold rounded-3xl h-auto py-2.5"
                            style={
                              selectedPlanTypes.includes(type.id)
                                ? {
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                    color: 'white',
                                  }
                                : {
                                    borderColor: `${mainColor}20`,
                                  }
                            }
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="text-left">
                                <div className="font-black text-sm">
                                  {selectedPlanTypes.includes(type.id) && (
                                    <span className="mr-2">✓</span>
                                  )}
                                  {type.label}
                                </div>
                                <div className="text-xs opacity-80 font-normal">
                                  {type.desc}
                                </div>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                      {selectedPlanTypes.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearPlanTypes}
                          className="text-xs font-bold w-full"
                          style={{ color: mainColor }}
                        >
                          Bersihkan Tipe Paket
                        </Button>
                      )}
                    </div>
                  </TabsContent>

                  {/* Category Tab */}
                  <TabsContent
                    value="category"
                    className="p-4 space-y-3"
                  >
                    {categoryOptions.length > 0 ? (
                      <div className="space-y-2">
                        <Label className="text-sm font-black text-gray-900 flex items-center gap-2">
                          <Star
                            className="w-4 h-4"
                            style={{ color: mainColor }}
                          />
                          Filter Kategori
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {categoryOptions.map((category) => (
                            <Button
                              key={category.id}
                              variant={
                                selectedCategories.includes(category.id)
                                  ? 'default'
                                  : 'outline'
                              }
                              size="sm"
                              onClick={() => toggleCategory(category.id)}
                              className="justify-start font-bold rounded-3xl"
                              style={
                                selectedCategories.includes(category.id)
                                  ? {
                                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                      color: 'white',
                                    }
                                  : {
                                      borderColor: `${mainColor}20`,
                                    }
                              }
                            >
                              {selectedCategories.includes(category.id) && (
                                <span className="mr-1">✓</span>
                              )}
                              {category.name}
                            </Button>
                          ))}
                        </div>
                        {selectedCategories.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearCategories}
                            className="text-xs font-bold w-full"
                            style={{ color: mainColor }}
                          >
                            Bersihkan Kategori
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">
                        Tidak ada kategori tersedia
                      </p>
                    )}
                  </TabsContent>

                  {/* Price Tab */}
                  <TabsContent
                    value="price"
                    className="p-4 space-y-3"
                  >
                    <div className="space-y-3">
                      <Label className="text-sm font-black text-gray-900 flex items-center gap-2">
                        <Wallet
                          className="w-4 h-4"
                          style={{ color: mainColor }}
                        />
                        Range Harga
                      </Label>

                      <div
                        className="flex items-center justify-between p-3 rounded-3xl border-2"
                        style={{
                          backgroundColor: `${mainColor}08`,
                          borderColor: `${mainColor}20`,
                        }}
                      >
                        <div>
                          <div className="text-xs text-gray-600 font-bold">
                            Minimum
                          </div>
                          <div
                            className="text-base font-black"
                            style={{ color: mainColor }}
                          >
                            Rp {priceRange[0].toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div className="text-gray-400">—</div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600 font-bold">
                            Maximum
                          </div>
                          <div
                            className="text-base font-black"
                            style={{ color: secondaryColor }}
                          >
                            Rp {priceRange[1].toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>

                      <div className="px-2 py-3">
                        <Slider
                          min={priceMinMax.min}
                          max={priceMinMax.max}
                          step={10000}
                          value={priceRange}
                          onValueChange={(value) =>
                            setPriceRange(value as [number, number])
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700">
                          Preset Harga
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: '< 100K', range: [0, 100000] },
                            { label: '100K - 500K', range: [100000, 500000] },
                            { label: '500K - 1JT', range: [500000, 1000000] },
                            { label: '1JT - 2JT', range: [1000000, 2000000] },
                            {
                              label: '> 2JT',
                              range: [2000000, priceMinMax.max],
                            },
                            {
                              label: 'Semua',
                              range: [priceMinMax.min, priceMinMax.max],
                            },
                          ].map((preset) => (
                            <Button
                              key={preset.label}
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setPriceRange(
                                  preset.range as [number, number],
                                )
                              }
                              className="text-xs font-bold rounded-3xl"
                              style={{
                                borderColor: `${mainColor}20`,
                              }}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Duration Tab */}
                  <TabsContent
                    value="duration"
                    className="p-4 space-y-3"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-black text-gray-900 flex items-center gap-2">
                        <Calendar
                          className="w-4 h-4"
                          style={{ color: mainColor }}
                        />
                        Durasi Akses
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: '30', label: '1 Bulan', desc: '1-30 hari' },
                          { id: '90', label: '3 Bulan', desc: '31-90 hari' },
                          {
                            id: '180',
                            label: '6 Bulan',
                            desc: '91-180 hari',
                          },
                          {
                            id: '365',
                            label: '1 Tahun',
                            desc: '181-365 hari',
                          },
                          {
                            id: '365+',
                            label: '> 1 Tahun',
                            desc: '365+ hari',
                          },
                          {
                            id: 'unlimited',
                            label: 'Unlimited',
                            desc: 'Tanpa batas',
                          },
                        ].map((duration) => (
                          <Button
                            key={duration.id}
                            variant={
                              selectedDurations.includes(duration.id)
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() => toggleDuration(duration.id)}
                            className="justify-start font-bold rounded-3xl h-auto py-2.5"
                            style={
                              selectedDurations.includes(duration.id)
                                ? {
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                    color: 'white',
                                  }
                                : {
                                    borderColor: `${mainColor}20`,
                                  }
                            }
                          >
                            <div className="text-left w-full">
                              <div className="font-black text-sm">
                                {selectedDurations.includes(duration.id) && (
                                  <span className="mr-2">✓</span>
                                )}
                                {duration.label}
                              </div>
                              <div className="text-xs opacity-80 font-normal">
                                {duration.desc}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                      {selectedDurations.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearDurations}
                          className="text-xs font-bold w-full"
                          style={{ color: mainColor }}
                        >
                          Bersihkan Durasi
                        </Button>
                      )}
                    </div>
                  </TabsContent>

                  {/* Features Tab */}
                  <TabsContent
                    value="features"
                    className="p-4 space-y-3"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-black text-gray-900 flex items-center gap-2">
                        <Sparkles
                          className="w-4 h-4"
                          style={{ color: mainColor }}
                        />
                        Fitur yang Tersedia
                      </Label>
                      <div className="space-y-2">
                        {[
                          {
                            id: 'video',
                            label: 'Video Course',
                            desc: 'Akses video pembelajaran',
                            icon: Video,
                          },
                          {
                            id: 'document',
                            label: 'Dokumen & Materi',
                            desc: 'E-book dan modul',
                            icon: FileText,
                          },
                          {
                            id: 'tryout',
                            label: 'Tryout',
                            desc: 'Latihan soal tryout',
                            icon: BookOpen,
                          },
                          {
                            id: 'live_class',
                            label: 'Live Class',
                            desc: 'Kelas langsung dengan tutor',
                            icon: Star,
                          },
                        ].map((feature) => {
                          const IconComponent = feature.icon;
                          return (
                            <Button
                              key={feature.id}
                              variant={
                                selectedFeatures.includes(feature.id)
                                  ? 'default'
                                  : 'outline'
                              }
                              onClick={() => toggleFeature(feature.id)}
                              className="w-full justify-start font-bold rounded-3xl h-auto py-2.5"
                              style={
                                selectedFeatures.includes(feature.id)
                                  ? {
                                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                      color: 'white',
                                    }
                                  : {
                                      borderColor: `${mainColor}20`,
                                    }
                              }
                            >
                              <div className="flex items-center gap-3 w-full">
                                <IconComponent className="w-4 h-4" />
                                <div className="text-left flex-1">
                                  <div className="font-black text-sm">
                                    {selectedFeatures.includes(feature.id) && (
                                      <span className="mr-2">✓</span>
                                    )}
                                    {feature.label}
                                  </div>
                                  <div className="text-xs opacity-80 font-normal">
                                    {feature.desc}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                      {selectedFeatures.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFeatures}
                          className="text-xs font-bold w-full"
                          style={{ color: mainColor }}
                        >
                          Bersihkan Fitur
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Sort & Reset */}
                <div className="border-t p-4 space-y-2 bg-gray-50">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">
                      Urutkan
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        ['name', 'price', 'price-desc', 'popularity'] as const
                      ).map((option) => (
                        <Button
                          key={option}
                          variant={sortBy === option ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSortBy(option)}
                          className="text-xs font-bold rounded-3xl"
                          style={
                            sortBy === option
                              ? {
                                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  color: 'white',
                                }
                              : { borderColor: `${mainColor}20` }
                          }
                        >
                          {option === 'name' && 'A-Z'}
                          {option === 'price' && 'Termurah'}
                          {option === 'price-desc' && 'Termahal'}
                          {option === 'popularity' && 'Populer'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetAllFilters}
                      className="w-full rounded-3xl font-bold"
                      style={{
                        borderColor: `${mainColor}20`,
                        color: mainColor,
                      }}
                    >
                      Reset Semua ({activeFiltersCount} filter aktif)
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
