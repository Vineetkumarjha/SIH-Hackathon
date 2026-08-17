import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import WhatYouCanDo from './components/WhatYouCanDo';
import StatsBar from './components/StatsBar';
import SymptomChecker from './components/SymptomChecker';
import ResultCard from './components/ResultCard';
import HospitalLocatorModal from './components/HospitalLocatorModal';
import DisclaimerBar from './components/DisclaimerBar';

const API_BASE = 'http://127.0.0.1:5000';

export default function App() {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);

  // Fetch symptom checklist registry from Flask backend on load
  useEffect(() => {
    fetch(`${API_BASE}/symptoms`)
      .then((res) => res.json())
      .then((data) => {
        if (data.symptoms) {
          setAllSymptoms(data.symptoms);
        }
      })
      .catch((err) => {
        console.error('Error connecting to Flask backend:', err);
      });
  }, []);

  const handleAnalyze = async (symptomsToUse = selectedSymptoms) => {
    if (!symptomsToUse || symptomsToUse.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomsToUse }),
      });
      const data = await res.json();
      setPredictionResult(data);

      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById('results');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      alert('Could not connect to Flask prediction API. Ensure python app.py is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSymptomAndPredict = (newSymptom) => {
    const updated = Array.from(new Set([...selectedSymptoms, newSymptom]));
    setSelectedSymptoms(updated);
    handleAnalyze(updated);
  };

  const scrollToChecker = () => {
    const el = document.getElementById('checker');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-teal-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Nav onOpenChecker={scrollToChecker} />

      {/* Main Content Sections */}
      <main className="flex-grow space-y-4">
        <Hero onStartCheck={scrollToChecker} />
        <WhatYouCanDo onSelectFeature={scrollToChecker} />
        <StatsBar />
        
        {/* Symptom Checker Section */}
        <SymptomChecker
          allSymptoms={allSymptoms}
          selectedSymptoms={selectedSymptoms}
          setSelectedSymptoms={setSelectedSymptoms}
          onAnalyze={() => handleAnalyze(selectedSymptoms)}
          loading={loading}
        />

        {/* Prediction & Triage Result Screen */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResultCard
            result={predictionResult}
            onAddSymptomAndPredict={handleAddSymptomAndPredict}
            onOpenHospitalModal={() => setIsHospitalModalOpen(true)}
          />
        </div>
      </main>

      {/* Hospital Locator Popup Modal */}
      <HospitalLocatorModal
        isOpen={isHospitalModalOpen}
        onClose={() => setIsHospitalModalOpen(false)}
      />

      Persistent Disclaimer Footer Bar
      <DisclaimerBar />

    </div>
  );
}
