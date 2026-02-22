"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  BookOpen, 
  Atom, 
  ChevronRight, 
  Clock, 
  Activity, 
  CheckCircle2,
  Terminal,
  Binary
} from "lucide-react";

/**
 * STRICT INTERFACES
 */
interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  estimated_minutes: number;
  difficulty: number;
}

interface ProgressRecord {
  module_id: string;
  completed: boolean;
}

// Framer Motion Configurations
const SPRING = { type: "spring" as const, stiffness: 80, damping: 20 };

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const ITEM_ENTRANCE = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: SPRING }
};

export default function LearnPage() {
  const supabase = createClient();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurriculum() {
      // 1. Fetch all modules from the database
      const { data: moduleData, error: moduleError } = await supabase
        .from("modules")
        .select("id, title, slug, description, estimated_minutes, difficulty")
        .order("title", { ascending: true });

      if (moduleError) {
        console.error("Failed to fetch modules:", moduleError);
      } else if (moduleData) {
        setModules(moduleData as Module[]);
      }

      // 2. Fetch the current user's progress to map completion status
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: progressData } = await supabase
          .from("module_progress")
          .select("module_id, completed")
          .eq("user_id", user.id);

        if (progressData) {
          const progressMap: Record<string, boolean> = {};
          progressData.forEach((p: ProgressRecord) => {
            progressMap[p.module_id] = p.completed;
          });
          setProgress(progressMap);
        }
      }

      setLoading(false);
    }

    fetchCurriculum();
  }, [supabase]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Terminal className="w-8 h-8 text-indigo-500 animate-pulse" />
        <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em]">Querying_Curriculum_Nodes...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-size-[4rem_4rem] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-12 border-b border-slate-800/80 pb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.3em]">Knowledge_Base_Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">Research Curriculum</h1>
            <p className="mt-4 text-slate-400 max-w-2xl text-sm leading-relaxed">
              Navigate the complete A-Z Nanobiotechnology matrix. Select a node to initiate deep-dive protocols and verify your mastery through adaptive evaluation.
            </p>
          </motion.div>
        </header>

        {/* CURRICULUM GRID */}
        {modules.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
            <Binary className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">No_Modules_Found_In_Database</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
          >
            {modules.map((mod) => {
              const isCompleted = progress[mod.id] === true;

              return (
                <motion.div key={mod.id} variants={ITEM_ENTRANCE}>
                  <Link href={`/learn/${mod.slug}`}>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`h-full flex flex-col justify-between p-6 rounded-2xl border backdrop-blur-xl transition-all group ${
                        isCompleted 
                          ? "bg-slate-900/30 border-emerald-500/30 hover:border-emerald-500/60" 
                          : "bg-slate-900/40 border-slate-800 hover:border-indigo-500/50 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.1)]"
                      }`}
                    >
                      <div>
                        {/* CARD HEADER */}
                        <div className="flex justify-between items-start mb-6">
                          <div className={`p-2.5 rounded-xl border transition-colors ${
                            isCompleted ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-slate-950 border-slate-800 text-indigo-400 group-hover:border-indigo-500/30 group-hover:text-indigo-300"
                          }`}>
                            <Atom className="w-5 h-5" />
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest block mb-0.5">Status</span>
                            {isCompleted ? (
                              <span className="text-[10px] font-mono font-bold text-emerald-500 flex items-center gap-1 justify-end">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono font-bold text-indigo-400">Available</span>
                            )}
                          </div>
                        </div>

                        {/* CONTENT */}
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-indigo-300 transition-colors uppercase tracking-tight">
                          {mod.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-6 font-sans">
                          {mod.description}
                        </p>
                      </div>

                      {/* CARD FOOTER METADATA */}
                      <div className="pt-5 border-t border-slate-800/60 flex items-center justify-between">
                         <div className="flex gap-4 text-[9px] font-mono text-slate-500 uppercase">
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {mod.estimated_minutes}M</span>
                            <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> LVL_{mod.difficulty}</span>
                         </div>
                         <ChevronRight className={`w-4 h-4 transition-all ${
                           isCompleted ? "text-emerald-500" : "text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1"
                         }`} />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>
    </div>
  );
}