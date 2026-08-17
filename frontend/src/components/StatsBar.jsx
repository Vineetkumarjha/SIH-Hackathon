import React from 'react';

export default function StatsBar() {
  const stats = [
    { label: 'Trusted & Secure', value: '100% Private', sub: 'No Data Stored' },
    { label: 'Happy Users', value: '10K+', sub: 'Community Tested' },
    { label: 'Model Accuracy', value: '95%+', sub: 'Logistic Regression ML' },
    { label: 'Always Available', value: '24/7 AI', sub: 'Instant Response' }
  ];

  return (
    <section id="stats" className="py-16 bg-slate-950 border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-2xl relative">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left 3D Shield Icon */}
            <div className="md:col-span-3 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
              <div className="w-24 h-24 mb-3 relative flex items-center justify-center">
                <img 
                  src="/static/images/shield_icon.png" 
                  alt="3D Security Shield" 
                  className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(20,184,166,0.4)]"
                />
              </div>
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest">Clinical Grade Security</p>
            </div>

            {/* Right Stats Grid */}
            <div className="md:col-span-9 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-teal-300">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
