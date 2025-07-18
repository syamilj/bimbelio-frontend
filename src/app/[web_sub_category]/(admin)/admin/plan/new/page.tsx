'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingPageWithText from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import {
  // FeatureTypeEnum,
  WebsiteCategory,
  WebsiteSubCategory,
} from '@/types/database';
import { Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type LimitType = 'chat' | 'notes' | 'tryout' | 'vision' | 'quiz';

const listLimit: LimitType[] = ['chat', 'notes', 'vision', 'quiz', 'tryout'];

type ActiveTabType = {
  limit: boolean;
  feature: boolean;
};

type LimitRowType = {
  id: number;
  type: LimitType;
  limit: string;
}[];

export default function CreatePlanForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTabType>({
    feature: false,
    limit: false,
  });

  const [limitRows, setLimitRows] = useState<LimitRowType>([
    { id: 1, type: 'chat', limit: '' },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;
    const tier = formData.get('tier') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const originalPrice = formData.get('original_price') as string;

    const course = formData.get('course') as 'on' | null;
    const materiPremium = formData.get('materiPremium') as 'on' | null;
    const liveClass = formData.get('liveClass') as 'on' | null;

    const liveClassesPerWeek = formData.get('liveClassesPerWeek') as string;

    const expireType = formData.get('expireType') as string;
    const duration = formData.get('duration') as string;
    const websiteSubCategoryId = formData.get('websiteSubCategoryId') as string;

    const limitRowsData = limitRows.reduce(
      (acc, row) => {
        const key = row.type as string;
        acc[key] = Number.parseInt(row.limit) || 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    const payload = {
      name,
      description,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice),
      planLimitation: activeTab.limit
        ? {
            chat: limitRowsData?.chat || 0,
            notes: limitRowsData?.notes || 0,
            quiz: limitRowsData?.quiz || 0,
            tryout: limitRowsData?.tryout || 0,
            vision: limitRowsData?.vision || 0,
          }
        : undefined,
      planSubscription: activeTab.feature
        ? {
            tier,
            expireDays:
              expireType === 'days'
                ? parseInt(duration)
                : expireType === 'month'
                  ? parseInt(duration) * 30
                  : expireType === 'month'
                    ? parseInt(duration) * 365
                    : 0,
            websiteSubCategoryId,
            planfeature: [
              { type: course ? 'COURSE' : null },
              { type: materiPremium ? 'DOCUMENT' : null },
              {
                type: liveClass ? 'LIVECLASS' : null,
                liveClassesPerWeek: parseInt(liveClassesPerWeek || '0'),
              },
            ].filter((item) => item.type),
          }
        : undefined,
    };

    await mutateGeneral('/plan/createPlan', {
      payload,
      type: 'post',
      setLoading: setIsLoading,
    });
  };

  return (
    <form
      className="mx-auto p-4 min-h-screen"
      onSubmit={handleSubmit}
    >
      <LoadingPageWithText
        loading={isLoading}
        heading="Menambahkan Plan"
      />
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label
              htmlFor="name"
              className="block mb-2"
            >
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              name="name"
              placeholder="Pricing Name"
            />
          </div>
          {/* <div>
            <Label htmlFor="tier" className="block mb-2">
              Tier <span className="text-red-500">*</span>
            </Label>
            <Input name="tier" placeholder="Tier" />
          </div> */}
          <div className="col-span-2">
            <Label
              htmlFor="slug"
              className="block mb-2"
            >
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              name="description"
              placeholder="Description"
            />
          </div>
        </div>

        {/* Type Section */}

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Label className="text-base font-medium">Type</Label>
            </div>

            {/* Limit */}

            <SectionLimit
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              limitRows={limitRows}
              setLimitRows={setLimitRows}
            />

            {/* Features User */}
            <SectionFeature
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </CardContent>
        </Card>

        {/* Price Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Label className="text-base font-medium">Price</Label>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="original_price"
                  className="block mb-2"
                >
                  Original Price{' '}
                  <span className="text-xs text-gray-500">(optional)</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none bg-gray-100 border-r rounded-l-xl px-2">
                    <span className="text-gray-500">Rp</span>
                  </div>
                  <Input
                    id="original_price"
                    name="original_price"
                    type="text"
                    className="pl-12"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="price"
                  className="block mb-2"
                >
                  Total
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none bg-gray-100 border-r rounded-l-xl px-2">
                    <span className="text-gray-500">Rp</span>
                  </div>
                  <Input
                    id="price"
                    name="price"
                    type="text"
                    className="pl-12"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Label Variant Section */}
        {/* <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Label className="text-base font-medium">Label Variant</Label>
            </div>

            <div className="rounded-xl shadow-cardSoft2 p-4 mb-4">
              <div className="flex items-center mb-4">
                <Checkbox id="highlightLabel" defaultChecked />
                <Label htmlFor="highlightLabel" className="ml-2 font-medium">
                  Highlight Label
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                <div>
                  <Label htmlFor="labelText" className="block mb-2">
                    Text <span className="text-red-500">*</span>
                  </Label>
                  <Input id="labelText" placeholder="Text" />
                </div>
                <div>
                  <Label htmlFor="labelBgColor" className="block mb-2">
                    Background Color <span className="text-red-500">*</span>
                  </Label>
                  <Input id="labelBgColor" placeholder="#000000" />
                </div>
                <div>
                  <Label htmlFor="labelTextColor" className="block mb-2">
                    Text Color <span className="text-red-500">*</span>
                  </Label>
                  <Input id="labelTextColor" placeholder="#000000" />
                </div>
              </div>
            </div>

            <div className="rounded-xl shadow-cardSoft2 p-4">
              <div className="flex items-center mb-4">
                <Checkbox id="promoTag" defaultChecked />
                <Label htmlFor="promoTag" className="ml-2 font-medium">
                  Promo Tag
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                <div>
                  <Label htmlFor="promoText" className="block mb-2">
                    Text <span className="text-red-500">*</span>
                  </Label>
                  <Input id="promoText" placeholder="Text" />
                </div>
                <div>
                  <Label htmlFor="promoBgColor" className="block mb-2">
                    Background Color <span className="text-red-500">*</span>
                  </Label>
                  <Input id="promoBgColor" placeholder="#000000" />
                </div>
                <div>
                  <Label htmlFor="promoTextColor" className="block mb-2">
                    Text Color <span className="text-red-500">*</span>
                  </Label>
                  <Input id="promoTextColor" placeholder="#000000" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="bg-main hover:bg-main/80"
            disabled={isLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}

const SectionLimit = ({
  activeTab,
  setActiveTab,
  limitRows,
  setLimitRows,
}: {
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTabType>>;
  activeTab: ActiveTabType;
  setLimitRows: React.Dispatch<React.SetStateAction<LimitRowType>>;
  limitRows: LimitRowType;
}) => {
  const addLimitRow = () => {
    const newId =
      limitRows.length > 0
        ? Math.max(...limitRows.map((row) => row.id)) + 1
        : 1;

    // Find the first available type that's not already selected
    const selectedTypes = limitRows.map((row) => row.type);
    const availableType = listLimit.find(
      (type) => !selectedTypes.includes(type),
    );

    if (!availableType) return; // Don't add a row if all types are used

    setLimitRows([...limitRows, { id: newId, type: availableType, limit: '' }]);
  };

  const removeLimitRow = (id: number) => {
    setLimitRows(limitRows.filter((row) => row.id !== id));
  };

  const updateLimitType = (id: number, type: LimitType) => {
    // Check if the type is already selected in another row
    const isTypeAlreadySelected = limitRows.some(
      (row) => row.id !== id && row.type === type,
    );

    // Only update if the type is not already selected elsewhere
    if (!isTypeAlreadySelected) {
      setLimitRows(
        limitRows.map((row) => (row.id === id ? { ...row, type } : row)),
      );
    }
  };
  return (
    <div className="rounded-xl shadow-cardSoft2 p-4 mb-4">
      <div className="flex items-center mb-4">
        <Checkbox
          id="limit"
          checked={activeTab.limit}
          onCheckedChange={(check) =>
            setActiveTab((prev) => ({
              ...prev,
              limit: check.valueOf() as boolean,
            }))
          }
        />
        <Label
          htmlFor="limit"
          className="ml-2 font-medium"
        >
          Limit
        </Label>
      </div>

      {activeTab.limit && (
        <div className="space-y-4">
          {/* Replace the entire limitRows.map section with this updated version */}
          {limitRows.map((row, index) => {
            // Function to check if a type is already selected by another row
            const isTypeAlreadySelected = (type: LimitType) =>
              limitRows.some((r) => r.id !== row.id && r.type === type);

            return (
              <div
                key={row.id}
                className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <Label className="block mb-2">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={row.type === 'chat' ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        row.type === 'chat' ? 'bg-main hover:bg-main/80' : '',
                        isTypeAlreadySelected('chat') &&
                          'opacity-50 cursor-not-allowed',
                      )}
                      onClick={() => {
                        if (
                          !isTypeAlreadySelected('chat') ||
                          row.type === 'chat'
                        ) {
                          updateLimitType(row.id, 'chat');
                        }
                      }}
                    >
                      chat
                    </Button>
                    <Button
                      type="button"
                      variant={row.type === 'notes' ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        row.type === 'notes' ? 'bg-main hover:bg-main/80' : '',
                        isTypeAlreadySelected('notes') &&
                          'opacity-50 cursor-not-allowed',
                      )}
                      onClick={() => {
                        if (
                          !isTypeAlreadySelected('notes') ||
                          row.type === 'notes'
                        ) {
                          updateLimitType(row.id, 'notes');
                        }
                      }}
                    >
                      notes
                    </Button>
                    <Button
                      type="button"
                      variant={row.type === 'vision' ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        row.type === 'vision' ? 'bg-main hover:bg-main/80' : '',
                        isTypeAlreadySelected('vision') &&
                          'opacity-50 cursor-not-allowed',
                      )}
                      onClick={() => {
                        if (
                          !isTypeAlreadySelected('vision') ||
                          row.type === 'vision'
                        ) {
                          updateLimitType(row.id, 'vision');
                        }
                      }}
                    >
                      vision
                    </Button>
                    <Button
                      type="button"
                      variant={row.type === 'quiz' ? 'default' : 'outline'}
                      className={cn(
                        row.type === 'quiz' ? 'bg-main hover:bg-main/80' : '',
                        isTypeAlreadySelected('quiz') &&
                          'opacity-50 cursor-not-allowed',
                      )}
                      size="sm"
                      onClick={() => {
                        if (
                          !isTypeAlreadySelected('quiz') ||
                          row.type === 'quiz'
                        ) {
                          updateLimitType(row.id, 'quiz');
                        }
                      }}
                    >
                      quiz
                    </Button>
                    <Button
                      type="button"
                      variant={row.type === 'tryout' ? 'default' : 'outline'}
                      className={cn(
                        row.type === 'tryout' ? 'bg-main hover:bg-main/80' : '',
                        isTypeAlreadySelected('tryout') &&
                          'opacity-50 cursor-not-allowed',
                      )}
                      size="sm"
                      onClick={() => {
                        if (
                          !isTypeAlreadySelected('tryout') ||
                          row.type === 'tryout'
                        ) {
                          updateLimitType(row.id, 'tryout');
                        }
                      }}
                    >
                      try out
                    </Button>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label className="block mb-2">
                      Limit <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={row.limit}
                      onChange={(e) => {
                        setLimitRows(
                          limitRows.map((r) =>
                            r.id === row.id
                              ? { ...r, limit: e.target.value }
                              : r,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="flex gap-2 mb-[2px]">
                    {index === limitRows.length - 1 &&
                      limitRows.length < listLimit.length && (
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 border-blue-100"
                          onClick={addLimitRow}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    {limitRows.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-red-50 text-red-500 hover:bg-red-100 border-red-100"
                        onClick={() => removeLimitRow(row.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SectionFeature = ({
  activeTab,
  setActiveTab,
}: {
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTabType>>;
  activeTab: ActiveTabType;
}) => {
  const [expireType, setExpireType] = useState<string>('days');

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [categories, setCategories] = useState<WebsiteCategory[]>([]);

  const [subCategories, setSubCategories] = useState<WebsiteSubCategory[]>([]);

  const [isLiveClassActive, setIsLiveClassActive] = useState<boolean>(false);

  const changeExpireType = (type: string) => {
    const input = document.getElementById('expireType') as
      | HTMLInputElement
      | undefined;
    if (input) {
      setExpireType(type);
      input.value = type;
    }
  };

  useEffect(() => {
    getGeneral('/website-category/getWebsiteCategory', {
      onSuccess({ data }) {
        const getData: (WebsiteCategory & {
          WebsiteSubCategory: WebsiteSubCategory[];
        })[] = data;
        const category = getData.map((cat) => {
          return {
            id: cat.id,
            name: cat.name,
            main_color: cat.main_color,
            secondary_color: cat.secondary_color,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
          };
        });
        const subCategory = getData
          .map((cat) => {
            return cat.WebsiteSubCategory.map((sub) => {
              return {
                id: sub.id,
                name: sub.name,
                main_color: sub.main_color,
                secondary_color: sub.secondary_color,
                website_category_id: sub.website_category_id,
                createdAt: sub.createdAt,
                updatedAt: sub.updatedAt,
              };
            });
          })
          .flat(Infinity);
        setCategories(category);
        setSubCategories(subCategory as any);
      },
    });
  }, []);

  return (
    <div className="rounded-xl shadow-cardSoft2 p-4">
      <div className="flex items-center mb-4">
        <Checkbox
          id="features"
          checked={activeTab.feature}
          onCheckedChange={(check) =>
            setActiveTab((prev) => ({
              ...prev,
              feature: check.valueOf() as boolean,
            }))
          }
        />
        <Label
          htmlFor="features"
          className="ml-2 font-medium"
        >
          Features User
        </Label>
      </div>
      {activeTab.feature && (
        <div className="space-y-4">
          <div className="ml-6 flex flex-wrap gap-6">
            <div className="flex items-center">
              <Checkbox name="course" />
              <Label
                htmlFor="course"
                className="ml-2"
              >
                Course
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox name="materiPremium" />
              <Label
                htmlFor="materiPremium"
                className="ml-2"
              >
                Materi Premium
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="liveClass"
                name="liveClass"
                onCheckedChange={(value) => {
                  setIsLiveClassActive(value as boolean);
                }}
              />
              <Label
                htmlFor="liveClass"
                className="ml-2"
              >
                Live Class
              </Label>
            </div>
          </div>

          <div className="ml-6">
            <Label
              htmlFor="tier"
              className="block mb-2"
            >
              Tier <span className="text-red-500">*</span>
            </Label>
            <Input
              name="tier"
              placeholder="Tier"
            />
          </div>

          <div className="ml-6">
            <Label
              htmlFor="duration"
              className="block mb-2"
            >
              Duration <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                name="duration"
                type="number"
                placeholder="0"
                className="flex-1"
              />
              <div className="flex">
                <input
                  id="expireType"
                  name="expireType"
                  type="text"
                  hidden
                  value={expireType}
                  onChange={(e) => setExpireType(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'rounded-r-none ',
                    expireType === 'days' && 'bg-main text-white',
                  )}
                  onClick={() => changeExpireType('days')}
                >
                  days
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'rounded-none border-l-0 border-r-0',
                    expireType === 'month' && 'bg-main text-white',
                  )}
                  onClick={() => changeExpireType('month')}
                >
                  month
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'rounded-l-none',
                    expireType === 'year' && 'bg-main text-white',
                  )}
                  onClick={() => changeExpireType('year')}
                >
                  year
                </Button>
              </div>
            </div>
          </div>

          <div className="ml-6 flex items-center w-full gap-4">
            <div className="w-full">
              <Label
                htmlFor="category"
                className="block mb-2"
              >
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCategory && (
              <div className="w-full">
                <Label
                  htmlFor="subcategory"
                  className="block mb-2"
                >
                  Sub Category <span className="text-red-500">*</span>
                </Label>
                <Select name="websiteSubCategoryId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories
                      .filter(
                        (item) => item.website_category_id === selectedCategory,
                      )
                      .map((sub) => (
                        <SelectItem
                          key={sub.id}
                          value={sub.id}
                        >
                          {sub.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className={cn('ml-6', !isLiveClassActive && 'hidden')}>
            <Label
              htmlFor="liveClassesPerWeek"
              className="block mb-2"
            >
              Live Class Per Minggu <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="liveClassesPerWeek"
                name="liveClassesPerWeek"
                type="number"
                placeholder="0"
                className="flex-1"
                required={isLiveClassActive}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
