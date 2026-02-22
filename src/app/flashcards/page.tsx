"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  RotateCcw, 
  Brain, 
  CheckCircle2, 
  Dna,
  Terminal,
  Activity
} from "lucide-react";

/**
 * TECHNICAL INTERFACES
 */
interface Flashcard {
  id: string;
  term: string;
  definition: string;
}

const SPRING = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function FlashcardTerminal() {
  const supabase = createClient();
  const router = useRouter();

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ mastered: 0, reviewing: 0 });

  useEffect(() => {
    async function fetchFlashcards() {
      // Fetching terminology directly from your key_terms table
      const { data, error } = await supabase
        .from("key_terms")
        .select("id, term, definition");
      
      if (!error && data) {
        setCards(data as Flashcard[]);
      }
      setLoading(false);
    }
    fetchFlashcards();
  }, [supabase]);

  const handleScore = async (status: 'mastered' | 'review') => {
    // Update local session telemetry
    if (status === 'mastered') setStats(s => ({ ...s, mastered: s.mastered + 1 }));
    else setStats(s => ({ ...s, reviewing: s.reviewing + 1 }));

    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      // Brief delay to allow flip animation to reset before slide
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    } else {
      // Final Session Sync: Award XP for completing the deck
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Calling your increment_xp RPC function
        await supabase.rpc('increment_xp', { x: 50 });
      }
      router.push("/analytics");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Terminal className="w-8 h-8 text-indigo-500 animate-pulse" />
        <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em]">Loading_Neural_Deck...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans overflow-hidden selection:bg-indigo-500/30">
      {/* AMBIENT GRID SYSTEM */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-size-[4rem_4rem] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      <main className="max-w-4xl mx-auto relative z-10 h-[80vh] flex flex-col">
        {/* SESSION HEADER */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Neural Sync</h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active_Session: Spaced Repetition</p>
            </div>
          </div>
          <div className="flex gap-4 font-mono">
            <div className="text-right">
              <p className="text-[9px] text-slate-500 uppercase">Mastered</p>
              <p className="text-sm font-bold text-emerald-500">{stats.mastered}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-500 uppercase">Review</p>
              <p className="text-sm font-bold text-orange-500">{stats.reviewing}</p>
            </div>
          </div>
        </div>

        {/* 3D CARD INTERFACE */}
        <div className="flex-1 flex items-center justify-center [perspective:1000px]">
          <AnimatePresence mode="wait">
            {cards.length > 0 ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, rotateZ: -10 }}
                transition={SPRING}
                className="w-full max-w-lg aspect-[4/3] relative cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  className="w-full h-full relative [transform-style:preserve-3d] transition-all duration-700"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                >
                  {/* FRONT: TERMINOLOGY */}
                  <div className="absolute inset-0 [backface-visibility:hidden] backdrop-blur-2xl bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl group-hover:border-indigo-500/30 transition-all">
                    <Dna className="w-8 h-8 text-indigo-500/20 mb-6" />
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.4em] mb-4">Concept_Probe</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight uppercase">
                      {cards[currentIndex]?.term}
                    </h2>
                    <p className="mt-12 text-[10px] font-mono text-slate-600 uppercase animate-pulse">Touch_to_Decrypt</p>
                  </div>

                  {/* BACK: DEFINITION */}
                  <div className="absolute inset-0 [backface-visibility:hidden] backdrop-blur-2xl bg-slate-900/90 border border-indigo-500/30 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl [transform:rotateY(180deg)]">
                    <Activity className="w-8 h-8 text-emerald-500/20 mb-6" />
                    <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-sans">
                      {cards[currentIndex]?.definition}
                    </p>
                    
                    {/* Mastery Controls */}
                    <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-center gap-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleScore('review'); }}
                        className="flex-1 py-3 bg-slate-800 hover:bg-orange-500/20 border border-slate-700 hover:border-orange-500/50 text-orange-400 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 font-mono"
                      >
                        <RotateCcw className="w-3 h-3" /> Review_Later
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleScore('mastered'); }}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-emerald-600 text-white rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 font-mono"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <div className="text-slate-500 font-mono text-xs uppercase tracking-widest">No_Concepts_In_Database</div>
            )}
          </AnimatePresence>
        </div>

        {/* SESSION FOOTER */}
        <div className="mt-auto flex justify-between items-center py-8 border-t border-slate-900/50">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              NEURAL_STREAM: ACTIVE
            </div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
              Queue: {cards.length - currentIndex} Concepts Remaining
            </p>
        </div>
      </main>
    </div>
  );
}