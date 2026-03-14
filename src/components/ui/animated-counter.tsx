'use client';

import { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  prefix = '', 
  suffix = '', 
  duration = 2,
  className = ''
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  useEffect(() => {
    if (isInView && ref.current) {
      animate(0, value, {
        duration: duration,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            // Usa toLocaleString para separar miles si es necesario
            ref.current.textContent = `${prefix}${Math.floor(latest).toLocaleString('es-ES')}${suffix}`;
          }
        }
      });
    }
  }, [isInView, value, duration, prefix, suffix]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
