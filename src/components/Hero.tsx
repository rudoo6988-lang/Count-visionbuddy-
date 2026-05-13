import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Rocket, AlertCircle } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc, increment, serverTimestamp, writeBatch } from 'firebase/firestore';

export const Hero = ({ onJoin }: { onJoin: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ip, setIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIp(data.ip);
      } catch (err) {
        console.error("Failed to fetch IP:", err);
      }
    };
    fetchIp();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !ip) {
      if (!ip) setError("We couldn't verify your IP. Please try again or disable your adblocker.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const batch = writeBatch(db);
      
      const entryId = crypto.randomUUID();
      const entryRef = doc(db, 'waitlist', entryId);
      const ipSafe = ip.replace(/\./g, '-'); // Sanitize for ID if needed, though rules allow dots
      const usedIpRef = doc(db, 'used_ips', ipSafe);
      
      batch.set(entryRef, {
        name,
        email,
        ipAddress: ip,
        joinedAt: serverTimestamp()
      });

      batch.set(usedIpRef, {
        used: true,
        email,
        timestamp: serverTimestamp()
      });

      // Increment counter
      const statsRef = doc(db, 'stats', 'global');
      
      // We use set with merge: true to ensure the document exists
      // If it doesn't exist, it will create it. If it does, it will increment.
      batch.set(statsRef, {
        waitlistCount: increment(1)
      }, { merge: true });

      await batch.commit();

      // Trigger Email Notification via Backend
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, ipAddress: ip })
        });
      } catch (notifyErr) {
        console.error("Notification failed:", notifyErr);
      }

      setSuccess(true);
      onJoin();
      setName('');
      setEmail('');
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      if (err.message?.includes('permission-denied') || err.message?.includes('insufficient permissions')) {
        setError("It looks like you've already joined the waitlist from this network! 🚀");
      } else {
        handleFirestoreError(err, OperationType.WRITE, 'waitlist');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-brand-purple/20 blur-[120px] rounded-full" />
      
      {/* Background Particles (Animated) */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 - 50 + "%"
            }}
            transition={{ 
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute rounded-full bg-white w-1 h-1"
            style={{ 
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%"
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-blue mb-8 uppercase tracking-widest"
        >
          <Sparkles className="w-3 h-3" />
          The future of productivity is here
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-[1.1] tracking-tighter"
        >
          Your Future Deserves a <span className="text-gradient">Roadmap.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          VisionBuddy uses AI to understand your dreams, build personalized roadmaps, and help you stay consistent with smart habit tracking.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          id="waitlist"
          className="glass-card max-w-xl mx-auto p-2"
        >
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="md:w-1/3"
              disabled={loading}
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="md:w-1/2"
              disabled={loading}
              required
            />
            <Button
              type="submit"
              disabled={loading || !name || !email || !ip}
              className="w-full md:w-auto"
            >
              {loading ? "Joining..." : "Count Me In"}
            </Button>
          </form>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 flex items-center justify-center gap-2 text-red-400 text-sm font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-4 flex items-center gap-3 border-brand-blue/50 glow-blue text-white"
            >
              <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-brand-blue" />
              </div>
              <div className="text-left">
                <p className="font-bold">Welcome to VisionBuddy 🚀</p>
                <p className="text-sm text-white/60">You're on the list! Check your inbox soon.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
