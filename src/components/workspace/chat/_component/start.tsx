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
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <div className="flex h-full w-full max-w-3xl flex-col items-center justify-center gap-8 px-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div
            className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center shadow-lg mb-4"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <BookOpen className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Halo,{' '}
              <span style={{ color: mainColor }}>{session?.user.name}</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Siap untuk memulai pembelajaran hari ini?
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClick}
          disabled={isLoading}
          className={`
            group relative overflow-hidden rounded-3xl px-8 py-6 text-white shadow-xl transition-all duration-300
            ${!isLoading ? 'hover:shadow-2xl hover:scale-105 hover:-translate-y-1' : 'cursor-not-allowed opacity-80'}
          `}
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-white rounded-full blur-[1px]" />
            <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-white rounded-full blur-[1px]" />
            <div className="absolute right-4 top-4 w-2 h-2 bg-white rounded-full" />
            <div className="absolute right-8 top-8 w-1 h-1 bg-white rounded-full" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center gap-4">
            {isLoading ? (
              <>
                <Spinner width="24px" />
                <span className="text-lg font-semibold">
                  Memulai pembelajaran...
                </span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-3xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Play className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">Mulai Belajar</div>
                  <div className="text-sm text-white/80">
                    Jelajahi materi pembelajaran
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Hover Effect */}
          {!isLoading && (
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </button>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          <div className="text-center p-4 rounded-3xl bg-white shadow-sm border border-gray-200">
            <div
              className="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Sparkles
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
            </div>
            <h3 className="font-semibold text-sm mb-1">AI Assistant</h3>
            <p className="text-xs text-gray-500">Bantuan pembelajaran cerdas</p>
          </div>

          <div className="text-center p-4 rounded-3xl bg-white shadow-sm border border-gray-200">
            <div
              className="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <BookOpen
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
            </div>
            <h3 className="font-semibold text-sm mb-1">Materi Lengkap</h3>
            <p className="text-xs text-gray-500">Bank soal terlengkap</p>
          </div>

          <div className="text-center p-4 rounded-3xl bg-white shadow-sm border border-gray-200">
            <div
              className="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Play
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
            </div>
            <h3 className="font-semibold text-sm mb-1">Belajar Interaktif</h3>
            <p className="text-xs text-gray-500">
              Pengalaman belajar yang menyenangkan
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Mulai perjalanan belajarmu sekarang juga
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Sparkles className="w-3 h-3" />
            <span>Didukung oleh teknologi AI terdepan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
