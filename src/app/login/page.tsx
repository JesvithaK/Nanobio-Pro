"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Dna, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

/**
 * ANIMATION CONFIG
 */
const SPRING_TRANSITION = { type: "spring" as const, stiffness: 80, damping: 20 };

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      router.push("/dashboard");
    } else {
      alert(error.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 relative overflow-hidden font-sans">
      {/* AMBIENT BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_TRANSITION}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* LOGO AREA */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)] mb-4">
            <Dna className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            Terminal <span className="text-indigo-500">Access</span>
          </h2>
          <p className="text-xs font-mono text-slate-500 mt-2 uppercase tracking-widest">
            Nanobio Pro Research Portal
          </p>
        </div>

        {/* GLASS FORM */}
        <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-1">Identity (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  required
                  type="email"
                  placeholder="name@institution.edu"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-1">Access Key (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full relative group py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? "AUTHORIZING..." : "INITIALIZE SESSION"} 
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
              {/* SHIMMER EFFECT */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <ShieldCheck className="w-3 h-3" />
              <span>SECURE ENDPOINT</span>
            </div>
            <button 
              onClick={() => router.push("/signup")}
              className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest"
            >
              Request Access
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
          Authorized personnel only • System v4.0.2
        </p>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}