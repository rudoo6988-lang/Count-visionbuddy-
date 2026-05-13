import { Instagram, Linkedin, Twitter, Youtube, Target } from 'lucide-react';
import { motion } from 'motion/react';

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/visionbuddy_india", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/sk-sarfaraz-962934368", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/sksarfaraz69", label: "Twitter" },
  { icon: Youtube, href: "https://www.youtube.com/@visionbuddy_india", label: "YouTube" }
];

export const Footer = () => {
  return (
    <footer className="pt-32 pb-20 px-6 border-t border-white/5 bg-black/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Target className="w-5 h-5 text-white/50" />
            </div>
            <span className="font-display font-bold text-xl uppercase tracking-tighter">VisionBuddy</span>
          </div>
          <p className="text-white/30 text-sm max-w-xs text-center md:text-left">Building the infrastructure for the next generation of dreamers and achievers.</p>
        </div>

        <div className="flex gap-4">
          {socialLinks.map((social, i) => (
            <motion.a
              key={i}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 transition-colors group relative"
            >
              <div className="absolute inset-0 bg-brand-blue/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <social.icon className="w-5 h-5 text-white/70 group-hover:text-white relative z-10" />
            </motion.a>
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-white/20 uppercase tracking-[0.2em]">
        <p>© 2026 VisionBuddy. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white/40 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white/40 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
