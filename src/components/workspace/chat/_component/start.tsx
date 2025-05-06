import { useSession } from '@/components/provider/session-provider-auth';
import { Spinner } from '@/components/ui/spinner';
import { IconDocument } from '@/styles/icon';

interface Props {
  isLoading: boolean;
  onClick: () => void;
}

export default function Start({ isLoading, onClick }: Props) {
  const { data: session } = useSession();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-full w-full max-w-[800px] flex-col items-center justify-center gap-[2rem] px-[2rem]">
        <h1 className="font-regular w-full text-center text-[24px] text-main-gray-text">
          Halo, <span className="text-main">{session?.user.name}</span> <br />
          Siap untuk memulai pembelajaran?
        </h1>
        <div
          className={`flex items-center gap-[.5rem] rounded-[1rem] bg-white p-[1.5rem] duration-200 ${
            !isLoading && 'cursor-pointer hover:shadow-xl'
          } font-medium text-main-gray-text`}
          onClick={onClick}
        >
          {isLoading ? (
            <div className="flex w-full justify-center text-main">
              <Spinner />
            </div>
          ) : (
            <>
              <IconDocument className="text-main" />
              <p>Mulai Belajar</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
