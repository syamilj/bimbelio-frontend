import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { siteHref } from '@/lib/surface';
import { motion } from 'framer-motion';
import { Crown, Lock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CourseLocked() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="flex h-full min-h-[500px] w-full flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm md:flex-row"
      >
        {/* Visual Side */}
        <div className="relative min-h-[200px] w-full md:min-h-[300px] md:w-5/12">
          <div
            className="absolute inset-0 z-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
            <div className="relative">
              <div
                className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-2xl"
                style={{ backgroundColor: secondaryColor }}
              />
              <div className="relative z-20 rounded-3xl border border-white/50 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
                <Lock
                  className="h-12 w-12 text-slate-700/80"
                  strokeWidth={1.5}
                />
                <div className="absolute -top-2 -right-2 rounded-3xl border border-amber-100 bg-amber-50 p-2 text-amber-500 shadow-sm">
                  <Crown className="h-5 w-5 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="flex w-full flex-col justify-center bg-white p-6 md:w-7/12 md:p-8">
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[10px] font-bold tracking-wide text-slate-600 uppercase">
                Premium Only
              </span>
            </div>
            <h2 className="mb-2 text-2xl leading-tight font-black text-slate-800">
              Materi Terkunci
            </h2>
            <p className="text-sm leading-relaxed text-balance text-slate-500">
              Ups, materi ini hanya tersedia untuk pengguna Premium. Upgrade
              sekarang untuk akses penuh.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push(siteHref('/price'))}
              className="h-12 w-full rounded-3xl text-sm font-bold shadow-lg transition-all hover:translate-y-[-2px] hover:shadow-xl active:scale-95"
              style={{
                backgroundColor: mainColor,
                color: 'white',
              }}
            >
              Upgrade Sekarang
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
