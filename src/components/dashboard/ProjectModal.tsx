'use client';

import React, { useState } from 'react';
import { PROJECT_1_DATA, ProjectInfo } from '../../data/projectsData';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedSample, setSelectedSample] = useState<string>('sample-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync initial tab when changed
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!isOpen) return null;

  const project: ProjectInfo = PROJECT_1_DATA;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Goals', icon: '📋' },
    { id: 'queues', label: '3-Level Queues', icon: '🔀' },
    { id: 'loop', label: 'Simulator Loop', icon: '⏱️' },
    { id: 'pcb', label: 'PCB Blueprint', icon: '🧱' },
    { id: 'samples', label: 'Sample Traces', icon: '📊' },
    { id: 'metrics', label: 'Metrics & Formulas', icon: '📐' },
    { id: 'submission', label: 'Submission & Rules', icon: '📤' },
    { id: 'starter', label: 'Starter Code', icon: '💻' },
  ];

  const currentSample = project.samples.find((s) => s.id === selectedSample) || project.samples[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1040px',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '22px 28px 18px',
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '3px 9px',
                    borderRadius: '20px',
                    background: '#dbeafe',
                    color: '#1e40af',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  {project.code} • {project.term}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '20px',
                    background: '#fef3c7',
                    color: '#92400e',
                    border: '1px solid #fde68a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>⏳</span>
                  <span>Due {project.dueDate} at 11:59 PM</span>
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '20px',
                    background: '#f1f5f9',
                    color: '#475569',
                  }}
                >
                  C++11
                </span>
              </div>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                }}
              >
                {project.title}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>{project.subtitle}</p>
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#64748b',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e2e8f0';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#64748b';
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs Bar */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingTop: '4px',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 13px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: '1px solid',
                    borderColor: isActive ? '#3b82f6' : '#e2e8f0',
                    background: isActive ? '#eff6ff' : '#ffffff',
                    color: isActive ? '#1d4ed8' : '#64748b',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.color = '#0f172a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#64748b';
                    }
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            padding: '24px 28px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            background: '#ffffff',
          }}
        >
          {/* TAB 1: OVERVIEW & GOALS */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  lineHeight: 1.6,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📌</span>
                  <span>Assignment Overview</span>
                </div>
                <p style={{ color: '#475569', fontSize: '13.5px' }}>{project.overview}</p>
              </div>

              {/* Learning Goals Grid */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎯</span>
                  <span>Core Learning Objectives</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {project.learningGoals.map((goal, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          background: '#eff6ff',
                          color: '#2563eb',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.45 }}>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assumptions Table */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚙️</span>
                  <span>Simulation Assumptions & Constraints</span>
                </h3>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 18px' }}>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {project.assumptions.map((assump, idx) => (
                      <li key={idx} style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                        {assump}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Compilation & Grading Quick Box */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '16px',
                  padding: '18px 22px',
                  color: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13.5px' }}>
                    <span>💻</span>
                    <span>Compilation & Execution Command</span>
                  </div>
                  <span style={{ fontSize: '11px', background: '#334155', padding: '2px 8px', borderRadius: '6px', color: '#94a3b8' }}>
                    Gradescope Target
                  </span>
                </div>
                <div
                  style={{
                    background: '#090d16',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12.5px',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <code>{project.submission.compilerLinux}</code>
                  <button
                    onClick={() => copyToClipboard(project.submission.compilerLinux, 'compile-cmd')}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      color: '#cbd5e1',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedId === 'compile-cmd' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUEUE RULES */}
          {activeTab === 'queues' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {project.queueRules.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 18px',
                        background: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            background: q.color,
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '12px',
                            padding: '3px 10px',
                            borderRadius: '20px',
                          }}
                        >
                          {q.name}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>
                          {q.algorithm}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#475569',
                          background: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: '8px',
                        }}
                      >
                        Allotment: <strong>{q.allotment}</strong>
                      </span>
                    </div>

                    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 700, color: '#64748b' }}>Priority Policy:</span>
                        <span style={{ color: '#334155', lineHeight: 1.45 }}>{q.priorityBehavior}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 700, color: '#64748b' }}>Tie-Breaker:</span>
                        <span style={{ color: '#334155', lineHeight: 1.45 }}>{q.tieBreaker}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 700, color: '#dc2626' }}>Demotion Trigger:</span>
                        <span style={{ color: '#991b1b', background: '#fef2f2', padding: '4px 8px', borderRadius: '6px', lineHeight: 1.4 }}>
                          {q.demotionRule}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Crucial Nuances Alert Box */}
              <div
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  borderRadius: '14px',
                  padding: '16px 18px',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#92400e', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚠️</span>
                  <span>Critical Preemption & Quantum Invariants</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#78350f', fontSize: '12.5px', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong>Strict Hierarchy:</strong> Q0 is strictly above Q1, which is strictly above Q2. If CPU is running a Q1 or Q2 job and ANY higher job appears, it is preempted immediately at the time boundary and stays in its queue.</li>
                  <li><strong>Leftover Quantum:</strong> Preemption by a higher-priority process does NOT reset the q0 budget. When interrupted, the process resumes with its leftover slice. Demotion occurs only when the budget hits 0.</li>
                  <li><strong>Priority Only Applies in Q0:</strong> Q1 and Q2 do not consider priority numbers. A low-priority process that dropped to Q2 can be overtaken by a later high-priority arrival (because new arrivals enter Q0).</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: SIMULATOR LOOP */}
          {activeTab === 'loop' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 18px' }}>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                  Implement a <strong>time-driven loop</strong>. At each integer time <code style={{ color: '#2563eb', fontWeight: 700 }}>t</code>, execute the following steps in this <strong>exact order</strong>. Hidden grading tests assume this sequence when simultaneous events occur.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {project.eventLoopSteps.map((step) => (
                  <div
                    key={step.step}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '14px 18px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '14px',
                        flexShrink: 0,
                        border: '1px solid #bfdbfe',
                      }}
                    >
                      {step.step}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{step.title}</span>
                        <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '6px', fontWeight: 600 }}>
                          {step.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                        {step.action}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.45 }}>{step.details}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PCB BLUEPRINT */}
          {activeTab === 'pcb' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 18px' }}>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                  A defensible Process Control Block (PCB) must store every fact that survives a context switch.
                  <strong> Note:</strong> Documenting every field and why it exists in the Design Report is graded!
                </p>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 14px', fontWeight: 700, color: '#475569' }}>Field</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700, color: '#475569' }}>C++ Type</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700, color: '#475569' }}>Category</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700, color: '#475569' }}>Purpose & Description</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700, color: '#475569' }}>Grading Justification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.pcbFields.map((field, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < project.pcbFields.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#2563eb' }}>
                          {field.name}
                        </td>
                        <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                          {field.cppType}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              padding: '2px 6px',
                              borderRadius: '6px',
                              background:
                                field.category === 'identity'
                                  ? '#eff6ff'
                                  : field.category === 'progress'
                                  ? '#fef3c7'
                                  : field.category === 'metrics'
                                  ? '#ecfdf5'
                                  : '#f3e8ff',
                              color:
                                field.category === 'identity'
                                  ? '#1d4ed8'
                                  : field.category === 'progress'
                                  ? '#92400e'
                                  : field.category === 'metrics'
                                  ? '#065f46'
                                  : '#6b21a8',
                            }}
                          >
                            {field.category}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', color: '#475569', lineHeight: 1.4 }}>{field.description}</td>
                        <td style={{ padding: '10px 14px', color: '#334155', fontWeight: 500, lineHeight: 1.4 }}>{field.justification}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SAMPLE TRACES */}
          {activeTab === 'samples' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Sample Switcher */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {project.samples.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSample(s.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: selectedSample === s.id ? 700 : 500,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: selectedSample === s.id ? '#3b82f6' : '#e2e8f0',
                      background: selectedSample === s.id ? '#eff6ff' : '#ffffff',
                      color: selectedSample === s.id ? '#1d4ed8' : '#64748b',
                    }}
                  >
                    {s.title.split(':')[0]}
                  </button>
                ))}
              </div>

              {/* Sample Details */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px 20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{currentSample.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>{currentSample.subtitle}</p>
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5, background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  {currentSample.description}
                </div>
              </div>

              {/* Gantt Timeline Slices */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📊</span>
                  <span>Execution Timeline (Interval Slices)</span>
                </h4>
                <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '8px 12px', fontWeight: 700, color: '#475569' }}>Interval</th>
                        <th style={{ padding: '8px 12px', fontWeight: 700, color: '#475569' }}>Process</th>
                        <th style={{ padding: '8px 12px', fontWeight: 700, color: '#475569' }}>Queue</th>
                        <th style={{ padding: '8px 12px', fontWeight: 700, color: '#475569' }}>What Ends The Slice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSample.intervals.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < currentSample.intervals.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                          <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0f172a' }}>
                            {item.interval}
                          </td>
                          <td style={{ padding: '8px 12px', fontWeight: 700, color: item.who === 'Idle' ? '#64748b' : '#2563eb' }}>
                            {item.who}
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: item.queue === 'Q0' ? '#eff6ff' : item.queue === 'Q1' ? '#f3e8ff' : item.queue === 'Q2' ? '#ecfdf5' : '#f1f5f9',
                                color: item.queue === 'Q0' ? '#1d4ed8' : item.queue === 'Q1' ? '#7e22ce' : item.queue === 'Q2' ? '#065f46' : '#475569',
                              }}
                            >
                              {item.queue}
                            </span>
                          </td>
                          <td style={{ padding: '8px 12px', color: '#475569' }}>{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Side-by-side Input & Exact Output */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                {/* Input Card */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ background: '#f8fafc', padding: '8px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Standard Input (input.txt)</span>
                    <button
                      onClick={() => copyToClipboard(currentSample.input, `in-${currentSample.id}`)}
                      style={{ fontSize: '11px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '2px 8px', cursor: 'pointer' }}
                    >
                      {copiedId === `in-${currentSample.id}` ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre style={{ margin: 0, padding: '12px', background: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#0f172a' }}>
                    {currentSample.input}
                  </pre>
                </div>

                {/* Output Card */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ background: '#f8fafc', padding: '8px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Expected Output (Gradescope Format)</span>
                    <button
                      onClick={() => copyToClipboard(currentSample.output, `out-${currentSample.id}`)}
                      style={{ fontSize: '11px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '2px 8px', cursor: 'pointer' }}
                    >
                      {copiedId === `out-${currentSample.id}` ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre style={{ margin: 0, padding: '12px', background: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#0f172a', maxHeight: '220px', overflowY: 'auto' }}>
                    {currentSample.output}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: METRICS & FORMULAS */}
          {activeTab === 'metrics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {project.metricsFormulas.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '16px',
                      background: '#ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '8px' }}>
                      {m.name}
                    </div>
                    <div
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        marginBottom: '8px',
                      }}
                    >
                      {m.formula}
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.4, margin: '0 0 6px 0' }}>
                      {m.description}
                    </p>
                    <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                      Format: {m.formatNote}
                    </span>
                  </div>
                ))}
              </div>

              {/* Edge Case Guidelines Box */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px 20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🧪</span>
                  <span>Two Edge Cases for Canvas Submission (inputA.txt & inputB.txt)</span>
                </h4>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: '10px' }}>
                  You must build 2 unique boundary test cases. Do not reuse Sample 1 or Sample 2. A single process arriving at time 0 alone does not count.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                  {project.submission.edgeCaseRequirements.map((req, idx) => (
                    <div key={idx} style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#334155' }}>
                      • {req}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SUBMISSION & AI POLICY */}
          {activeTab === 'submission' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {/* Gradescope Submission */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px' }}>🎯</span>
                    <span style={{ fontWeight: 800, fontSize: '14.5px', color: '#0f172a' }}>Gradescope Deliverables</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {project.submission.gradescope.map((item, idx) => (
                      <li key={idx} style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.45 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Canvas Submission */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px' }}>📁</span>
                    <span style={{ fontWeight: 800, fontSize: '14.5px', color: '#0f172a' }}>Canvas Deliverables (Separate Files)</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {project.submission.canvas.map((item, idx) => (
                      <li key={idx} style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.45 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Policy Box */}
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '16px',
                  padding: '18px 20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '14px', color: '#991b1b', marginBottom: '8px' }}>
                  <span>🛡️</span>
                  <span>AI Policy & Restrictions</span>
                </div>
                <p style={{ fontSize: '13px', color: '#7f1d1d', lineHeight: 1.5, marginBottom: '12px' }}>
                  {project.aiPolicy.summary}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                    <div style={{ fontWeight: 700, fontSize: '12px', color: '#166534', marginBottom: '6px' }}>
                      ✓ Permitted Uses
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {project.aiPolicy.allowed.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                    <div style={{ fontWeight: 700, fontSize: '12px', color: '#991b1b', marginBottom: '6px' }}>
                      ✗ Strictly Prohibited
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {project.aiPolicy.prohibited.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: '10px', fontSize: '12px', color: '#991b1b', fontStyle: 'italic' }}>
                  Note: {project.aiPolicy.appendixRequirement}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: STARTER CODE */}
          {activeTab === 'starter' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                    Standard Input Boilerplate (C++11)
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                    AI-compliant starter template providing PCB struct and redirected std::cin parsing.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(project.starterInputParserCpp, 'starter-code')}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {copiedId === 'starter-code' ? '✓ Copied to Clipboard' : '📋 Copy Starter Code'}
                </button>
              </div>

              <pre
                style={{
                  margin: 0,
                  padding: '16px',
                  background: '#090d16',
                  color: '#e2e8f0',
                  borderRadius: '14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  overflowX: 'auto',
                  maxHeight: '440px',
                }}
              >
                <code>{project.starterInputParserCpp}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 28px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            <span>Policy: </span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{project.latePolicy}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
