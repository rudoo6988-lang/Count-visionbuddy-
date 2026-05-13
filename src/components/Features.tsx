import { motion } from 'motion/react';
import { Target, Zap, Layout, User, PieChart, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: "AI Goal Roadmaps",
    description: "AI creates personalized step-by-step plans tailored to your specific dreams and timeline.",
    color: "blue"
  },
  {
    icon: Zap,
    title: "Habit Tracking",
    description: "Track consistency daily with smart insights that adapt to your behavioral patterns.",
    color: "purple"
  },
  {
    icon: Layout,
    title: "Future Recommendations",
    description: "Discover new opportunities and resources curated by AI based on your long-term goals.",
    color: "blue"
  },
  {
    icon: User,
    title: "AI Companion",
    description: "A motivational companion that keeps you engaged, focused, and accountable every day.",
    color: "purple"
  },
  {
    icon: PieChart,
    title: "Progress Analytics",
    description: "Stunning visual charts and growth metrics that show exactly how far you've come.",
    color: "blue"
  },
  {
    icon: Sparkles,
    title: "Neural Synergy",
    description: "Sync your digital life with your physical goals through advanced behavioral modeling.",
    color: "purple"
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Designed for the <span className="text-gradient">Ambitious.</span></h2>
          <p className="text-white/50 max-w-xl mx-auto">Our toolkit leverages cutting-edge artificial intelligence to transform high-level aspirations into daily actionable steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-card p-8 group transition-all duration-300 hover:border-brand-blue/30"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${feature.color === 'blue' ? 'bg-brand-blue/10 group-hover:bg-brand-blue/20' : 'bg-brand-purple/10 group-hover:bg-brand-purple/20'}`}>
                <feature.icon className={`w-6 h-6 ${feature.color === 'blue' ? 'text-brand-blue' : 'text-brand-purple'}`} />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
