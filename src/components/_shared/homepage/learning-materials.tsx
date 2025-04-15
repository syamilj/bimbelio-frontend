//learning-materials.tsx

import { cn } from '@/lib/utils';
import {
  IconCategoryTIU,
  IconCategoryTKP,
  IconCategoryTOEFL,
  IconCategoryTWK,
} from '@/styles/icon';
import { AnimatedList } from '../../magicui/animated-list';

const LearningMaterials = () => {
  let notifications = [
    {
      name: 'Test Potensi Skolastik (TPS)',
      description: 'Test of English as a Foreign Language',
      time: '15m ago',
      icon: <IconCategoryTOEFL />,
      color: '#00C9A7',
    },
    {
      name: 'Tes Literasi Bahasa',
      description: 'Tes Karakteristik Pribadi',
      time: '15m ago',
      icon: <IconCategoryTKP />,
      color: '#00C9A7',
    },
    {
      name: 'Tes Penalaran Matematika',
      description: 'Tes Intelegensi Umum',
      time: '15m ago',
      icon: <IconCategoryTIU />,
      color: '#00C9A7',
    },
    {
      name: 'TWK',
      description: 'Tes Wawasan Kebangsaan',
      time: '15m ago',
      icon: <IconCategoryTWK />,
      color: '#00C9A7',
    },
    // {
    //   name: 'Umum',
    //   description: 'Materi Dasar dan Umum',
    //   time: '15m ago',
    //   icon: <IconCategoryUmum />,
    //   color: '#00C9A7',
    // },
  ];

  notifications = Array.from({ length: 10 }, () => notifications).flat();

  return (
    <div
      id="materi"
      className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-[4rem]"
    >
      <div className="mx-[1rem] md:mx-0">
        <h1 className="mb-[1rem] text-center text-[1.5rem] font-bold text-main md:text-[2.5rem]">
          Materi Apa yang Kamu Butuhkan?
        </h1>
        <p className="font-regular mt-[-1rem] text-center text-main-gray-text">
          Uji tingkat kesiapanmu dengan Quiz di setiap materi SNBT/UTBK!
        </p>
      </div>
      <div className="gap-[1.5rem]">
        <div
          className={cn(
            'relative flex h-[450px] w-full flex-col overflow-hidden rounded-xl p-6 md:h-[500px]',
          )}
        >
          <AnimatedList>
            {notifications.map((item: any, i: number) => (
              <figure
                key={i}
                className={cn(
                  'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
                  'transition-all duration-200 ease-in-out hover:scale-[103%]',
                  'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
                  'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
                )}
              >
                <div className="flex flex-row items-center gap-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: 'transparent',
                    }}
                  >
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
                      <span className="text-lg">{item.name}</span>
                    </figcaption>
                    <p className="text-sm font-normal text-main-gray-text">
                      {item.description}
                    </p>
                  </div>
                </div>
              </figure>
            ))}
          </AnimatedList>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-[100px] w-full bg-fadeMateri" />
    </div>
  );
};

export default LearningMaterials;
