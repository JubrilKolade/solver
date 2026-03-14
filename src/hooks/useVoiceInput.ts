import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for voice input - convert speech to text
 * Uses Web Speech API for math problem recognition
 */

interface VoiceInputOptions {
  language?: string;
  continuous?: boolean;
}

export function useVoiceInput(options: VoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Voice input not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = options.continuous || false;
    recognition.interimResults = true;
    recognition.language = options.language || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          setFinalTranscript((prev) => prev + transcript + ' ');
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript);
    };

    recognition.onerror = (event) => {
      setError(`Voice recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [options]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setFinalTranscript('');
      setTranscript('');
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const reset = useCallback(() => {
    setTranscript('');
    setFinalTranscript('');
    setError(null);
  }, []);

  const fullText = `${finalTranscript}${transcript}`.trim();

  return {
    isListening,
    transcript: fullText,
    finalTranscript,
    error,
    startListening,
    stopListening,
    reset,
    isSupported: !!recognitionRef.current,
  };
}

/**
 * Post-process voice input to normalize math expressions
 * e.g., "x squared plus 3" -> "x^2 + 3"
 */
export function normalizeVoiceInput(text: string): string {
  let result = text.toLowerCase();

  // Common speech patterns to math
  const replacements: Record<string, string> = {
    'squared': '^2',
    'cubed': '^3',
    'to the power of': '^',
    'divided by': '/',
    'times': '*',
    'multiplied by': '*',
    'minus': '-',
    'plus': '+',
    'equals': '=',
    'pi': 'pi',
    'e to the': 'e^',
    'square root': 'sqrt',
    'sine': 'sin',
    'cosine': 'cos',
    'tangent': 'tan',
    'log': 'log',
    'natural log': 'ln',
    'derivative': "d/dx",
    'integral': '∫',
  };

  // Replace words with math symbols
  for (const [word, symbol] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, symbol);
  }

  // Clean up multiple spaces
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}
