"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";
import { 
  ChevronLeft, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Activity,
  Binary
} from "lucide-react";

/**
 * STRICT INTERFACES
 */
interface Module {
  id: string;
  title: string;
  content: string;
  estimated_minutes: number;
  slug: string;
}

interface KeyTerm {
  id: string;
  term: string;
  definition: string;
}

export default function LectureReader() {
  const { slug } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [module, setModule] = useState<Module | null>(null);
  const [terms, setTerms] = useState<KeyTerm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLecture() {
      // 1. Fetch Module by Slug
      const { data: mod, error } = await supabase
        .from("modules")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !mod) {
        setLoading(false);
        return;
      }

      setModule(mod as Module);

      // 2. Fetch Key Terms linked to this Module
      const { data: termData } = await supabase
        .from("key_terms")
        .select("*")
        .eq("module_id", mod.id);
      
      setTerms((termData as KeyTerm[]) || []);
      setLoading(false);

      // 3. Update "Last Opened" status in background
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("module_progress").upsert({
          user_id: user.id,
          module_id: mod.id,
          last_opened: new Date().toISOString()
        });
      }
    }
    loadLecture();
  }, [slug, supabase]);

  const markComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !module) return;

    await supabase.from("module_progress").update({
      completed: true,
      progress: 100
    }).eq("user_id", user.id).eq("module_id", module.id);

    // Redirect to the dynamic Quiz associated with this module
    router.push(`/quiz/${module.id}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono">
      <div className="text-indigo-500 animate-pulse uppercase tracking-[0.3em]">Downloading_Neural_Lecture...</div>
    </div>
  );
  
  if (!module) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-20 text-red-500 font-mono text-center">
      ERROR_404: MODULE_NOT_IN_DATABASE
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <button 
          onClick={() => router.push("/learn")} 
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-all uppercase text-[10px] font-mono tracking-widest group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return_to_Curriculum
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <main className="lg:col-span-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight leading-tight">
              {module.title}
            </h1>
            
            <div className="flex gap-4 mb-10 text-[10px] font-mono text-slate-500 border-b border-slate-900 pb-6 uppercase">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {module.estimated_minutes}M_READ</span>
              <span className="flex items-center gap-1.5 text-indigo-400"><Activity className="w-3.5 h-3.5" /> Researcher_Authorized</span>
              <span className="hidden md:flex items-center gap-1.5"><Binary className="w-3.5 h-3.5" /> Sync_Stable</span>
            </div>

            <article className="prose prose-invert prose-indigo max-w-none 
              prose-p:leading-relaxed prose-p:text-lg prose-p:text-slate-400
              prose-headings:text-white prose-strong:text-indigo-400
              prose-code:text-indigo-300 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:rounded">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{module.content}</ReactMarkdown>
            </article>

            <button 
              onClick={markComplete}
              className="mt-16 w-full py-5 bg-indigo-600 hover:bg-emerald-600 text-white rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              Verify Mastery & Initialize Quiz <CheckCircle2 className="w-4 h-4" />
            </button>
          </main>

          <aside className="lg:col-span-4">
             <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sticky top-10 backdrop-blur-xl">
                <h3 className="text-[10px] font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-[0.3em]">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Nomenclature
                </h3>
                <div className="space-y-8">
                  {terms.map((t) => (
                    <div key={t.id} className="group">
                      <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-tighter mb-2">{t.term}</p>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">{t.definition}</p>
                    </div>
                  ))}
                  {terms.length === 0 && (
                    <p className="text-[10px] font-mono text-slate-600 uppercase">No_Terms_Defined_For_Node</p>
                  )}
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}