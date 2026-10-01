import {
  siFacebook,
  siInstagram,
  siTiktok,
  siWhatsapp,
  siX,
  siYoutube,
} from 'simple-icons';

// Logo platform. lucide-react v1 menghapus ikon merek, jadi path diambil
// dari simple-icons (CC0). LinkedIn tidak tersedia di simple-icons.
type BrandIconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const createBrandIcon = (title: string, path: string) => {
  function BrandIcon({ size = 24, ...props }: BrandIconProps) {
    return (
      <svg
        role="img"
        aria-label={title}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        {...props}
      >
        <path d={path} />
      </svg>
    );
  }
  BrandIcon.displayName = title;
  return BrandIcon;
};

const LINKEDIN_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

export const Facebook = createBrandIcon('Facebook', siFacebook.path);
export const Instagram = createBrandIcon('Instagram', siInstagram.path);
export const Youtube = createBrandIcon('YouTube', siYoutube.path);
export const Twitter = createBrandIcon('X', siX.path);
export const Tiktok = createBrandIcon('TikTok', siTiktok.path);
export const Whatsapp = createBrandIcon('WhatsApp', siWhatsapp.path);
export const Linkedin = createBrandIcon('LinkedIn', LINKEDIN_PATH);
