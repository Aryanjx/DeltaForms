import React, { useState } from 'react';

export default function LandingPage({ darkMode, setDarkMode, onNavigateToAuth }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    { q: "How does the AI generate forms?", a: "Our system takes your natural language prompt and processes it using the Gemini LLM engine to securely compile standard JSON schemas instantly." },
    { q: "Can I use EchoForms for free?", a: "Yes! Everyone gets up to 3 form generations completely free. Upgrade to Premium for unlimited generation pipelines." },
    { q: "Can I export data out of my forms?", a: "Absolutely. Premium members can view detailed tabular submission layouts and export data straight into CSV flat sheets." }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="scroll-smooth min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      
      {/* 1. STICKY HEADER NAVIGATION */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-indigo-600 dark:text-teal-400">DeltaForms</div>
          
          <div className="flex items-center gap-6">
            <a href="#plans" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-teal-400">Plans</a>
            <a href="#faqs" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-teal-400">FAQs</a>
            
            {/* Dark / Light Toggle Switch */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-lg cursor-pointer transition-all hover:opacity-80"
              style={{ backgroundColor: 'var(--accent-bg)' }}
              title="Toggle Layout Theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <button 
              onClick={onNavigateToAuth}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white dark:text-slate-950 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO VALUE PROPOSITION SECTION */}
      <header className="max-w-4xl mx-auto text-center px-6 py-20 lg:py-32">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-pink-500 dark:from-teal-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Build Forms in Seconds Using Artificial Intelligence
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8 opacity-80" style={{ color: 'var(--text-muted)' }}>
          Stop writing layout inputs by hand. Describe your target dynamic questionnaire fields, and let our custom engine render it ready for production.
        </p>
        <button 
          onClick={onNavigateToAuth}
          className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 px-8 py-3.5 rounded-xl font-bold transition-all shadow-xl cursor-pointer"
        >
          Get Started For Free
        </button>
      </header>

      {/* 3. PREMIUM TIERS & PRICING PLANS */}
      <section id="plans" className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Transparent Software Pricing</h2>
          <p style={{ color: 'var(--text-muted)' }}>No recurring monthly lock-ins. Pay once, unlock access forever.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Membership Card */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm transition-all duration-300" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div>
              <h3 className="font-bold text-xl mb-2">Starter Tier</h3>
              <div className="text-4xl font-black mb-6">$0</div>
              <ul className="space-y-3 text-sm mb-8 opacity-80" style={{ color: 'var(--text-muted)' }}>
                <li>✨ Up to 3 AI Form Generations</li>
                <li>📊 Standard Dashboard Previews</li>
                <li>🔒 Standard User Auth Security</li>
              </ul>
            </div>
            <button 
              onClick={onNavigateToAuth}
              className="w-full py-3 text-slate-800 dark:text-slate-200 font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer"
              style={{ backgroundColor: 'var(--accent-bg)' }}
            >
              Claim Free Tier
            </button>
          </div>

          {/* Premium Membership Card */}
          <div className="border-2 border-indigo-500 dark:border-teal-400 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative transition-all duration-300" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <span className="absolute -top-3 right-8 bg-indigo-500 dark:bg-teal-400 text-white dark:text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Popular</span>
            <div>
              <h3 className="font-bold text-xl mb-2">Lifetime Access</h3>
              <div className="text-4xl font-black mb-6">$19 <span className="text-sm font-normal opacity-60">one-time</span></div>
              <ul className="space-y-3 text-sm mb-8 opacity-80" style={{ color: 'var(--text-muted)' }}>
                <li>🚀 Unlimited Generation Queries</li>
                <li>⚡ Faster Gemini-2.5 Failover Processing</li>
                <li>📥 Export Entries Directly to CSV Sheets</li>
                <li>📧 Instant Resend Mail Notification Webhooks</li>
              </ul>
            </div>
            <button 
              onClick={onNavigateToAuth}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white dark:text-slate-950 font-bold rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Buy Lifetime Access
            </button>
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION PATTERN BLOCK */}
      <section id="faqs" className="max-w-3xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <button 
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-6 py-4 font-semibold flex justify-between items-center hover:opacity-80 cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-xl">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              
              {activeFaq === idx && (
                <div className="px-6 pb-4 text-sm border-t border-slate-100 dark:border-slate-800/50 pt-3" style={{ color: 'var(--text-muted)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. DYNAMIC FOOTER WITH BRANDED SOCIAL CHANNELS */}
      <footer className="border-t border-slate-200 dark:border-slate-800 transition-colors duration-300" style={{ backgroundColor: 'var(--accent-bg)' }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-sm opacity-60">© 2026 DeltaForms Inc. All rights reserved. Built with passion.</div>
          <div className="flex gap-6 text-sm font-semibold">
            <a href="https://github.com/Aryanjx" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">GitHub</a>
            <a href="https://linkedin.com/in/your-username" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">LinkedIn</a>
            <a href="https://x.com/arceus-29" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>

    </div> // Closes the root scroll-smooth div container wrapper
  );      // Closes the main return block
}         // Closes the LandingPage component function definition block