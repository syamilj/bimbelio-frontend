import { Logo } from '@/components/brand/logo';
import { Scribble } from '@/components/brand/scribble';
import { Supergraphic } from '@/components/brand/supergraphic';
import { Instagram, Tiktok, Youtube } from '@/components/icons/brand-icons';
import { CONTACT_CONFIG, whatsappUrl } from '@/config/contact';
import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Program',
    links: [
      { label: 'Paket belajar', href: '/price' },
      { label: 'Tryout gratis', href: '/tryout' },
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

const linkClass =
  'rounded-xs text-sm text-on-dark-muted transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-highlight focus-visible:outline-none';

/** Footer situs di permukaan Tinta: logo putih, titik i lime, coretan Lio. */
export function SiteFooter() {
  return (
    <footer
      data-surface="ink"
      className="relative overflow-hidden"
    >
      <Supergraphic className="max-lg:hidden -right-[6%] -bottom-[40%] h-[90%] text-white/5" />
      <div className="relative mx-auto grid w-full max-w-[75rem] gap-12 px-5 pt-16 pb-10 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:pt-20">
        <div className="flex flex-col gap-6">
          <Logo
            tone="white"
            className="h-9 self-start"
          />
          <p className="max-w-xs text-sm text-on-dark-muted">
            Tryout, rapor, dan pendamping belajar untuk UTBK-SNBT, ujian
            mandiri, dan sekolah kedinasan.
          </p>
          <Scribble arrow="down">Lio liat. Lio selalu liat.</Scribble>
          <ul className="flex gap-2">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Bimbelio di ${label}`}
                  className="flex size-10 items-center justify-center rounded-full border border-on-dark-line text-white transition-colors hover:border-white hover:bg-white hover:text-ink focus-visible:ring-2 focus-visible:ring-highlight focus-visible:outline-none"
                >
                  <Icon
                    size={18}
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
            className="flex flex-col gap-4"
          >
            <p className="font-mono text-xs font-medium text-on-dark-muted lowercase">
              {column.title}
            </p>
            <ul className="flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={linkClass}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs font-medium text-on-dark-muted lowercase">
            Kontak
          </p>
          <address className="flex flex-col gap-3 text-sm text-on-dark-muted not-italic">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              WhatsApp {CONTACT_CONFIG.whatsapp.display}
            </a>
            <a
              href={`mailto:${CONTACT_CONFIG.email}`}
              className={`${linkClass} break-all`}
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

      <div className="relative border-t border-on-dark-line">
        <div className="mx-auto flex w-full max-w-[75rem] flex-col gap-6 px-5 py-8 sm:px-8">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs font-medium text-on-dark-muted lowercase">
              Metode pembayaran
            </p>
            <ul className="flex flex-wrap items-center gap-2">
              {PAYMENT_LOGOS.map(([file, label]) => (
                <li
                  key={file}
                  className="flex h-8 items-center rounded-xs bg-white px-2.5"
                >
                  <img
                    src={`/hero/${file}-logo.svg`}
                    alt={label}
                    loading="lazy"
                    className="h-4 w-auto max-w-16 object-contain"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 text-xs text-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} PT Bimbelio Edukasi Teknologi</p>
            <nav
              aria-label="Legal"
              className="flex gap-5"
            >
              <Link
                href="/privacy"
                className={linkClass}
              >
                Kebijakan privasi
              </Link>
              <Link
                href="/terms"
                className={linkClass}
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
