// index.tsx
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/ui/logo';
import { IconOpenAI } from '@/styles/icon';
import { Building2, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <footer className="relative w-full overflow-hidden bg-background py-12 md:py-16">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{
            background: `radial-gradient(circle, ${mainColor}, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{
            background: `radial-gradient(circle, ${secondaryColor}, transparent)`,
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Main Footer Card */}
        <Card
          className="border-2 shadow-xl rounded-2xl overflow-hidden mb-8"
          style={{ borderColor: `${mainColor}20` }}
        >
          {/* Top Accent Bar */}
          <div
            className="h-2 w-full"
            style={{
              background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
            }}
          />

          <CardContent className="p-8 md:p-12">
            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
              {/* Kolom 1: Brand & About - Span 4 columns */}
              <div className="lg:col-span-4">
                <div className="flex flex-col gap-6">
                  {/* Logo & Tagline */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div>
                        <Logo
                          className="text-2xl font-black"
                          style={{ color: mainColor }}
                        />
                        <p className="text-xs text-gray-600 font-medium">
                          Bimbel AI Terdepan
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* About Text */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Platform pembelajaran terpadu dengan teknologi AI untuk
                    membantu siswa mencapai prestasi akademik terbaik.
                  </p>

                  {/* Social Media */}
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
                      Ikuti Kami
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href="https://instagram.com/bimbelio.official"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border-2"
                        style={{
                          backgroundColor: `${mainColor}10`,
                          borderColor: `${mainColor}30`,
                          color: mainColor,
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.069 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                        </svg>
                      </a>
                      <a
                        href="https://tiktok.com/@bimbelio.official"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border-2"
                        style={{
                          backgroundColor: `${mainColor}10`,
                          borderColor: `${mainColor}30`,
                          color: mainColor,
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.89 2.89 0 1 1-5.92-2.4c.3-.84 1-1.64 1.9-2.09V9.9a6.72 6.72 0 0 0-1.02.15A4.84 4.84 0 0 0 5 13.75a4.85 4.85 0 0 0 9.57.3V9.2a6.33 6.33 0 0 0 3.02 1.48v-3.7a4.9 4.9 0 0 1-.53-.05z" />
                        </svg>
                      </a>
                      <a
                        href="https://youtube.com/@bimbelio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border-2"
                        style={{
                          backgroundColor: `${mainColor}10`,
                          borderColor: `${mainColor}30`,
                          color: mainColor,
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Alamat Kantor - Span 4 columns */}
              <div className="lg:col-span-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2
                      className="w-5 h-5"
                      style={{ color: mainColor }}
                    />
                    <h4
                      className="text-sm font-black text-gray-900 uppercase tracking-wider"
                      style={{ color: mainColor }}
                    >
                      Kantor Pusat
                    </h4>
                  </div>

                  <div
                    className="p-4 rounded-xl border-2"
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

                      <div
                        className="pt-3 border-t"
                        style={{ borderColor: `${mainColor}20` }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Phone
                            className="w-4 h-4"
                            style={{ color: mainColor }}
                          />
                          <a
                            href="https://wa.me/6285128056771?text=Halo!%20Saya%20ingin%20konsultasi%20mengenai%20program%20bimbel%20Bimbelio."
                            className="text-sm text-gray-700 hover:font-bold transition-all"
                            style={{ color: mainColor }}
                          >
                            +62 821-7465-3020
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail
                            className="w-4 h-4"
                            style={{ color: mainColor }}
                          />
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

              {/* Kolom 3 & 4: Links - Span 4 columns */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                {/* Produk */}
                <div>
                  <h4
                    className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider"
                    style={{ color: mainColor }}
                  >
                    Produk
                  </h4>
                  <ul className="space-y-3">
                    {['Kursus Online', 'Tryout', 'Konsultasi', 'Premium'].map(
                      (item) => (
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
                      ),
                    )}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4
                    className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider"
                    style={{ color: mainColor }}
                  >
                    Legal
                  </h4>
                  <ul className="space-y-3">
                    {['Privasi', 'Syarat', 'Kebijakan', 'Bantuan'].map(
                      (item) => (
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
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              className="h-px my-8"
              style={{
                background: `linear-gradient(to right, transparent, ${mainColor}30, transparent)`,
              }}
            />

            {/* Payment Methods */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-6 uppercase tracking-wider text-center">
                Metode Pembayaran
              </p>

              <div className="flex flex-wrap justify-center gap-5">
                {/* Cards */}
                <div className="flex flex-col items-center px-6 py-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Kartu</span>
                  <div className="flex items-center justify-center gap-4 h-10">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-7 object-contain" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-10 object-contain" />
                  </div>
                </div>

                {/* E-Wallets */}
                <div className="flex flex-col items-center px-6 py-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">E-Wallet</span>
                  <div className="flex items-center justify-center gap-4 h-10">
                    <img src="/hero/astrapay-logo.svg" alt="AstraPay" className="h-8 object-contain" />
                    <img src="/hero/ovo-logo.svg" alt="OVO" className="h-8 object-contain" />
                    <img src="/hero/shopeepay-logo.svg" alt="ShopeePay" className="h-8 object-contain" />
                  </div>
                </div>

                {/* Virtual Account */}
                <div className="flex flex-col items-center px-6 py-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Virtual Account</span>
                  <div className="grid grid-cols-4 gap-3 place-items-center">
                    <img src="/hero/bca-logo.svg" alt="BCA" className="h-8 object-contain" />
                    <img src="/hero/bni-logo.svg" alt="BNI" className="h-8 object-contain" />
                    <img src="/hero/bri-logo.svg" alt="BRI" className="h-8 object-contain" />
                    <img src="/hero/mandiri-logo.svg" alt="Mandiri" className="h-8 object-contain" />
                    <img src="/hero/bsi-logo.svg" alt="BSI" className="h-8 object-contain" />
                    <img src="/hero/bjb-logo.svg" alt="BJB" className="h-8 object-contain" />
                    <img src="/hero/cimb-logo.svg" alt="CIMB" className="h-8 object-contain" />
                    <img src="/hero/permata-logo.svg" alt="Permata" className="h-8 object-contain" />
                  </div>
                </div>

                {/* PayLater */}
                <div className="flex flex-col items-center px-6 py-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">PayLater</span>
                  <div className="flex items-center justify-center gap-4 h-10">
                    <img src="/hero/akulaku-logo.svg" alt="Akulaku" className="h-8 object-contain" />
                  </div>
                </div>

                {/* Retail & QRIS */}
                <div className="flex flex-col items-center px-6 py-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Retail & QRIS</span>
                  <div className="flex items-center justify-center gap-4 h-10">
                    <img src="/hero/qris-logo.svg" alt="QRIS" className="h-8 object-contain" />
                    <img src="/hero/alfamart-logo.svg" alt="Alfamart" className="h-8 object-contain" />
                    <img src="/hero/indomaret-logo.svg" alt="Indomaret" className="h-8 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          {/* Copyright */}
          <div className="text-sm text-gray-600 text-center md:text-left">
            <p>
              © 2025{' '}
              <span
                className="font-black"
                style={{ color: mainColor }}
              >
                Bimbelio
              </span>
              . All Rights Reserved.
            </p>
          </div>

          {/* Powered By */}
          <div
            className="flex items-center gap-3 px-5 py-2.5 rounded-full border-2 shadow-sm"
            style={{
              backgroundColor: `${mainColor}08`,
              borderColor: `${mainColor}20`,
            }}
          >
            <span className="text-xs text-gray-600 font-medium">
              Powered by
            </span>
            <div className="flex items-center gap-2">
              <IconOpenAI className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
