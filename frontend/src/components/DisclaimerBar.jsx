import React from 'react';

export default function DisclaimerBar() {
  return (
    <footer id="disclaimer" className="sticky bottom-0 z-40 w-full bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-md py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
            ⚠️
          </div>
          <p className="text-xs text-slate-300 font-medium leading-tight max-w-4xl">
            <strong className="text-amber-400 font-bold">Important Medical Disclaimer:</strong> AetherHealth AI is an educational diagnostic support system trained on machine learning data. It is <strong>NOT a substitute for professional medical advice, clinical diagnosis, or treatment</strong>. Always consult a licensed healthcare provider for medical concerns.
          </p>
        </div>

      </div>
    </footer>
  );
}
