import React from 'react';
import { motion } from 'framer-motion';

interface ImageHoverEffectProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const hoverVariants = {
  initial: {
    scale: 1,
    boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.1)'
  },
  hover: {
    scale: 1.03,
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

const ImageHoverEffect: React.FC<ImageHoverEffectProps> = ({
  children,
  className = "",
  onClick
}) => {
  return (
    <motion.div
      className={className}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={hoverVariants}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default ImageHoverEffect;
