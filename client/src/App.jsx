import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import PromptInput from './components/PromptInput';
import FormRenderer from './components/FormRenderer';
import LandingPage from './components/LandingPage'; // Ensure you create this file!

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [generatedForm, setGeneratedForm] = useState(null);
  const [upgradeMessage, setUpgradeMessage] = useState('');
  
  // Controls routing states: 'landing', 'auth', or 'dashboard'
  const [view, setView] = useState(token ? 'dashboard' : 'landing');

  // Dark/Light Mode Switcher Logic
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleUpgrade = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url; 
    } catch (err) {
      console.error("Payment routing failure", err);
    }
  };

  const handleAuthSuccess = (t, u) => {
    setToken(t);
    setUser(u);
    setView('dashboard');
  };

  // 1️⃣ VIEW: LANDING PAGE (SaaS Marketing Hub)
  if (view === 'landing' && !token) {
    return (
      <LandingPage 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onNavigateToAuth={() => setView('auth')} 
      />
    );
  }

  // 2️⃣ VIEW: AUTHENTICATION INTERFACE (Login / Registration Portal)
  if (view === 'auth' && !token) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
        <button 
          onClick={() => setView('landing')} 
          className="absolute top-6 left-6 text-sm text-indigo-600 dark:text-teal-400 hover:underline font-semibold"
        >
          ← Back to Main Page
        </button>
        <Auth onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  // 3️⃣ VIEW: DELTAFORMS WORKSPACE DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-300">
      <div className="p-6 flex-grow">
        <header className="max-w-5xl mx-auto flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
          <div>
            <h1 className="text-xl font-bold text-indigo-600 dark:text-teal-400">DeltaForms Terminal</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Status: {user?.isPremium ? '💎 Premium Account' : '🌱 Free Tier'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Quick-switch layout theme inside workspace */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-sm rounded-lg bg-slate-200/60 dark:bg-slate-900 border border-slate-300 dark:border-slate-800"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }} 
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 dark:border-red-500/30 text-xs px-3 py-1.5 rounded-lg transition-all font-medium"
            >
              Logout Session
            </button>
          </div>
        </header>

        {upgradeMessage && (
          <div className="max-w-5xl mx-auto bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-center mb-6">
            <p className="text-amber-600 dark:text-amber-400 text-sm mb-2">{upgradeMessage}</p>
            <button onClick={handleUpgrade} className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-all shadow">
              Upgrade to Premium ($19)
            </button>
          </div>
        )}

        <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-slate-700 dark:text-slate-200">AI Blueprint Engine</h2>
            <PromptInput onFormGenerated={(layout) => setGeneratedForm(layout)} onErrorCatch={(msg) => setUpgradeMessage(msg)} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-slate-700 dark:text-slate-200">Live Dynamic View</h2>
            {generatedForm ? <FormRenderer layout={generatedForm} /> : (
              <div className="border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-sm h-64 rounded-xl flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/20">
                Your generated questionnaire canvas will appear here...
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-900 py-6 text-center text-xs text-slate-400">
        DeltaForms Engine Hub • Created with EchoForms Architecture
      </footer>
    </div>
  );
}