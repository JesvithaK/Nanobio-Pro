"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Briefcase, Award, ShieldCheck, Edit3, Save, X, Terminal } from "lucide-react";

/**
 * REFINED INTERFACES
 */
interface ProfileData {
  full_name: string;
  institution: string;
  role: string;
  xp: number;
  level: number;
}

const SPRING = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", institution: "", role: "" });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, institution, role, xp, level")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          institution: data.institution || "",
          role: data.role || ""
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({ 
        id: user.id, 
        full_name: formData.full_name,
        institution: formData.institution,
        role: formData.role
      }, { onConflict: 'id' });

    if (!error) {
      setProfile(prev => prev ? ({ ...prev, ...formData }) : null);
      setIsEditing(false);
    } else {
      alert(`Sync Error: ${error.message}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono">
      <div className="flex flex-col items-center gap-4">
        <Terminal className="w-8 h-8 text-indigo-500 animate-pulse" />
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">Verifying_Identity_Matrix...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* AMBIENT BACKGROUND GRID */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-size-[4rem_4rem] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      <main className="relative z-10 p-6 md:p-12 max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-end border-b border-slate-800 pb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.3em]">Researcher_Credentials</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase">Identity Terminal</h1>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.button 
                key="edit-btn"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 text-[10px] font-mono hover:border-indigo-500 transition-all uppercase tracking-widest shadow-lg"
              >
                <Edit3 className="w-4 h-4" /> Edit_Details
              </motion.button>
            ) : (
              <motion.div 
                key="action-btns"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <button onClick={() => setIsEditing(false)} className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl text-white text-[10px] font-mono hover:bg-indigo-500 transition-all uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                  <Save className="w-4 h-4" /> Save_Changes
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* IDENTITY CARD */}
        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
          
          <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
            <div className="w-32 h-32 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group-hover:border-indigo-500/30 transition-colors">
               <User className="w-12 h-12 text-slate-700" />
            </div>

            <div className="flex-1 w-full space-y-6">
              {isEditing ? (
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700" placeholder="Identity Node Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] ml-1">Institution / Department</label>
                    <input type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700" placeholder="e.g. Molecular Research Lab" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] ml-1">Professional Role</label>
                    <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700" placeholder="e.g. Lead Researcher" />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2 tracking-tight uppercase">{profile?.full_name || "Guest Researcher"}</h2>
                    <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.4em]">Node_Clearance: Level_{profile?.level || 1}.0</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800/60">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500"><Building2 size={20} /></div>
                      <div>
                        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Institution</p>
                        <p className="text-sm text-slate-200 font-medium">{profile?.institution || "Unlinked_Entity"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500"><Briefcase size={20} /></div>
                      <div>
                        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Designation</p>
                        <p className="text-sm text-slate-200 font-medium">{profile?.role || "Field_Operative"}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* METRICS HUB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl flex items-center justify-between group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><Award size={100} /></div>
              <div className="flex items-center gap-6 relative z-10">
                 <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                   <Award className="w-8 h-8 text-indigo-400" />
                 </div>
                 <div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-1">Acquired_Telemetry_XP</p>
                    <p className="text-3xl font-black text-white font-mono">{profile?.xp || 0}</p>
                 </div>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}