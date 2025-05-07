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
import AnimatedGradientText from '../../magicui/animated-gradient-text';

const LearningRevolutions = () => {
  // <span className="text-main-default"></span>
  const revolusiBelajar = [
    {
      icon: <IconRevolusi1 />,
      heading: 'Interactive Materials',
      description: (
        <p className="text-[.95rem] text-main-gray-text">
          Ingin material interaktif? Dapatkan material{' '}
          <span className="text-main-default">materi</span>,{' '}
          <span className="text-main-default">soal</span>, dan{' '}
          <span className="text-main-default">video</span> yang bisa kamu tandai
          dan tanyakan sesuai kebutuhan!
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
          <span className="text-main-default">Chat Bimbelio AI</span> untuk
          penjelasan dan analisis materi dalam bentuk apapun secara real-time
          dan teruji!
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
          <span className="text-main-default">Note</span> yang disertai AI untuk
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
          <span className="text-main-default">Generate Quiz</span> pilihan ganda
          maupun esai secara otomatis dari material!
        </p>
      ),

      image: <ImageQuiz />,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[4rem]">
      <div className="mx-[1rem] md:mx-0">
        <h2 className="text-center text-[1.5rem] font-bold md:text-[2.5rem]">
          <AnimatedGradientText>
            Revolusi Persiapan SNBT/UTBK dengan AI!
          </AnimatedGradientText>
        </h2>
        <p className="font-regular mt-[-1rem] text-center text-main-gray-text">
          Bagaimana cara belajar untuk SNBT/UTBK dengan AI membantu Kamu?
        </p>
      </div>
      <div className="mx-[1rem] grid grid-cols-1 gap-[1.5rem] md:mx-0 md:grid-cols-2">
        {revolusiBelajar.map((item: any, i: number) => (
          <div
            key={i}
            className="grid grid-cols-1 rounded-[.8rem] bg-white p-[1.5rem] md:grid-cols-2  bg-white/50"
          >
            <div className="flex flex-col gap-[1rem]">
              <div className="text-main-default">{item.icon}</div>
              <h1 className="text-[1.3rem] font-medium">{item.heading}</h1>
              {item.description}
            </div>
            <div className="hidden shrink-0 md:block text-main-default">
              {item.image}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningRevolutions;
