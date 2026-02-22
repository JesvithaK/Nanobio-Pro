"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  Terminal, 
  ChevronRight, 
  Dna, 
  Microscope, 
  Zap, 
  Activity,
  Binary,
  ShieldAlert,
  FlaskConical,
  Atom
} from "lucide-react";

/**
 * INTERFACES
 */
interface QuizModule {
  id: string;
  title: string;
  slug: string;
  difficulty: number;
}

const SPRING = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function QuizDashboard() {
  const supabase = createClient();
  const [quizzes, setQuizzes] = useState<QuizModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      // Fetching all A-Z modules from the database
      const { data, error } = await supabase
        .from("modules")
        .select("id, title, slug, difficulty")
        .order("title", { ascending: true });

      if (data) setQuizzes(data as QuizModule[]);
      setLoading(false);
    }
    fetchQuizzes();
  }, [supabase]);

  // DYNAMIC ICON ASSIGNMENT BASED ON CONTENT
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("microscopy") || t.includes("imaging")) return <Microscope size={24} />;
    if (t.includes("genetic") || t.includes("dna") || t.includes("sirna") || t.includes("crispr")) return <Dna size={24} />;
    if (t.includes("fluidics")) return <Binary size={24} />;
    if (t.includes("protein") || t.includes("enzyme")) return <FlaskConical size={24} />;
    if (t.includes("atomic") || t.includes("quantum")) return <Atom size={24} />;
    return <Zap size={24} />;
  };

  // TIER LABEL LOGIC
  const getTier = (difficulty: number) => {
    if (difficulty === 1) return "Foundation";
    if (difficulty === 2) return "Intermediate";
    return "Advanced";
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-indigo-500 uppercase tracking-widest text-[10px]">
      Synchronizing_Evaluation_Nodes...
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans p-6 md:p-12 selection:bg-indigo-500/30">
      {/* INDUSTRIAL OVERLAYS */}
      <div className="absolute inset-0 z-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      
      <main className="relative z-10 max-w-5xl mx-auto">
        {/* HEADER SECTION */}
        <header className="mb-12 border-b border-slate-800 pb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Terminal className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.3em]">Evaluation_Matrix_v4.0</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">Curriculum Quizzes</h1>
            <p className="mt-4 text-slate-500 max-w-2xl text-sm leading-relaxed font-sans">
              Access technical verification nodes for all Zoology research modules. Complete evaluation with <span className="text-indigo-400 font-bold">70% ACCURACY</span> to verify mastery.
            </p>
          </motion.div>
        </header>

        {/* DYNAMIC MODULE LIST */}
        <div className="grid grid-cols-1 gap-4">
          {quizzes.length > 0 ? (
            quizzes.map((mod, i) => (
              <motion.div 
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link
                  href={`/quiz/${mod.slug}`}
                  className="flex items-center justify-between p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 bg-slate-900/40 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60 hover:shadow-[0_0_25px_rgba(99,102,241,0.1)] group"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 group-hover:text-indigo-300 transition-colors shadow-inner">
                      {getIcon(mod.title)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors uppercase tracking-tight leading-none mb-2">
                        {mod.title}
                      </h2>
                      <div className="flex items-center gap-4 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                         <span className="flex items-center gap-1.5"><Activity size={12} /> Tier: {getTier(mod.difficulty)}</span>
                         <span className="text-slate-800">|</span>
                         <span className="text-indigo-500/60 font-bold">NODE_READY</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end mr-4">
                      <span className="text-[8px] font-mono text-emerald-500 uppercase font-bold tracking-widest">Protocol_Active</span>
                      <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">Sync_Latency: 12ms</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center border border-dashed border-slate-800 rounded-3xl">
              <ShieldAlert className="w-10 h-10 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-600 font-mono text-[10px] uppercase tracking-[0.3em]">No_Quizzes_Available_In_Matrix</p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .grid-bg {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
          animation: grid-drift 40s linear infinite;
        }
        @keyframes grid-drift { 
          0% { background-position: 0 0; } 
          100% { background-position: 40px 40px; } 
        }
      `}</style>
    </div>
  );
}