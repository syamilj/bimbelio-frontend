import {
  IconRevolusi1,
  IconRevolusi2,
  IconRevolusi3,
  IconRevolusi4,
} from '@/styles/icon';

import { ImageBahanAjar } from '@/_assest/homepage/Revolusi/BahanAjar';
import { ImageChatAI } from '@/_assest/homepage/Revolusi/Chat';
import { ImageNotes } from '@/_assest/homepage/Revolusi/Notes';
import { ImageQuiz } from '@/_assest/homepage/Revolusi/Quiz';

const LearningRevolutions = () => {
  const revolusiBelajar = [
    {
      icon: <IconRevolusi1 />,
      heading: 'Interactive Materials',
      description: (
        <p className="text-[.95rem] text-main-gray-text">
          Ingin material interaktif? Dapatkan material{' '}
          <span className="text-main">materi</span>,{' '}
          <span className="text-main">soal</span>, dan{' '}
          <span className="text-main">video</span> yang bisa kamu tandai dan
          tanyakan sesuai kebutuhan!
        </p>
      ),
      image: <ImageBahanAjar />,
    },
    {
      icon: <IconRevolusi2 />,
      heading: 'Chat & Vision',
      description: (
        <p className="text-[.95rem] text-main-gray-text">
          Perlu bantuan langsung?{' '}
          <span className="text-main">Chat Bimbelio AI</span> untuk penjelasan
          dan analisis materi dalam bentuk apapun secara real-time dan teruji!
        </p>
      ),
      image: <ImageChatAI />,
    },
    {
      icon: <IconRevolusi3 />,
      heading: 'Note Collection',
      description: (
        <p className="text-[.95rem] text-main-gray-text">
          Tipe belajar mencatat? Gunakan fitur{' '}
          <span className="text-main">Note</span> yang disertai AI untuk
          membantu perihal catatan dan mengatur informasi pentingmu!
        </p>
      ),
      image: <ImageNotes />,
    },
    {
      icon: <IconRevolusi4 />,
      heading: 'Generate Quiz',
      description: (
        <p className="text-[.95rem] text-main-gray-text">
          Ingin menguji pemahamanmu?{' '}
          <span className="text-main">Generate Quiz</span> pilihan ganda maupun
          esai secara otomatis dari material!
        </p>
      ),
      image: <ImageQuiz />,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[4rem]">
      <div className="mx-[1rem] md:mx-0">
        <h2 className="text-center text-[1.5rem] font-bold md:text-[2.5rem] mb-4">
          Revolusi Belajar dengan AI!
        </h2>
        <p className="font-regular mt-[-1rem] text-center text-main-gray-text">
          Bagaimana cara belajar dengan AI membantu Kamu?
        </p>
      </div>

      <div className="mx-[1rem] grid grid-cols-1 gap-[1.5rem] md:mx-0 md:grid-cols-2">
        {revolusiBelajar.map((item: any, i: number) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-[.8rem] bg-white/50 p-[1.5rem] shadow-sm transition-all hover:shadow-md"
          >
            {/* Content wrapper */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Text content */}
              <div className="flex flex-col gap-[1rem] md:max-w-[50%]">
                <div className="text-main">{item.icon}</div>
                <h1 className="text-[1.3rem] font-medium">{item.heading}</h1>
                {item.description}
              </div>

              {/* Image - visible on all screen sizes */}
              <div className="flex justify-center md:justify-end text-main">
                {item.image}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningRevolutions;
