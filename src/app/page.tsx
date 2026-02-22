"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Dna, 
  ArrowRight, 
  Microscope, 
  FlaskConical, 
  ShieldCheck, 
  Binary,
  Globe,
  Zap
} from "lucide-react";

/**
 * ANIMATION CONFIGURATION
 * Damped spring physics for a professional, non-bouncy feel.
 */
const SPRING = { type: "spring" as const, stiffness: 80, damping: 20 };

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const ITEM_ENTRANCE = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: SPRING }
};

export default function NanobioHome() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* GLOBAL HUD STYLES */}
      <style jsx global>{`
        @keyframes drift {
          from { background-position: 0 0; }
          to { background-position: 4rem 4rem; }
        }
        .grid-drift {
          background-image: linear-gradient(to right, rgba(30,41,59,0.5) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(30,41,59,0.5) 1px, transparent 1px);
          background-size: 4rem 4rem;
          animation: drift 20s linear infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1);
          background-size: 200% auto;
          color: transparent;
          background-clip: text;
          animation: shine 4s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
      `}</style>

      {/* AMBIENT LABORATORY BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 grid-drift mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      {/* TOP NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <Dna className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white uppercase">
            NANOBIO <span className="text-indigo-500">PRO</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
          <Link href="/learn" className="hover:text-white transition-colors">Curriculum</Link>
          <Link href="/analytics" className="hover:text-white transition-colors">Network</Link>
          <div className="h-4 w-px bg-slate-800" />
          <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          <Link href="/signup" className="px-5 py-2 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 rounded-lg hover:bg-indigo-600/20 transition-all shadow-inner">
            Initialize Access
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32 text-center">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={ITEM_ENTRANCE} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-[0.3em]">PhD Learning Terminal Active</span>
          </motion.div>

          <motion.h1 variants={ITEM_ENTRANCE} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8 text-white">
            Redefining <br />
            <span className="shimmer-text">Nanobiotechnology</span>
          </motion.h1>

          <motion.p variants={ITEM_ENTRANCE} className="mt-8 text-lg text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            A high-fidelity adaptive learning environment for PhD researchers. 
            From <span className="text-indigo-400">Liposomal Delivery</span> to 
            <span className="text-emerald-400"> CRISPR-Cas9 Structural Biology</span>. 
            Precision-engineered content for the next generation of scientists.
          </motion.p>

          <motion.div variants={ITEM_ENTRANCE} className="mt-12 flex flex-col md:flex-row justify-center gap-6">
            <Link href="/signup" className="group">
              <button className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:bg-indigo-500 flex items-center justify-center gap-3">
                START RESEARCH <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/learn">
              <button className="w-full md:w-auto px-10 py-4 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl hover:bg-slate-800 transition-all font-bold text-sm text-slate-400 hover:text-white">
                EXPLORE DOMAINS
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* FEATURE HUD GRID */}
        
        <motion.div 
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {[
            { 
              icon: <FlaskConical className="w-5 h-5" />, 
              title: "Molecular Logic", 
              desc: "Deep-dive modules into synthesis, characterization, and cellular interactions.",
              code: "MOD_TYPE: LAB_CORE"
            },
            { 
              icon: <Zap className="w-5 h-5" />, 
              title: "Adaptive Evaluation", 
              desc: "Spaced-repetition and difficulty-scaling quizzes tailored to your retention rate.",
              code: "ALG: NEURAL_RECALL"
            },
            { 
              icon: <Binary className="w-5 h-5" />, 
              title: "Telemetry Dashboard", 
              desc: "Real-time analytics tracking your XP, streaks, and curriculum coverage.",
              code: "SYNC: STABLE"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={ITEM_ENTRANCE}
              className="group p-8 rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-sm text-left hover:border-indigo-500/30 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Binary className="w-16 h-16" />
              </div>
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 mb-6 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all">
                {feature.icon}
              </div>
              <p className="text-[9px] font-mono text-indigo-500 uppercase tracking-widest mb-2">{feature.code}</p>
              <h3 className="font-bold text-lg text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* FOOTER SYSTEM */}
      <footer className="relative z-10 border-t border-slate-900/60 py-12 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> SSL_ENCRYPTED
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              <Globe className="w-4 h-4" /> GLOBAL_CDN
            </div>
          </div>
          
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
            Nanobio Pro Terminal © 2026 • Specialized PhD Curriculum
          </p>

          <div className="flex gap-8 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <Link href="/terms" className="hover:text-white transition-colors">Privacy_Protocol</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Terms_of_Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}