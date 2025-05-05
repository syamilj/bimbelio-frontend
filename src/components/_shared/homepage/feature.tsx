import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { IconFitur1, IconFitur2, IconFitur3 } from '@/styles/icon';

const Feature = () => {
  useWebsiteSubCategory();
  const fitur = [
    {
      icon: <IconFitur1 w={80} />,
      text: 'Pendamping belajar cermat',
      description: (
        <p className="font-regular mt-[-.5rem] text-[.85rem] text-main-gray-text">
          Gunakan metode strategi revolusi belajar yang{' '}
          <span className="font-medium text-main">terpersonalisasi</span>{' '}
          berdasarkan kemampuanmu.
        </p>
      ),
    },
    {
      icon: <IconFitur2 w={80} />,
      text: 'Pembelajaran aktif dan terarah',
      description: (
        <p className="font-regular mt-[-.5rem] text-[.85rem] text-main-gray-text">
          Manfaatkan teknologi{' '}
          <span className="font-medium text-main">
            Active AI-Based Learning
          </span>{' '}
          untuk mendapatkan pendamping belajar yang interaktif dan efektif.
        </p>
      ),
    },
    {
      icon: <IconFitur3 w={80} />,
      text: 'Akses materi variatif dan lengkap',
      description: (
        <p className="font-regular mt-[-.5rem] text-[.85rem] text-main-gray-text">
          Nikmati akses ke{' '}
          <span className="font-medium text-main">materi kurasi terbaru</span>{' '}
          yang variatif dan lengkap kapan saja, di mana saja dengan teknologi
          tertinggi.{' '}
        </p>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">
        <AnimatedGradientText>
          Inovasi Belajar SNBT/UTBK Berbasis AI
        </AnimatedGradientText>
      </h1>
      <div
        id="fitur"
        className="mx-auto mt-[-2rem] grid w-full max-w-[1024px] grid-cols-1 gap-y-4 py-[3rem] md:mt-[0] md:grid-cols-3 md:gap-x-[1.5rem] md:gap-y-0"
      >
        {fitur.map((item: any) => (
          <div
            key={item.id} // Replace with a unique identifier or generate a unique key
            className="mx-[1rem] flex flex-col items-center justify-center gap-[1rem] rounded-[2rem] bg-transparent bg-white p-[1rem] text-center md:gap-[1.5rem] lg:mx-[unset]"
            // style={{
            //   color: websiteSubCategory?.main_color,
            // }}
          >
            <div className="text-white">{item.icon}</div>
            <p className="font-semibold">{item.text}</p>
            {item.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feature;
