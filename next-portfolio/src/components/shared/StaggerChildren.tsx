'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React from 'react';

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

export default function StaggerChildren({
  children,
  className,
  stagger = 0.12,
}: StaggerChildrenProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: 0.1,
          },
        },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)', scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};
