import React, { useState, useEffect } from 'react';

export default function SymptomChecker({ 
  allSymptoms, 
  selectedSymptoms, 
  setSelectedSymptoms, 
  onAnalyze, 
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Common quick picks
  const quickPicks = [
    'fever', 'cough', 'headache', 'chest_pain', 
    'fatigue', 'nausea', 'vomiting', 'breathlessness', 
    'dizziness', 'joint_pain', 'skin_rash', 'itching'
  ];

  // Filter symptoms based on search term
  const filteredSymptoms = allSymptoms.filter(sym => 
    sym.toLowerCase().includes(searchTerm.toLowerCase().replace(/\s+/g, '_')) ||
    sym.replace(/_/g, ' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const clearAll = () => {
    setSelectedSymptoms([]);
    setSearchTerm('');
  };

  // Browser Web Speech API fallback for direct speech input in UI
  const handleVoiceListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Speech Recognition not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setSearchTerm(transcript);
      
      // Auto match recognized keywords
      const matched = allSymptoms.filter(sym => 
        transcript.includes(sym.replace(/_/g, ' ')) || transcript.includes(sym)
      );
      if (matched.length > 0) {
        setSelectedSymptoms(prev => Array.from(new Set([...prev, ...matched])));
      }
    };

    recognition.start();
  };

  return (
    <section id="checker" className="py-16 bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <span>🔍 Multi-Symptom Checklist</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Check Your Symptoms
          </h2>
          <p className="text-slate-400 text-sm">
            Search or select from the clinical symptom registry below. Select at least 1 symptom to run ML triage.
          </p>
        </div>

        {/* Checker Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
          
          {/* Search Bar & Voice Input */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search symptoms (e.g., headache, chest pain, fever)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm font-medium transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Voice Mic Button */}
            <button
              type="button"
              onClick={handleVoiceListen}
              className={`px-5 py-3.5 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                isListening 
                  ? 'bg-red-950 border-red-500 text-red-300 animate-pulse' 
                  : 'bg-slate-950 border-slate-800 text-teal-400 hover:border-teal-500/50 hover:bg-slate-900'
              }`}
            >
              <span>{isListening ? '🎙️ Listening...' : '🎤 Speak Symptoms'}</span>
            </button>
          </div>

          {/* Quick Selection Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Select Common Symptoms:</label>
            <div className="flex flex-wrap gap-2">
              {quickPicks.map(sym => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected 
                        ? 'bg-teal-500 border-teal-400 text-slate-950 shadow-md shadow-teal-500/20' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {sym.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Symptoms Counter & Tags */}
          {selectedSymptoms.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300">
                  Selected Symptoms ({selectedSymptoms.length})
                </span>
                <button 
                  type="button" 
                  onClick={clearAll}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map(sym => (
                  <span 
                    key={sym}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-950 text-teal-200 border border-teal-500/40 text-xs font-semibold"
                  >
                    <span className="capitalize">{sym.replace(/_/g, ' ')}</span>
                    <button 
                      type="button" 
                      onClick={() => toggleSymptom(sym)}
                      className="hover:text-white font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Full Searchable Symptoms Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Symptom Directory ({filteredSymptoms.length} matching)</span>
            </div>

            <div className="max-h-64 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 custom-scrollbar">
              {filteredSymptoms.map(sym => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <div
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-teal-950/90 border-teal-500/60 text-teal-200 shadow-sm' 
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <span className="capitalize">{sym.replace(/_/g, ' ')}</span>
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded text-teal-500 focus:ring-0 border-slate-700 bg-slate-900"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Predict Action CTA Button */}
          <button
            type="button"
            disabled={selectedSymptoms.length === 0 || loading}
            onClick={onAnalyze}
            className={`w-full py-4 rounded-2xl text-base font-extrabold shadow-xl transition-all flex items-center justify-center gap-3 ${
              selectedSymptoms.length === 0 || loading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 shadow-teal-500/25 transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Analyzing Symptoms with ML Model...</span>
              </>
            ) : (
              <>
                <span>Analyze Symptoms & Predict Condition</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </>
            )}
          </button>

        </div>

      </div>
    </section>
  );
}
