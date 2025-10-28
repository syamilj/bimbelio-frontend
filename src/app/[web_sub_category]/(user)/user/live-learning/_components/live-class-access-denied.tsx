'use client';

import { Video, Lock, ArrowUp, Star, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';

export const LiveClassAccessDenied = () => {
  // === DESIGN SYSTEM FROM LEADERBOARD ===
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ENHANCED ACCESS DENIED CARD */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
          {/* GRADIENT HEADER */}
          <CardHeader
            className="text-center pb-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
            }}
          >
            <div
              className="absolute -right-8 -top-8 w-20 h-20 rounded-full opacity-5"
              style={{ backgroundColor: mainColor }}
            />
            <div
              className="absolute -left-6 -bottom-6 w-16 h-16 rounded-full opacity-5"
              style={{ backgroundColor: secondaryColor }}
            />

            <div className="relative z-10">
              {/* ENHANCED ICON */}
              <div
                className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-4"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <Crown className="h-10 w-10 text-white" />
              </div>

              <CardTitle
                className="text-2xl font-bold mb-2"
                style={{ color: mainColor }}
              >
                Live Class Eksklusif
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Live class premium ini membutuhkan upgrade plan untuk akses penuh
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* FEATURES LIST */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Manfaat Upgrade Plan:
              </h4>

              <div className="space-y-3">
                {[
                  { icon: Video, text: 'Akses ke semua Live Class premium' },
                  { icon: Zap, text: 'Materi pembelajaran eksklusif' },
                  { icon: Star, text: 'Sertifikat kelulusan resmi' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <feature.icon
                        className="h-5 w-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA SECTION */}
            <div
              className="p-4 rounded-xl border-2 text-center relative overflow-hidden"
              style={{
                backgroundColor: `${mainColor}08`,
                borderColor: `${mainColor}20`
              }}
            >
              <div
                className="absolute -right-3 -top-3 w-8 h-8 rounded-full opacity-10"
                style={{ backgroundColor: mainColor }}
              />
              <p className="text-sm text-gray-600 mb-3">
                Upgrade sekarang dan dapatkan akses unlimited ke semua konten premium!
              </p>

              <Button
                className="w-full h-12 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  backgroundColor: mainColor,
                  backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                }}
              >
                <ArrowUp className="mr-2 h-5 w-5" />
                Upgrade Plan Sekarang
              </Button>
            </div>

            {/* CONTACT SUPPORT */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Butuh bantuan memilih plan yang tepat?
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-2 hover:bg-gray-50 transition-colors rounded-lg"
              >
                Hubungi Customer Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
