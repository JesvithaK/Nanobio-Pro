"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { 
  Dna, 
  Flame, 
  Star, 
  ChevronRight, 
  Atom, 
  Clock, 
  Activity, 
  Binary, 
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  Beaker 
} from "lucide-react";

/**
 * STRICT INTERFACES
 */
interface Profile {
  full_name: string;
  streak: number;
  xp: number;
  level: number;
}

interface ModuleStats {
  total: number;
  completed: number;
}

interface RecentModule {
  progress: number;
  modules: {
    title: string;
    slug: string;
  };
}

const SPRING = { type: "spring" as const, stiffness: 100, damping: 15 };

export default function NanobioDashboard() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ModuleStats>({ total: 26, completed: 0 });
  const [recent, setRecent] = useState<RecentModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Real Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, streak, xp, level")
        .eq("id", user.id)
        .single();

      // 2. Fetch Module Counts
      const { count: totalModules } = await supabase
        .from("modules")
        .select("*", { count: 'exact', head: true });

      const { count: completedCount } = await supabase
        .from("module_progress")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("completed", true);

      // 3. Fetch Most Recent Active Module
      const { data: recentData } = await supabase
        .from("module_progress")
        .select("progress, modules(title, slug)")
        .eq("user_id", user.id)
        .order("last_opened", { ascending: false })
        .limit(1)
        .maybeSingle(); // Prevents error if no progress exists yet

      if (profileData) setProfile(profileData);
      setStats({ 
        total: totalModules || 26, 
        completed: completedCount || 0 
      });
      if (recentData) setRecent(recentData as unknown as RecentModule);
      
      setLoading(false);

      // 4. Real-time Profile Listener
      const channel = supabase.channel('dashboard-sync')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, 
        payload => setProfile(payload.new as Profile))
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    };

    fetchDashboardData();
  }, [supabase]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Activity className="w-8 h-8 text-indigo-500 animate-pulse" />
        <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em]">Syncing_Telemetry...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-12 selection:bg-indigo-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-size-[4rem_4rem] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      <main className="relative z-10 max-w-7xl mx-auto space-y-10">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.3em]">Researcher: {profile?.full_name || "Auth_Node_Error"}</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase">Control Center</h1>
          </motion.div>

          <div className="flex gap-4">
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-center min-w-25 group transition-all hover:border-orange-500/30">
              <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xl font-bold text-white font-mono">{profile?.streak || 0}</p>
              <p className="text-[9px] font-mono text-slate-600 uppercase">Streak</p>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl text-center min-w-25 group transition-all hover:border-indigo-400/40">
              <Star className="w-5 h-5 text-indigo-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xl font-bold text-indigo-400 font-mono">{profile?.xp || 0}</p>
              <p className="text-[9px] font-mono text-indigo-500/60 uppercase">Neural_XP</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING}>
              <div className="backdrop-blur-3xl bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group border-l-4 border-l-indigo-500">
                <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                  <div className="w-24 h-24 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center shadow-inner">
                    <Atom className="w-12 h-12 text-indigo-500 animate-[spin_12s_linear_infinite]" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-indigo-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-1">Resume_Active_Phase</p>
                    <h2 className="text-3xl font-bold text-white mb-4 tracking-tight leading-tight">
                      {recent?.modules.title || "Initialize A-Z Curriculum"}
                    </h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-500 text-[10px] font-mono uppercase">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Est_Duration: 45m</span>
                      <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Tier: Advanced</span>
                    </div>
                  </div>
                  <Link href={recent ? `/learn/${recent.modules.slug}` : "/learn"}>
                    <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-2">
                      Boot_Lecture <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" /> Mastery_Progress
                </h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-xs text-slate-400 font-sans">Curriculum_Mastery</span>
                      <span className="text-xs font-mono text-indigo-400">{Math.round((stats.completed / stats.total) * 100)}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${(stats.completed / stats.total) * 100}%` }} 
                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                      />
                   </div>
                   <p className="text-[9px] font-mono text-slate-600 uppercase text-right tracking-tighter">
                      {stats.completed} / {stats.total} Modules_Verified
                   </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center justify-between text-[8px] font-mono text-slate-700 uppercase">
                <span>Node_Sync: Stable</span>
                <span>Latency: 14ms</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
             <Binary className="w-5 h-5 text-indigo-400" />
             <h2 className="text-xl font-bold text-white uppercase tracking-tight">Active Research Domains</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Nanoscience", domain: "Synthesis", count: "12 Modules", icon: <Atom className="w-5 h-5" /> },
              { title: "Biotechnology", domain: "Genetics", count: "8 Modules", icon: <Dna className="w-5 h-5" /> },
              { title: "Lab Protocols", domain: "Safety", count: "6 Modules", icon: <Beaker className="w-5 h-5" /> },
            ].map((domain, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl group hover:border-indigo-500/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    {domain.icon}
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{domain.domain}</span>
                </div>
                <h4 className="font-bold text-slate-200 mb-1 font-sans">{domain.title}</h4>
                <p className="text-[10px] font-mono text-slate-500 uppercase">{domain.count}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}