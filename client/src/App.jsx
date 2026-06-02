import React, { useState } from 'react';
import Auth from './components/Auth';
import PromptInput from './components/PromptInput';
import FormRenderer from './components/FormRenderer';
import Footer from './components/Footer'; // <-- Import the footer

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [generatedForm, setGeneratedForm] = useState(null);
  const [upgradeMessage, setUpgradeMessage] = useState('');

  const handleUpgrade = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url; // Redirects smoothly to secure Stripe billing
    } catch (err) {
      console.error("Payment routing failure", err);
    }
  };

  if (!token) return <Auth onAuthSuccess={(t, u) => { setToken(t); setUser(u); }} />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <div className="p-6 flex-grow">
        <header className="max-w-5xl mx-auto flex justify-between items-center border-b border-slate-800 pb-4 mb-8">
          <div>
            <h1 className="text-xl font-bold text-teal-400">DeltaForms Terminal</h1>
            <p className="text-xs text-slate-400">Status: {user?.isPremium ? '💎 Premium Account' : '🌱 Free Tier'}</p>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3 py-1.5 rounded-lg transition-all">
            Logout Session
          </button>
        </header>

        {upgradeMessage && (
          <div className="max-w-5xl mx-auto bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-center mb-6">
            <p className="text-amber-400 text-sm mb-2">{upgradeMessage}</p>
            <button onClick={handleUpgrade} className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-all">
              Upgrade to Premium ($19)
            </button>
          </div>
        )}

        <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-slate-200">AI Blueprint Engine</h2>
            {/* Catch premium limitation rejections here */}
            <PromptInput onFormGenerated={(layout) => setGeneratedForm(layout)} onErrorCatch={(msg) => setUpgradeMessage(msg)} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-slate-200">Live Dynamic View</h2>
            {generatedForm ? <FormRenderer layout={generatedForm} /> : (
              <div className="border border-dashed border-slate-800 text-slate-500 text-sm h-64 rounded-xl flex items-center justify-center bg-slate-900/20">
                Your generated questionnaire canvas will appear here...
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 🚀 Mount the social media footer layout seamlessly at the very baseline wrapper */}
      <Footer />
    </div>
  );
}