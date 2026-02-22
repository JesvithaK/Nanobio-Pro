"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Home, 
  BookOpen, 
  Brain, 
  BarChart3, 
  User, 
  Dna,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Quiz", href: "/quiz", icon: Brain },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0">
      {/* BRANDING */}
      <div className="p-6 mb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 group-hover:border-indigo-500/50 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Dna className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white uppercase">
            NANOBIO <span className="text-indigo-500">PRO</span>
          </span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2 px-4 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all border",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                    : "text-slate-500 border-transparent hover:text-slate-200 hover:bg-slate-800/40"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={18} className={cn(isActive ? "text-indigo-400" : "text-slate-500")} />
                {item.name}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* SYSTEM STATUS / FOOTER */}
      <div className="p-4 mt-auto border-t border-slate-800/50">
        <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-yellow-500" />
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              System Status
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-500/80">NODE_ACTIVE: CORE_DB</span>
          </div>
        </div>
      </div>
    </aside>
  );
}