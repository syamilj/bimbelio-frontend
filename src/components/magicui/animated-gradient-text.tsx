import { cn } from '@/lib/utils';
import { MouseEventHandler, ReactNode } from 'react';

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}

export default function AnimatedGradientText({
  children,
  className,
  onClick,
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        'relative inline-block animate-gradient cursor-pointer bg-clip-text text-transparent bg-linear-to-r from-main-default to-secondary-default',
        className,
      )}
      onClick={onClick}
      style={{
        // backgroundImage: `linear-gradient(to right, ${websiteSubCategory?.secondary_color}, ${websiteSubCategory?.main_color}, ${websiteSubCategory?.main_color})`,
        backgroundSize: '200% 200%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  );
}
