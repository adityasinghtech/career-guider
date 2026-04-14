import React from 'react';
import { AlertTriangle, MessageSquareOff, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface PriorityBadgeProps {
  unrepliedCount: number;
  hasLowScore: boolean;
  hasNoSuggestions: boolean;
}

export const PriorityBadge = ({ unrepliedCount, hasLowScore, hasNoSuggestions }: PriorityBadgeProps) => {
  if (unrepliedCount < 3 && !(hasLowScore && hasNoSuggestions)) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {unrepliedCount >= 3 && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-display font-bold bg-destructive/15 text-destructive border border-destructive/30 uppercase tracking-tighter"
        >
          <MessageSquareOff className="w-2.5 h-2.5" /> High Priority: {unrepliedCount} Messages
        </motion.span>
      )}
      
      {hasLowScore && hasNoSuggestions && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-display font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 uppercase tracking-tighter"
        >
          <TrendingDown className="w-2.5 h-2.5" /> Attention needed: Low Score
        </motion.span>
      )}
    </div>
  );
};
