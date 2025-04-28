'use client';

import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { useWebsiteSubCategory } from '../provider/provider-website-category';

interface WordRotateProps {
  words: string[];
  duration?: number;
  framerProps?: HTMLMotionProps<'h1'>;
  className?: string;
}

export default function WordRotate({
  words,
  duration = 5000,
  framerProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 },
  },
  className,
}: WordRotateProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [words, duration]);
  // console.log(index, words[index]);

  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.h1
          key={words[index]}
          style={{
            color: websiteSubCategory?.main_color,
          }}
          className={cn(className)}
          {...framerProps}
        >
          {words[index] ? (
            <span dangerouslySetInnerHTML={{ __html: words[index] }} />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: words[0] }} />
          )}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
