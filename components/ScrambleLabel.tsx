import React from 'react';
import { useScramble } from '../hooks/useScramble';

interface Props {
  children: string;
  mode?: 'hover' | 'reveal';
  className?: string;
  as?: 'span' | 'div';
  onClick?: () => void;
}

/** Mono-Label mit Scramble-Effekt (Nav-Links bei Hover, Eyebrows bei Reveal). */
const ScrambleLabel: React.FC<Props> = ({ children, mode = 'hover', className, as = 'span', onClick }) => {
  const ref = useScramble<HTMLElement>(mode);
  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={className} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {children}
    </Tag>
  );
};

export default ScrambleLabel;
