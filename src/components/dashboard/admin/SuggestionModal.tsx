import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface SuggestionModalProps {
  sendingTo: { studentId: string; resultId?: string } | null;
  setSendingTo: (val: { studentId: string; resultId?: string } | null) => void;
  suggestionText: string;
  setSuggestionText: (val: string) => void;
  sendSuggestion: () => void;
}

const SuggestionModal = ({
  sendingTo,
  setSendingTo,
  suggestionText,
  setSuggestionText,
  sendSuggestion,
}: SuggestionModalProps) => {
  if (!sendingTo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSendingTo(null)}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-2 border-border rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" /> Suggestion Bhejein
        </h3>
        <textarea
          placeholder="Apna suggestion yahan likhein..."
          value={suggestionText}
          onChange={(e) => setSuggestionText(e.target.value)}
          className="w-full p-3 rounded-xl border-2 border-border bg-background font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors text-sm min-h-[120px] resize-none"
          maxLength={1000}
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setSendingTo(null)}
            className="font-display font-semibold text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={sendSuggestion}
            disabled={!suggestionText.trim()}
            className="font-display font-semibold text-sm px-4 py-2 rounded-lg gradient-hero text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            Bhejein ✈️
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuggestionModal;

