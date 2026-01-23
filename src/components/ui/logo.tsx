import { cn } from '@/lib/utils';
import LogoSvg from '@/styles/logo-svg';
import Link from 'next/link';
import { Bimbelio } from './bim-brand';

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
          <Bimbelio className="text-xl sm:text-3xl" />
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
        <Bimbelio className="text-3xl md:text-2xl" />
      </div>
    </Link>
  );
}
