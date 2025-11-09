import React from 'react';

export default function MicControl({ isListening, toggle, detectedLang, micLevel }) {
  return (
    <div className="mic-section">
      <div className="detected-lang">
        🎯 Detected: <strong>{detectedLang}</strong>
      </div>

      <button onClick={toggle} className={`mic-btn ${isListening ? 'listening' : ''}`}>
        {isListening ? '⏹️ Stop' : '🎤 Start'}
      </button>

      <div className="wave-container">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="wave" style={{ 
            height: `${Math.max(micLevel / 4 + 10, 15)}px`,
            animationDelay: `${i * 0.08}s`
          }} />
        ))}
      </div>

      <p className="status">
        {isListening ? '🔴 Listening...' : 'Ready • Auto Detection'}
      </p>
    </div>
  );
}