import { Loader2, Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  id: string;
  title: string;
  videoTitle: string;
  setDeleteConfirmation: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setDeleteData: Dispatch<
    SetStateAction<{ id: string; title: string; videoTitle: string }>
  >;
};

export default function HapusDokumen({
  id,
  title,
  videoTitle,
  setDeleteConfirmation,
  loading,
  setDeleteData,
}: Props) {
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-main" />
        </div>
      )}
      <button
        title="Hapus dokumen"
        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        onClick={() => {
          setDeleteConfirmation(true);
          setDeleteData({ id, title, videoTitle });
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );
}
