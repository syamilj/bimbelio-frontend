import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Trophy } from 'lucide-react';
import { useState } from 'react';
import ExitTryout from './exit-tryout';

interface HeaderProps {
  current: number;
  total: number;
  name: string;
  done?: boolean;
}

const Header = ({ current, total, name, done = false }: HeaderProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [open, setOpen] = useState(false);

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Progress calculation
  const progressValue = ((current + 1) / total) * 100;

  return (
    <>
      <ExitTryout
        open={open}
        setOpen={setOpen}
        done={done}
      />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white border-b-2 shadow-lg rounded-b-2xl"
        style={{ borderColor: `${mainColor}20` }}
      >
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{
                    background: done
                      ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                      : `${mainColor}15`,
                  }}
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Trophy
                      className="w-5 h-5"
                      style={{ color: mainColor }}
                    />
                  )}
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-lg leading-tight">
                    {done ? 'Hasil Try Out' : name || 'Try Out'}
                  </h1>
                  {done && (
                    <p className="text-sm text-gray-600">
                      Selamat! Kamu telah menyelesaikan try out
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Center Progress Indicator */}
            {!done && total > 0 && (
              <div className="flex flex-col items-center gap-2 min-w-[130px]">
                <div className="flex items-center gap-2">
                  <span
                    className="font-bold"
                    style={{ color: mainColor }}
                  >
                    Progress
                  </span>
                  <div className="relative flex items-center gap-1 overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={current}
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        exit={{ y: '-100%' }}
                        transition={{ ease: 'backIn', duration: 0.75 }}
                        className="block text-lg font-bold"
                        style={{ color: mainColor }}
                      >
                        {current + 1}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-gray-600">/{total}</span>
                  </div>
                </div>
                <Progress
                  value={progressValue}
                  className="h-2 w-32"
                  style={
                    {
                      '--progress-foreground': mainColor,
                    } as React.CSSProperties
                  }
                />
              </div>
            )}

            {/* Completion Badge */}
            {done && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">Selesai</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
