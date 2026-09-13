import React from 'react';
import {
  Stethoscope,
  Pill,
  BellRing,
  MessageSquareText,
  Users,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  CalendarDays,
  Ticket,
  MapPin,
  Layers,
} from 'lucide-react';
import { projects } from '../data/projectData';

// Honest, brand-consistent product visualizations.
//
// These are illustrative interface compositions built from each project's
// REAL feature list (src/data/projectData.js) - not screenshots, and not
// dressed up with fabricated metrics or match percentages. No numbers here
// are claimed to be real data. The small "INTERFACE PREVIEW" label makes
// that explicit so nothing is ever mistaken for an actual screenshot.

const iconMap = {
  1: [Stethoscope, Pill, BellRing, MessageSquareText],
  2: [GraduationCap, Users, LayoutDashboard, Sparkles],
  3: [CalendarDays, Ticket, MapPin, Layers],
};

function PreviewLabel() {
  return (
    <span className="absolute top-4 right-4 z-20 text-[10px] font-inter tracking-[0.2em] uppercase text-text-secondary/70 bg-background/60 backdrop-blur-sm px-2 py-1 rounded-full border border-border/60">
      Interface Preview
    </span>
  );
}

function FeatureRow({ Icon, label }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/40 last:border-b-0 py-3">
      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-accent" strokeWidth={1.75} />
      </div>
      <span className="text-sm font-inter text-text-primary/90 truncate">{label}</span>
    </div>
  );
}

export const ProjectVisuals = ({ projectId }) => {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const icons = iconMap[projectId] ?? [Layers, Layers, Layers, Layers];
  const features = project.features.slice(0, 4);

  if (projectId === 1) {
    // MEDASSIST AI
    return (
      <div className="w-full h-full bg-surface rounded-2xl overflow-hidden relative border border-border flex items-center justify-center p-6 md:p-8">
        <PreviewLabel />
        <div className="relative z-10 w-full max-w-md bg-background border border-border rounded-xl shadow-2xl p-6 flex flex-col gap-2 transform rotate-[-1.5deg] transition-transform duration-700 hover:rotate-0">
          <div className="flex justify-between items-center border-b border-border pb-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-text-primary font-inter font-medium text-sm">MedAssist AI</span>
            </div>
            <span className="text-accent text-[10px] font-mono bg-accent/10 px-2 py-1 rounded-full uppercase tracking-widest">
              AI-Assisted
            </span>
          </div>
          {features.map((f, i) => (
            <FeatureRow key={f} Icon={icons[i % icons.length]} label={f} />
          ))}
        </div>
      </div>
    );
  }

  if (projectId === 2) {
    // CAMPUSIQ AI
    return (
      <div className="w-full h-full bg-surface rounded-2xl overflow-hidden relative border border-border flex items-center justify-center p-6 md:p-8">
        <PreviewLabel />
        <div className="relative z-10 w-full max-w-lg flex flex-col md:flex-row gap-4">
          <div className="hidden md:flex flex-col gap-3 bg-background border border-border rounded-xl p-4 w-16 items-center">
            {icons.map((Icon, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  i === 0 ? 'bg-accent text-background' : 'bg-surface-2 text-text-secondary'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </div>
            ))}
          </div>
          <div className="flex-1 bg-background border border-border rounded-xl p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-primary font-inter font-medium text-sm">CampusIQ AI</span>
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            </div>
            {features.map((f, i) => (
              <FeatureRow key={f} Icon={icons[i % icons.length]} label={f} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // EVENTHUB
  return (
    <div className="w-full h-full bg-surface rounded-2xl overflow-hidden relative border border-border flex flex-col p-6 md:p-8">
      <PreviewLabel />
      <div className="relative z-10 w-full mb-6">
        <span className="text-text-primary font-inter font-medium text-sm">EventHub</span>
      </div>
      <div className="relative z-10 flex-1 grid grid-cols-2 gap-4">
        {features.map((f, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={f}
              className={`rounded-xl overflow-hidden flex flex-col border border-border bg-background p-4 justify-between ${
                i % 2 === 1 ? 'mt-6' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-accent" strokeWidth={1.75} />
              </div>
              <span className="text-xs font-inter text-text-secondary mt-4 leading-snug">{f}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
