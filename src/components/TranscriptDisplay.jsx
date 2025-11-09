import React from 'react';

export default function TranscriptDisplay({ transcript, interim, confidence }) {
  const words = transcript.trim().split(/\s+/).filter(w => w).length;

  return (
    <div className="transcript-box">
      <div className="stats">
        Words: {words} | Confidence: {(confidence * 100).toFixed(0)}%
      </div>
      <p className="text">
        {transcript || 'Start speaking in any language...'}
        <span className="interim"> {interim}</span>
      </p>
    </div>
  );
}