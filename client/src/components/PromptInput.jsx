import React, { useState } from 'react';
import { getApiUrl, getAuthHeaders } from '../utils/api';

export default function PromptInput({ onFormGenerated, onErrorCatch }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    onErrorCatch(''); // Clear any historic errors

    const token = localStorage.getItem('token');
    if (!token) {
      onErrorCatch('Login required to generate AI layouts. Please sign in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/ai/generate-layout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onErrorCatch('Session expired or invalid token. Please log in again.');
        window.location.reload();
        return;
      }

      if (!response.ok) {
        onErrorCatch(data.message || 'Generation pipeline failed.');
        return;
      }

      onFormGenerated(data);
      setPrompt('');
    } catch (err) {
      console.error('Network communication failure:', err);
      onErrorCatch('Could not link to server instance. Ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGenerate} className="space-y-4 bg-slate-900/30 p-5 border border-slate-900 rounded-2xl">
      <div className="flex flex-col gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Build an event RSVP questionnaire with name, meal preference select box, and a long textarea for allergy notes..."
          disabled={loading}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 min-h-[120px] transition-all resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-800/40 text-slate-950 disabled:text-teal-600/60 font-semibold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
        ) : (
          'Run Generation Engine'
        )}
      </button>
    </form>
  );
}