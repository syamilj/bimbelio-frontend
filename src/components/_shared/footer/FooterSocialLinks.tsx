import { socialLinks } from './footer-config';

interface FooterSocialLinksProps {
  mainColor: string;
}

export const FooterSocialLinks: React.FC<FooterSocialLinksProps> = ({ mainColor }) => (
  <div className="flex items-center gap-3">
    {socialLinks.map((link) => (
      <a
        key={link.label}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-11 h-11 rounded-3xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border-2"
        style={{
          backgroundColor: `${mainColor}10`,
          borderColor: `${mainColor}30`,
          color: mainColor,
        }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d={link.svgPath} />
        </svg>
      </a>
    ))}
  </div>
);
