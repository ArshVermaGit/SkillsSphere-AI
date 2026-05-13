import React, { useState } from "react";
import CameraCheck from "../components/CameraCheck";
import PersonaSelector from "../components/PersonaSelector";
import Button from "../../../shared/components/Button";
import Select from "../../../shared/components/Select";
import { Play, GraduationCap } from "lucide-react";
import "../styles/mock-interview.css";

const DOMAINS = [
  { value: "frontend-react", label: "Frontend (React)" },
  { value: "backend-node", label: "Backend (Node.js)" },
  { value: "fullstack-js", label: "Fullstack JavaScript" },
  { value: "python-dev", label: "Python Developer" },
  { value: "system-design", label: "System Design" },
  { value: "data-structures", label: "DSA & Algorithms" }
];

const DIFFICULTY_LEVELS = [
  { value: "entry", label: "Entry Level (0-1 yrs)" },
  { value: "junior", label: "Junior (1-2 yrs)" },
  { value: "mid", label: "Mid-Level (3-5 yrs)" },
  { value: "senior", label: "Senior (5+ yrs)" }
];

const InterviewLobby = () => {
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState("friendly");
  const [domain, setDomain] = useState("frontend-react");
  const [difficulty, setDifficulty] = useState("entry");

  const handleStartInterview = () => {
    // This will navigate to the actual interview session in the next phase
    console.log("Starting Interview with:", {
      selectedPersona,
      domain,
      difficulty
    });
    alert("Phase 1 Complete! The actual interview engine is coming in Phase 2.");
  };

  return (
    <div className="interview-lobby-container">
      <header className="lobby-header">
        <h1>Adaptive Cognitive Interview</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Prepare for your dream role with our concept-aware AI interviewer. 
          The session will adapt to your performance in real-time.
        </p>
      </header>

      <div className="lobby-grid">
        <div className="space-y-6">
          <CameraCheck onStreamReady={setIsMediaReady} />
          
          <div className="setup-card">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="text-indigo-500" /> Focus Area
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Technical Domain</label>
                <Select
                  options={DOMAINS}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Difficulty</label>
                <Select
                  options={DIFFICULTY_LEVELS}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <PersonaSelector 
            selectedPersona={selectedPersona} 
            onSelect={setSelectedPersona} 
          />

          <div className="start-button-wrapper">
            <Button
              variant="primary"
              size="lg"
              className="w-full md:w-auto px-12 py-4 text-lg font-bold rounded-full flex items-center gap-3 shadow-lg hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1"
              disabled={!isMediaReady}
              onClick={handleStartInterview}
            >
              <Play fill="currentColor" /> Start Interview Session
            </Button>
          </div>
          {!isMediaReady && (
            <p className="text-center text-sm text-amber-500 font-medium">
              Please enable Camera & Microphone to proceed
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewLobby;
