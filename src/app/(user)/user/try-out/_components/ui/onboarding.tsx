import OpeningChat from '@/_assest/onboarding/chat/1-opening.png';
import Chat from '@/_assest/onboarding/chat/2-chat.png';
import Vision1 from '@/_assest/onboarding/chat/3-vision.png';
import Vision2 from '@/_assest/onboarding/chat/4-vision.png';
import OpeningNotes from '@/_assest/onboarding/notes/1-opening.png';
import Notes1 from '@/_assest/onboarding/notes/2-notes.png';
import Notes2 from '@/_assest/onboarding/notes/3-notes.png';
import OpeningQuiz from '@/_assest/onboarding/quiz/1-opening.png';
import Quiz1 from '@/_assest/onboarding/quiz/2-quiz.png';
import Quiz2 from '@/_assest/onboarding/quiz/3-quiz.png';
import Quiz3 from '@/_assest/onboarding/quiz/4-quiz.png';
import { useAppContext } from '@/components/provider/provider-app';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  open: boolean;
  type: 'chat' | 'notes' | 'quiz' | 'tryout';
}

const OnBoarding = ({ open, type }: Props) => {
  const { setOnBoarding, onBoarding } = useAppContext();

  const handleClose = () => {
    if (type === 'chat') {
      setOnBoarding((prev: any) => ({ ...prev, chat: false }));
      localStorage.setItem(
        'on-boarding',
        JSON.stringify({ ...onBoarding, chat: false }),
      );
    } else if (type === 'notes') {
      setOnBoarding((prev: any) => ({ ...prev, notes: false }));
      localStorage.setItem(
        'on-boarding',
        JSON.stringify({ ...onBoarding, notes: false }),
      );
    } else if (type === 'quiz') {
      setOnBoarding((prev: any) => ({ ...prev, quiz: false }));
      localStorage.setItem(
        'on-boarding',
        JSON.stringify({ ...onBoarding, quiz: false }),
      );
    } else if (type === 'tryout') {
      setOnBoarding((prev: any) => ({ ...prev, tryout: false }));
      localStorage.setItem(
        'on-boarding',
        JSON.stringify({ ...onBoarding, tryout: false }),
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        handleClose();
      }}
    >
      <DialogContent className="w-[90%] max-w-[690px] md:w-full">
        {type === 'chat' ? (
          <ChatAI />
        ) : type === 'notes' ? (
          <Notes />
        ) : type === 'quiz' ? (
          <QuizAI />
        ) : type === 'tryout' ? (
          <Tryout />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default OnBoarding;

const ChatAI = () => {
  const { setOnBoarding, onBoarding } = useAppContext();

  const [index, setIndex] = useState<number>(0);

  const data = [
    {
      image: (
        <Image
          src={OpeningChat}
          alt=""
        />
      ),
      heading: 'Selamat Datang di Chat AI',
      content:
        'Dengan Chat AI, kamu dapat bertanya seputar soal atau materi yang kurang dipahami, dan langsung mendapatkan jawaban secara real-time.',
      plus: 'Ingin pelajari fitur ini lebih lanjut?',
    },
    {
      image: (
        <Image
          src={Chat}
          alt=""
        />
      ),
      heading: 'Bertanya Langsung ke AI',
      content:
        'Kamu bisa langsung mengetik pertanyaan atau soal yang kamu ingin tanyakan kepada Chat AI, dan AI akan memberikan penjelasan yang kamu butuhkan.',
      plus: null,
    },
    {
      image: (
        <Image
          src={Vision1}
          alt=""
        />
      ),
      heading: 'Pakai Vision AI (1/2)',
      content:
        'Dengan Vision AI, kamu bisa menganalisis gambar atau soal yang muncul di layar. Klik ikon Vision untuk memulai.',
      plus: null,
    },
    {
      image: (
        <Image
          src={Vision2}
          alt=""
        />
      ),
      heading: 'Pakai Vision AI (2/2)',
      content:
        'Kamu bisa memilih bagian dari dokumen atau soal yang ingin kamu tanyakan. Setelah memilih area, tooltip akan muncul dengan opsi untuk meminta bantuan lebih lanjut.',
      plus: 'Mulai fitur Chat AI?',
    },
  ];
  return (
    <div className="flex flex-col justify-center gap-[1rem] md:flex-row">
      <div className="mx-auto w-full max-w-[274px] shrink-0 md:mx-0 md:w-[274px]">
        {data[index].image}
      </div>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-[1rem]">
          <h1 className="text-[1.1rem] font-semibold">{data[index].heading}</h1>
          <p>{data[index].content}</p>
          {data[index].plus && (
            <span className="text-[.9rem] text-blue-700">
              {data[index].plus}
            </span>
          )}
        </div>
        <div className="flex w-full items-center justify-end gap-[1rem]">
          <button
            className="rounded-[.8rem] px-[1rem] py-[.8rem] text-[.9rem] text-main-gray-text outline-none duration-300 md:hover:text-black"
            onClick={() => {
              if (index > 0) {
                setIndex((prev) => prev - 1);
              } else if (index === 0) {
                setOnBoarding((prev: any) => ({ ...prev, notes: false }));
                localStorage.setItem(
                  'on-boarding',
                  JSON.stringify({ ...onBoarding, notes: false }),
                );
              }
            }}
          >
            {index === 0 ? 'Tutup' : 'Sebelumnya'}
          </button>
          <button
            className="rounded-[.8rem] bg-main px-[1rem] py-[.8rem] text-[.9rem] text-white outline-none duration-300 md:hover:bg-main-hover"
            onClick={() => {
              if (index < data.length - 1) {
                setIndex((prev) => prev + 1);
              } else if (index === data.length - 1) {
                setOnBoarding((prev: any) => ({ ...prev, chat: false }));
                localStorage.setItem(
                  'on-boarding',
                  JSON.stringify({ ...onBoarding, chat: false }),
                );
              }
            }}
          >
            {index === 0
              ? 'Lihat Panduan'
              : index === data.length - 1
                ? 'Mulai'
                : 'Berikutnya'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Notes = () => {
  const { setOnBoarding, onBoarding } = useAppContext();

  const [index, setIndex] = useState<number>(0);

  const data = [
    {
      image: (
        <Image
          src={OpeningNotes}
          alt=""
        />
      ),
      heading: 'Selamat Datang di Notes',
      content:
        'Dengan Notes, kamu bisa membuat catatan pribadi untuk menyimpan poin-poin penting selama belajar.',
      plus: 'Ingin pelajari fitur ini lebih lanjut?',
    },
    {
      image: (
        <Image
          src={Notes1}
          alt=""
        />
      ),
      heading: 'Catatan Terstruktur',
      content:
        'Kamu bisa mengetik garis miring ‘/’ di awal paragraf untuk menampilkan berbagai opsi seperti heading, tabel, daftar, blok kutipan, dan elemen lainnya sesuai kebutuhanmu.',
      plus: null,
    },
    {
      image: (
        <Image
          src={Notes2}
          alt=""
        />
      ),
      heading: 'AI dalam Catatan',
      content:
        'Gunakan fitur AI untuk membantu kamu memahami atau menyempurnakan catatan yang sudah dibuat. Klik pada catatanmu, lalu pilih opsi AI untuk merangkum atau memperjelas isi catatan.',
      plus: null,
    },
  ];
  return (
    <div className="flex flex-col justify-center gap-[1rem] md:flex-row">
      <div className="mx-auto w-full max-w-[274px] shrink-0 md:mx-0 md:w-[274px]">
        {data[index].image}
      </div>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-[1rem]">
          <h1 className="text-[1.1rem] font-semibold">{data[index].heading}</h1>
          <p>{data[index].content}</p>
          {data[index].plus && (
            <span className="text-[.9rem] text-blue-700">
              {data[index].plus}
            </span>
          )}
        </div>
        <div className="flex w-full items-center justify-end gap-[1rem]">
          <button
            className="rounded-[.8rem] px-[1rem] py-[.8rem] text-[.9rem] text-main-gray-text outline-none duration-300 md:hover:text-black"
            onClick={() => {
              if (index > 0) {
                setIndex((prev) => prev - 1);
              } else if (index === 0) {
                setOnBoarding((prev: any) => ({ ...prev, notes: false }));
                localStorage.setItem(
                  'on-boarding',
                  JSON.stringify({ ...onBoarding, notes: false }),
                );
              }
            }}
          >
            {index === 0 ? 'Tutup' : 'Sebelumnya'}
          </button>
          <button
            className="rounded-[.8rem] bg-main px-[1rem] py-[.8rem] text-[.9rem] text-white outline-none duration-300 md:hover:bg-main-hover"
            onClick={() => {
              if (index < data.length - 1) {
                setIndex((prev) => prev + 1);
              } else if (index === data.length - 1) {
                setOnBoarding((prev: any) => ({ ...prev, notes: false }));
                localStorage.setItem(
                  'on-boarding',
                  JSON.stringify({ ...onBoarding, notes: false }),
                );
              }
            }}
          >
            {index === 0
              ? 'Lihat Panduan'
              : index === data.length - 1
                ? 'Mulai'
                : 'Berikutnya'}
          </button>
        </div>
      </div>
    </div>
  );
};

const QuizAI = () => {
  const { setOnBoarding, onBoarding } = useAppContext();
  const [index, setIndex] = useState<number>(0);
  const data = [
    {
      image: (
        <Image
          src={OpeningQuiz}
          alt=""
        />
      ),
      heading: 'Selamat Datang di Quiz',
      content:
        'Dengan Quiz AI, kamu bisa mengerjakan soal-soal pilihan ganda atau esai secara interaktif. Hasil quiz kamu akan dinilai secara otomatis oleh sistem.',
      plus: 'Ingin pelajari fitur ini lebih lanjut?',
    },
    {
      image: (
        <Image
          src={Quiz1}
          alt=""
        />
      ),
      heading: 'Pilih Tipe Soal',
      content:
        'Pilih tipe soal pilihan ganda atau jawaban singkat, sesuai dengan kebutuhanmu.',
      plus: null,
    },
    {
      image: (
        <Image
          src={Quiz2}
          alt=""
        />
      ),
      heading: 'Pilih Halaman',
      content:
        'Pilih halaman material yang ingin dijadikan quiz. Topik dan isi quiz akan dibuat berdasarkan konten dari halaman tersebut.',
      plus: null,
    },
    {
      image: (
        <Image
          src={Quiz3}
          alt=""
        />
      ),
      heading: 'Kerjakan dan Lihat Hasil',
      content:
        'Setelah memilih soal dan halaman, kamu bisa langsung menjawab. Sistem akan memberi umpan balik setelah kamu menjawab soal.',
      plus: 'Mulai fitur Quiz?',
    },
  ];
  return (
    <div className="flex flex-col justify-center gap-[1rem] md:flex-row">
      <div className="mx-auto w-full max-w-[274px] shrink-0 md:mx-0 md:w-[274px]">
        {data[index].image}
      </div>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-[1rem]">
          <h1 className="text-[1.1rem] font-semibold">{data[index].heading}</h1>
          <p>{data[index].content}</p>
          {data[index].plus && (
            <span className="text-[.9rem] text-blue-700">
              {data[index].plus}
            </span>
          )}
        </div>
        <div className="flex w-full items-center justify-end gap-[1rem]">
          <button
            className="rounded-[.8rem] px-[1rem] py-[.8rem] text-[.9rem] text-main-gray-text outline-none duration-300 md:hover:text-black"
            onClick={() => {
              if (index > 0) {
                setIndex((prev) => prev - 1);
              } else if (index === 0) {
                setOnBoarding((prev: any) => ({ ...prev, quiz: false }));
                localStorage.setItem(
                  'on-boarding',
                  JSON.stringify({ ...onBoarding, quiz: false }),
                );
              }
            }}
          >
            {index === 0 ? 'Tutup' : 'Sebelumnya'}
          </button>
          <button
            className="rounded-[.8rem] bg-main px-[1rem] py-[.8rem] text-[.9rem] text-white outline-none duration-300 md:hover:bg-main-hover"
            onClick={() => {
              if (index < data.length - 1) {
                setIndex((prev) => prev + 1);
              } else if (index === data.length - 1) {
                setOnBoarding((prev: any) => ({ ...prev, quiz: false }));
                localStorage.setItem(
                  'on-boarding',
                  JSON.stringify({ ...onBoarding, quiz: false }),
                );
              }
            }}
          >
            {index === 0
              ? 'Lihat Panduan'
              : index === data.length - 1
                ? 'Mulai'
                : 'Berikutnya'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Tryout = () => {
  const { setOnBoarding, onBoarding } = useAppContext();
  const [index, setIndex] = useState<number>(0);
  const data = [
    {
      image: (
        <Image
          src={OpeningQuiz}
          alt=""
        />
      ),
      heading: 'Selamat Datang di Tryout',
      content:
        'Dengan Quiz AI, kamu bisa mengerjakan soal-soal pilihan ganda atau esai secara interaktif. Hasil quiz kamu akan dinilai secara otomatis oleh sistem.',
      plus: 'Ingin pelajari fitur ini lebih lanjut?',
    },
    {
      image: (
        <Image
          src={Quiz1}
          alt=""
        />
      ),
      heading: 'Pilih Tipe Soal',
      content:
        'Pilih tipe soal pilihan ganda atau jawaban singkat, sesuai dengan kebutuhanmu.',
      plus: null,
    },
    {
      image: (
        <Image
          src={Quiz2}
          alt=""
        />
      ),
      heading: 'Pilih Halaman',
      content:
        'Pilih halaman material yang ingin dijadikan quiz. Topik dan isi quiz akan dibuat berdasarkan konten dari halaman tersebut.',
      plus: null,
    },
    {
      image: (
        <Image
          src={Quiz3}
          alt=""
        />
      ),
      heading: 'Kerjakan dan Lihat Hasil',
      content:
        'Setelah memilih soal dan halaman, kamu bisa langsung menjawab. Sistem akan memberi umpan balik setelah kamu menjawab soal.',
      plus: 'Mulai fitur Quiz?',
    },
  ];
  return (
    <div className="flex flex-col justify-center gap-[1rem] md:flex-row">
      <div className="mx-auto w-full max-w-[274px] shrink-0 md:mx-0 md:w-[274px]">
        {data[index].image}
      </div>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-[1rem]">
          <h1 className="text-[1.1rem] font-semibold">{data[index].heading}</h1>
          <p>{data[index].content}</p>
          {data[index].plus && (
            <span className="text-[.9rem] text-blue-700">
              {data[index].plus}
            </span>
          )}
        </div>
        <div className="flex w-full items-center justify-end gap-[1rem]">
          <button
            className="rounded-[.8rem] px-[1rem] py-[.8rem] text-[.9rem] text-main-gray-text outline-none duration-300 md:hover:text-black"
            onClick={() => {
              if (index > 0) {
                setIndex((prev) => prev - 1);
              } else if (index === 0) {
                setOnBoarding((prev: any) => ({ ...prev, quiz: false }));
                localStorage.setItem(
                  'on-boarding',
                  JSON.stringify({ ...onBoarding, quiz: false }),
                );
              }
            }}
          >
            {index === 0 ? 'Tutup' : 'Sebelumnya'}
          </button>
          <button
            className="rounded-[.8rem] bg-main px-[1rem] py-[.8rem] text-[.9rem] text-white outline-none duration-300 md:hover:bg-main-hover"
            onClick={() => {
              if (index < data.length - 1) {
                setIndex((prev) => prev + 1);
              } else if (index === data.length - 1) {
                setOnBoarding((prev: any) => ({ ...prev, quiz: false }));
                localStorage.setItem(
                  'on-boarding',
                  JSON.stringify({ ...onBoarding, quiz: false }),
                );
              }
            }}
          >
            {index === 0
              ? 'Lihat Panduan'
              : index === data.length - 1
                ? 'Mulai'
                : 'Berikutnya'}
          </button>
        </div>
      </div>
    </div>
  );
};
