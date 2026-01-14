import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Crown,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CourseLocked() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';


  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] h-full w-full p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row overflow-hidden"
      >
        {/* Visual Side */}
        <div className="relative w-full md:w-5/12 min-h-[200px] md:min-h-[300px]">
          <div
            className="absolute inset-0 z-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
             <div className="relative">
                <div
                  className="w-24 h-24 rounded-full blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"
                  style={{ backgroundColor: secondaryColor }}
                />
                <div className="relative z-20 bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50">
                    <Lock className="w-12 h-12 text-slate-700/80" strokeWidth={1.5} />
                    <div className="absolute -top-2 -right-2 bg-amber-50 p-2 rounded-3xl text-amber-500 shadow-sm border border-amber-100">
                        <Crown className="w-5 h-5 fill-current" />
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-center bg-white">
          <div className="mb-6">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Premium Only</span>
             </div>
             <h2 className="text-2xl font-black text-slate-800 mb-2 leading-tight">
                Materi Terkunci
             </h2>
             <p className="text-sm text-slate-500 leading-relaxed text-balance">
                Ups, materi ini hanya tersedia untuk pengguna Premium. Upgrade sekarang untuk akses penuh.
             </p>
          </div>

          <div className="flex flex-col gap-3">
             <Button
                onClick={() => router.push('/price')}
                className="w-full h-12 text-sm font-bold rounded-3xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all active:scale-95"
                style={{
                   backgroundColor: mainColor,
                   color: 'white'
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
