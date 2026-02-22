"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Building2, Briefcase, Award, ShieldCheck, Edit3, Save, X } from "lucide-react";

interface ProfileData {
  full_name: string;
  institution: string;
  role: string;
  xp: number;
  level: number;
}

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
      } else if (error && error.code !== 'PGRST116') {
        // Log error unless it's just "no rows found" (PGRST116)
        console.error("Profile load error:", error.message);
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Error: You are not authenticated.");
      return;
    }

    // FIXED: Added onConflict mapping
    const { error } = await supabase
      .from("profiles")
      .upsert({ 
        id: user.id, 
        full_name: formData.full_name,
        institution: formData.institution,
        role: formData.role
      }, { onConflict: 'id' });

    if (!error) {
      setProfile({ ...profile, ...formData } as ProfileData);
      setIsEditing(false);
    } else {
      console.error("Save Error:", error);
      alert(`Database Error: ${error.message}`);
    }
  };

  if (loading) return <div className="p-20 text-indigo-500 font-mono animate-pulse uppercase tracking-widest">Verifying_Identity_Matrix...</div>;

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Researcher_Credentials</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Identity Terminal</h1>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs font-mono hover:bg-slate-800 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <Edit3 className="w-4 h-4" /> Edit_Details
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-slate-700 rounded-lg text-slate-400 text-xs font-mono hover:bg-slate-800 transition-all">
              <X className="w-4 h-4" />
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-white text-xs font-mono hover:bg-emerald-500 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Save className="w-4 h-4" /> Save_Changes
            </button>
          </div>
        )}
      </div>

      {/* IDENTITY CARD */}
      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
             <User className="w-12 h-12 text-slate-600" />
          </div>

          <div className="flex-1 w-full space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Full Name</label>
                  <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white font-sans focus:border-indigo-500 outline-none transition-colors" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Institution / Organization</label>
                  <input type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white font-sans focus:border-indigo-500 outline-none transition-colors" placeholder="e.g. Madras Christian College" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Current Role</label>
                  <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white font-sans focus:border-indigo-500 outline-none transition-colors" placeholder="e.g. Student" />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{profile?.full_name || "Not Provided"}</h2>
                  <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Level_{profile?.level || 1}_Clearance</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Institution</p>
                      <p className="text-sm text-slate-300 font-medium">{profile?.institution || "Not Provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Role</p>
                      <p className="text-sm text-slate-300 font-medium">{profile?.role || "Not Provided"}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* XP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"><Award className="w-6 h-6 text-indigo-400" /></div>
               <div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Total_Neural_XP</p>
                  <p className="text-2xl font-bold text-white font-mono">{profile?.xp || 0}</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}