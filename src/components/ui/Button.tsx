import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 disabled:opacity-50 disabled:cursor-not-allowed",
      secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10 opacity-50",
      ghost: "bg-transparent hover:bg-white/5 text-white"
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm md:text-base",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
