import React from "react";
import { UserCheck, Rocket, GraduationCap, Handshake, Briefcase } from "lucide-react";

const PERSONAS = [
  {
    id: "friendly",
    name: "Friendly Mentor",
    description: "Supportive and beginner-focused. Great for building confidence.",
    icon: <Handshake />,
    color: "bg-green-500/20 text-green-500"
  },
  {
    id: "faang",
    name: "FAANG Interviewer",
    description: "Fast-paced and optimization-heavy. Focuses on edge cases.",
    icon: <Briefcase />,
    color: "bg-blue-500/20 text-blue-500"
  },
  {
    id: "startup",
    name: "Startup CTO",
    description: "Practical engineering discussion and architecture focused.",
    icon: <Rocket />,
    color: "bg-purple-500/20 text-purple-500"
  },
  {
    id: "hr",
    name: "HR Behavioral",
    description: "Focuses on leadership, teamwork, and communication skills.",
    icon: <GraduationCap />,
    color: "bg-orange-500/20 text-orange-500"
  }
];

const PersonaSelector = ({ selectedPersona, onSelect }) => {
  return (
    <div className="setup-card">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <UserCheck className="text-indigo-500" /> Select Interviewer Style
      </h3>
      
      <div className="space-y-3">
        {PERSONAS.map((persona) => (
          <div
            key={persona.id}
            className={`persona-option ${selectedPersona === persona.id ? "selected" : ""}`}
            onClick={() => onSelect(persona.id)}
          >
            <div className={`persona-icon ${persona.color}`}>
              {persona.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 dark:text-slate-100">{persona.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{persona.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonaSelector;
