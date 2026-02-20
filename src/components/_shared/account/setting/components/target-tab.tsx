'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import axiosInstanceWithToken from '@/lib/axios/axiosInstanceWithToken';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import {
  Check,
  ChevronsUpDown,
  GraduationCap,
  Phone,
  Target,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type UniversityProps = {
  university: string;
  initials: string;
  averageScore: number;
  isKedinasan?: boolean;
  studyProgramList: { study: string; averageScore: number | null }[];
};

type UserTryoutDataType = {
  phone: string;
  phoneParent: string | null;
  targetValue: number | null;
  univChoiceOne: string | null;
  univStudyChoiceOne: string | null;
  univChoiceTwo: string | null;
  univStudyChoiceTwo: string | null;
};

function UnivCombobox({
  value,
  onChange,
  onClear,
  options,
  placeholder,
  mainColor,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  options: UniversityProps[];
  placeholder: string;
  mainColor: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      modal
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-left hover:border-slate-300 transition-colors',
            !value && 'text-slate-400',
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[350px] p-0 rounded-2xl shadow-xl"
        align="start"
        style={{ zIndex: 9999 }}
      >
        <Command>
          <CommandInput
            placeholder={`Cari ${placeholder.replace('Pilih ', '').replace('...', '')}...`}
          />
          <CommandList className="max-h-72">
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {value && (
                <CommandItem
                  value="__clear__"
                  onSelect={() => {
                    onClear();
                    setOpen(false);
                  }}
                  className="text-red-500 font-medium"
                >
                  Hapus pilihan
                </CommandItem>
              )}
              {options.map((u) => (
                <CommandItem
                  key={u.university}
                  value={u.university}
                  onSelect={() => {
                    onChange(value === u.university ? '' : u.university);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 w-4 h-4',
                      value === u.university ? 'opacity-100' : 'opacity-0',
                    )}
                    style={{ color: mainColor }}
                  />
                  <span className="font-bold mr-2">{u.initials}</span>
                  <span className="text-slate-500 text-xs truncate">
                    {u.university}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function MajorCombobox({
  value,
  onChange,
  onClear,
  options,
  placeholder,
  mainColor,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  options: { study: string; averageScore: number | null }[];
  placeholder: string;
  mainColor: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      modal
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-left hover:border-slate-300 transition-colors',
            !value && 'text-slate-400',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[350px] p-0 rounded-2xl shadow-xl"
        align="start"
        style={{ zIndex: 9999 }}
      >
        <Command>
          <CommandInput placeholder="Cari jurusan..." />
          <CommandList className="max-h-72">
            <CommandEmpty>Jurusan tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {value && (
                <CommandItem
                  value="__clear__"
                  onSelect={() => {
                    onClear();
                    setOpen(false);
                  }}
                  className="text-red-500 font-medium"
                >
                  Hapus pilihan
                </CommandItem>
              )}
              {options.map((m) => (
                <CommandItem
                  key={m.study}
                  value={m.study}
                  onSelect={() => {
                    onChange(value === m.study ? '' : m.study);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 w-4 h-4',
                      value === m.study ? 'opacity-100' : 'opacity-0',
                    )}
                    style={{ color: mainColor }}
                  />
                  <span className="truncate">{m.study}</span>
                  {m.averageScore && (
                    <span className="ml-auto text-xs text-slate-400 shrink-0">
                      {m.averageScore}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type TargetTabProps = {
  userId: string | undefined;
  websiteSubCategoryId: string | undefined;
  mainColor: string;
  secondaryColor: string;
};

export function TargetTab({
  userId,
  websiteSubCategoryId,
  mainColor,
  secondaryColor,
}: TargetTabProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const params = useParams<{ web_sub_category: string }>();
  // URL param is always correct (synchronous from route); context starts as "guest" before async fetch
  const activeWebsubId =
    params.web_sub_category ||
    websiteSubCategory?.id ||
    websiteSubCategoryId ||
    '';
  const isKedinasan = activeWebsubId.toLowerCase().includes('kedinasan');
  // Always show the university/institution section; for Kedinasan it shows kedinasan institutions
  const showUniversitySection = true;

  const [allUniversityOptions, setAllUniversityOptions] = useState<
    UniversityProps[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [phone, setPhone] = useState('');
  const [phoneParent, setPhoneParent] = useState('');
  const [targetValue, setTargetValue] = useState<number | ''>('');
  const [univ1, setUniv1] = useState('');
  const [major1, setMajor1] = useState('');
  const [univ2, setUniv2] = useState('');
  const [major2, setMajor2] = useState('');

  // Fetch ALL universities once; filter in-memory to avoid race conditions
  useEffect(() => {
    getGeneral('/universitas', { setData: setAllUniversityOptions });
  }, []);

  // Filter based on isKedinasan — always has correct value because of URL param fallback
  const universityOptions = useMemo(
    () =>
      isKedinasan
        ? allUniversityOptions.filter((u) => u.isKedinasan)
        : allUniversityOptions,
    [allUniversityOptions, isKedinasan],
  );

  // Fetch existing user tryout data
  const { data: existingData, isLoading: isLoadingData } =
    useGet<UserTryoutDataType>('/user/getUserTryOut', {
      params: { userId, website_sub_category_id: websiteSubCategoryId },
      enabled: !!userId && !!websiteSubCategoryId,
      toast: { hideError: true },
    });

  // Prefill form when data loads
  useEffect(() => {
    if (existingData) {
      setPhone(existingData.phone || '');
      setPhoneParent(existingData.phoneParent || '');
      setTargetValue(existingData.targetValue ?? '');
      setUniv1(existingData.univChoiceOne || '');
      setMajor1(existingData.univStudyChoiceOne || '');
      setUniv2(existingData.univChoiceTwo || '');
      setMajor2(existingData.univStudyChoiceTwo || '');
    }
  }, [existingData]);

  const majorsForUniv1 =
    universityOptions.find((u) => u.university === univ1)?.studyProgramList ??
    [];
  const majorsForUniv2 =
    universityOptions.find((u) => u.university === univ2)?.studyProgramList ??
    [];

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await axiosInstanceWithToken.put(
        `/user/updateUserTarget?website_sub_category_id=${websiteSubCategoryId}`,
        {
          phone: phone || undefined,
          phoneParent: phoneParent || null,
          targetValue: targetValue !== '' ? Number(targetValue) : null,
          univChoiceOne: univ1 || null,
          univStudyChoiceOne: major1 || null,
          univChoiceTwo: univ2 || null,
          univStudyChoiceTwo: major2 || null,
        },
      );
      toaster({
        title: 'Tersimpan',
        description: 'Target berhasil diperbarui!',
        condition: 'success',
      });
    } catch {
      toaster({
        title: 'Gagal',
        description: 'Gagal menyimpan perubahan.',
        condition: 'warning',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      {/* Phone Section */}
      <div className="rounded-3xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-black text-slate-700 flex items-center gap-2">
            <Phone
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            Nomor Handphone
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: mainColor }}
            >
              No. HP Kamu
            </Label>
            <Input
              type="tel"
              placeholder="Contoh: 081234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-2xl border-slate-200 text-sm font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: mainColor }}
            >
              No. HP Orang Tua
            </Label>
            <Input
              type="tel"
              placeholder="Contoh: 081234567890 (opsional)"
              value={phoneParent}
              onChange={(e) => setPhoneParent(e.target.value)}
              className="rounded-2xl border-slate-200 text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Target Nilai — only for non-Kedinasan websubs */}
      {!isKedinasan && (
        <div className="rounded-3xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <Target
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
              {'Target Nilai UTBK'}
            </h3>
          </div>
          <div className="p-5">
            <div className="space-y-1.5">
              <Label
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: mainColor }}
              >
                Target Skor
              </Label>
              <Input
                type="number"
                placeholder={'Contoh: 650'}
                min={0}
                max={1000}
                value={targetValue}
                onChange={(e) =>
                  setTargetValue(
                    e.target.value === '' ? '' : Number(e.target.value),
                  )
                }
                className="rounded-2xl border-slate-200 text-sm font-medium"
              />
              <p className="text-xs text-slate-400">
                Rata-rata skor UTBK berkisar antara 400–800
              </p>
            </div>
          </div>
        </div>
      )}

      {/* University/Institution sections */}
      {showUniversitySection && (
        <>
          {/* Pilihan 1 */}
          <div className="rounded-3xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-700 flex items-center gap-2">
                <GraduationCap
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                {isKedinasan
                  ? 'Pilihan Institusi Kedinasan Pertama'
                  : 'Pilihan Universitas Pertama'}
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: mainColor }}
                >
                  {isKedinasan ? 'Institusi Kedinasan' : 'Universitas'}
                </Label>
                <UnivCombobox
                  value={univ1}
                  onChange={(v) => {
                    setUniv1(v);
                    setMajor1('');
                  }}
                  onClear={() => {
                    setUniv1('');
                    setMajor1('');
                  }}
                  options={universityOptions}
                  placeholder={
                    isKedinasan
                      ? 'Pilih institusi kedinasan...'
                      : 'Pilih universitas...'
                  }
                  mainColor={mainColor}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: mainColor }}
                >
                  Jurusan / Program Studi
                </Label>
                <MajorCombobox
                  value={major1}
                  onChange={setMajor1}
                  onClear={() => setMajor1('')}
                  options={majorsForUniv1}
                  placeholder={
                    univ1
                      ? 'Pilih jurusan...'
                      : isKedinasan
                        ? 'Pilih institusi dulu'
                        : 'Pilih universitas dulu'
                  }
                  mainColor={mainColor}
                  disabled={!univ1}
                />
              </div>
            </div>
          </div>

          {/* Pilihan 2 */}
          <div className="rounded-3xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-700 flex items-center gap-2">
                <GraduationCap
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                {isKedinasan
                  ? 'Pilihan Institusi Kedinasan Kedua'
                  : 'Pilihan Universitas Kedua'}
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: mainColor }}
                >
                  {isKedinasan ? 'Institusi Kedinasan' : 'Universitas'}
                </Label>
                <UnivCombobox
                  value={univ2}
                  onChange={(v) => {
                    setUniv2(v);
                    setMajor2('');
                  }}
                  onClear={() => {
                    setUniv2('');
                    setMajor2('');
                  }}
                  options={universityOptions}
                  placeholder={
                    isKedinasan
                      ? 'Pilih institusi kedinasan...'
                      : 'Pilih universitas...'
                  }
                  mainColor={mainColor}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: mainColor }}
                >
                  Jurusan / Program Studi
                </Label>
                <MajorCombobox
                  value={major2}
                  onChange={setMajor2}
                  onClear={() => setMajor2('')}
                  options={majorsForUniv2}
                  placeholder={
                    univ2
                      ? 'Pilih jurusan...'
                      : isKedinasan
                        ? 'Pilih institusi dulu'
                        : 'Pilih universitas dulu'
                  }
                  mainColor={mainColor}
                  disabled={!univ2}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full rounded-3xl font-black py-5 text-white"
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
      >
        {isSaving ? <Spinner /> : 'Simpan Perubahan'}
      </Button>
    </div>
  );
}
