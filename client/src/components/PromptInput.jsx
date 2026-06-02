import React, { useState } from 'react';

export default function PromptInput({ onFormGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);

    try {
      // Updated to use the explicit IP address channel
      const response = await fetch('http://127.0.0.1:5000/api/ai/generate-layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 🔒 CRITICAL: Sends the saved user token from localStorage to satisfy requireAuth
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Network layout fetch failure');
      }

      const parsedLayout = await response.json();
      onFormGenerated(parsedLayout);
    } catch (error) {
      console.error('Error contacting generation engine:', error);
      alert('Failed to connect to the AI compilation service. Ensure your server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
          placeholder="e.g., Build a coffee shop survey tracking guest name, email, drop-down selection of their favorite beverage, and a multi-line field for feedback notes..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-medium py-2.5 px-4 rounded-lg text-sm transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
        ) : (
          "Generate Form Layout"
        )}
      </button>
    </form>
  );
}