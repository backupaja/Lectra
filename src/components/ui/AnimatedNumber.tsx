import React, { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  decimal?: string;
}

export function AnimatedNumber({
  value,
  duration = 1500,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = '.',
  decimal = ','
}: AnimatedNumberProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = current;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      const percentage = Math.min(progress / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      
      const nextValue = startValue + (value - startValue) * easeOut;
      setCurrent(nextValue);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCurrent(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return prefix + parts.join(decimal) + suffix;
  };

  return <>{formatNumber(current)}</>;
}
