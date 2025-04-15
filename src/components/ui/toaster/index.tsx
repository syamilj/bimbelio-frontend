import { getDate, getHours } from '@/lib/utils';
import { IconCheckList, IconPlus, IconWrong } from '@/styles/icon';
import toast from 'react-hot-toast';

interface ToasterProps {
  title: string;
  condition?: 'success' | 'warning';
  description?: string;
  duration?: number;
  noDate?: boolean;
}

export const toaster = ({
  title,
  condition,
  description,
  duration,
  noDate,
}: ToasterProps) => {
  toast(
    (data: any) => (
      <Toasts
        data={data}
        condition={condition}
        title={title}
        description={description}
        noDate={noDate ? noDate : false}
      />
    ),
    {
      duration: duration ? duration : 1500,
      style: {
        padding: 0,
        margin: 0,
        boxShadow: 'none',
        background: 'transparent',
      },
    },
  );
};

const Toasts = ({
  data,
  condition,
  title,
  description,
  noDate,
}: {
  data: any;
  condition?: any;
  title: string;
  description?: string;
  noDate: boolean;
}) => {
  const Dates = new Date();

  return (
    <div
      id="toaster"
      className={`${
        data.visible ? 'animate-enter' : 'animate-leave'
      } pointer-events-auto relative flex w-full max-w-md rounded-[1rem] bg-white shadow-default`}
    >
      <div className="flex flex-col p-[1rem] text-[.9rem]">
        <div className="flex items-center">
          <div className="flex w-[30px] justify-start">
            {condition === 'success' ? (
              <IconCheckList className={'text-blue-600'} />
            ) : condition === 'warning' ? (
              <IconWrong className={'text-red-600'} />
            ) : null}
            {!condition && <IconCheckList className={'text-blue-600'} />}
          </div>
          <p className="font-medium">{title}</p>
        </div>
        <div className="ml-[30px] mt-[5px]">
          {description && <p className="text-main-gray-text2">{description}</p>}
          {!noDate && (
            <div className="font-regular mt-[.3rem] flex items-center gap-[.2rem] text-[.8rem] text-main-gray-disabled duration-300">
              <p>{getHours(Dates)}</p>
              <span>.</span>
              <p>{getDate(Dates)}</p>
            </div>
          )}
        </div>
      </div>
      {}
      <div
        id="toasterClose"
        className="absolute right-[.5rem] top-[.5rem] w-fit rotate-45 rounded-[50%] p-[.4rem] duration-200 hover:bg-main-gray-input active:bg-main-gray-input2"
        onClick={() => toast.dismiss(data.id)}
      >
        <IconPlus
          className={'text-main-gray-text2'}
          w={15}
        />
      </div>
    </div>
  );
};
