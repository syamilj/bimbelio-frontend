'use client';

import type React from 'react';

import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn, Provinces } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const RegistrationTryOut = ({
  getUserTryout,
  isHideGeneralSection,
  isHideTargetValue,
  univOption,
}: {
  getUserTryout: () => any;
  isHideGeneralSection: boolean;
  isHideTargetValue: boolean;
  univOption: string | undefined;
}) => {
  const Router = useRouter();
  const { data: session } = useSession();

  const [UniversityOptions, setUniversityOptions] =
    useState<UniversityOptionsType>([]);

  useEffect(() => {
    getGeneral('/universitas', {
      setData: setUniversityOptions,
    });
  }, []);

  const currentYear = new Date().getFullYear() + 1 + 4;

  const [step, setStep] = useState<number>(2); // Mulai dari step 2
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createUserTo = async (data: any) => {
    await mutateGeneral('/user/createUserTryOut', {
      payload: data,
      type: 'post',
      onSuccess: getUserTryout,
    });
  };

  // Step 2
  const [Name, setName] = useState<string>('');
  const [Gender, setGender] = useState<string>('');
  const [Age, setAge] = useState<number>(0); // Ubah menjadi number
  const [Phone, setPhone] = useState<string>('');
  const [PhoneParent, setPhoneParent] = useState<string>('');
  const [Kabupaten, setKabupaten] = useState<string>('');
  const [Provinsi, setProvinsi] = useState<string>('');

  // Step 3
  const [TipeSekolah, setTipeSekolah] = useState<
    '' | 'SMA' | 'SMK' | 'MA' | 'Sederajat'
  >('');
  const [AsalSekolah, setAsalSekolah] = useState<string>('');
  const [Jurusan, setJurusan] = useState<
    'IPA' | 'IPS' | 'Bahasa' | 'Kejuruan' | 'Campuran' | ''
  >('');
  const [TahunLulus, setTahunLulus] = useState<number>(0);
  const [TargetNilai, setTargetNilai] = useState<number>(0);

  // Step 4
  const [PilihanUniv1, setPilihanUniv1] = useState<string>('');
  const [JurusanUniv1, setJurusanUniv1] = useState<string>('');
  const [PilihanUniv2, setPilihanUniv2] = useState<string>('');
  const [JurusanUniv2, setJurusanUniv2] = useState<string>('');
  const [Channel, setChannel] = useState<string>('');

  const handleNextStep = (currentStep: number) => {
    if (currentStep === 2) {
      if (!Name || !Gender || Age <= 0 || !Phone || !Kabupaten || !Provinsi) {
        toaster({
          title: 'Error',
          condition: 'warning',
          description:
            'Harap isi semua field yang diperlukan dan pastikan umur valid.',
          duration: 2000,
        });
        return;
      }
    }

    if (currentStep === 3) {
      if (!TipeSekolah || !AsalSekolah || !Jurusan || TahunLulus <= 0) {
        toaster({
          title: 'Error',
          condition: 'warning',
          description:
            'Harap isi semua field yang diperlukan dan pastikan nilai valid.',
          duration: 2000,
        });
        return;
      }
    }

    setStep(currentStep + 1);
  };

  const handleRegistration = async () => {
    if (step === 4) {
      try {
        setIsLoading(true);

        if (Age <= 0 && !isHideGeneralSection) {
          toaster({
            title: 'Error',
            condition: 'warning',
            description: 'Umur tidak valid. Silakan masukkan angka yang benar.',
            duration: 2000,
          });
          setIsLoading(false);
          return;
        }

        // Bungkus data tanpa newUserTryOut
        const dataToSend = {
          name: Name,
          userId: session?.user.id,
          gender: Gender,
          age: Age,
          phone: Phone,
          phoneParent: PhoneParent,
          kabupaten: Kabupaten,
          provinsi: Provinsi,
          schoolTipe: TipeSekolah,
          schoolOrigin: AsalSekolah,
          schoolStudy: Jurusan,
          schoolGraduated: TahunLulus,
          targetValue: TargetNilai,
          univChoiceOne: PilihanUniv1,
          univStudyChoiceOne: JurusanUniv1,
          univChoiceTwo: PilihanUniv2,
          univStudyChoiceTwo: JurusanUniv2,
          channel: Channel,
        };

        // Gunakan Non-Null Assertion jika perlu
        await createUserTo!(dataToSend);
        setIsLoading(false);
      } catch (error: any) {
        toaster({
          title: 'Upss',
          condition: 'warning',
          description: `${error}`,
          duration: 2000,
        });
        setIsLoading(false);
        return;
      }
    }
  };

  useEffect(() => {
    if (isHideGeneralSection) {
      setStep(4);
    }
    if (univOption) {
      setPilihanUniv1(univOption);
    }
  }, [isHideGeneralSection, univOption]);

  return (
    <div className="relative w-[calc(100%-2rem)] max-w-[500px] rounded-3xl bg-white p-8 shadow-default md:w-full">
      <div
        className="absolute right-4 top-4 cursor-pointer"
        onClick={() => {
          if (isHideGeneralSection) {
            setStep(3);
          } else {
            // setStep(2);
            Router.back();
          }
        }}
      >
        <X className="text-main-gray-text duration-200 md:hover:text-main-gray-text2" />
      </div>
      <p className="mb-8 text-center text-[1.2rem] font-semibold">
        Verifikasi Akun
      </p>

      {step === 2 && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleNextStep(2);
          }}
        >
          <InputText
            heading="Nama"
            placeholder="Nama"
            value={Name}
            setValue={setName}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputNumber
              heading="Umur"
              placeholder="Umur"
              value={Age}
              setValue={setAge}
              min={0}
            />
            <div
              id="gender-field"
              className="flex flex-col gap-[.5rem]"
            >
              <p className="text-[.9rem]">
                Jenis Kelamin<span className="text-red-600">*</span>
              </p>
              <Select
                required
                value={Gender}
                onValueChange={(value) => value && setGender(value)}
              >
                <SelectTrigger
                  className={cn(
                    `font-regular h-[unset] w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-[.9rem] text-black outline-none focus:border-main`,
                    Gender === '' && 'text-main-gray-disabled',
                  )}
                >
                  <SelectValue placeholder="Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIA">Pria</SelectItem>
                  <SelectItem value="WANITA">Wanita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-[.5rem]">
              <p className="text-[.9rem]">
                No. Hp<span className="text-red-600">*</span>
              </p>
              <div className="relative flex items-center">
                <p className="absolute left-4 text-[.9rem]">+62</p>
                <input
                  type="number"
                  className="font-regular w-full rounded-[.5rem] border border-main-gray-input py-[.5rem] pl-16 pr-4 text-[.9rem] text-black outline-none focus:border-main"
                  placeholder={'No. Hp'}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  value={Phone}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-[.5rem]">
              <p className="text-[.9rem]">
                No. Hp Orang Tua<span className="text-red-600">*</span>
              </p>
              <div className="relative flex items-center">
                <p className="absolute left-4 text-[.9rem]">+62</p>
                <input
                  type="number"
                  className="font-regular w-full rounded-[.5rem] border border-main-gray-input py-[.5rem] pl-16 pr-4 text-[.9rem] text-black outline-none focus:border-main"
                  placeholder={'No. Hp'}
                  onChange={(e) => {
                    setPhoneParent(e.target.value);
                  }}
                  value={PhoneParent}
                  required
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ComboboxSelect
              heading="Provinsi"
              placeholder="Provinsi"
              value={Provinsi}
              setValue={setProvinsi}
              options={Provinces.map((item) => ({
                label: item.province,
                value: item.province,
              }))}
            />
            <ComboboxSelect
              heading="Kota/Kabupaten"
              placeholder="Kota/Kabupaten"
              value={Kabupaten}
              setValue={setKabupaten}
              options={
                Provinces.find(
                  (item) => item.province === Provinsi,
                )?.district.map((regency) => ({
                  label: regency.regency,
                  value: regency.regency,
                })) || []
              }
              disabled={!Provinsi}
            />
          </div>
          <div className="flex h-[64px] items-center justify-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <Button
                type="submit"
                className="h-[calc(100%-1rem)] w-full rounded-[.8rem] bg-gradient px-8 text-white md:hover:opacity-85"
              >
                Selanjutnya
              </Button>
            )}
          </div>
        </form>
      )}

      {step === 3 && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleNextStep(3);
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div
              id="school-type-field"
              className="flex flex-col gap-[.5rem]"
            >
              <p className="text-[.95rem]">
                Asal Sekolah?<span className="text-red-600">*</span>
              </p>
              <Select
                required
                value={TipeSekolah}
                onValueChange={(value) =>
                  value &&
                  setTipeSekolah(
                    value as '' | 'SMA' | 'SMK' | 'MA' | 'Sederajat',
                  )
                }
              >
                <SelectTrigger
                  className={cn(
                    `font-regular h-[unset] w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-[.9rem] text-black outline-none focus:border-main`,
                    TipeSekolah === '' && 'text-main-gray-disabled',
                  )}
                >
                  <SelectValue placeholder="Pilih Sekolah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMA">SMA</SelectItem>
                  <SelectItem value="SMK">SMK</SelectItem>
                  <SelectItem value="MA">MA</SelectItem>
                  <SelectItem value="Sederajat">Sederajat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <InputText
              heading="Sekolah"
              placeholder="SMA N 01 Padang"
              value={AsalSekolah}
              setValue={setAsalSekolah}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              id="major-field"
              className="flex flex-col gap-[.5rem]"
            >
              <p className="text-[.95rem]">
                Jurusan<span className="text-red-600">*</span>
              </p>
              <Select
                required
                value={Jurusan}
                onValueChange={(value) =>
                  value &&
                  setJurusan(
                    value as
                      | 'IPA'
                      | 'IPS'
                      | 'Bahasa'
                      | 'Kejuruan'
                      | 'Campuran'
                      | '',
                  )
                }
              >
                <SelectTrigger
                  className={cn(
                    `font-regular h-[unset] w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-[.9rem] text-black outline-none focus:border-main`,
                    Jurusan === '' && 'text-main-gray-disabled',
                  )}
                >
                  <SelectValue placeholder="Pilih Jurusan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IPA">IPA</SelectItem>
                  <SelectItem value="IPS">IPS</SelectItem>
                  <SelectItem value="Bahasa">Bahasa</SelectItem>
                  <SelectItem value="Kejuruan">Kejuruan</SelectItem>
                  <SelectItem value="Campuran">Campuran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              id="graduation-year-field"
              className="flex flex-col gap-[.5rem]"
            >
              <p className="text-[.95rem]">
                Tahun Lulus<span className="text-red-600">*</span>
              </p>
              <Select
                required
                value={TahunLulus === 0 ? '' : TahunLulus.toString()}
                onValueChange={(value) => {
                  if (value.length > 0) {
                    setTahunLulus(Number.parseInt(value, 10));
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    `font-regular h-[unset] w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-[.9rem] text-black outline-none focus:border-main`,
                    TahunLulus === 0 && 'text-main-gray-disabled',
                  )}
                >
                  <SelectValue placeholder="Pilih Tahun Lulus" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }).map((item, index) => (
                    <SelectItem
                      key={index}
                      value={`${currentYear - index}`}
                    >
                      {currentYear - index}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex h-[64px] items-center justify-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <Button
                type="submit"
                className="h-[calc(100%-1rem)] w-full rounded-[.8rem] bg-gradient px-8 text-white md:hover:opacity-85"
              >
                Selanjutnya
              </Button>
            )}
          </div>
        </form>
      )}

      {step === 4 && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegistration();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <ComboboxSelect
              heading="Pilihan 1 - Universitas"
              placeholder="Universitas"
              value={PilihanUniv1}
              setValue={setPilihanUniv1}
              options={UniversityOptions.map((item) => ({
                label: item.university,
                value: item.university,
              }))}
              disabled={!!univOption}
              isUniversity={true}
            />
            <ComboboxSelect
              heading="Pilihan 1 - Jurusan"
              placeholder="Jurusan"
              value={JurusanUniv1}
              setValue={setJurusanUniv1}
              options={
                UniversityOptions.find(
                  (item) => item.university === PilihanUniv1,
                )?.studyProgramList.map((program) => ({
                  label: program.study,
                  value: program.study,
                })) || []
              }
              disabled={!PilihanUniv1}
              isUniversity={true}
            />
          </div>
          {!univOption && (
            <div className="grid grid-cols-2 gap-4">
              <ComboboxSelect
                heading="Pilihan 2 - Universitas"
                placeholder="Universitas"
                value={PilihanUniv2}
                setValue={setPilihanUniv2}
                options={UniversityOptions.map((item) => ({
                  label: item.university,
                  value: item.university,
                }))}
                isUniversity={true}
              />
              <ComboboxSelect
                heading="Pilihan 2 - Jurusan"
                placeholder="Jurusan"
                value={JurusanUniv2}
                setValue={setJurusanUniv2}
                options={
                  UniversityOptions.find(
                    (item) => item.university === PilihanUniv2,
                  )?.studyProgramList.map((program) => ({
                    label: program.study,
                    value: program.study,
                  })) || []
                }
                disabled={!PilihanUniv2}
                isUniversity={true}
              />
            </div>
          )}

          {!isHideTargetValue && (
            <InputNumber
              heading="Target Nilai PTN dan Kedinasan (0-1000)"
              placeholder="Target Nilai"
              value={TargetNilai} // Kirim sebagai number
              setValue={setTargetNilai} // Fungsi menerima number
              min={0}
              max={1000}
            />
          )}
          {!isHideGeneralSection && (
            <div className="flex flex-col gap-[.5rem]">
              <p className="text-[.95rem]">
                Tau Bimbelio dari mana?<span className="text-red-600">*</span>
              </p>
              <Select
                required
                value={Channel}
                onValueChange={(value) => {
                  if (value) {
                    setChannel(value);
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    `font-regular h-[unset] w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-[.9rem] text-black outline-none focus:border-main`,
                    Channel === '' && 'text-main-gray-disabled',
                  )}
                >
                  <SelectValue placeholder="Pilih Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Tiktok">Tiktok</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Teman">Teman</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Keluarga">Keluarga</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex h-[64px] items-center justify-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <Button
                type="submit"
                className="h-[calc(100%-1rem)] w-full rounded-[.8rem] bg-gradient px-8 text-white md:hover:opacity-85"
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

type UniversityOptionsType = {
  university: string;
  initials: string;
  averageScore: number;
  referensi: string | null;
  studyProgramList: {
    study: string;
    averageScore: number | null;
    passingGrade?: number;
  }[];
}[];

export default RegistrationTryOut;

// Komponen InputText
const InputText = ({
  heading,
  placeholder,
  setValue,
  value,
  disabled,
}: {
  heading: string;
  placeholder: string;
  setValue: (val: string) => void; // Required
  value: string;
  disabled?: boolean;
}) => {
  return (
    <div
      id="name-file"
      className="flex flex-col gap-[.5rem]"
    >
      <p className="text-[.9rem]">
        {heading}
        <span className="text-red-600">*</span>
      </p>
      <input
        type="text"
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-[.9rem] text-black outline-none focus:border-main"
        placeholder={`${placeholder}`}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value}
        required
        disabled={disabled}
      />
    </div>
  );
};

// Komponen InputNumber
const InputNumber = ({
  heading,
  placeholder,
  setValue,
  value,
  min,
  max,
}: {
  heading: string;
  placeholder: string;
  setValue: (val: number) => void; // Required
  value: number; // value sebagai number
  min?: number;
  max?: number;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Hanya mengizinkan angka
    const regex = /^[0-9]*$/;
    if (regex.test(inputValue)) {
      if (inputValue === '') {
        setValue(0); // Atur ke 0 atau nilai default lainnya
        return;
      }
      const num = Number.parseInt(inputValue, 10);
      // Validasi min dan max jika diperlukan
      if (
        (min !== undefined && num < min) ||
        (max !== undefined && num > max)
      ) {
        // Tidak melakukan apa-apa jika di luar rentang
        return;
      }
      setValue(num); // Simpan sebagai number
    }
  };

  return (
    <div
      id="name-file"
      className="flex flex-col gap-[.5rem]"
    >
      <p className="text-[.9rem]">
        {heading}
        <span className="text-red-600">*</span>
      </p>
      <input
        type="number"
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-[.9rem] text-black outline-none focus:border-main"
        placeholder={`${placeholder}`}
        onChange={handleChange}
        value={value === 0 ? '' : value} // Menangani sebagai number
        required
        min={min}
        max={max}
      />
    </div>
  );
};

// Combobox component for select with search
interface ComboboxOption {
  label: string;
  value: string;
}

const ComboboxSelect = ({
  heading,
  placeholder,
  value,
  setValue,
  options,
  disabled = false,
  isUniversity = false,
}: {
  heading: string;
  placeholder: string;
  value: string;
  setValue: (val: string) => void;
  options: ComboboxOption[];
  disabled?: boolean;
  isUniversity?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-[.5rem]">
      <p className="text-[.9rem]">
        {heading}
        <span className="text-red-600">*</span>
      </p>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between rounded-[.5rem] border border-main-gray-input px-4 py-[.5rem] text-left text-[.9rem] font-normal',
              !value && 'text-main-gray-disabled',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            <span className={isUniversity ? 'line-clamp-1' : 'truncate'}>
              {value
                ? options.find((option) => option.value === value)?.label ||
                  value
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${heading.toLowerCase()}...`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      setOpen(false);
                    }}
                    className={isUniversity ? 'py-2' : ''}
                  >
                    <div className="w-full text-left">{option.label}</div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4 shrink-0',
                        value === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
