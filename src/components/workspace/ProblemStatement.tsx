'use client';

import React from 'react';
import { ProblemMetadata } from '../../types';
import { MathRenderer } from '../ui/MathRenderer';
import { WorkspaceTab } from './WorkspaceNav';

interface ProblemStatementProps {
  problem: ProblemMetadata;
  activeTab: WorkspaceTab;
  capturedLogs: string[];
  userCode: string;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  language?: 'cpp' | 'c' | 'kotlin' | 'java' | 'python';
}

const LOG_COMMANDS: Record<string, string> = {
  cpp: 'std::cerr',
  c: 'fprintf(stderr, ...)',
  python: 'print(..., file=sys.stderr)',
  java: 'System.err.println()',
  kotlin: 'System.err.println()',
};

export const ProblemStatement: React.FC<ProblemStatementProps> = ({
  problem,
  activeTab,
  capturedLogs,
  userCode,
  isMaximized = false,
  onToggleMaximize,
  language = 'cpp',
}) => {
  const currentLang = (language || 'cpp').toLowerCase();
  const currentLogCommand = LOG_COMMANDS[currentLang] || 'std::cerr';

  return (
    <div
      className="problem-details-panel"
      id={activeTab === 'instructions' ? 'panel-instructions' : 'panel-log'}
      role="tabpanel"
      aria-labelledby={activeTab === 'instructions' ? 'tab-instructions' : 'tab-log'}
    >
      {/* Anchor target for Skip to main content link (WCAG 2.4.1) */}
      <div id="main-content" tabIndex={-1} style={{ outline: 'none' }} />

      {/* INSTRUCTIONS TAB */}
      {activeTab === 'instructions' && (
        <>
          <div className="problem-header">
            <div className="problem-emoji-hero" aria-hidden="true">
              {problem.emoji}
            </div>

            <div className="problem-meta-row">
              <span className="problem-type-tag">
                Exercise &bull; {problem.category}
              </span>
            </div>

            <h1 className="problem-title-text">
              {problem.id}. {problem.title}
            </h1>
          </div>

          <h2 className="section-heading">
            <span aria-hidden="true">📝</span>
            <span>Problem Statement</span>
          </h2>
          <div className="statement-text">
            <MathRenderer content={problem.descriptionHtml} />
          </div>

          {problem.inputSpecificationHtml && (
            <>
              <h2 className="section-heading">
                <span aria-hidden="true">📥</span>
                <span>Input Specification</span>
              </h2>
              <div className="statement-text">
                <MathRenderer content={problem.inputSpecificationHtml} />
              </div>
            </>
          )}

          {problem.outputSpecificationHtml && (
            <>
              <h2 className="section-heading">
                <span aria-hidden="true">📤</span>
                <span>Output Specification</span>
              </h2>
              <div className="statement-text">
                <MathRenderer content={problem.outputSpecificationHtml} />
              </div>
            </>
          )}
        </>
      )}

      {/* LOG TAB */}
      {activeTab === 'log' && (
        <div style={{ padding: '10px 0' }}>
          {/* Header matching Scenario Log screenshot */}
          <div style={{ marginBottom: '18px' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Log</span>
              {capturedLogs.length > 0 && (
                <span
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  {capturedLogs.length} line{capturedLogs.length === 1 ? '' : 's'}
                </span>
              )}
            </h2>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              This is the output from your code execution. Here you can analyse the changes you&apos;ve made. Use{' '}
              <code
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#0284c7',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  border: '1px solid #e2e8f0',
                }}
              >
                {currentLogCommand}
              </code>{' '}
              to log values.
            </p>
          </div>

          {/* Captured Logs Terminal Output OR Empty State Illustration */}
          {capturedLogs.length > 0 ? (
            <div
              role="region"
              aria-label="Execution logs output"
              tabIndex={0}
              style={{
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '14px 16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                maxHeight: '260px',
                overflowY: 'auto',
                marginBottom: '16px',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.25)',
              }}
            >
              {capturedLogs.map((log, i) => {
                const isError = log.includes('ERROR') || log.includes('Exception');
                const isWarn = log.includes('WARN') || log.includes('Breakpoint');
                const isDebug = log.includes('[Debugger]') || log.includes('[Test');

                return (
                  <div
                    key={i}
                    style={{
                      color: isError ? '#f87171' : isWarn ? '#fbbf24' : isDebug ? '#60a5fa' : '#38bdf8',
                      marginBottom: '4px',
                      lineHeight: 1.5,
                      wordBreak: 'break-all',
                    }}
                  >
                    <span aria-hidden="true" style={{ color: '#64748b', marginRight: '8px', userSelect: 'none' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {log}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '36px 20px 28px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  backgroundColor: '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <svg
                  width="74"
                  height="74"
                  viewBox="0 0 74 74"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <rect
                    x="18"
                    y="14"
                    width="34"
                    height="46"
                    rx="3"
                    fill="#c7d2fe"
                    transform="rotate(-8 18 14)"
                  />
                  <rect
                    x="24"
                    y="17"
                    width="34"
                    height="46"
                    rx="3"
                    fill="#ffffff"
                    stroke="#818cf8"
                    strokeWidth="2"
                  />
                  <path
                    d="M30 27C32 25.5 34 28.5 36 27C38 25.5 40 28.5 42 27C44 25.5 46 28.5 48 27"
                    stroke="#818cf8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 33C32 31.5 34 34.5 36 33C38 31.5 40 34.5 42 33C44 31.5 46 34.5 48 33"
                    stroke="#818cf8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 39C32 37.5 34 40.5 36 39C38 37.5 40 40.5 42 39C44 37.5 46 40.5 48 39"
                    stroke="#818cf8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 45C32 43.5 34 46.5 36 45C38 43.5 40 46.5 42 45"
                    stroke="#818cf8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <g transform="translate(39, 21) rotate(42)">
                    <rect x="0" y="0" width="7" height="28" rx="1.5" fill="#ffffff" stroke="#818cf8" strokeWidth="2" />
                    <path d="M0 28L3.5 35L7 28Z" fill="#818cf8" />
                    <line x1="0" y1="6" x2="7" y2="6" stroke="#818cf8" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>

              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#64748b',
                }}
              >
                You&apos;ve not logged anything out yet
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
