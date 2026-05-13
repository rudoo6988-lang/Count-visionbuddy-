import { motion } from 'motion/react';
import { Target, Zap, Layout, User, PieChart } from 'lucide-react';

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">VisionBuddy</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#waitlist" className="hover:text-white transition-colors">Waitlist</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          Join Beta
        </motion.button>
      </div>
    </motion.nav>
  );
};
