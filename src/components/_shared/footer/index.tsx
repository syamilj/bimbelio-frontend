import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/ui/logo';
import { IconOpenAI } from '@/styles/icon';
import { Building2, Mail, MapPin, Phone } from 'lucide-react';

import { legalLinks, productLinks } from './footer-config';
import { FooterPaymentMethods } from './FooterPaymentMethods';
import { FooterSocialLinks } from './FooterSocialLinks';

export default function Footer() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <footer className="relative w-full overflow-hidden bg-background py-12 md:py-16">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{ background: `radial-gradient(circle, ${mainColor}, transparent)` }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{ background: `radial-gradient(circle, ${secondaryColor}, transparent)` }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Main Footer Card */}
        <Card
          className="border-2 shadow-xl rounded-3xl overflow-hidden mb-8"
          style={{ borderColor: `${mainColor}20` }}
        >
          <div
            className="h-2 w-full"
            style={{ background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})` }}
          />

          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
              {/* Brand & About */}
              <div className="lg:col-span-4">
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div>
                        <Logo className="text-2xl font-black" style={{ color: mainColor }} />
                        <p className="text-xs text-gray-600 font-medium">Bimbel AI Terdepan</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    Platform pembelajaran terpadu dengan teknologi AI untuk membantu siswa mencapai
                    prestasi akademik terbaik.
                  </p>

                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
                      Ikuti Kami
                    </p>
                    <FooterSocialLinks mainColor={mainColor} />
                  </div>
                </div>
              </div>

              {/* Office Address */}
              <div className="lg:col-span-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5" style={{ color: mainColor }} />
                    <h4
                      className="text-sm font-black text-gray-900 uppercase tracking-wider"
                      style={{ color: mainColor }}
                    >
                      Kantor Pusat
                    </h4>
                  </div>

                  <div
                    className="p-4 rounded-3xl border-2"
                    style={{
                      backgroundColor: `${mainColor}08`,
                      borderColor: `${mainColor}20`,
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <MapPin
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: mainColor }}
                        />
                        <div className="text-sm text-gray-700 leading-relaxed">
                          <p className="font-bold text-gray-900 mb-1">
                            PT. Bimbelio Edukasi Teknologi
                          </p>
                          <p>Jl. Pulo Asem No. 62</p>
                          <p>RT 001 / RW 001</p>
                          <p>Kelurahan Jati, Kecamatan Pulogadung</p>
                          <p>Jakarta Timur, DKI Jakarta</p>
                          <p className="font-semibold mt-1">13220</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t" style={{ borderColor: `${mainColor}20` }}>
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="w-4 h-4" style={{ color: mainColor }} />
                          <a
                            href="https://wa.me/6285128056771?text=Halo!%20Saya%20ingin%20konsultasi%20mengenai%20program%20bimbel%20Bimbelio."
                            className="text-sm text-gray-700 hover:font-bold transition-all"
                            style={{ color: mainColor }}
                          >
                            +62 821-7465-3020
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4" style={{ color: mainColor }} />
                          <a
                            href="mailto:bimbelio.official@gmail.com"
                            className="text-sm text-gray-700 hover:font-bold transition-all"
                            style={{ color: mainColor }}
                          >
                            bimbelio.official@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                {[
                  { title: 'Produk', items: productLinks },
                  { title: 'Legal', items: legalLinks },
                ].map((section) => (
                  <div key={section.title}>
                    <h4
                      className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider"
                      style={{ color: mainColor }}
                    >
                      {section.title}
                    </h4>
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item}>
                          <a
                            href="#"
                            className="text-sm text-gray-600 hover:text-gray-900 hover:font-bold transition-all duration-300 flex items-center gap-2 group"
                          >
                            <span
                              className="w-0 group-hover:w-3 transition-all duration-300 h-0.5 rounded-full"
                              style={{ backgroundColor: mainColor }}
                            />
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div
              className="h-px my-8"
              style={{
                background: `linear-gradient(to right, transparent, ${mainColor}30, transparent)`,
              }}
            />

            <FooterPaymentMethods />
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="text-sm text-gray-600 text-center md:text-left">
            <p>
              © 2025{' '}
              <span className="font-black" style={{ color: mainColor }}>
                Bimbelio
              </span>
              . All Rights Reserved.
            </p>
          </div>

          <div
            className="flex items-center gap-3 px-5 py-2.5 rounded-full border-2 shadow-sm"
            style={{
              backgroundColor: `${mainColor}08`,
              borderColor: `${mainColor}20`,
            }}
          >
            <span className="text-xs text-gray-600 font-medium">Powered by</span>
            <div className="flex items-center gap-2">
              <IconOpenAI className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
