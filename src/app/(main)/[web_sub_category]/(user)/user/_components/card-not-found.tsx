import { IconDataNotFound } from '@/styles/icon';
import { useMedia } from 'use-media';

const CardNotFound = ({ title }: { title?: string }) => {
  const isMobile = useMedia({ maxWidth: '768px' });

  return (
    <div
      id="card"
      className="relative flex h-[160px] w-full cursor-default flex-col items-center justify-center overflow-hidden rounded-3xl bg-white border-2 border-gray-100 shadow-sm duration-300 mb:h-[200px] md:h-[200px] md2:h-[180px] xl:h-[250px] xxxl:h-[300px]"
    >
      <div className="-mt-8 flex flex-col items-center text-center text-[.9rem] text-gray-500">
        <IconDataNotFound w={isMobile ? 70 : 130} />
        {title ? <p className="text-gray-500 font-medium">{title}</p> : <p></p>}
      </div>
    </div>
  );
};

export default CardNotFound;
