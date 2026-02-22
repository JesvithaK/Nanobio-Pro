"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  BarChart3, TrendingUp, Zap, Target, Award, Activity, 
  Binary, Shield, Microscope, ChevronDown, ChevronUp, Lock, CheckCircle2
} from "lucide-react";

interface DomainStat {
  domain_name: string;
  completed: number;
  total: number;
  percentage: number;
}

const SPRING = { type: "spring" as const, stiffness: 100, damping: 15 };

export default function AnalyticsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [domainStats, setDomainStats] = useState<DomainStat[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // State for collapsible section
  const [isDomainOpen, setIsDomainOpen] = useState(true);

  useEffect(() => {
    async function fetchRealTelemetry() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profileData) setProfile(profileData);

      const [{ data: allModules }, { data: progress }, { data: attempts }] = await Promise.all([
        supabase.from("modules").select("id, title"), 
        supabase.from("module_progress").select("module_id").eq("user_id", user.id).eq("completed", true),
        supabase.from("user_quiz_attempts").select("is_correct").eq("user_id", user.id)
      ]);

      if (allModules && progress) {
        setTotalCompleted(progress.length);
        const completedIds = new Set(progress.map(p => p.module_id));
        const statsMap: Record<string, { completed: number, total: number }> = {};
        
        allModules.forEach((mod) => {
          const category = mod.title.split(' ')[0] || "General";
          if (!statsMap[category]) statsMap[category] = { completed: 0, total: 0 };
          statsMap[category].total += 1;
          if (completedIds.has(mod.id)) statsMap[category].completed += 1;
        });

        const calculatedStats = Object.keys(statsMap).map(key => ({
          domain_name: key,
          completed: statsMap[key].completed,
          total: statsMap[key].total,
          percentage: Math.round((statsMap[key].completed / statsMap[key].total) * 100)
        })).sort((a, b) => b.percentage - a.percentage);

        setDomainStats(calculatedStats);
      }

      if (attempts && attempts.length > 0) {
        const correct = attempts.filter(a => a.is_correct).length;
        setAccuracy(Math.round((correct / attempts.length) * 100));
      }
      setLoading(false);
    }
    fetchRealTelemetry();
  }, [supabase]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono">
       <Activity className="w-8 h-8 text-indigo-500 animate-pulse mb-2" />
       <span className="text-[10px] text-slate-500 uppercase tracking-widest">Compiling_Matrix_Data...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* TOP STATUS BAR */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-800/60 pb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.3em]">Telemetry_Node_A1</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase">Researcher Analytics</h1>
          </motion.div>
          
          <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-2 rounded-2xl">
            <div className="px-4 py-2 border-r border-slate-800">
              <p className="text-[8px] font-mono text-slate-500 uppercase">Clearance</p>
              <p className="text-sm font-bold text-white font-mono">Lvl_{profile?.level || 1}.0</p>
            </div>
            <div className="px-4 py-2">
              <p className="text-[8px] font-mono text-slate-500 uppercase">Status</p>
              <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Authorized
              </div>
            </div>
          </div>
        </div>

        {/* METRICS HUD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Neural Streak", value: `${profile?.streak || 0}d`, icon: <Zap size={20} className="text-orange-500" />, sub: "CONSISTENCY" },
            { label: "Matrix XP", value: `${profile?.xp || 0}`, icon: <TrendingUp size={20} className="text-indigo-400" />, sub: "TELEMETRY" },
            { label: "Verified Nodes", value: `${totalCompleted}`, icon: <Award size={20} className="text-emerald-500" />, sub: "A-Z_SYNC" },
            { label: "Precision", value: `${accuracy}%`, icon: <Target size={20} className="text-purple-500" />, sub: "ACCURACY" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl hover:bg-slate-900/60 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-950 rounded-lg">{stat.icon}</div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="text-3xl font-black text-white font-mono">{stat.value}</p>
              <p className="text-[8px] font-mono text-slate-600 uppercase mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* COLLAPSIBLE DOMAIN ANALYSIS */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden">
          <button 
            onClick={() => setIsDomainOpen(!isDomainOpen)}
            className="w-full flex items-center justify-between p-8 hover:bg-slate-800/30 transition-colors border-b border-slate-800"
          >
            <div className="flex items-center gap-4">
              <Microscope className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Domain_Mastery_Analysis</h3>
              <span className="ml-2 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-mono text-indigo-400">
                {domainStats.length} DATA_CHANNELS
              </span>
            </div>
            {isDomainOpen ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
          </button>

          <AnimatePresence>
            {isDomainOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-950/20">
                  {domainStats.length > 0 ? domainStats.map((domain, i) => (
                    <motion.div 
                      key={domain.domain_name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3">
                          {domain.percentage === 100 ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                          ) : (
                            <Lock size={14} className="text-slate-700" />
                          )}
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{domain.domain_name}_SYSTEM</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-indigo-400">{domain.percentage}%</span>
                      </div>
                      <div className="relative h-2 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${domain.percentage}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className={`h-full shadow-[0_0_15px_rgba(99,102,241,0.3)] ${domain.percentage === 100 ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-indigo-600'}`}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-slate-600 uppercase tracking-tighter">
                        <span>Nodes: {domain.completed} / {domain.total}</span>
                        <span>{domain.percentage === 100 ? "VERIFIED" : "IN_PROGRESS"}</span>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-full py-10 text-center opacity-30 font-mono text-[10px] uppercase">No_Active_Telemetry_Detected</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PROGRESSION INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col justify-center">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                   <Binary className="text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white uppercase tracking-tight">System_Optimization</h4>
                  <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Procedural_Insight</p>
                </div>
             </div>
             <p className="text-sm text-slate-400 font-sans leading-relaxed">
               Current data streams indicate an accuracy of <span className="text-white font-bold">{accuracy}%</span>. To increase your clearance level to <span className="text-indigo-400 font-bold">{profile?.level + 1 || 2}.0</span>, you must verify at least 3 more high-tier research nodes in the Matrix.
             </p>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-10 flex flex-col justify-between group cursor-pointer hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/10">
            <Shield className="w-10 h-10 text-white/50 mb-4" />
            <div>
              <h4 className="text-2xl font-black text-white leading-tight uppercase mb-2">Continue<br/>Sequence</h4>
              <p className="text-xs text-indigo-100/70 font-mono uppercase tracking-widest mb-8">Return_To_Matrix</p>
            </div>
            <button 
              onClick={() => window.location.href = '/learn'}
              className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Resume_Research
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}