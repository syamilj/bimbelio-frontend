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
        'relative inline-block animate-gradient cursor-pointer bg-gradient-to-r from-[#00374d] via-[#0091FF] to-[#012732] bg-[length:200%_200%] bg-clip-text text-transparent',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
