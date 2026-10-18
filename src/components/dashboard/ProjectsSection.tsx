'use client';

import React, { useState } from 'react';
import { PROJECT_1_DATA, ProjectInfo } from '../../data/projectsData';

interface ProjectsSectionProps {
  onOpenProjectModal: (tab?: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenProjectModal }) => {
  const [quickGlanceExpanded, setQuickGlanceExpanded] = useState(false);
  const project: ProjectInfo = PROJECT_1_DATA;

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        padding: '18px',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="projects-sidebar-card"
    >
      {/* Top subtle gradient accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
        }}
      />

      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>💻</span>
          <span>Course Projects</span>
        </div>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: 700,
            color: '#1d4ed8',
            background: '#eff6ff',
            padding: '2px 8px',
            borderRadius: '10px',
            border: '1px solid #dbeafe',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#2563eb',
              boxShadow: '0 0 6px #2563eb',
            }}
          />
          1 Active
        </span>
      </div>

      {/* Main Project Card */}
      <div
        style={{
          background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
          border: '1px solid #cbd5e1',
          borderRadius: '14px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Project Meta Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#4338ca',
              background: '#e0e7ff',
              padding: '2px 7px',
              borderRadius: '6px',
              letterSpacing: '0.04em',
            }}
          >
            {project.code}
          </span>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#b45309',
              background: '#fef3c7',
              padding: '2px 7px',
              borderRadius: '6px',
              border: '1px solid #fde68a',
            }}
          >
            Due Oct 22
          </span>
        </div>

        {/* Project Title */}
        <div>
          <h3
            style={{
              fontSize: '13.5px',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.3,
              marginBottom: '2px',
            }}
          >
            {project.title.split(':')[1]?.trim() || project.title}
          </h3>
          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
            3-Level MLFQ & PCB Design
          </p>
        </div>

        {/* Queue Pipeline Visualizer */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Queue Hierarchy & Flow
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '10.5px',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                padding: '3px 6px',
                borderRadius: '6px',
                border: '1px solid #bfdbfe',
              }}
              title="Queue 0: Preemptive Priority with Round-Robin (quantum q0)"
            >
              Q0: RR(q0)
            </span>
            <span style={{ color: '#94a3b8', fontSize: '11px' }}>→</span>
            <span
              style={{
                background: '#f5f3ff',
                color: '#6d28d9',
                padding: '3px 6px',
                borderRadius: '6px',
                border: '1px solid #ddd6fe',
              }}
              title="Queue 1: Shortest Remaining Time First (allotment q1)"
            >
              Q1: SRTF(q1)
            </span>
            <span style={{ color: '#94a3b8', fontSize: '11px' }}>→</span>
            <span
              style={{
                background: '#ecfdf5',
                color: '#047857',
                padding: '3px 6px',
                borderRadius: '6px',
                border: '1px solid #a7f3d0',
              }}
              title="Queue 2: First-Come First-Served"
            >
              Q2: FCFS
            </span>
          </div>
        </div>

        {/* Key Feature Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {['Preemptive', 'Leftover Quantum', 'C++11', 'Gradescope'].map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#475569',
                background: '#f1f5f9',
                padding: '2px 6px',
                borderRadius: '6px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => onOpenProjectModal('overview')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '9px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.25)';
          }}
        >
          <span>📖</span>
          <span>Open Full Project Spec</span>
        </button>

        {/* Quick Shortcut Buttons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <button
            onClick={() => onOpenProjectModal('loop')}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#edf2f7')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
          >
            ⏱️ 5-Step Loop
          </button>

          <button
            onClick={() => onOpenProjectModal('pcb')}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#edf2f7')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
          >
            🧱 PCB Blueprint
          </button>

          <button
            onClick={() => onOpenProjectModal('samples')}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#edf2f7')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
          >
            📊 Samples 1 & 2
          </button>

          <button
            onClick={() => onOpenProjectModal('submission')}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#edf2f7')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
          >
            📤 Submission
          </button>
        </div>

        {/* Collapsible Quick Glance Section */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '2px' }}>
          <button
            onClick={() => setQuickGlanceExpanded(!quickGlanceExpanded)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              color: '#64748b',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🔍</span>
              <span>Quick Rules Glance</span>
            </span>
            <span style={{ fontSize: '10px' }}>{quickGlanceExpanded ? '▲' : '▼'}</span>
          </button>

          {quickGlanceExpanded && (
            <div
              style={{
                marginTop: '8px',
                padding: '8px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '10.5px',
                color: '#475569',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                lineHeight: 1.4,
              }}
            >
              <div>• <strong>Q0:</strong> Preemptive priority + RR ($q_0$). Preempts lower queues.</div>
              <div>• <strong>Q1:</strong> SRTF ($q_1$ allotment). Priority ignored.</div>
              <div>• <strong>Q2:</strong> FCFS. No allotment; runs until finish.</div>
              <div>• <strong>Budget:</strong> Preemption does not reset quantum; resumes leftover slice.</div>
              <div>• <strong>Utilization:</strong> Print unreduced fraction (e.g. 21/25).</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
