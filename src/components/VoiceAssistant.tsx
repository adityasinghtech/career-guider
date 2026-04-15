import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Sparkles, X } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useVoiceControl } from "@/hooks/useVoiceControl";
import { useAccessibility } from "@/hooks/useAccessibility";

const VoiceAssistant = () => {
  const { mode } = useAccessibility();
  const { isSpeaking, stop: stopSpeaking, supported: ttsSupported } = useTextToSpeech();
  const [isVisible, setIsVisible] = useState(false);

  // Auto-show when voice mode is active
  useEffect(() => {
    if (mode === "voice" || mode === "blind") {
      setIsVisible(true);
    }
  }, [mode]);

  const { isListening, transcript, supported: sttSupported, startListening, stopListening } = useVoiceControl([
    { 
      pattern: ["assistant hide", "assistant chhupao", "band karo"], 
      action: () => setIsVisible(false),
      description: "Hide the voice assistant"
    },
    {
      pattern: ["stop reading", "shant ho jao", "chup"],
      action: () => stopSpeaking(),
      description: "Stop speaking"
    }
  ]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-24 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-card/95 backdrop-blur-md border-2 border-primary/20 rounded-2xl p-4 shadow-elevated w-72"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isListening ? "bg-red-500" : "bg-green-500"}`} />
            <h3 className="font-display font-bold text-sm">PathFinder Voice</h3>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-muted rounded-xl p-3 min-h-[60px] flex items-center justify-center text-center">
            {isListening ? (
              <p className="text-xs font-body italic text-foreground/80">"{transcript || "Suno..."}"</p>
            ) : isSpeaking ? (
              <div className="flex flex-col items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary animate-bounce" />
                <p className="text-[10px] font-display font-bold text-primary uppercase tracking-wider">AI bol raha hai...</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">"Aage", "Piche", ya "Skip" bolein</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-display font-bold text-xs transition-all ${
                isListening 
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/20" 
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? "Stop Sunna" : "Command Bolein"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 opacity-50">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-display font-semibold uppercase tracking-tighter">AI Enabled Guidance</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceAssistant;
