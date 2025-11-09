import React from 'react';

export default function ActionButtons({ transcript, clear }) {
  const copy = () => {
    navigator.clipboard.writeText(transcript);
    alert('Copied!');
  };

  const downloadTxt = () => {
    const a = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = 'pelocal-transcript.txt';
    a.click();
  };

  return (
    <div className="actions">
      <button onClick={clear} className="btn clear">🗑️ Clear</button>
      <button onClick={copy} className="btn copy" disabled={!transcript}>📋 Copy</button>
      <button onClick={downloadTxt} className="btn txt" disabled={!transcript}>📄 TXT</button>
    </div>
  );
}