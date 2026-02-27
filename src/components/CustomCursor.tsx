import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      setMousePosition({ x, y });
      
      // Add new trail particle
      setTrail(prev => {
        const newTrail = [...prev, { x, y, id: Date.now() + Math.random() }];
        return newTrail.slice(-15); // Keep last 15 particles
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updatePosition(touch.clientX, touch.clientY);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updatePosition(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Stardust Trail */}
      <AnimatePresence>
        {trail.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{
              left: point.x,
              top: point.y,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Astronaut Cursor */}
      <motion.div
        className="absolute text-2xl"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
            rotate: [0, 10, -10, 0], // Slight wobble for "floating" effect
        }}
        transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }}
      >
        👩‍🚀
      </motion.div>
    </div>
  );
}
