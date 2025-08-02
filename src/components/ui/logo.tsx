import { cn } from '@/lib/utils';
import LogoSvg from '@/styles/logo-svg';
import Link from 'next/link';

export default function Logo({
  href,
  className,
  imageWidth,
  style, // <-- Add this!
}: {
  href?: string;
  className?: string;
  imageWidth?: number;
  style?: React.CSSProperties; // <-- Add this!
}) {
  if (!href) {
    return (
      <div>
        <div
          className={cn(
            'relative flex items-center gap-1 text-main',
            className,
          )}
          style={style} // <-- Add this!
        >
          <LogoSvg w={imageWidth ? imageWidth : 30} />
          <span className="font-semibold text-xl sm:text-3xl">Bimbelio</span>
        </div>
      </div>
    );
  }
  return (
    <Link href={href}>
      <div
        className={cn('relative flex items-center gap-1 text-main', className)}
        style={style} // <-- Add this!
      >
        <LogoSvg w={imageWidth ? imageWidth : 30} />
        <span className="font-semibold text-3xl md:text-2xl">Bimbelio</span>
      </div>
    </Link>
  );
}
