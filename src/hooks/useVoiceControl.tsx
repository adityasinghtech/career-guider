import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceCommand {
  pattern: RegExp | string[];  // "quiz shuru karo" ya ["start", "shuru"]
  action: () => void;
  description: string;         // Screen reader ke liye
}

export function useVoiceControl(commands: VoiceCommand[]) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  const commandsRef = useRef(commands);
  
  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  useEffect(() => {
    // Browser support check
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Voice Assistant: SpeechRecognition is not supported in this browser.');
      return;
    }
    console.info('Voice Assistant: SpeechRecognition supported.');
    setSupported(true);

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Hindi primary
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);

      // Command match karo using Ref
      commandsRef.current.forEach((cmd) => {
        if (Array.isArray(cmd.pattern)) {
          if (cmd.pattern.some((p) => text.includes(p))) cmd.action();
        } else {
          if (cmd.pattern.test(text)) cmd.action();
        }
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    console.info('Voice Assistant: Attempting to start listening...', { supported, hasRecognition: !!recognitionRef.current });
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Voice Assistant: Failed to start recognition', err);
      }
    }
  }, [supported]);

  const stopListening = useCallback(() => {
    console.info('Voice Assistant: Stopping listening...');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return { isListening, transcript, supported, startListening, stopListening };
}
