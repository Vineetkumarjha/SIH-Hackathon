import React from 'react';
import TriageBadge from './TriageBadge';

export default function ResultCard({ result, onAddSymptomAndPredict, onOpenHospitalModal }) {
  if (!result) return null;

  const {
    best_disease,
    confidence,
    confidence_level,
    triage,
    description,
    precautions,
    diet,
    workout,
    medications,
    suggested_symptoms,
    warning
  } = result;

  const confPercent = Math.round((confidence || 0) * 100);

  const levelColor = {
    HIGH: 'bg-emerald-500 text-slate-950',
    MODERATE: 'bg-amber-500 text-slate-950',
    LOW: 'bg-red-500 text-white'
  }[confidence_level] || 'bg-teal-500 text-slate-950';

  const isEmergency = triage?.level === 'EMERGENCY';

  return (
    <div id="results" className="mt-12 space-y-8 animate-fade-in">
      
      {/* 🚨 Emergency Alert Banner */}
      {isEmergency && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-2xl shadow-red-600/40 border border-red-400 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="text-lg font-extrabold uppercase tracking-wide">Emergency Triage Flagged</h3>
              <p className="text-xs text-red-100 font-medium">
                Immediate medical evaluation required. Do not delay emergency consultation.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenHospitalModal}
            className="px-6 py-3 rounded-2xl bg-white text-red-700 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Find Nearest Emergency Care 🏥
          </button>
        </div>
      )}

      {/* Warning if some symptoms unrecognized */}
      {warning && (
        <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-semibold flex items-center gap-3">
          <span>⚠️</span>
          <span>{warning}</span>
        </div>
      )}

      {/* Clinical Triage Badge Component */}
      <TriageBadge triage={triage} />

      {/* Main Prediction Summary Card */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-8">
        
        {/* Header with Disease & Confidence */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div>
            <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">Primary ML Diagnosis</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white capitalize tracking-tight mt-1">
              {best_disease}
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${levelColor}`}>
                {confidence_level} CONFIDENCE
              </span>
              <span className="text-2xl font-black text-white">{confPercent}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-1000"
                style={{ width: `${confPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Clinical Description */}
        {description && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Condition Overview</h4>
            <p className="text-slate-200 text-base leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              {description}
            </p>
          </div>
        )}

        {/* 4 Details Grid: Precautions, Diet, Workout, Medications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Precautions */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
              <span>🛡️</span>
              <span>Recommended Precautions</span>
            </div>
            {precautions ? (
              <ul className="space-y-2 text-xs text-slate-300">
                {Object.values(precautions).filter(Boolean).map((prec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">•</span>
                    <span>{prec}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-xs text-slate-500">Standard precautions apply.</p>}
          </div>

          {/* Dietary Advice */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span>🥗</span>
              <span>Dietary Guidance</span>
            </div>
            {diet && diet.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {diet.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                    {item}
                  </span>
                ))}
              </div>
            ) : <p className="text-xs text-slate-500">Maintain a balanced, nutritious diet.</p>}
          </div>

          {/* Workout & Lifestyle */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <span>🏃‍♂️</span>
              <span>Workout & Activity</span>
            </div>
            {workout && workout.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-300">
                {workout.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-xs text-slate-500">Light activity as tolerated by your body.</p>}
          </div>

          {/* Medications */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span>💊</span>
              <span>Common Medications</span>
            </div>
            {medications && medications.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {medications.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/30 text-amber-300 text-xs font-medium">
                    {item}
                  </span>
                ))}
              </div>
            ) : <p className="text-xs text-slate-500">Consult a doctor before taking medications.</p>}
          </div>

        </div>

        {/* 🔄 Suggested Additional Symptoms Loop (When Confidence is not HIGH) */}
        {confidence_level !== 'HIGH' && suggested_symptoms && suggested_symptoms.length > 0 && (
          <div className="p-6 rounded-2xl bg-teal-950/40 border border-teal-500/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h4 className="text-sm font-bold text-teal-300">Refine Prediction Accuracy</h4>
                <p className="text-xs text-slate-300">
                  Model confidence is moderate. Select any additional symptoms below to re-calculate:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {suggested_symptoms.map((symptom, idx) => (
                <button
                  key={idx}
                  onClick={() => onAddSymptomAndPredict(symptom)}
                  className="px-3.5 py-2 rounded-xl bg-teal-900/80 hover:bg-teal-700 text-teal-100 text-xs font-semibold border border-teal-500/50 transition-all flex items-center gap-1.5 transform hover:scale-105"
                >
                  <span>+</span>
                  <span className="capitalize">{symptom.replace(/_/g, ' ')}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
