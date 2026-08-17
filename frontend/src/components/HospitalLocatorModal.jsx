import React from 'react';

export default function HospitalLocatorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const nearbyHospitals = [
    { name: "City Care Emergency & Trauma Hospital", dist: "1.2 km", time: "4 mins away", status: "24/7 ICU Available", phone: "+1 (800) 555-0199" },
    { name: "Metropolitan General Hospital", dist: "2.8 km", time: "8 mins away", status: "Emergency ER Open", phone: "+1 (800) 555-0244" },
    { name: "St. Jude Super Specialty Clinic", dist: "4.5 km", time: "12 mins away", status: "Specialists on Duty", phone: "+1 (800) 555-0311" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              aria-label="Back to main page"
              className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold shrink-0"
            >
              ←
            </button>
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xl">
              🏥
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Emergency Medical Care Locator</h3>
              <p className="text-xs text-slate-400">Nearest emergency trauma centers and hospitals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Emergency Hotline Quick Dial Bar */}
        <div className="p-4 rounded-2xl bg-red-950/90 border border-red-500/40 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-red-200 uppercase tracking-wider">National Medical Emergency Helplines</p>
            <p className="text-lg font-extrabold text-white">Dial 112 / 911 / 108</p>
          </div>
          <a
            href="tel:112"
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/40 flex items-center gap-2"
          >
            <span>📞 Call 112</span>
          </a>
        </div>

        {/* Simulated Map View */}
        <div className="h-44 w-full rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          <div className="relative z-10 text-center space-y-1">
            <span className="text-3xl">📍</span>
            <p className="text-xs font-bold text-teal-300">Live GPS Location Active</p>
            <p className="text-[10px] text-slate-500">Scanning hospitals within 5km radius</p>
          </div>
        </div>

        {/* Hospital List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Nearby Emergency Centers</h4>
          
          <div className="space-y-2">
            {nearbyHospitals.map((hosp, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h5 className="text-sm font-bold text-white">{hosp.name}</h5>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="text-teal-400 font-semibold">{hosp.dist}</span>
                    <span>•</span>
                    <span>{hosp.time}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">{hosp.status}</span>
                  </div>
                </div>
                <a
                  href={`tel:${hosp.phone}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-teal-300 hover:text-white text-xs font-bold whitespace-nowrap"
                >
                  Call Clinic
                </a>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
        >
          ← Back to Main Page
        </button>

      </div>
    </div>
  );
}
