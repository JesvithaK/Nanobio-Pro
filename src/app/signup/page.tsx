"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Dna, User, Mail, Lock, Sparkles, ChevronRight } from "lucide-react";

const SPRING_TRANSITION = { type: "spring" as const, stiffness: 80, damping: 20 };

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    // Passing options.data ensures the Postgres trigger public.handle_new_user() 
    // can populate the profiles table correctly.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${fullName || 'default'}`,
        },
      },
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
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_TRANSITION}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            New <span className="text-purple-500">Researcher</span>
          </h2>
          <p className="text-xs font-mono text-slate-500 mt-2 uppercase tracking-widest">
            Create your Nanobio Pro Credentials
          </p>
        </div>

        <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-4">
            {/* FULL NAME */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-1">Research Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Jesvitha K."
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  required
                  type="email"
                  placeholder="scientist@lab.com"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-1">Secure Passkey</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  required
                  type="password"
                  placeholder="Min. 6 characters"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-3 mt-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? "PROVISIONING..." : "CREATE TERMINAL ACCOUNT"}
              {!isLoading && <ChevronRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => router.push("/login")}
              className="text-[10px] font-mono text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              Already have access? <span className="text-purple-400">Login</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-mono text-slate-600 uppercase">
          <div className="flex items-center gap-1"><Dna size={12}/> Biometric Ready</div>
          <div className="flex items-center gap-1"><Lock size={12}/> E2E Encrypted</div>
        </div>
      </motion.div>
    </div>
  );
}