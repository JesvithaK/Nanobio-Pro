'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants, Transition } from 'framer-motion';
import { Terminal, Database, Activity, Lock, ChevronRight } from 'lucide-react';

const PARTICLES = Array.from({ length: 15 }).map((_, i) => ({
  id: `particle-${i}`,
  x: (i * 41) % 100,
  y: (i * 53) % 100,
  size: (i % 2) + 1,
  duration: 12 + (i % 4) * 2,
  delay: (i % 3) * 1.5,
}));

const springConfig: Transition = { type: 'spring', stiffness: 80, damping: 20 };

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: springConfig },
};

const QUIZ_MODULES = [
  { id: 'sys-arch-01', title: 'System Architecture', status: 'ONLINE', icon: Database, questions: 3 },
  { id: 'net-sec-02', title: 'Network Security', status: 'LOCKED', icon: Lock, questions: 5 },
  { id: 'telemetry-03', title: 'Telemetry Protocols', status: 'ONLINE', icon: Activity, questions: 4 },
];

export default function QuizDashboard() {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans flex items-center justify-center p-4 sm:p-8">
      {/* Background Animated Grid */}
      <div className="absolute inset-0 z-0 grid-bg opacity-30" />

      {/* Ambient Neon Blobs */}
      <div className="absolute top-0 left-1/3 w-125 h-125 bg-indigo-600/15 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-purple-600/15 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      {/* Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-indigo-400/30"
            style={{ width: p.size, height: p.size, top: `${p.y}%`, left: `${p.x}%` }}
            animate={{ y: ['0%', '-30%', '0%'], opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl"
      >
        <motion.div variants={itemVariants} className="mb-10 flex items-center gap-4">
          <Terminal className="w-8 h-8 text-indigo-400" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Active Modules</h1>
            <p className="font-mono text-sm text-slate-500 mt-1">Select a subsystem protocol to initiate evaluation.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {QUIZ_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isLocked = mod.status === 'LOCKED';
            
            return (
              <motion.div key={mod.id} variants={itemVariants} whileHover={isLocked ? {} : { scale: 1.01 }}>
                <Link
                  href={isLocked ? '#' : `/quiz/${mod.id}`}
                  className={`
                    flex items-center justify-between p-6 rounded-xl border backdrop-blur-xl transition-all duration-300
                    ${isLocked 
                      ? 'bg-slate-950/50 border-slate-800/50 opacity-60 cursor-not-allowed' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-lg ${isLocked ? 'bg-slate-900' : 'bg-indigo-500/10'}`}>
                      <Icon className={`w-6 h-6 ${isLocked ? 'text-slate-600' : 'text-indigo-400'}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-200">{mod.title}</h2>
                      <div className="flex gap-3 mt-1 font-mono text-xs text-slate-500">
                        <span>ID: {mod.id.toUpperCase()}</span>
                        <span>•</span>
                        <span>{mod.questions} Qs</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-xs font-bold px-3 py-1 rounded-full ${isLocked ? 'bg-slate-900 text-slate-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {mod.status}
                    </span>
                    {!isLocked && <ChevronRight className="w-5 h-5 text-slate-500" />}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <style jsx>{`
        .grid-bg {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          animation: grid-drift 30s linear infinite;
        }
        @keyframes grid-drift {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(40px) translateX(40px); }
        }
      `}</style>
    </div>
  );
}