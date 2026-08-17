import React from 'react';

export default function TriageBadge({ triage }) {
  if (!triage) return null;

  const level = triage.level || 'SELF_CARE';
  
  const styles = {
    EMERGENCY: {
      bg: 'bg-red-950/80 border-red-500/50 text-red-200',
      badgeBg: 'bg-red-500 text-white shadow-lg shadow-red-500/40',
      icon: '🚨',
      glow: 'shadow-red-900/30'
    },
    SEE_DOCTOR: {
      bg: 'bg-amber-950/80 border-amber-500/50 text-amber-200',
      badgeBg: 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30',
      icon: '👨‍⚕️',
      glow: 'shadow-amber-900/30'
    },
    SELF_CARE: {
      bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200',
      badgeBg: 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30',
      icon: '🌿',
      glow: 'shadow-emerald-900/30'
    }
  };

  const current = styles[level] || styles.SELF_CARE;

  return (
    <div className={`p-6 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all ${current.bg} ${current.glow}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="text-3xl p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-inner">
            {current.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${current.badgeBg}`}>
                {triage.badge_text || level}
              </span>
              <span className="text-xs font-bold text-slate-400">Clinical Triage Guidance</span>
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight">
              {triage.title}
            </h4>
          </div>
        </div>

        {triage.emergency_flag && (
          <a
            href="tel:112"
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 animate-pulse"
          >
            <span>Call 112 / 911 Now</span>
          </a>
        )}

      </div>

      <p className="mt-4 text-sm text-slate-300 leading-relaxed font-normal border-t border-white/10 pt-3">
        {triage.description}
      </p>
    </div>
  );
}
