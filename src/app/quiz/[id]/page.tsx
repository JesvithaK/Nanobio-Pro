"use client";

import React, { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  Terminal, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  BookOpen, 
  FileCode2, 
  Zap,
  ChevronLeft,
  CheckCircle2,
  XCircle
} from "lucide-react";
import Link from "next/link";

/**
 * STRICT INTERFACES
 */
interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  topic: string;
}

interface ModuleData {
  id: string;
  title: string;
  slug: string;
  content: string;
}

const SPRING = { type: "spring" as const, stiffness: 80, damping: 20 };

export default function QuizIDPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const id = params.id;
  const supabase = createClient();
  
  const [activeTab, setActiveTab] = useState<'lecture' | 'quiz'>('lecture');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // FEEDBACK STATES
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    async function initNode() {
      const { data: mod } = await supabase.from("modules").select("*").eq("slug", id).single();
      if (mod) {
        setModuleData(mod as ModuleData);
        const { data: qs } = await supabase.from("questions").select("*").eq("topic", mod.title).order("difficulty", { ascending: true });
        if (qs) setQuestions(qs as Question[]);
      }
      setLoading(false);
    }
    initNode();
  }, [supabase, id]);

  const handleVerify = () => {
    if (!selectedOption) return;
    setShowFeedback(true);
    
    if (selectedOption === questions[currentIndex].correct_answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correct_answer;

    // Log telemetry to DB
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("user_quiz_attempts").insert({
        user_id: user.id,
        question_id: currentQ.id,
        is_correct: isCorrect,
        selected_option: selectedOption,
      });
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      if (user && moduleData) {
        const finalPercent = Math.round((score / questions.length) * 100);
        await supabase.from("module_progress").upsert({
          user_id: user.id,
          module_id: moduleData.id,
          completed: finalPercent >= 70,
          last_score: finalPercent
        });
      }
      setIsFinished(true);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-indigo-500 uppercase tracking-widest text-[10px]">
      Linking_Core_Nodes...
    </div>
  );

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 selection:bg-indigo-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-size-[4rem_4rem] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      <main className="relative z-10 max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
             <Link href="/learn" className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-indigo-500 transition-colors text-slate-400">
               <ChevronLeft size={18} />
             </Link>
             <div>
               <div className="flex items-center gap-2 text-indigo-400 mb-1">
                 <Terminal size={14} />
                 <span className="text-[9px] font-mono uppercase tracking-[0.2em]">Zoology Research Module</span>
               </div>
               <h1 className="text-2xl font-bold uppercase tracking-tight">{moduleData?.title}</h1>
             </div>
          </div>

          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 backdrop-blur-md">
            <button onClick={() => { setActiveTab('lecture'); setShowFeedback(false); }} className={`px-4 py-2 rounded-lg text-[10px] font-mono font-bold transition-all ${activeTab === 'lecture' ? 'bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'text-slate-500 hover:text-slate-300'}`}>
              <BookOpen size={14} className="inline mr-2" /> DATA_STREAM
            </button>
            <button onClick={() => setActiveTab('quiz')} className={`px-4 py-2 rounded-lg text-[10px] font-mono font-bold transition-all ${activeTab === 'quiz' ? 'bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'text-slate-500 hover:text-slate-300'}`}>
              <FileCode2 size={14} className="inline mr-2" /> EVALUATION
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'lecture' ? (
            <motion.div key="lecture" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
              <div className="prose prose-invert max-w-none">
                <div className="flex items-center gap-3 mb-6 text-indigo-400">
                  <Zap size={20} />
                  <h2 className="text-lg font-bold uppercase tracking-tight m-0 text-white">Technical Protocol</h2>
                </div>
                <div className="text-slate-400 text-sm leading-relaxed space-y-6 mb-10 font-sans whitespace-pre-wrap">
                  {moduleData?.content}
                </div>
              </div>
              <button onClick={() => setActiveTab('quiz')} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold uppercase text-xs tracking-widest transition-all">
                Initiate Evaluation <ArrowRight size={16} />
              </button>
            </motion.div>
          ) : !isFinished ? (
            <motion.div key="quiz" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-10">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Question: {currentIndex + 1} / {questions.length}</span>
                <div className="flex gap-1.5">
                   {questions.map((_, idx) => (
                     <div key={idx} className={`h-1 w-6 rounded-full transition-all ${idx <= currentIndex ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}`} />
                   ))}
                </div>
              </div>

              {currentQ ? (
                <>
                  <h2 className="text-xl md:text-2xl font-bold mb-10 leading-snug">{currentQ.question}</h2>
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    {(['option_a', 'option_b', 'option_c', 'option_d'] as const).map((key) => {
                      const isCorrect = key === currentQ.correct_answer;
                      const isSelected = key === selectedOption;
                      
                      let btnStyles = "bg-slate-950/40 border-slate-800 hover:border-slate-700";
                      if (showFeedback) {
                        if (isCorrect) btnStyles = "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
                        else if (isSelected) btnStyles = "bg-red-500/10 border-red-500 text-red-400";
                        else btnStyles = "opacity-40 border-slate-900";
                      } else if (isSelected) {
                        btnStyles = "bg-indigo-500/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)]";
                      }

                      return (
                        <button
                          key={key}
                          disabled={showFeedback}
                          onClick={() => setSelectedOption(key)}
                          className={`group relative flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${btnStyles}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`font-mono text-[10px] uppercase ${isSelected ? "text-indigo-400" : "text-slate-600"}`}>
                              [{key.split('_')[1].toUpperCase()}]
                            </span>
                            <span className={`text-sm ${isSelected ? "text-white font-medium" : "text-slate-400"}`}>
                              {currentQ[key]}
                            </span>
                          </div>
                          {showFeedback && isCorrect && <CheckCircle2 className="text-emerald-500" size={18} />}
                          {showFeedback && isSelected && !isCorrect && <XCircle className="text-red-500" size={18} />}
                        </button>
                      );
                    })}
                  </div>
                  
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-10 p-5 bg-slate-950/50 border-l-2 border-indigo-500 rounded-r-xl">
                        <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-1">Zoological_Analysis:</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{currentQ.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : null}

              <div className="flex justify-end pt-6 border-t border-slate-800/60">
                {!showFeedback ? (
                  <button
                    disabled={!selectedOption}
                    onClick={handleVerify}
                    className="flex items-center gap-2 px-10 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.3)] font-bold uppercase text-[10px] tracking-[0.2em] transition-all disabled:opacity-50"
                  >
                    Verify Answer <Zap size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-10 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold uppercase text-[10px] tracking-[0.2em] transition-all"
                  >
                    {currentIndex === questions.length - 1 ? "Submit Results" : "Next Question"} <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 backdrop-blur-xl text-center">
              <Activity className="text-emerald-400 w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-3 uppercase tracking-tight text-white">Telemetry Complete</h2>
              <div className="max-w-xs mx-auto bg-slate-950/80 border border-slate-800 p-10 rounded-3xl mb-12 shadow-inner">
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                  {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%
                </div>
                <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Mastery: {score} / {questions.length} Nodes</p>
              </div>
              <Link href="/learn" className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold uppercase tracking-[0.2em] transition-all">
                Return to Matrix
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}