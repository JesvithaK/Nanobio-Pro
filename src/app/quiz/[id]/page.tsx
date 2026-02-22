'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';
import { Terminal, ArrowRight, Hexagon, Zap, ShieldCheck } from 'lucide-react';

// Deterministic Particle Configuration to prevent hydration mismatches without needing useEffect
const PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  id: `particle-${i}`,
  x: (i * 23) % 100, 
  y: (i * 37) % 100,
  size: (i % 2) + 1,
  duration: 10 + (i % 5) * 3,
  delay: (i % 4) * 1.5,
}));

// Strictly typed Framer Motion Configurations
const springConfig: Transition = { type: 'spring', stiffness: 80, damping: 20 };

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: springConfig 
  },
};

// Dummy Quiz Data Structure
const QUIZ_DATA = {
  title: 'Advanced System Architecture',
  question: 'Which protocol ensures stateful, persistent, two-way communication across the telemetry layer?',
  options: [
    { id: 'opt_a', text: 'HTTP/3 Quic Polling' },
    { id: 'opt_b', text: 'WebSocket (WSS)' },
    { id: 'opt_c', text: 'Server-Sent Events (SSE)' },
    { id: 'opt_d', text: 'GraphQL Subscriptions via TCP' },
  ],
};

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans flex items-center justify-center p-4 sm:p-8">
      {/* Background Animated Grid */}
      <div className="absolute inset-0 z-0 grid-bg opacity-30" />

      {/* Ambient Neon Blobs - Using canonical Tailwind spacing */}
      <div className="absolute top-1/4 left-1/4 w-125 h-125 bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-purple-600/15 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      {/* Particle System */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-indigo-400/30"
            style={{ width: p.size, height: p.size, top: `${p.y}%`, left: `${p.x}%` }}
            animate={{
              y: ['0%', '-20%', '0%'],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main Glassmorphism Interface */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-3xl rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-[0_0_30px_rgba(99,102,241,0.15)] flex flex-col overflow-hidden"
      >
        {/* Header Ribbon */}
        <motion.div variants={itemVariants} className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <Hexagon className="w-5 h-5 text-indigo-400" strokeWidth={1.5} />
            <span className="font-bold tracking-wide text-slate-100 uppercase text-sm">
              CADmint <span className="text-slate-500">/</span> HardJunc
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
            <Terminal className="w-4 h-4" />
            <span>ID: {params.id || 'SYS_NULL'}</span>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="p-8 flex flex-col gap-8">
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <h2 className="text-indigo-400 font-mono text-sm tracking-widest uppercase">
              {QUIZ_DATA.title}
            </h2>
            <p className="text-2xl font-bold leading-snug text-slate-100">
              {QUIZ_DATA.question}
            </p>
          </motion.div>

          {/* Options Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 gap-4">
            {QUIZ_DATA.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.015, transition: springConfig }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`
                    group relative w-full flex items-center justify-between p-5 rounded-xl border text-left transition-colors duration-300
                    ${isSelected 
                      ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }
                  `}
                >
                  <span className="font-mono text-sm text-slate-400 mr-4 group-hover:text-indigo-400 transition-colors">
                    [{opt.id.split('_')[1].toUpperCase()}]
                  </span>
                  <span className={`flex-1 ${isSelected ? 'text-indigo-100 font-semibold' : 'text-slate-300'}`}>
                    {opt.text}
                  </span>
                  
                  {/* Active Indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: springConfig }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Action Footer */}
        <motion.div variants={itemVariants} className="px-8 py-5 border-t border-slate-800/60 bg-slate-950/30 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
            <Zap className="w-4 h-4 text-purple-500" />
            <span>Connection Secure</span>
          </div>

          <motion.button
            disabled={!selectedOption}
            whileHover={selectedOption ? { scale: 1.05, transition: springConfig } : {}}
            whileTap={selectedOption ? { scale: 0.95 } : {}}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300
              ${selectedOption 
                ? 'bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] cursor-pointer hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }
            `}
          >
            Execute Next <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Internal CSS for Grid Drift Animation */}
      <style jsx>{`
        .grid-bg {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          animation: grid-drift 20s linear infinite;
        }

        @keyframes grid-drift {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(40px) translateX(40px); }
        }
      `}</style>
    </div>
  );
}