//src/pages/client/try-out/_component/registration-try-out.tsx
"use client";

import { useSession } from "@/components/provider/session-provider-auth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toaster } from "@/components/ui/toaster";
import University from "@/lib/data/university";
import { mutateGeneral } from "@/lib/fetch-helper";
import { cn, Provinces } from "@/lib/utils";
import { IconX } from "@/styles/icon";
import { useState } from "react";
// Hapus import TRPCError karena tidak digunakan di frontend
// import { TRPCError } from '@trpc/server';

const RegistrationTryOut = ({
  getUserTryout,
}: {
  getUserTryout: () => any;
}) => {
  const { data: session } = useSession();

  const currentYear = new Date().getFullYear() + 1 + 4;

  const [step, setStep] = useState<number>(2); // Mulai dari step 2
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const { mutateAsync: createUserTo } = api.user.createUserTryOut.useMutation({
  //   onSuccess: async (data, variables, context) => {
  //     console.log({ data, variables, context });
  //     await trpc.user.getUserTryOut.invalidate();
  //     setIsLoading(false);
  //     toaster({
  //       title: "Sukses",
  //       condition: "success",
  //       description: "Berhasil membuat akun try out!",
  //       duration: 2000,
  //     });
  //   },
  //   onError(error) {
  //     toaster({
  //       title: "Upss",
  //       condition: "warning",
  //       description: `${error.message}`,
  //       duration: 2000,
  //     });
  //     setIsLoading(false);
  //   },
  // });

  const createUserTo = async (data: any) => {
    await mutateGeneral("/user/createUserTryOut", {
      payload: data,
      type: "post",
      onSuccess: getUserTryout,
    });
  };

  // Step 2
  const [Name, setName] = useState<string>("");
  const [Gender, setGender] = useState<string>("");
  const [Age, setAge] = useState<number>(0); // Ubah menjadi number
  const [Phone, setPhone] = useState<string>("");
  const [Kabupaten, setKabupaten] = useState<string>("");
  const [Provinsi, setProvinsi] = useState<string>("");

  // Step 3
  const [TipeSekolah, setTipeSekolah] = useState<
    "" | "SMA" | "SMK" | "MA" | "Sederajat"
  >("");
  const [AsalSekolah, setAsalSekolah] = useState<string>("");
  const [Jurusan, setJurusan] = useState<
    "IPA" | "IPS" | "Bahasa" | "Kejuruan" | "Campuran" | ""
  >("");
  const [TahunLulus, setTahunLulus] = useState<number>(0);
  const [TargetNilai, setTargetNilai] = useState<number>(0);

  // Step 4
  const [PilihanUniv1, setPilihanUniv1] = useState<string>("");
  const [JurusanUniv1, setJurusanUniv1] = useState<string>("");
  const [PilihanUniv2, setPilihanUniv2] = useState<string>("");
  const [JurusanUniv2, setJurusanUniv2] = useState<string>("");
  const [Channel, setChannel] = useState<string>("");

  const handleNextStep = (currentStep: number) => {
    if (currentStep === 2) {
      if (!Name || !Gender || Age <= 0 || !Phone || !Kabupaten || !Provinsi) {
        toaster({
          title: "Error",
          condition: "warning",
          description:
            "Harap isi semua field yang diperlukan dan pastikan umur valid.",
          duration: 2000,
        });
        return;
      }
    }

    if (currentStep === 3) {
      if (
        !TipeSekolah ||
        !AsalSekolah ||
        !Jurusan ||
        TahunLulus <= 0 ||
        TargetNilai <= 0
      ) {
        toaster({
          title: "Error",
          condition: "warning",
          description:
            "Harap isi semua field yang diperlukan dan pastikan nilai valid.",
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

        console.log("Age:", Age, typeof Age); // Harus number
        console.log("Phone:", Phone, typeof Phone); // Harus string
        console.log("Gender:", Gender, typeof Gender); // Harus string
        console.log("Kabupaten:", Kabupaten, typeof Kabupaten); // Harus string
        console.log("Provinsi:", Provinsi, typeof Provinsi); // Harus string
        console.log("TipeSekolah:", TipeSekolah, typeof TipeSekolah); // Harus string
        console.log("AsalSekolah:", AsalSekolah, typeof AsalSekolah); // Harus string
        console.log("Jurusan:", Jurusan, typeof Jurusan); // Harus string
        console.log("TahunLulus:", TahunLulus, typeof TahunLulus); // Harus number
        console.log("TargetNilai:", TargetNilai, typeof TargetNilai); // Harus number

        if (Age <= 0) {
          toaster({
            title: "Error",
            condition: "warning",
            description: "Umur tidak valid. Silakan masukkan angka yang benar.",
            duration: 2000,
          });
          setIsLoading(false);
          return;
        }

        console.log(
          "TargetNilai sebelum dikirim:",
          TargetNilai,
          typeof TargetNilai
        );

        // Bungkus data tanpa newUserTryOut
        const dataToSend = {
          userId: session?.user.id,
          gender: Gender,
          age: Age,
          phone: Phone,
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

        console.log("Data yang dikirim ke backend:", dataToSend);

        // Gunakan Non-Null Assertion jika perlu
        await createUserTo!(dataToSend);
        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
        toaster({
          title: "Upss",
          condition: "warning",
          description: `${error}`,
          duration: 2000,
        });
        setIsLoading(false);
        return;
      }
    }
  };

  return (
    <div className="relative w-[calc(100%-2rem)] max-w-[500px] rounded-[1rem] bg-white p-[2rem] shadow-default md:w-full">
      <div
        className="absolute right-4 top-4 cursor-pointer"
        onClick={() => {
          // Handle tombol close sesuai kebutuhan
          // Misalnya, tutup modal atau lakukan tindakan lain tanpa merubah step
          // Contoh: Menutup modal atau navigasi kembali
          // Di sini saya set step kembali ke 2 untuk tetap menampilkan form
          setStep(2);
        }}
      >
        <IconX className="text-main-gray-text duration-200 md:hover:text-main-gray-text2" />
      </div>
      <p className="mb-[2rem] text-center text-[1.2rem] font-semibold">
        Verifikasi Akun
      </p>

      {step === 2 && (
        <form
          className="flex flex-col gap-[1rem]"
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
          <div className="grid grid-cols-2 gap-[1rem]">
            <InputNumber
              heading="Umur"
              placeholder="Umur"
              value={Age}
              setValue={setAge}
              min={0}
            />
            <div id="gender-field" className="flex flex-col gap-[.5rem]">
              <p className="text-[.9rem]">
                Jenis Kelamin<span className="text-red-600">*</span>
              </p>
              <Select
                value={Gender}
                onValueChange={(value) => value && setGender(value)}
              >
                <SelectTrigger
                  className={cn(
                    `font-regular h-[unset] w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-[.9rem] text-black outline-none focus:border-main`,
                    Gender === "" && "text-main-gray-disabled"
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
          <div className="flex flex-col gap-[.5rem]">
            <p className="text-[.9rem]">
              No. Hp<span className="text-red-600">*</span>
            </p>
            <div className="relative flex items-center">
              <p className="absolute left-[1rem] text-[.9rem]">+62</p>
              <input
                type="number"
                className="font-regular w-full rounded-[.5rem] border border-main-gray-input py-[.5rem] pl-[4rem] pr-[1rem] text-[.9rem] text-black outline-none focus:border-main"
                placeholder={"No. Hp"}
                onChange={(e) => {
                  setPhone(e.target.value);
                  console.log("Phone diupdate menjadi:", e.target.value);
                }}
                value={Phone}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[1rem]">
            <InputOptionProvince
              heading="Provinsi"
              placeholder="Provinsi"
              value={Provinsi}
              setValue={setProvinsi}
              type="province"
            />
            <InputOptionProvince
              heading="Kota/Kabupaten"
              placeholder="Kota/Kabupaten"
              value={Kabupaten}
              setValue={setKabupaten}
              type="regency"
              province={Provinsi}
            />
          </div>
          <div className="flex h-[64px] items-center justify-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <Button
                type="submit"
                className="h-[calc(100%-1rem)] w-full rounded-[.8rem] bg-gradientGreen px-[2rem] text-white md:hover:bg-gradientGreenHover"
              >
                Selanjutnya
              </Button>
            )}
          </div>
        </form>
      )}

      {step === 3 && (
        <form
          className="flex flex-col gap-[1rem]"
          onSubmit={(e) => {
            e.preventDefault();
            handleNextStep(3);
          }}
        >
          <div className="grid grid-cols-2 gap-[1rem]">
            <div id="school-type-field" className="flex flex-col gap-[.5rem]">
              <p className="text-[.95rem]">
                Asal Sekolah?<span className="text-red-600">*</span>
              </p>
              <Select
                value={TipeSekolah}
                onValueChange={(value) =>
                  value &&
                  setTipeSekolah(
                    value as "" | "SMA" | "SMK" | "MA" | "Sederajat"
                  )
                }
              >
                <SelectTrigger
                  className={cn(
                    `font-regular h-[unset] w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-[.9rem] text-black outline-none focus:border-main`,
                    TipeSekolah === "" && "text-main-gray-disabled"
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
          <div className="grid grid-cols-2 gap-[1rem]">
            <div id="major-field" className="flex flex-col gap-[.5rem]">
              <p className="text-[.95rem]">
                Jurusan<span className="text-red-600">*</span>
              </p>
              <Select
                value={Jurusan}
                onValueChange={(value) =>
                  value &&
                  setJurusan(
                    value as
                      | "IPA"
                      | "IPS"
                      | "Bahasa"
                      | "Kejuruan"
                      | "Campuran"
                      | ""
                  )
                }
              >
                <SelectTrigger
                  className={cn(
                    `font-regular h-[unset] w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-[.9rem] text-black outline-none focus:border-main`,
                    Jurusan === "" && "text-main-gray-disabled"
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
                value={TahunLulus === 0 ? "" : TahunLulus.toString()}
                onValueChange={(value) => {
                  if (value.length > 0) {
                    setTahunLulus(parseInt(value, 10));
                    console.log("Tahun Lulus diupdate menjadi:", value);
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    `font-regular h-[unset] w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-[.9rem] text-black outline-none focus:border-main`,
                    TahunLulus === 0 && "text-main-gray-disabled"
                  )}
                >
                  <SelectValue placeholder="Pilih Tahun Lulus" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }).map((item, index) => (
                    <SelectItem key={index} value={`${currentYear - index}`}>
                      {currentYear - index}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <InputNumber
            heading="Target Nilai SNBT/UTBK (0-1000)"
            placeholder="Target Nilai"
            value={TargetNilai} // Kirim sebagai number
            setValue={setTargetNilai} // Fungsi menerima number
            max={1000}
          />
          <div className="flex h-[64px] items-center justify-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <Button
                type="submit"
                className="h-[calc(100%-1rem)] w-full rounded-[.8rem] bg-gradientGreen px-[2rem] text-white md:hover:bg-gradientGreenHover"
              >
                Selanjutnya
              </Button>
            )}
          </div>
        </form>
      )}

      {step === 4 && (
        <form
          className="flex flex-col gap-[1rem]"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegistration();
          }}
        >
          <div className="grid grid-cols-2 gap-[1rem]">
            <InputOptionUniversity
              heading="Pilihan 1 - Universitas"
              placeholder="Universitas"
              value={PilihanUniv1}
              setValue={setPilihanUniv1}
              type="university"
            />
            <InputOptionUniversity
              heading="Pilihan 1 - Jurusan"
              placeholder="Jurusan"
              value={JurusanUniv1}
              setValue={setJurusanUniv1}
              type="studyProgramList"
              university={PilihanUniv1}
            />
          </div>
          <div className="grid grid-cols-2 gap-[1rem]">
            <InputOptionUniversity
              heading="Pilihan 2 - Universitas"
              placeholder="Universitas"
              value={PilihanUniv2}
              setValue={setPilihanUniv2}
              type="university"
            />
            <InputOptionUniversity
              heading="Pilihan 2 - Jurusan"
              placeholder="Jurusan"
              value={JurusanUniv2}
              setValue={setJurusanUniv2}
              type="studyProgramList"
              university={PilihanUniv2}
            />
          </div>
          <div className="flex flex-col gap-[.5rem]">
            <p className="text-[.95rem]">
              Tau Bimbelio dari mana?<span className="text-red-600">*</span>
            </p>
            <Select
              value={Channel}
              onValueChange={(value) => {
                if (value) {
                  setChannel(value);
                  console.log("Channel diupdate menjadi:", value);
                }
              }}
            >
              <SelectTrigger
                className={cn(
                  `font-regular h-[unset] w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-[.9rem] text-black outline-none focus:border-main`,
                  Channel === "" && "text-main-gray-disabled"
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
          <div className="flex h-[64px] items-center justify-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <Button
                type="submit"
                className="h-[calc(100%-1rem)] w-full rounded-[.8rem] bg-gradientGreen px-[2rem] text-white md:hover:bg-gradientGreenHover"
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
    <div id="name-file" className="flex flex-col gap-[.5rem]">
      <p className="text-[.9rem]">
        {heading}
        <span className="text-red-600">*</span>
      </p>
      <input
        type="text"
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-[.9rem] text-black outline-none focus:border-main"
        placeholder={`${placeholder}`}
        onChange={(e) => {
          setValue(e.target.value);
          console.log(`${heading} diupdate menjadi:`, e.target.value);
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
      if (inputValue === "") {
        setValue(0); // Atur ke 0 atau nilai default lainnya
        return;
      }
      const num = parseInt(inputValue, 10);
      // Validasi min dan max jika diperlukan
      if (
        (min !== undefined && num < min) ||
        (max !== undefined && num > max)
      ) {
        // Tidak melakukan apa-apa jika di luar rentang
        return;
      }
      setValue(num); // Simpan sebagai number
      console.log(`${heading} diupdate menjadi:`, num);
    }
  };

  return (
    <div id="name-file" className="flex flex-col gap-[.5rem]">
      <p className="text-[.9rem]">
        {heading}
        <span className="text-red-600">*</span>
      </p>
      <input
        type="number"
        className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-[.9rem] text-black outline-none focus:border-main"
        placeholder={`${placeholder}`}
        onChange={handleChange}
        value={value === 0 ? "" : value} // Menangani sebagai number
        required
        min={min}
        max={max}
      />
    </div>
  );
};

// Komponen InputOptionProvince
const InputOptionProvince = ({
  heading,
  placeholder,
  setValue,
  value,
  province,
  type,
}: {
  heading: string;
  placeholder: string;
  setValue: (val: string) => void; // Required
  value: string;
  province?: string;
  type: "province" | "regency";
}) => {
  const [showOption, setShowOption] = useState<boolean>(false);

  const provinces = Provinces;

  const getData = () => {
    if (type === "province") {
      return provinces.map((item) => ({ value: item.province }));
    } else if (type === "regency") {
      return (
        provinces
          .find((item) => item.province === province)
          ?.district.map((regency) => ({ value: regency.regency })) || []
      );
    }
    return provinces.map((item) => ({ value: item.province }));
  };

  const search = () => {
    return getData()?.filter((item) =>
      item.value.toLowerCase().includes(value.toLowerCase())
    );
  };

  console.log("search :", value);
  console.log("getData :", getData());
  console.log("search :", search());

  return (
    <div id="name-file" className="flex flex-col gap-[.5rem]">
      <p className="text-[.9rem]">
        {heading}
        <span className="text-red-600">*</span>
      </p>
      <div className="relative">
        <input
          id="inputOptionProvince"
          type="text"
          className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-[.9rem] text-black outline-none focus:border-main"
          placeholder={`${placeholder}`}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onFocus={() => setShowOption(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowOption(false);
            }, 200);
          }}
          value={value}
          required
        />
        {showOption && value.length === 0 ? (
          <div className="absolute left-0 top-[calc(100%+.5rem)] w-full overflow-hidden rounded-[.5rem] bg-white py-[.5rem] shadow-default">
            <div className="max-h-[200px] w-full overflow-y-auto text-[.9rem]">
              {getData()?.map((item, i) => (
                <div
                  key={i}
                  className="cursor-pointer px-[1rem] py-[.2rem] duration-300 md:hover:bg-main md:hover:text-white"
                  onClick={() => {
                    setValue(item.value);
                    console.log(`${heading} dipilih:`, item.value);
                  }}
                >
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        ) : showOption && value.length > 0 ? (
          <div className="absolute left-0 top-[calc(100%+.5rem)] w-full overflow-hidden rounded-[.5rem] bg-white py-[.5rem] shadow-default">
            <div className="max-h-[200px] w-full overflow-y-auto text-[.9rem]">
              {search()?.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "cursor-pointer px-[1rem] py-[.2rem] text-[.9rem] duration-300 md:hover:bg-main md:hover:text-white"
                  )}
                  onClick={() => {
                    setValue(item.value);
                    console.log(`${heading} dipilih:`, item.value);
                  }}
                >
                  {item.value}
                </div>
              ))}
              {search()?.length === 0 && (
                <div className="px-[1rem] py-[.2rem] text-[.9rem] text-main-gray-text duration-300">
                  Jika tidak ada, tulis sendiri
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Komponen InputOptionUniversity
export const InputOptionUniversity = ({
  heading,
  placeholder,
  setValue,
  value,
  university,
  type,
}: {
  heading: string;
  placeholder: string;
  setValue: (val: string) => void; // Required
  value: string;
  university?: string;
  type: "university" | "studyProgramList";
}) => {
  const [showOption, setShowOption] = useState<boolean>(false);

  const universities = University;

  const getData = () => {
    if (type === "university") {
      return universities.map((item) => ({
        value: item.university,
        initials: item.initials,
      }));
    } else if (type === "studyProgramList") {
      const findData = universities.find(
        (item) => item.university === university
      );
      if (!findData) return [];
      return findData.studyProgramList.map((sProgram) => ({
        value: sProgram.study,
        initials: "-",
      }));
    }
    return universities.map((item) => ({
      value: item.university,
      initials: item.initials,
    }));
  };

  const search = () => {
    return getData()?.filter(
      (item) =>
        item.value.toLowerCase().includes(value.toLowerCase()) ||
        item.initials.toLowerCase().includes(value.toLowerCase())
    );
  };

  console.log(getData().length);

  return (
    <div id="name-file" className="flex flex-col gap-[.5rem]">
      <p className="text-[.9rem]">
        {heading}
        <span className="text-red-600">*</span>
      </p>
      <div className="relative">
        <input
          id="inputOptionProvince"
          type="text"
          className="font-regular w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.5rem] text-[.9rem] text-black outline-none focus:border-main"
          placeholder={`${placeholder}`}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onFocus={() => setShowOption(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowOption(false);
            }, 200);
          }}
          value={value}
          required
        />
        {showOption && value.length === 0 ? (
          <div
            className={cn(
              "absolute left-0 top-[calc(100%+.5rem)] z-[999] w-full overflow-hidden rounded-[.5rem] bg-white py-[.5rem] shadow-default"
            )}
          >
            <div className="max-h-[200px] w-full overflow-y-auto text-[.9rem]">
              {getData()?.map((item, i) => (
                <div
                  key={i}
                  className="cursor-pointer px-[1rem] py-[.2rem] duration-300 md:hover:bg-main md:hover:text-white"
                  onClick={() => {
                    setValue(item.value);
                    console.log(`${heading} dipilih:`, item.value);
                  }}
                >
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        ) : showOption && value.length > 0 ? (
          <div
            className={cn(
              "absolute left-0 top-[calc(100%+.5rem)] z-[999] w-full overflow-hidden rounded-[.5rem] bg-white py-[.5rem] shadow-default"
            )}
          >
            <div className="max-h-[200px] w-full overflow-y-auto text-[.9rem]">
              {search()?.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "cursor-pointer px-[1rem] py-[.2rem] text-[.9rem] duration-300 md:hover:bg-main md:hover:text-white"
                  )}
                  onClick={() => {
                    setValue(item.value);
                    console.log(`${heading} dipilih:`, item.value);
                  }}
                >
                  {item.value}
                </div>
              ))}
              {search()?.length === 0 && (
                <div className="px-[1rem] py-[.2rem] text-[.9rem] text-main-gray-text duration-300">
                  Jika tidak ada, tulis sendiri
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
