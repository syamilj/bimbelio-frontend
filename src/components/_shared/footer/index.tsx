// index.tsx
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import Logo from '@/components/ui/logo';
import { IconOpenAI } from '@/styles/icon';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <footer className="relative w-full overflow-hidden bg-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      {/* Top Section - Contact CTA */}
      <div
        className="relative w-full py-8 md:py-12 border-b"
        style={{ borderColor: `${mainColor}20` }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 p-6 md:p-8 rounded-2xl"
            style={{
              backgroundColor: `${mainColor}08`,
              borderColor: `${mainColor}20`,
              border: '2px solid',
            }}
          >
            {/* Contact Info 1 */}
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${mainColor}20`,
                  color: mainColor,
                }}
              >
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Email Kami</h4>
                <p className="text-sm text-gray-600">info@bimbelio.com</p>
                <a
                  href="mailto:info@bimbelio.com"
                  className="text-sm font-semibold mt-2 flex items-center gap-1 group transition-colors"
                  style={{ color: mainColor }}
                >
                  Kirim Email
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>

            {/* Contact Info 2 */}
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${mainColor}20`,
                  color: mainColor,
                }}
              >
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Hubungi Kami</h4>
                <p className="text-sm text-gray-600">+62 21 1234 5678</p>
                <a
                  href="https://wa.me/6212112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold mt-2 flex items-center gap-1 group transition-colors"
                  style={{ color: mainColor }}
                >
                  Chat WhatsApp
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>

            {/* Contact Info 3 */}
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${mainColor}20`,
                  color: mainColor,
                }}
              >
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Kunjungi Kami</h4>
                <p className="text-sm text-gray-600">Jakarta Selatan</p>
                <a
                  href="#"
                  className="text-sm font-semibold mt-2 flex items-center gap-1 group transition-colors"
                  style={{ color: mainColor }}
                >
                  Lihat Lokasi
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative w-full py-12 md:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
            {/* Kolom 1: Brand & About */}
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-6">
                {/* Logo & Tagline */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div>
                      <Logo
                        className="text-2xl font-bold"
                        style={{ color: mainColor }}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Bimbel AI Terdepan
                      </p>
                    </div>
                  </div>
                </div>

                {/* About Text */}
                <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
                  Platform pembelajaran terpadu dengan teknologi AI untuk
                  membantu siswa mencapai prestasi akademik terbaik.
                </p>

                {/* Social Media */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com/bimbelio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: `${mainColor}15`,
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
                    href="https://tiktok.com/@bimbelio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: `${mainColor}15`,
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
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: `${mainColor}15`,
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

            {/* Kolom 2: Produk */}
            <div>
              <h4
                className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider"
                style={{ color: mainColor }}
              >
                Produk
              </h4>
              <ul className="space-y-4">
                {['Kursus Online', 'Tryout', 'Konsultasi', 'Premium'].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-gray-600 hover:font-semibold transition-all duration-300 flex items-center gap-2 group"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Kolom 3: Perusahaan */}
            <div>
              <h4
                className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider"
                style={{ color: mainColor }}
              >
                Perusahaan
              </h4>
              <ul className="space-y-4">
                {['Tentang Kami', 'Blog', 'Karir', 'Berita'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:font-semibold transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 4: Legal */}
            <div>
              <h4
                className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider"
                style={{ color: mainColor }}
              >
                Legal
              </h4>
              <ul className="space-y-4">
                {['Privasi', 'Syarat & Ketentuan', 'Kebijakan Cookie'].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-gray-600 hover:font-semibold transition-all duration-300 flex items-center gap-2 group"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"
            style={{
              backgroundImage: `linear-gradient(to right, transparent, ${mainColor}30, transparent)`,
            }}
          />

          {/* Payment Methods */}
          <div className="mb-8">
            <h4
              className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider"
              style={{ color: mainColor }}
            >
              Metode Pembayaran
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                {
                  name: 'QRIS',
                  icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/QRIS_logo.svg',
                },
                {
                  name: 'GoPay',
                  icon: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
                },
                {
                  name: 'Dana',
                  icon: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Dana_logo.png',
                },
                {
                  name: 'OVO',
                  icon: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/OVO_logo.svg',
                },
                {
                  name: 'LinkAja',
                  icon: 'https://upload.wikimedia.org/wikipedia/commons/2/27/LinkAja_logo.svg',
                },
                {
                  name: 'Transfer Bank',
                  icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Bank_logo.svg',
                },
                {
                  name: 'Kartu Kredit',
                  icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg',
                },
                {
                  name: 'Cicilan',
                  icon: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Cicilan_logo.svg',
                },
              ].map((method) => (
                <div
                  key={method.name}
                  className="flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: `${mainColor}08`,
                    border: `1px solid ${mainColor}20`,
                  }}
                >
                  <div className="w-8 h-8 mb-2 flex items-center justify-center">
                    <img
                      src={method.icon}
                      alt={method.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback jika image gagal load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 text-center font-medium">
                    {method.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="w-full py-6 md:py-8 border-t"
        style={{ borderColor: `${mainColor}20` }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-sm text-gray-600">
              <p>
                © 2025 <span className="font-semibold">Bimbelio</span>. All
                Rights Reserved.
              </p>
            </div>

            {/* Powered By */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50">
              <span className="text-xs text-gray-600">Powered by</span>
              <div className="flex items-center gap-1.5">
                <IconOpenAI className="w-4 h-4" />
                <span
                  className="text-xs font-bold"
                  style={{ color: mainColor }}
                >
                  Jutif AI
                </span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="hidden md:flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: `${mainColor}60` }}
              />
              <div
                className="w-1 h-1 rounded-full animate-pulse"
                style={{
                  backgroundColor: `${secondaryColor}80`,
                  animationDelay: '0.2s',
                }}
              />
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: `${mainColor}40`,
                  animationDelay: '0.4s',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
