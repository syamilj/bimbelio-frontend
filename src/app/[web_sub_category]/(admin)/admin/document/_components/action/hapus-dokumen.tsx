import { Loader2 } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  id: string;
  title: string;
  setDeleteConfirmation: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setDeleteData: Dispatch<
    SetStateAction<{
      id: string;
      title: string;
    }>
  >;
};

export default function HapusDokumen({
  id,
  title,
  setDeleteConfirmation,
  loading,
  setDeleteData,
}: Props) {
  return (
    <>
      {loading && (
        <div className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-[#ffffff09]">
          <Loader2 className={'mr-2 h-[5rem] w-[5rem] animate-spin'} />
        </div>
      )}
      <button
        className="cursor-pointer border border-black px-[1rem] py-[.3rem]"
        onClick={() => {
          setDeleteConfirmation(true);
          setDeleteData({
            id,
            title,
          });
        }}
      >
        Hapus
      </button>
    </>
  );
}
