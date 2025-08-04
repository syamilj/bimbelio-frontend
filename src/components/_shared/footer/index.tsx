// index.tsx
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card } from '@/components/ui/card';
import Logo from '@/components/ui/logo';
import { IconOpenAI } from '@/styles/icon';
import { InstagramIcon, Sparkles } from 'lucide-react';

export default function Footer() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <footer className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-5" />

      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Main Footer Content */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              {/* Logo Section */}
              <div className="flex flex-col items-center md:items-start gap-3">
                <Logo className="text-2xl md:text-3xl text-main-default" />
                <div className="flex items-center gap-2 text-sm md:text-base text-gray-600">
                  <Sparkles className="w-4 h-4 text-main-default" />
                  <span className="font-medium">Bimbel AI Terdepan</span>
                </div>
              </div>

              {/* Social & Branding */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-default">
                    <InstagramIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-main-default">
                      @Bimbelio
                    </p>
                    <p className="text-sm text-gray-600">
                      Follow us on Instagram
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-main-default">
                      10K+
                    </p>
                    <p className="text-xs text-gray-600">Siswa Aktif</p>
                  </div>
                  <div className="w-px h-8 bg-gray-300" />
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-main-default">
                      95%
                    </p>
                    <p className="text-xs text-gray-600">Tingkat Kepuasan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 md:my-8 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
              {/* Powered By */}
              <div className="flex items-center gap-2 text-gray-600 order-2 md:order-1">
                <span className="font-medium">Powered by</span>
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                  <IconOpenAI className="w-4 h-4" />
                </div>
              </div>

              {/* Copyright */}
              <div className="text-center order-1 md:order-2">
                <p className="text-gray-600">
                  <span className="font-semibold text-main-default">
                    Jutif AI
                  </span>
                  {' • '}
                  <span>©2025 Bimbelio. All Rights Reserved.</span>
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="hidden md:flex items-center gap-2 order-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `${mainColor}60` }}
                />
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: `${secondaryColor}80` }}
                />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `${mainColor}40` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating Decorative Elements */}
      <div
        className="absolute top-4 right-8 w-16 h-16 rounded-full opacity-10 animate-pulse"
        style={{ backgroundColor: mainColor }}
      />
      <div
        className="absolute bottom-8 left-12 w-8 h-8 rounded-full opacity-20 animate-pulse animation-delay-1000"
        style={{ backgroundColor: secondaryColor }}
      />
    </footer>
  );
}
