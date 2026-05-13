import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Users } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

const AnimatedNumber = ({ value }: { value: number }) => {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

export const WaitlistCounter = () => {
  const [count, setCount] = useState<number | null>(null);
  const [isGlow, setIsGlow] = useState(false);

  useEffect(() => {
    const docRef = doc(db, 'stats', 'global');
    
    // Initial check/setup of global stats if it doesn't exist (only if user is admin, but let's try reading)
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const newCount = data.waitlistCount;
        if (count !== null && newCount > count) {
          setIsGlow(true);
          setTimeout(() => setIsGlow(false), 2000);
        }
        setCount(newCount);
      } else {
        // Fallback to a starting number if the document doesn't exist yet
        setCount(5000);
      }
    }, (error) => {
      // Log error but don't throw to prevent app crash for unauthenticated users
      // if rules are still propagating or doc is missing.
      process.env.NODE_ENV === 'development' && console.warn("Waitlist counter error:", error);
      if (count === null) setCount(5000);
    });

    return () => unsubscribe();
  }, [count]);

  return (
    <section className="py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-white/50 mb-4 uppercase tracking-[0.2em] text-xs font-semibold">People Building Their Future</p>
        
        <motion.div
          animate={isGlow ? { scale: [1, 1.05, 1], borderColor: 'rgba(14, 165, 233, 0.5)' } : {}}
          className={`glass-card p-10 flex flex-col items-center gap-4 transition-all duration-500 ${isGlow ? 'glow-blue' : ''}`}
        >
          <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-brand-blue" />
          </div>
          
          <div className="text-5xl md:text-6xl font-display font-bold tracking-tight">
            {count !== null ? <AnimatedNumber value={count} /> : "..."}
          </div>
          
          <div className="text-lg font-medium text-white/70">Future Builders</div>
        </motion.div>
      </div>
    </section>
  );
};
