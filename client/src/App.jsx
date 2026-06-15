import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import PromptInput from './components/PromptInput';
import FormRenderer from './components/FormRenderer';
import FormHistory from './components/FormHistory';
import HistoryPage from './components/HistoryPage';
import LandingPage from './components/LandingPage';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [generatedForm, setGeneratedForm] = useState(null);
  const [formHistory, setFormHistory] = useState([]);
  const [upgradeMessage, setUpgradeMessage] = useState('');
  
  // Controls routing states: 'landing', 'auth', 'dashboard', or 'history'
  const [view, setView] = useState(token ? 'dashboard' : 'landing');

  // Dark/Light Mode Switcher Logic
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Apply theme to DOM and localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Listen for system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
      return () => mediaQuery.removeListener(handleSystemThemeChange);
    }
  }, []);

  // Sync theme across browser tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        const newTheme = e.newValue;
        if (newTheme === 'dark') {
          setDarkMode(true);
        } else if (newTheme === 'light') {
          setDarkMode(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchCurrentUser = async () => {
    if (!token) return;

    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      console.error('Error refreshing user profile:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' && token) {
      fetchCurrentUser();
      setUpgradeMessage('Premium successfully unlocked! Restart your workflow to enjoy unlimited forms.');
    }
  }, [token]);

  const fetchSavedForms = async () => {
    if (!token) return;

    try {
      const response = await fetch('http://127.0.0.1:5000/api/forms', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        console.error('Failed to load form history', response.statusText);
        return;
      }

      const data = await response.json();
      setFormHistory(data);
    } catch (err) {
      console.error('Error fetching saved forms:', err);
    }
  };

  useEffect(() => {
    fetchSavedForms();
  }, [token]);

  const handleFormSelected = (form) => {
    setGeneratedForm(form);
  };

  const handleFormGenerated = (layout) => {
    setGeneratedForm(layout);
    setFormHistory((prev) => [layout, ...prev.filter((f) => f._id !== layout._id)]);
  };

  const handleDeleteForm = async (formId) => {
    if (!token) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/forms/${formId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const err = await response.json();
        console.error('Delete failed', err);
        return;
      }

      setFormHistory((prev) => prev.filter((form) => form._id !== formId));
      if (generatedForm?._id === formId) {
        setGeneratedForm(null);
      }
    } catch (err) {
      console.error('Error deleting saved form:', err);
    }
  };

  const handleHistoryBack = () => {
    setView('dashboard');
  };

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

  if (view === 'history') {
    return (
      <HistoryPage
        forms={formHistory}
        activeForm={generatedForm}
        onSelect={handleFormSelected}
        onDelete={handleDeleteForm}
        onBack={handleHistoryBack}
        themeMode={darkMode ? 'dark' : 'light'}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
      />
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
            <button
              onClick={() => setView('history')}
              className="p-2 text-sm rounded-lg bg-slate-200/60 dark:bg-slate-900 border border-slate-300 dark:border-slate-800"
            >
              📁 History
            </button>
            <button 
              onClick={() => setDarkMode((prev) => !prev)}
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

        <main className="max-w-5xl mx-auto space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-8 items-start">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-slate-700 dark:text-slate-200">AI Blueprint Engine</h2>
              <PromptInput onFormGenerated={handleFormGenerated} onErrorCatch={(msg) => setUpgradeMessage(msg)} />
            </div>

            <div className="space-y-4">
              <FormHistory forms={formHistory} activeFormId={generatedForm?._id} onSelect={handleFormSelected} onDelete={handleDeleteForm} />
            </div>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-medium text-slate-700 dark:text-slate-200">Live Dynamic View</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Rendered from your selected or latest saved layout</span>
            </div>
            {generatedForm ? (
              <FormRenderer layout={generatedForm} />
            ) : (
              <div className="border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-sm h-72 rounded-xl flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/20">
                No saved layout selected. Use the AI engine to generate one, or choose from your history.
              </div>
            )}
          </section>
        </main>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-900 py-6 text-center text-xs text-slate-400">
        DeltaForms Engine Hub • Created with EchoForms Architecture
      </footer>
    </div>
  );
}