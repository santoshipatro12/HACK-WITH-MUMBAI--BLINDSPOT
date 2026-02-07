import { motion, HTMLMotionProps, TargetAndTransition, MotionStyle } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  isLoading,
  disabled,
  leftIcon,
  rightIcon,
  style,
  ...props 
}: ButtonProps) {
  
  // Base styles
  const baseStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: 600,
    border: 'none',
    borderRadius: '12px',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    opacity: disabled ? 0.5 : 1,
  };

  // Size styles
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '10px 18px', fontSize: '13px', borderRadius: '10px', gap: '6px' },
    md: { padding: '14px 28px', fontSize: '14px', gap: '10px' },
    lg: { padding: '18px 36px', fontSize: '16px', borderRadius: '14px', gap: '12px' },
  };

  // Variant styles
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      color: '#FFFFFF',
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35), 0 0 0 1px rgba(139, 92, 246, 0.2)',
    },
    secondary: {
      color: '#A5B4FC',
      background: 'rgba(99, 102, 241, 0.1)',
      border: '1.5px solid rgba(139, 92, 246, 0.25)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    ghost: {
      color: '#94A3B8',
      background: 'transparent',
    },
    danger: {
      color: '#FFFFFF',
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.35)',
    },
  };

  const combinedStyles: MotionStyle = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  // Hover animation based on variant
  const getHoverAnimation = (): TargetAndTransition | undefined => {
    if (disabled || isLoading) return undefined;
    
    const baseHover: TargetAndTransition = {
      scale: 1.02,
      y: -2,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseHover,
          boxShadow: '0 8px 35px rgba(99, 102, 241, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.4)',
        };
      case 'danger':
        return {
          ...baseHover,
          boxShadow: '0 8px 35px rgba(239, 68, 68, 0.5)',
        };
      case 'secondary':
        return {
          ...baseHover,
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
        };
      default:
        return baseHover;
    }
  };

  // Tap animation
  const getTapAnimation = (): TargetAndTransition | undefined => {
    if (disabled || isLoading) return undefined;
    return { scale: 0.98 };
  };

  return (
    <motion.button
      style={combinedStyles}
      whileHover={getHoverAnimation()}
      whileTap={getTapAnimation()}
      disabled={disabled || isLoading}
      className={className}
      {...props}
    >
      {/* Content */}
      <span style={{ 
        position: 'relative', 
        zIndex: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '10px' 
      }}>
        {isLoading ? (
          <>
            <motion.span
              style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                flexShrink: 0,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {leftIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>}
          </>
        )}
      </span>
    </motion.button>
  );
}