"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";
import { 
  ChevronLeft, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Activity,
  Terminal,
  Zap,
  ArrowRight
} from "lucide-react";

interface Module {
  id: string;
  title: string;
  content: string;
  estimated_minutes: number;
  difficulty: number;
  slug: string;
}

interface KeyTerm {
  id: string;
  term: string;
  definition: string;
}

export default function LecturePage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const supabase = createClient();

  const [module, setModule] = useState<Module | null>(null);
  const [terms, setTerms] = useState<KeyTerm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 1. Fetch Module
      const { data: mod } = await supabase
        .from("modules")
        .select("*")
        .eq("slug", params.slug)
        .single();

      if (mod) {
        setModule(mod as Module);
        // 2. Fetch Sidebar Terms
        const { data: termData } = await supabase
          .from("key_terms")
          .select("*")
          .eq("module_id", mod.id);
        setTerms(termData || []);
      }
      setLoading(false);
    }
    loadData();
  }, [params.slug, supabase]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-[10px] text-indigo-500 uppercase tracking-widest">
      Neural_Link_Establishing...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10 bg-[size:4rem_4rem] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        {/* Navigation */}
        <button 
          onClick={() => router.push("/learn")} 
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-all uppercase text-[10px] font-mono tracking-widest group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return_to_Matrix
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Lecture Content */}
          <main className="lg:col-span-8">
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.3em]">Lecture_Node_Active</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                {module?.title}
              </h1>
              <div className="flex gap-6 text-[10px] font-mono text-slate-500 uppercase border-b border-slate-900 pb-6">
                <span className="flex items-center gap-2"><Clock size={14} /> {module?.estimated_minutes}M_Reading</span>
                <span className="flex items-center gap-2"><Activity size={14} /> Complexity_LVL_{module?.difficulty}</span>
              </div>
            </header>

            <article className="prose prose-invert prose-indigo max-w-none prose-p:text-slate-400 prose-p:leading-relaxed prose-headings:text-white prose-strong:text-indigo-400">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{module?.content || ""}</ReactMarkdown>
              
              {/* Contextual Visual Aids */}
              <div className="my-12">
                {params.slug === 'atomic-layer-deposition' && (
                  <div className="border border-slate-800 rounded-3xl overflow-hidden bg-slate-950 p-6">
                    
                    <p className="text-[10px] font-mono text-slate-600 mt-4 text-center uppercase tracking-widest font-bold">Fig 1.1: Sequential Precursor Pulse Mechanism</p>
                  </div>
                )}
                {params.slug === 'dendrimer-carriers' && (
                  <div className="border border-slate-800 rounded-3xl overflow-hidden bg-slate-950 p-6">
                    
                    <p className="text-[10px] font-mono text-slate-600 mt-4 text-center uppercase tracking-widest font-bold">Fig 2.1: Polymeric Branching Generations</p>
                  </div>
                )}
              </div>
            </article>

            {/* Verification Button - Leads to Quiz */}
            <button 
              onClick={() => router.push(`/quiz/${params.slug}`)}
              className="mt-12 w-full py-6 bg-indigo-600 hover:bg-emerald-600 text-white rounded-2xl font-bold uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 group"
            >
              Verify Mastery & Open Quiz <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </main>

          {/* Nomenclature Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sticky top-10 backdrop-blur-xl">
              <h3 className="text-[10px] font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-[0.3em]">
                <Terminal className="w-4 h-4 text-indigo-400" /> Nomenclature_DB
              </h3>
              <div className="space-y-8">
                {terms.map((t) => (
                  <div key={t.id} className="group">
                    <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase mb-2 group-hover:text-white transition-colors">{t.term}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{t.definition}</p>
                  </div>
                ))}
                {terms.length === 0 && (
                  <p className="text-[10px] font-mono text-slate-600 uppercase">No_Terms_Available</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .bg-size-\\[4rem_4rem\\] { background-size: 4rem 4rem; }
      `}</style>
    </div>
  );
}