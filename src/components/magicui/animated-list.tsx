'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';

interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 2000 }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = React.Children.toArray(children);

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
      }, delay);

      return () => clearInterval(interval);
    }, [childrenArray.length, delay]);

    const itemsToShow = useMemo(
      () => childrenArray.slice(0, index + 1).reverse(),
      [index, childrenArray],
    );

    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = 'AnimatedList';

function AnimatedListItem({ children }: { children: React.ReactNode }) {
  // Animasi dipisah agar transition diberikan langsung ke motion.div
  const initial = { scale: 0, opacity: 0 };
  const animate = { scale: 1, opacity: 1, originY: 0 };
  const exit = { scale: 0, opacity: 0 };
  const transition = { type: 'spring' as const, stiffness: 350, damping: 40 };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      layout
      className="mx-auto w-full"
    >
      {children}
    </motion.div>
  );
}
