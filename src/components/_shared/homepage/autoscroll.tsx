import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const autoScroll = (hashUrl: string) => {
  const pathname = usePathname();
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      console.log(
        '=============================================================',
      );
      console.log({ hash });
      if (hash === `#${hashUrl}` && pathname === '/') {
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId);
        console.log(
          '=============================================================',
        );
        console.log({ targetElement, targetId });

        if (targetElement) {
          const offset = 200;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    };

    // Run on mount
    handleHashScroll();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, [pathname]);
};
