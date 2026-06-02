import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-6 mt-20 text-center font-sans">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 gap-4">
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} <span className="text-teal-400 font-semibold">DeltaForms</span> Inc. No Code. Just Magic.
        </div>
        
        {/* 🌐 Your Active Social Media Portals Layout */}
        <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <a 
            href="https://github.com/your-username" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-teal-400 transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com/in/your-profile" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-teal-400 transition-colors"
          >
            LinkedIn
          </a>
          <a 
            href="https://twitter.com/your-handle" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-teal-400 transition-colors"
          >
            Twitter / X
          </a>
        </div>
      </div>
    </footer>
  );
}