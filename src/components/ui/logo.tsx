import Link from 'next/link';
// import { useWebsiteSubCategory } from "../provider/provider-website-category";
import { cn } from '@/lib/utils';
import LogoSvg from '@/styles/logo-svg';

export default function Logo({
  href,
  className,
  imageWidth,
}: {
  href?: string;
  className?: string;
  imageWidth?: number;
}) {
  if (!href) {
    return (
      <div>
        <div
          className={cn(
            'relative flex items-center gap-1 text-main',
            className,
          )}
        >
          <LogoSvg w={imageWidth ? imageWidth : 30} />
          <span className="font-semibold">Bimbelio</span>
        </div>
      </div>
    );
  }
  return (
    <Link href={href}>
      <div
        className={cn('relative flex items-center gap-1 text-main', className)}
      >
        <LogoSvg w={imageWidth ? imageWidth : 30} />
        <span className="font-semibold">Bimbelio</span>
      </div>
    </Link>
  );
}
