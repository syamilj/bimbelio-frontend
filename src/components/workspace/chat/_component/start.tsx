import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Spinner } from '@/components/ui/spinner';
import { BookOpen, Play, Sparkles } from 'lucide-react';

interface Props {
  isLoading: boolean;
  onClick: () => void;
}

export default function Start({ isLoading, onClick }: Props) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <div className="flex h-full w-full max-w-3xl flex-col items-center justify-center gap-4 px-6">
        <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-3xl"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <BookOpen className="h-5 w-5" style={{ color: mainColor }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Halo, <span style={{ color: mainColor }}>{session?.user.name}</span>
              </h1>
              <p className="text-sm text-gray-600">Siap belajar?</p>
            </div>
          </div>

          <button
            onClick={onClick}
            disabled={isLoading}
            className={`flex w-full items-center gap-3 rounded-3xl border px-4 py-4 text-left transition-all duration-200 ${!isLoading ? 'hover:shadow-md' : 'cursor-not-allowed opacity-80'}`}
            style={{
              borderColor: `${mainColor}35`,
              backgroundColor: `${mainColor}10`,
            }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-3xl"
              style={{ backgroundColor: `${mainColor}20` }}
            >
              {isLoading ? (
                <Spinner width="18px" />
              ) : (
                <Play className="h-5 w-5" style={{ color: mainColor }} />
              )}
            </div>
            <span className="text-xl font-semibold text-gray-900">
              {isLoading ? 'Memulai...' : 'Mulai Belajar'}
            </span>
          </button>
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <div
              className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-3xl"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Sparkles className="h-4 w-4" style={{ color: mainColor }} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">AI Assistant</h3>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <div
              className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-3xl"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <BookOpen className="h-4 w-4" style={{ color: mainColor }} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Materi Lengkap</h3>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <div
              className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-3xl"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Play className="h-4 w-4" style={{ color: mainColor }} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Interaktif</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
