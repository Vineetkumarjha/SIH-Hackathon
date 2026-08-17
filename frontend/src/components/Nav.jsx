import React from 'react';

export default function Nav({ onOpenChecker }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Aether<span className="text-teal-400">Health</span>
            </span>
            <span className="ml-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-teal-300 bg-teal-950/80 border border-teal-500/30 rounded-full uppercase">
              AI MVP
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#hero" className="hover:text-teal-400 transition-colors">Home</a>
          <a href="#checker" onClick={onOpenChecker} className="hover:text-teal-400 transition-colors">Symptom Checker</a>
          <a href="#features" className="hover:text-teal-400 transition-colors">Health Info</a>
          <a href="#stats" className="hover:text-teal-400 transition-colors">About Us</a>
          <a href="#disclaimer" className="hover:text-teal-400 transition-colors">Contact</a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:inline-flex text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Login
          </button>
          <button 
            onClick={onOpenChecker}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
}
