import React from 'react';

export default function WhatYouCanDo({ onSelectFeature }) {
  const cards = [
    {
      id: 'checker',
      icon: '🩺',
      title: 'Symptom Checker',
      badge: 'ML Engine',
      description: 'Search and select symptoms from 370+ clinical indicators for immediate multi-symptom probability matching.',
      gradient: 'from-teal-500/20 to-cyan-500/10',
      border: 'hover:border-teal-500/50'
    },
    {
      id: 'library',
      icon: '📚',
      title: 'Health Library',
      badge: 'Medical Data',
      description: 'Access clinical descriptions, recommended precautions, dietary guidance, and workouts for predicted conditions.',
      gradient: 'from-blue-500/20 to-indigo-500/10',
      border: 'hover:border-blue-500/50'
    },
    {
      id: 'records',
      icon: '📑',
      title: 'Health Records',
      badge: 'Session Log',
      description: 'Review past symptom checks, confidence scores, and triage advisories stored securely in your session.',
      gradient: 'from-emerald-500/20 to-teal-500/10',
      border: 'hover:border-emerald-500/50'
    },
    {
      id: 'reminders',
      icon: '🔔',
      title: 'Health Reminders',
      badge: '24/7 Care',
      description: 'Get automated follow-up suggestions when prediction confidence is low to narrow down potential causes.',
      gradient: 'from-amber-500/20 to-orange-500/10',
      border: 'hover:border-amber-500/50'
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-900/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold text-teal-400 tracking-wider uppercase">What You Can Do</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Healthcare & Triage Tools
          </p>
          <p className="text-slate-400 text-base">
            Designed to empower patients with instant clinical insights, structured precautions, and emergency guidance.
          </p>
        </div>

        {/* 4 Icon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div 
              key={card.id}
              onClick={() => onSelectFeature(card.id)}
              className={`group relative p-6 rounded-3xl bg-slate-950/80 border border-slate-800/80 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer shadow-lg hover:shadow-2xl ${card.border}`}
            >
              {/* Card Gradient Backdrop */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 uppercase tracking-wider">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                  {card.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {card.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-teal-400 group-hover:text-teal-300">
                  <span>Explore feature</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
