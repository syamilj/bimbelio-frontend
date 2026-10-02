import { Logo } from '@/components/brand/logo';
import { Instagram, Tiktok, Youtube } from '@/components/icons/brand-icons';
import { CONTACT_CONFIG, whatsappUrl } from '@/config/contact';
import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Program',
    links: [
      { label: 'Paket belajar', href: '/price' },
      { label: 'Try out gratis', href: '/tryout' },
      { label: 'Kalender event', href: '/calendar' },
      { label: 'Beasiswa', href: '/scholarship' },
    ],
  },
  {
    title: 'Bimbelio',
    links: [
      { label: 'Tentang kami', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Grup WhatsApp', href: CONTACT_CONFIG.whatsappGroupPath },
    ],
  },
];

const SOCIALS = [
  {
    label: 'Instagram',
    href: CONTACT_CONFIG.social.instagram,
    icon: Instagram,
  },
  { label: 'TikTok', href: CONTACT_CONFIG.social.tiktok, icon: Tiktok },
  { label: 'YouTube', href: CONTACT_CONFIG.social.youtube, icon: Youtube },
];

const PAYMENT_LOGOS: [file: string, label: string][] = [
  ['qris', 'QRIS'],
  ['bca', 'BCA'],
  ['bni', 'BNI'],
  ['bri', 'BRI'],
  ['mandiri', 'Mandiri'],
  ['bsi', 'BSI'],
  ['permata', 'Permata'],
  ['cimb', 'CIMB Niaga'],
  ['ovo', 'OVO'],
  ['shopeepay', 'ShopeePay'],
  ['astrapay', 'AstraPay'],
  ['akulaku', 'Akulaku'],
  ['alfamart', 'Alfamart'],
  ['indomaret', 'Indomaret'],
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm text-ink-muted">
            Bimbel dengan tutor, mentor, dan AI untuk persiapan UTBK-SNBT, ujian
            mandiri, dan sekolah kedinasan.
          </p>
          <ul className="flex gap-2">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Bimbelio di ${label}`}
                  className="flex size-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  <Icon
                    size={16}
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {COLUMNS.map((column) => (
          <nav
            key={column.title}
            aria-label={column.title}
            className="flex flex-col gap-3"
          >
            <p className="text-sm font-bold text-ink">{column.title}</p>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-ink">Kontak</p>
          <address className="flex flex-col gap-2 text-sm text-ink-muted not-italic">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink"
            >
              WhatsApp {CONTACT_CONFIG.whatsapp.display}
            </a>
            <a
              href={`mailto:${CONTACT_CONFIG.email}`}
              className="break-all hover:text-ink"
            >
              {CONTACT_CONFIG.email}
            </a>
            <span>
              {CONTACT_CONFIG.address.map((line) => (
                <span
                  key={line}
                  className="block"
                >
                  {line}
                </span>
              ))}
            </span>
          </address>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-ink-muted">
              Metode pembayaran
            </p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {PAYMENT_LOGOS.map(([file, label]) => (
                <li key={file}>
                  <img
                    src={`/hero/${file}-logo.svg`}
                    alt={label}
                    loading="lazy"
                    className="h-5 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} PT Bimbelio Edukasi Teknologi</p>
            <nav
              aria-label="Legal"
              className="flex gap-4"
            >
              <Link
                href="/privacy"
                className="hover:text-ink"
              >
                Kebijakan privasi
              </Link>
              <Link
                href="/terms"
                className="hover:text-ink"
              >
                Syarat dan ketentuan
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
