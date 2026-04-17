'use client';
import { useState } from 'react';
import type { JSX, ComponentProps, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Transform {
  x: number;
  y: number;
  rotationZ: number;
}

const transforms: Transform[] = [
  { x: -0.8, y: -0.6, rotationZ: -29 },
  { x: -0.2, y: -0.4, rotationZ: -6 },
  { x: -0.05, y: 0.1, rotationZ: 12 },
  { x: -0.05, y: -0.1, rotationZ: -9 },
  { x: -0.1, y: 0.55, rotationZ: 3 },
  { x: 0, y: -0.1, rotationZ: 9 },
  { x: 0, y: 0.15, rotationZ: -12 },
  { x: 0, y: 0.15, rotationZ: -17 },
  { x: 0, y: -0.65, rotationZ: 9 },
  { x: 0.1, y: 0.4, rotationZ: 12 },
  { x: 0, y: -0.15, rotationZ: -9 },
  { x: 0.2, y: 0.15, rotationZ: 12 },
  { x: 0.8, y: 0.6, rotationZ: 20 },
];

type TextDisperseProps = ComponentProps<'div'> & {
  children: string;
  icon?: ReactNode;
  onHover?: (isActive: boolean) => void;
};

export function TextDisperse({
  children,
  icon,
  onHover,
  className,
  ...props
}: Omit<TextDisperseProps, 'onMouseEnter' | 'onMouseLeave'>) {
  const [isAnimated, setIsAnimated] = useState(false);

  const makeVariants = (t: Transform) => ({
    open: {
      x: t.x + 'em',
      y: t.y + 'em',
      rotateZ: t.rotationZ,
      transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] as const },
    },
    closed: {
      x: 0,
      y: 0,
      rotateZ: 0,
      transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] as const },
    },
  });

  const elements: JSX.Element[] = [];

  children.split('').forEach((char, i) => {
    const t = transforms[i] ?? transforms[transforms.length - 1];
    elements.push(
      <motion.span
        key={char + i}
        variants={makeVariants(t)}
        animate={isAnimated ? 'open' : 'closed'}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>,
    );
  });

  if (icon) {
    const iconIndex = children.length;
    const t = transforms[iconIndex] ?? transforms[transforms.length - 1];
    elements.push(
      <motion.span
        key="icon"
        variants={makeVariants(t)}
        animate={isAnimated ? 'open' : 'closed'}
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        {icon}
      </motion.span>,
    );
  }

  return (
    <div
      className={cn('relative flex cursor-pointer items-center', className)}
      onMouseEnter={() => { onHover?.(true); setIsAnimated(true); }}
      onMouseLeave={() => { onHover?.(false); setIsAnimated(false); }}
      {...props}
    >
      {elements}
    </div>
  );
}
