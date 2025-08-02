import { cn } from '@/lib/utils';
import React, { useCallback, useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ToCProps {
  headings: Heading[];
}

const ToC: React.FC<ToCProps> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>('');

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const offset = 150; // Sesuaikan nilai ini berdasarkan layout Kamu

    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      const element = document.getElementById(heading.id);
      if (element && element.offsetTop - offset <= scrollPosition) {
        setActiveId(heading.id);
        break;
      }
    }
  }, [headings]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Panggil sekali untuk mengatur heading aktif awal
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <nav className="toc sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl p-4">
      <span className="text-m mb-2 flex items-center text-center font-medium">
        Daftar Isi
      </span>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              'text-sm transition-all duration-200 ease-in-out',
              heading.level === 1 ? 'ml-0' : 'ml-4',
            )}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  const yOffset = -100; // Sesuaikan nilai ini berdasarkan layout Kamu
                  const y =
                    element.getBoundingClientRect().top +
                    window.scrollY +
                    yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className={cn(
                'transition-colors duration-200',
                activeId === heading.id
                  ? 'font-medium text-black'
                  : 'text-gray-400 hover:text-main-gray-text',
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ToC;
