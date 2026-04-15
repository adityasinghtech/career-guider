import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility, Volume2, Eye, User, Settings2 } from "lucide-react";
import { useAccessibility, A11yMode } from "@/hooks/useAccessibility";

const AccessibilityButton = () => {
  const { mode, setMode } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const modes: { id: A11yMode; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
    { 
      id: "normal", 
      label: "Normal", 
      icon: <User className="w-4 h-4" />, 
      desc: "Standard interface",
      color: "bg-blue-500"
    },
    { 
      id: "voice", 
      label: "Voice", 
      icon: <Volume2 className="w-4 h-4" />, 
      desc: "Voice commands active",
      color: "bg-purple-500" 
    },
    { 
      id: "blind", 
      label: "Blind", 
      icon: <Eye className="w-4 h-4" />, 
      desc: "Auto-speak + Commands",
      color: "bg-green-500" 
    },
  ];

  const currentMode = modes.find((m) => m.id === mode) || modes[0];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 left-0 bg-card border-2 border-border rounded-2xl p-2 shadow-elevated w-56 flex flex-col gap-1 mb-2"
          >
            <div className="px-3 py-2 border-b border-border/50 mb-1">
              <h3 className="font-display font-bold text-sm">A11y Settings</h3>
              <p className="text-[10px] text-muted-foreground">Choose your experience</p>
            </div>
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left hover:bg-muted group ${
                  mode === m.id ? "bg-primary/10 border-primary" : "border-transparent"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${m.color}`}>
                  {m.icon}
                </div>
                <div>
                  <p className="font-display font-bold text-xs">{m.label}</p>
                  <p className="text-[9px] text-muted-foreground group-hover:text-foreground/70">{m.desc}</p>
                </div>
                {mode === m.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full gradient-hero shadow-elevated flex items-center justify-center group relative overflow-hidden"
        aria-label="Accessibility settings"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {isOpen ? <Settings2 className="w-6 h-6 text-primary-foreground" /> : <Accessibility className="w-6 h-6 text-primary-foreground" />}
        </motion.div>
        
        {/* Active Mode Indicator */}
        <span className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4 ${currentMode.color}`} />
      </motion.button>
    </div>
  );
};

export default AccessibilityButton;
