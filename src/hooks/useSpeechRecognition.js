// src/hooks/useSpeechRecognition.js
import { useEffect, useRef, useState, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState('');
  const [micLevel, setMicLevel] = useState(0);
  const [detectedLang, setDetectedLang] = useState('Auto Detecting...');
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const timeoutRef = useRef(null);
  const interimTimeout = useRef(null);

  const langNames = {
    'en-IN': 'English (India)', 'hi-IN': 'हिंदी', 'bn-IN': 'বাংলা', 'ta-IN': 'தமிழ்',
    'te-IN': 'తెలుగు', 'mr-IN': 'मराठी', 'gu-IN': 'ગુજરાતી', 'pa-IN': 'ਪੰਜాబੀ', 'en-US': 'English (US)'
  };

  const detectLanguage = (text) => {
    if (!text) return 'en-IN';
    if (/[\u0900-\u097f]/.test(text)) return 'hi-IN';
    if (/[\u0980-\u09ff]/.test(text)) return 'bn-IN';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
    if (/[\u0900-\u097f]/.test(text)) return 'mr-IN';
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN';
    if (/[\u0A00-\u0A7F]/.test(text)) return 'pa-IN';
    return 'en-IN';
  };

  const startMicVisualizer = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true
        } 
      });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      await audioContextRef.current.resume();

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024; // Better sensitivity

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 2; // Louder mic
      source.connect(gainNode);
      gainNode.connect(analyserRef.current);

      const loop = () => {
        if (!isListening || !analyserRef.current) return;
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b) / data.length;
        setMicLevel(avg / 2.55);
        requestAnimationFrame(loop);
      };
      loop();
    } catch (err) {
      setError('🚫 Mic blocked! Click Allow');
      console.error('Mic error:', err);
    }
  }, [isListening]);

  const stopMicVisualizer = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setMicLevel(0);
  }, []);

  const startRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = 'en-IN';
      try {
        recognitionRef.current.start();
        console.log('Recognition started');
      } catch (e) {
        console.log('Already started');
      }
    }
  };

  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setError('Use Chrome/Edge');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const rec = recognitionRef.current;

    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 10; // More alternatives = better detection

    rec.onstart = () => {
      setIsListening(true);
      setError('');
      setDetectedLang('Listening...');
      new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3').play().catch(() => {});
      console.log('🎤 Listening started');
    };

    rec.onresult = (event) => {
      console.log('Result received', event.results);

      let finalText = '';
      let interimText = '';
      let latestText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptPart = result[0].transcript;
        latestText = transcriptPart;

        if (result.isFinal) {
          finalText += transcriptPart + ' ';
        } else {
          interimText = transcriptPart;
        }
      }

      // INSTANT DETECTION ON EVERY WORD
      if (latestText) {
        const detected = detectLanguage(latestText);
        rec.lang = detected;
        setDetectedLang(langNames[detected] || detected);
        console.log('Detected:', langNames[detected]);
      }

      // LIVE INTERIM EVERY 500MS
      clearTimeout(interimTimeout.current);
      setInterimTranscript(interimText);
      interimTimeout.current = setTimeout(() => {
        if (interimText && isListening) {
          setTranscript(prev => prev + interimText + ' ');
          setInterimTranscript('');
          console.log('Forced final:', interimText);
        }
      }, 800);

      if (finalText) {
        setTranscript(prev => prev + finalText);
        setInterimTranscript('');
        setConfidence(0.95);
      }
    };

    rec.onerror = (e) => {
      console.error('Error:', e.error);
      setError(`Error: ${e.error}`);
      timeoutRef.current = setTimeout(() => isListening && startRecognition(), 500);
    };

    rec.onend = () => {
      console.log('Recognition ended');
      setIsListening(false);
      stopMicVisualizer();
      if (isListening) {
        timeoutRef.current = setTimeout(startRecognition, 100);
      }
    };

    return () => {
      rec.abort();
      clearTimeout(timeoutRef.current);
      clearTimeout(interimTimeout.current);
      stopMicVisualizer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, startMicVisualizer, stopMicVisualizer]);

  const toggle = async () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      setError('');
      setDetectedLang('Starting...');
      await startMicVisualizer();
      startRecognition();
    }
  };

  const clear = () => {
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);
  };

  return { 
    transcript, 
    interimTranscript, 
    isListening, 
    confidence, 
    error, 
    micLevel, 
    detectedLang,
    toggle, 
    clear 
  };
};