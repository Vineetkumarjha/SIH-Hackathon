import React from 'react';

export default function Hero({ onStartCheck }) {
  return (
    <section id="hero" className="relative pt-12 pb-20 overflow-hidden bg-slate-950">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/70 border border-teal-500/30 text-teal-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              AI-Powered Clinical Diagnostics & Triage
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Intelligent Symptom Analysis & <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">Instant Healthcare Triage</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Analyze your symptoms in seconds with our machine learning engine trained on over 700+ conditions. Get immediate urgency guidance, precautionary steps, personalized diet & exercise advice.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button 
                onClick={onStartCheck}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 shadow-xl shadow-teal-500/25 hover:from-teal-300 hover:to-cyan-400 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
              >
                <span>Check Your Symptoms</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>
              
              <a 
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-center gap-2"
              >
                Learn More
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center lg:justify-start gap-6 text-slate-400 text-xs font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Instant ML Triage</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>377 Recognized Symptoms</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Voice Enabled</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Doctor Illustration & Floating Feature Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Background Glow Ring */}
            <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-teal-500/20 to-cyan-400/20 blur-2xl absolute" />

            {/* Doctor 3D Character Image */}
            <div className="relative z-10 w-72 sm:w-96 transition-transform hover:scale-105 duration-500">
              <img 
                src="/static/images/hero_doctor.png" 
                alt="AI Medical Doctor Assistant" 
                className="w-full h-auto drop-shadow-[0_20px_40px_rgba(20,184,166,0.3)] rounded-3xl"
              />
            </div>

            {/* Floating Callout Card 1: Smart Symptom Analysis */}
            <div className="absolute -top-4 -left-6 z-20 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl shadow-xl animate-bounce-slow">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                🩺
              </div>
              <div>
                <p className="text-xs font-bold text-white">Smart Symptom Analysis</p>
                <p className="text-[10px] text-slate-400">ML pattern detection</p>
              </div>
            </div>

            {/* Floating Callout Card 2: Health Recommendations */}
            <div className="absolute top-1/2 -right-8 z-20 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                📋
              </div>
              <div>
                <p className="text-xs font-bold text-white">Health Recommendations</p>
                <p className="text-[10px] text-slate-400">Diet, workout & precautions</p>
              </div>
            </div>

            {/* Floating Callout Card 3: Triage Classifier */}
            <div className="absolute -bottom-6 left-4 z-20 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                🚨
              </div>
              <div>
                <p className="text-xs font-bold text-white">When to See a Doctor</p>
                <p className="text-[10px] text-slate-400">Instant triage urgency level</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
