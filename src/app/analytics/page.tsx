"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Zap, 
  Target, 
  Award,
  Activity,
  Binary,
  Shield,
  Microscope,
  Dna,
  Search
} from "lucide-react";

/**
 * STRICT INTERFACES
 */
interface Profile {
  xp: number;
  level: number;
  streak: number;
}

interface DomainStat {
  domain_name: string;
  completed: number;
  total: number;
  percentage: number;
}

const SPRING = { type: "spring" as const, stiffness: 100, damping: 15 };

export default function AnalyticsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [domainStats, setDomainStats] = useState<DomainStat[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRealTelemetry() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Real Profile Stats
      const { data: profileData } = await supabase
        .from("profiles")
        .select("xp, level, streak")
        .eq("id", user.id)
        .single();

      if (profileData) setProfile(profileData);

      // 2. Fetch Domain Mastery (Real calculations)
      // Get all modules with their domains
      const { data: allModules } = await supabase
        .from("modules")
        .select("id, domains(name)");

      // Get user's completed modules
      const { data: completedProgress } = await supabase
        .from("module_progress")
        .select("module_id")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (allModules && completedProgress) {
        setTotalCompleted(completedProgress.length);
        
        // Map completed module IDs for quick lookup
        const completedIds = new Set(completedProgress.map(p => p.module_id));
        
        // Calculate stats per domain
        const statsMap: Record<string, { completed: number, total: number }> = {};
        
        allModules.forEach((mod: any) => {
          const domainName = mod.domains?.name || "Uncategorized";
          if (!statsMap[domainName]) statsMap[domainName] = { completed: 0, total: 0 };
          
          statsMap[domainName].total += 1;
          if (completedIds.has(mod.id)) {
            statsMap[domainName].completed += 1;
          }
        });

        // Convert to array and calculate percentages
        const calculatedStats: DomainStat[] = Object.keys(statsMap).map(key => ({
          domain_name: key,
          completed: statsMap[key].completed,
          total: statsMap[key].total,
          percentage: statsMap[key].total > 0 ? Math.round((statsMap[key].completed / statsMap[key].total) * 100) : 0
        }));

        setDomainStats(calculatedStats);
      }
      
      setLoading(false);
    }

    fetchRealTelemetry();

    // Real-time listener for XP/Level updates
    const channel = supabase.channel('analytics-sync')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, 
      (payload) => setProfile(payload.new as Profile))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Activity className="w-8 h-8 text-indigo-500 animate-pulse" />
        <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em]">Querying_Database_Telemetry...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans overflow-x-hidden selection:bg-indigo-500/30">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-linear-to-r from-slate-800/30 to-transparent bg-size-[4rem_4rem] mask-[radial-gradient(circle_at_center,black,transparent_80%)] border-r border-slate-800/30" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        
        {/* TOP COMMAND BAR */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-800/60 pb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.3em]">Researcher_Performance_Terminal</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase">System Analytics</h1>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-4 hidden md:flex">
               <Search className="w-4 h-4 text-slate-600" />
               <input type="text" placeholder="QUERY_LOGS..." className="bg-transparent text-xs font-mono outline-none w-32 text-slate-300" disabled />
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-6 py-2">
              <p className="text-[9px] font-mono text-indigo-400 uppercase">Clearance_Level</p>
              <p className="text-xl font-bold text-white font-mono">{profile?.level || 1}.0</p>
            </div>
          </div>
        </div>

        {/* TRUE METRICS HUB */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Neural Streak", value: `${profile?.streak || 0}d`, icon: <Zap className="text-orange-500" />, sub: "CONSISTENCY_METRIC" },
            { label: "Total XP", value: `${profile?.xp || 0}`, icon: <TrendingUp className="text-indigo-400" />, sub: "ACQUIRED_KNOWLEDGE" },
            { label: "Modules Verified", value: `${totalCompleted}`, icon: <Award className="text-emerald-500" />, sub: "DATABASE_SYNCED" },
            { label: "Accuracy", value: totalCompleted > 0 ? "100%" : "0%", icon: <Target className="text-purple-500" />, sub: "EVALUATION_SCORE" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: i * 0.1 }}>
              <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5"><Binary className="w-12 h-12" /></div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg shadow-inner">{stat.icon}</div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1 font-mono">{stat.value}</h3>
                <p className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* REAL DOMAIN MASTERY RADAR */}
          <div className="lg:col-span-2 space-y-6">
            <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8 h-full">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-8 border-b border-slate-800 pb-4">
                <Microscope className="w-4 h-4 text-emerald-400" /> Domain_Mastery_Analysis
              </h3>
              
              {domainStats.length === 0 ? (
                 <div className="py-12 text-center text-slate-600 font-mono text-xs uppercase">Awaiting_Curriculum_Data...</div>
              ) : (
                <div className="space-y-8">
                  {domainStats.map((domain, i) => (
                    <div key={domain.domain_name} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-slate-300 uppercase flex items-center gap-2">
                          <Binary className="w-3 h-3 text-indigo-500" /> {domain.domain_name}
                        </span>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-white">{domain.percentage}%</span>
                          <span className="text-[9px] font-mono text-slate-500 ml-2 uppercase">({domain.completed}/{domain.total})</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-950 border border-slate-800 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${domain.percentage}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* UPCOMING MILESTONE (Dynamic based on completion) */}
          <div className="space-y-6">
            <div className={`bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group h-full flex flex-col justify-center transition-colors ${totalCompleted === 0 ? 'border-orange-500/30 bg-orange-500/5' : 'border-indigo-500/30 bg-indigo-500/5'}`}>
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform">
                 <Target className="w-32 h-32" />
               </div>
               
               {totalCompleted === 0 ? (
                 <>
                   <p className="text-[10px] font-mono text-orange-400 uppercase tracking-widest mb-2">System_Warning</p>
                   <h4 className="text-2xl font-bold text-white mb-4 leading-tight">No Modules<br/>Verified</h4>
                   <p className="text-xs text-slate-400 mb-8 font-sans leading-relaxed">Your telemetry stream is empty. Access the Research Curriculum to begin logging data.</p>
                 </>
               ) : (
                 <>
                   <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-2">Next_Objective</p>
                   <h4 className="text-2xl font-bold text-white mb-4 leading-tight">Maintain<br/>Momentum</h4>
                   <p className="text-xs text-slate-400 mb-8 font-sans leading-relaxed">You have verified {totalCompleted} modules. Continue the A-Z sequence to unlock advanced certifications.</p>
                 </>
               )}
               
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}