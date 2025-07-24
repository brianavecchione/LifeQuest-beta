import React, { useEffect, useState } from 'react';

interface AnimatedValueProps {
  value: number;
  duration?: number;
  className?: string;
  format?: (value: number) => string;
}

const AnimatedValue: React.FC<AnimatedValueProps> = ({ 
  value, 
  duration = 800, 
  className = "",
  format = (val) => Math.round(val).toString()
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayValue === value) return;

    setIsAnimating(true);
    const startValue = displayValue;
    const difference = value - startValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      
      const currentValue = startValue + (difference * easedProgress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, displayValue]);

  return (
    <span 
      className={`${className} ${isAnimating ? 'animate-pulse' : ''} transition-all duration-300`}
    >
      {format(displayValue)}
    </span>
  );
};

export default AnimatedValue;