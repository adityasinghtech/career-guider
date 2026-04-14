import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentInsight {
  summary: string;
  concern: string;
  action: string;
  suggestedPath: string;
}

interface SmartInsightButtonProps {
  studentId: string;
}

export const SmartInsightButton = ({ studentId }: SmartInsightButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<StudentInsight | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-student-insight', {
        body: { studentId },
      });

      if (functionError) throw functionError;
      setInsight(data);
      toast.success("AI Insight taiyar hai! ✨");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Insight generate karne mein dikkat aayi");
      toast.error("Insight generate nahi ho paaya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={generateInsight}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-display font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {loading ? "Analyzing..." : "Get AI Smart Insight"}
        </button>
        
        {insight && (
          <button 
            onClick={() => setInsight(null)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-display"
          >
            Hide
          </button>
        )}
      </div>

      <AnimatePresence>
        {insight && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-card border-2 border-primary/20 shadow-lg relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full -mr-16 -mt-16 pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1.5 rounded-lg bg-primary/10">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-1">Situation Summary</h4>
                  <p className="text-sm font-body text-foreground leading-relaxed">
                    {insight.summary}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <h4 className="text-[10px] font-display font-bold text-amber-600 uppercase tracking-wider mb-1">⚠️ Top Concern</h4>
                  <p className="text-sm font-body text-amber-700 dark:text-amber-400">
                    {insight.concern}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <h4 className="text-[10px] font-display font-bold text-violet-600 uppercase tracking-wider mb-1">🎯 Suggested Path</h4>
                  <p className="text-sm font-body text-violet-700 dark:text-violet-400">
                    {insight.suggestedPath}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[10px] font-display font-bold text-green-600 uppercase tracking-wider mb-1">🚀 Recommended next action</h4>
                  <p className="text-sm font-body text-green-700 dark:text-green-400">
                    {insight.action}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-destructive mt-2 font-display bg-destructive/10 p-2 rounded-lg border border-destructive/20"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
