import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, X, HelpCircle } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceControl } from '@/hooks/useVoiceControl';

const HELP_TEXT =
  'Main aapki madad kar sakta hoon. Boliye: ' +
  'Quiz shuru karo, ' +
  'Home jao, ' +
  'Dashboard dekho, ' +
  'Career compare karo, ' +
  'ya Learning resources dekho.';

const COMMANDS_GUIDE = [
  { phrase: '"Quiz shuru"', action: 'Quiz pe jao' },
  { phrase: '"Ghar" / "Home"', action: 'Home page' },
  { phrase: '"Dashboard"', action: 'Dashboard' },
  { phrase: '"Career compare"', action: 'Career comparison' },
  { phrase: '"Seekhna hai" / "Learning"', action: 'Learning resources' },
  { phrase: '"Madad" / "Help"', action: 'Help sunao' },
];

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const { speak, stop, isSpeaking, supported: ttsSupported } = useTextToSpeech();

  const handleNavigate = useCallback(
    (path: string, announcement: string) => {
      setLastCommand(announcement);
      setIsOpen(false);
      if (ttsSupported) speak(announcement);
      navigate(path);
    },
    [navigate, speak, ttsSupported]
  );

  const handleHelp = useCallback(() => {
    const text = HELP_TEXT;
    setLastCommand(text);
    speak(text);
  }, [speak]);

  const { isListening, transcript, startListening, stopListening, supported: voiceSupported } =
    useVoiceControl([
      {
        pattern: ['quiz shuru', 'quiz start', 'quiz'],
        action: () => handleNavigate('/quiz', 'Quiz shuru ho raha hai!'),
        description: 'Quiz pe jao',
      },
      {
        pattern: ['ghar', 'home', 'wapas jao', 'main page'],
        action: () => handleNavigate('/', 'Home page pe aa gaye.'),
        description: 'Home page pe jao',
      },
      {
        pattern: ['dashboard', 'mera page', 'meri profile'],
        action: () => handleNavigate('/dashboard', 'Dashboard khul raha hai.'),
        description: 'Dashboard pe jao',
      },
      {
        pattern: ['career compare', 'compare karo', 'tulna'],
        action: () => handleNavigate('/career-comparison', 'Career comparison page.'),
        description: 'Career comparison page',
      },
      {
        pattern: ['seekhna hai', 'learning', 'resources', 'padhna'],
        action: () => handleNavigate('/learning', 'Learning resources page.'),
        description: 'Learning resources',
      },
      {
        pattern: ['deep analysis', 'analysis', 'gehri jaanch'],
        action: () => handleNavigate('/deep-analysis', 'Deep analysis page.'),
        description: 'Deep analysis pe jao',
      },
      {
        pattern: ['contact', 'message', 'sampark'],
        action: () => handleNavigate('/contact', 'Contact page.'),
        description: 'Contact page pe jao',
      },
      {
        pattern: ['madad chahiye', 'madad', 'help', 'kya karu'],
        action: handleHelp,
        description: 'Help sunao',
      },
    ]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if user is typing
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

      // Escape — close
      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      if (e.altKey) {
        const isV = e.key.toLowerCase() === 'v' || e.code === 'KeyV';
        
        if (isV) {
          e.preventDefault();
          e.stopPropagation();
          console.info('Voice Assistant: Alt+V detected', { isListening });
          
          if (isListening) {
            stopListening();
          } else {
            startListening();
            setIsOpen(true);
          }
        }
        // Alt + H — help
        if (e.key === 'h') {
          e.preventDefault();
          handleHelp();
        }
        // Alt + S — stop
        if (e.key === 's') {
          e.preventDefault();
          stop();
          setLastCommand('Stop kiya gaya.');
        }
        // Alt + R — repeat
        if (e.key === 'r') {
          e.preventDefault();
          if (lastCommand) speak(lastCommand);
          else speak('Maaf kijiye, repeat karne ke liye kuch nahi hai.');
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, startListening, stopListening, handleHelp, lastCommand]);

  // Clear lastCommand after 3 seconds
  useEffect(() => {
    if (!lastCommand) return;
    const timer = setTimeout(() => setLastCommand(''), 3000);
    return () => clearTimeout(timer);
  }, [lastCommand]);

  if (!voiceSupported && !ttsSupported) return null;

  return (
    <>
      {/* Tooltip / Command panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Voice Assistant Commands"
          aria-modal="false"
          className="fixed bottom-40 right-4 z-50 w-72 rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-2"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-sm text-foreground">
                Voice Assistant
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Panel band karo"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs font-body ${
              isListening
                ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                : isSpeaking
                ? 'bg-primary/10 text-primary border border-primary/30'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5 animate-pulse" />
                <span>Sun raha hoon... Boliye!</span>
              </>
            ) : isSpeaking ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>Bol raha hoon...</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>
                  <kbd className="px-1 py-0.5 bg-muted-foreground/20 rounded text-[10px]">Alt+V</kbd>{' '}
                  dabao ya neeche click karo
                </span>
              </>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <p className="text-xs text-muted-foreground font-body italic mb-3 px-1">
              Suna: "{transcript}"
            </p>
          )}

          {/* Last command feedback */}
          {lastCommand && (
            <p className="text-xs text-primary font-body font-medium mb-3 px-1">
              <span aria-hidden="true">✓</span> {lastCommand}
            </p>
          )}

          {/* Commands guide */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-display font-semibold mb-2 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Available Commands
            </p>
            {COMMANDS_GUIDE.map((cmd) => (
              <div key={cmd.phrase} className="flex items-center justify-between text-xs font-body">
                <span className="text-primary font-mono">{cmd.phrase}</span>
                <span className="text-muted-foreground">{cmd.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => {
          if (isListening) {
            stopListening();
          } else {
            setIsOpen((prev) => !prev);
            if (!isOpen) startListening();
          }
        }}
        aria-label={
          isListening
            ? 'Sun raha hoon — band karne ke liye click karo'
            : 'Voice assistant kholo — Alt+V ya click karo'
        }
        aria-pressed={isListening}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title="Voice Assistant (Alt+V)"
        className={`fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg font-display font-semibold text-sm border-2 transition-all duration-200 select-none ${
          isListening
            ? 'bg-red-500 border-red-400 text-white shadow-red-500/30 shadow-xl scale-105 animate-pulse'
            : isSpeaking
            ? 'bg-primary border-primary/50 text-primary-foreground shadow-primary/30'
            : 'bg-card border-border text-foreground hover:border-primary/60 hover:shadow-primary/10 hover:scale-105'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4" />
            <span className="hidden sm:inline">Sun raha hoon...</span>
          </>
        ) : isSpeaking ? (
          <>
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Bol raha hoon...</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Voice</span>
          </>
        )}
      </button>
    </>
  );
}
