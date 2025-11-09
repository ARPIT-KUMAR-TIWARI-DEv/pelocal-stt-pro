import React from 'react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import Header from './components/Header';
import MicControl from './components/MicControl';
import TranscriptDisplay from './components/TranscriptDisplay';
import ActionButtons from './components/ActionButtons';
import './App.css';

function App() {
  const {
    transcript,
    interimTranscript,
    isListening,
    confidence,
    error,
    micLevel,
    detectedLang,
    toggle,
    clear
  } = useSpeechRecognition();

  return (
    <div className="app">
      <div className="card">
        <Header />
        {error && <div className="error">{error}</div>}
        <MicControl 
          isListening={isListening} 
          toggle={toggle} 
          detectedLang={detectedLang} 
          micLevel={micLevel} 
        />
        <TranscriptDisplay 
          transcript={transcript} 
          interim={interimTranscript} 
          confidence={confidence} 
        />
        <ActionButtons transcript={transcript} clear={clear} />
      </div>
    </div>
  );
}

export default App;