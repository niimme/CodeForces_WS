'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TestCase } from '../../types';
import { ExecutionSummary, TestResult } from '../../lib/codeRunner';
import { TraceStep } from '../../lib/codeTracer';

interface TestRunnerConsoleProps {
  testCases: TestCase[];
  selectedTestIndex: number;
  onSelectTest: (index: number) => void;
  onRunCode: () => void;
  isRunning: boolean;
  executionSummary: ExecutionSummary | null;
  onAddTestCase?: (newTestCase: TestCase) => void;
  onDeleteTestCase?: (index: number) => void;
  onUpdateTestCase?: (index: number, updated: TestCase) => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  problemEmoji?: string;
  problemTitle?: string;
  onResetCode?: () => void;
  nextProblemId?: string | null;
  traceSteps?: TraceStep[];
  activeTraceStepIndex?: number;
  onSelectTraceStep?: (stepIndex: number) => void;
  showTracePopover?: boolean;
  onToggleTracePopover?: () => void;
}

export const TestRunnerConsole: React.FC<TestRunnerConsoleProps> = ({
  testCases = [],
  selectedTestIndex,
  onSelectTest,
  onRunCode,
  isRunning,
  executionSummary,
  onAddTestCase,
  onDeleteTestCase,
  onUpdateTestCase,
  isMaximized = false,
  onToggleMaximize,
  isMinimized = false,
  onToggleMinimize,
  problemEmoji = '🍉',
  problemTitle = 'Code Challenge',
  onResetCode,
  nextProblemId,
  traceSteps = [],
  activeTraceStepIndex = 0,
  onSelectTraceStep,
  showTracePopover = false,
  onToggleTracePopover,
}) => {
  const currentTest = testCases[selectedTestIndex] || testCases[0];
  const currentResult: TestResult | undefined = executionSummary?.results?.[selectedTestIndex];
  const hasCompilationError = !!executionSummary?.compilationError;
  const allPassed = !!executionSummary?.allPassed;

  // Custom test case creation modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newInput, setNewInput] = useState<string>('');
  const [newExpected, setNewExpected] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');

  // Inline editing state for active test case
  const [isEditingCurrentTest, setIsEditingCurrentTest] = useState<boolean>(false);
  const [editedInput, setEditedInput] = useState<string>('');
  const [editedExpected, setEditedExpected] = useState<string>('');

  useEffect(() => {
    setEditedInput(currentTest?.input || '');
    setEditedExpected(currentTest?.expectedOutput || '');
    setIsEditingCurrentTest(false);
  }, [selectedTestIndex, currentTest]);

  const handleOpenAddModal = () => {
    setNewTitle(`Custom Test ${testCases.length + 1}`);
    setNewInput('');
    setNewExpected('');
    setNewDescription('Custom user-defined test case.');
    setShowAddModal(true);
  };

  const handleCreateCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInput.trim() || !onAddTestCase) return;

    const newCase: TestCase = {
      id: Date.now(),
      title: newTitle.trim() || `Custom Test ${testCases.length + 1}`,
      description: newDescription.trim() || 'Custom test case',
      input: newInput,
      expectedOutput: newExpected,
      isCustom: true,
    };

    onAddTestCase(newCase);
    setShowAddModal(false);
  };

  const handleSaveInlineEdit = () => {
    if (onUpdateTestCase && currentTest) {
      onUpdateTestCase(selectedTestIndex, {
        ...currentTest,
        input: editedInput,
        expectedOutput: editedExpected,
      });
      setIsEditingCurrentTest(false);
    }
  };

  // Auto-play state for stepping through code execution trace
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = Math.max(1, traceSteps.length);

  // Auto-stepping through line-by-line code execution
  useEffect(() => {
    if (isPlaying && traceSteps.length > 1 && onSelectTraceStep) {
      playTimerRef.current = setInterval(() => {
        onSelectTraceStep((activeTraceStepIndex + 1) % traceSteps.length);
      }, 1500);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, activeTraceStepIndex, traceSteps.length, onSelectTraceStep]);

  const handlePrevStep = () => {
    setIsPlaying(false);
    if (onSelectTraceStep) {
      const prev = activeTraceStepIndex <= 0 ? traceSteps.length - 1 : activeTraceStepIndex - 1;
      onSelectTraceStep(prev);
    }
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    if (onSelectTraceStep) {
      const next = (activeTraceStepIndex + 1) % traceSteps.length;
      onSelectTraceStep(next);
    }
  };

  // Determine global run status
  const hasRun = !!executionSummary;
  const statusLineColor = hasCompilationError
    ? '#ef4444'
    : hasRun
    ? allPassed
      ? '#22c55e'
      : '#ef4444'
    : '#cbd5e1';

  return (
    <div
      className={`minimal-test-console ${isMinimized ? 'minimized' : ''} ${isMaximized ? 'maximized' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* 1. Top Minimalist Header */}
      <div
        className="minimal-console-header"
        style={{
          height: '52px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          flexShrink: 0,
        }}
      >
        {/* Left: Test Case Dots with Concentric Halo Outline Glow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {testCases.map((tc, idx) => {
              const res = executionSummary?.results?.[idx];
              const isSelected = selectedTestIndex === idx;

              let dotColor = '#cbd5e1'; // neutral pending
              let haloColor = 'rgba(203, 213, 225, 0.55)'; // light surrounding glow

              if (hasCompilationError) {
                dotColor = '#ef4444';
                haloColor = 'rgba(248, 113, 113, 0.45)';
              } else if (res) {
                if (res.passed) {
                  dotColor = '#10b981';
                  haloColor = 'rgba(52, 211, 153, 0.45)'; // exact light green glow from screenshot
                } else {
                  dotColor = '#ef4444';
                  haloColor = 'rgba(248, 113, 113, 0.45)'; // light red glow
                }
              }

              return (
                <div
                  key={tc.id || idx}
                  style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      onSelectTest(idx);
                    }}
                    title={`Test ${idx + 1}: ${tc.title || 'Case ' + (idx + 1)}`}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: dotColor,
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.18s ease',
                      // Exact concentric outline glow of a lighter shade surrounding the dot
                      boxShadow: isSelected ? `0 0 0 5px ${haloColor}` : 'none',
                    }}
                    id={`minimal-test-dot-${idx + 1}`}
                    aria-label={`Select test ${idx + 1}`}
                  />

                  {/* Downward Caret Triangle under the active dot */}
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-14px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: `6px solid ${dotColor}`,
                        zIndex: 2,
                      }}
                    />
                  )}
                </div>
              );
            })}

            {onAddTestCase && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                title="Add your own custom test case"
                id="btn-add-custom-test"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 9px',
                  borderRadius: '12px',
                  border: '1.5px dashed #94a3b8',
                  backgroundColor: '#f8fafc',
                  color: '#334155',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  marginLeft: '6px',
                  height: '24px',
                }}
              >
                <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: 800 }}>+</span>
                <span>Add Test</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Reset Button & Run Code Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onResetCode && (
            <button
              type="button"
              onClick={onResetCode}
              title="Reset starter template code"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.15s ease',
              }}
              id="btn-minimal-reset"
              aria-label="Reset Code"
            >
              ↺
            </button>
          )}

          {onToggleMinimize && (
            <button
              type="button"
              onClick={onToggleMinimize}
              title={isMinimized ? 'Expand Console' : 'Collapse Console'}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '13px',
              }}
              id="btn-minimal-minimize"
            >
              {isMinimized ? '▲' : '▼'}
            </button>
          )}

          <button
            type="button"
            className="minimal-run-code-btn"
            onClick={onRunCode}
            disabled={isRunning}
            id="btn-minimal-run-code"
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 18px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.28)',
              transition: 'all 0.15s ease',
              opacity: isRunning ? 0.7 : 1,
            }}
          >
            {isRunning ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                <span>Running...</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '13px' }}>▷</span>
                <span>Run Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Horizontal Colored Separator Bar matching test status */}
      <div
        style={{
          height: '2.5px',
          backgroundColor: statusLineColor,
          width: '100%',
          flexShrink: 0,
          transition: 'background-color 0.2s ease',
        }}
      />

      {/* 3. Main Console Body (Full width matching screenshot) */}
      {!isMinimized && (
        <div
          className="minimal-console-body"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 'calc(100% - 55px)',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
          }}
        >
          {/* Upper Content Area spanning 100% width */}
          <div
            style={{
              padding: '18px 24px 14px',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {/* Test Header & Actions */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#1e293b',
                      margin: 0,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {currentTest?.title || `Test Case ${selectedTestIndex + 1}`}
                  </h2>

                  {currentTest?.isCustom && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        padding: '1px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      Custom Test
                    </span>
                  )}

                  {currentTest?.isCustom && onDeleteTestCase && (
                    <button
                      type="button"
                      onClick={() => onDeleteTestCase(selectedTestIndex)}
                      title="Delete this custom test case"
                      style={{
                        background: '#fff1f2',
                        color: '#e11d48',
                        border: '1px solid #fecdd3',
                        borderRadius: '6px',
                        padding: '2px 7px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>✕</span>
                      <span>Remove</span>
                    </button>
                  )}

                  {currentTest?.isCustom && onUpdateTestCase && (
                    <button
                      type="button"
                      onClick={() => setIsEditingCurrentTest(!isEditingCurrentTest)}
                      title="Edit this test case input/output"
                      style={{
                        background: isEditingCurrentTest ? '#eff6ff' : '#f8fafc',
                        color: isEditingCurrentTest ? '#2563eb' : '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {isEditingCurrentTest ? 'Cancel Edit' : '✏️ Edit'}
                    </button>
                  )}
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {currentTest?.description || `Verification across test case #${selectedTestIndex + 1}.`}
                </p>
              </div>

              {/* Status Indicator Icon (Green Checkmark / Red Cross) */}
              {hasRun && currentResult && (
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    color: !currentResult.passed ? '#dc2626' : '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 800,
                    border: `1.5px solid ${!currentResult.passed ? '#fca5a5' : '#86efac'}`,
                    flexShrink: 0,
                    marginLeft: '12px',
                  }}
                  title={currentResult.passed ? 'Test Passed' : 'Test Failed'}
                >
                  {!currentResult.passed ? '✕' : '✓'}
                </div>
              )}
            </div>

            {/* Compilation Error Alert */}
            {hasCompilationError && executionSummary?.compilationError && (
              <div
                style={{
                  backgroundColor: '#fff1f2',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginTop: '12px',
                  marginBottom: '12px',
                  border: '1px solid #fecdd3',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '5px',
                    display: 'inline-block',
                    letterSpacing: '0.04em',
                    marginBottom: '6px',
                  }}
                >
                  ERROR
                </span>
                <div
                  style={{
                    color: '#b91c1c',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.4,
                  }}
                >
                  {executionSummary.compilationError.slice(0, 300)}
                </div>
              </div>
            )}

            {/* Inline Editor for Custom Test Case */}
            {isEditingCurrentTest && currentTest?.isCustom ? (
              <div
                style={{
                  marginTop: '14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>
                  Edit Test Case: {currentTest?.title}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Input (stdin):
                  </label>
                  <textarea
                    rows={4}
                    value={editedInput}
                    onChange={e => setEditedInput(e.target.value)}
                    style={{
                      width: '100%',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12.5px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      resize: 'vertical',
                      lineHeight: 1.4,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Expected Output (stdout):
                  </label>
                  <textarea
                    rows={3}
                    value={editedExpected}
                    onChange={e => setEditedExpected(e.target.value)}
                    style={{
                      width: '100%',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12.5px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      resize: 'vertical',
                      lineHeight: 1.4,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingCurrentTest(false)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInlineEdit}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#2563eb',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* Clean Table with Multiline Support: Input, Expected, Actual */
              <div
                style={{
                  marginTop: '14px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                {/* Input row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ width: '90px', fontWeight: 700, color: '#334155', flexShrink: 0 }}>Input</span>
                  <pre
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: '#ea580c',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: '140px',
                      overflowY: 'auto',
                      flex: 1,
                    }}
                  >
                    {currentTest?.input?.trim() || '(empty)'}
                  </pre>
                </div>

                {/* Expected row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ width: '90px', fontWeight: 700, color: '#334155', flexShrink: 0 }}>Expected</span>
                  <pre
                    style={{
                      margin: 0,
                      color: '#16a34a',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      fontSize: '13px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: '140px',
                      overflowY: 'auto',
                      flex: 1,
                    }}
                  >
                    {currentTest?.expectedOutput?.trim() || '(none)'}
                  </pre>
                </div>

                {/* Actual row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '12px 16px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ width: '90px', fontWeight: 700, color: '#334155', flexShrink: 0 }}>Actual</span>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <pre
                      style={{
                        margin: 0,
                        color: currentResult?.passed ? '#16a34a' : currentResult ? '#dc2626' : '#94a3b8',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        fontSize: '13px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxHeight: '140px',
                        overflowY: 'auto',
                      }}
                    >
                      {currentResult?.actualOutput?.trim() || (hasRun ? '(none)' : '(not run yet)')}
                    </pre>

                    {hasRun && currentTest?.isCustom && currentResult && !currentResult.passed && currentResult.actualOutput && onUpdateTestCase && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateTestCase(selectedTestIndex, {
                            ...currentTest,
                            expectedOutput: currentResult.actualOutput.trim(),
                          });
                        }}
                        style={{
                          alignSelf: 'flex-start',
                          background: '#f0fdf4',
                          color: '#16a34a',
                          border: '1px solid #bbf7d0',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginTop: '2px',
                        }}
                        title="Set this actual output as the expected output"
                      >
                        ✓ Set Actual as Expected Output
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Active Step Line Indicator (only when tests have run) */}
            {hasRun && traceSteps.length > 0 && traceSteps[activeTraceStepIndex] && (
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  Line {traceSteps[activeTraceStepIndex].lineNumber}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Step {activeTraceStepIndex + 1} of {traceSteps.length}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Scrubber & Line-by-Line Iteration Bar (Full-width matching screenshot) */}
          <div
            className="minimal-scrubber-bar"
            style={{
              height: '52px',
              padding: '0 24px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              backgroundColor: '#ffffff',
              flexShrink: 0,
            }}
          >
            {/* Play / Pause button */}
            <button
              type="button"
              disabled={!hasRun}
              onClick={() => {
                if (!hasRun) return;
                setIsPlaying(!isPlaying);
              }}
              title={!hasRun ? 'Run tests first to step through code' : isPlaying ? 'Pause playback' : 'Step line-by-line through code'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: !hasRun ? '#f1f5f9' : isPlaying ? '#bfdbfe' : '#dbeafe',
                color: !hasRun ? '#94a3b8' : '#2563eb',
                border: 'none',
                cursor: !hasRun ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                transition: 'all 0.15s ease',
                flexShrink: 0,
                opacity: !hasRun ? 0.6 : 1,
              }}
              id="btn-scrubber-play"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            {/* Slider Timeline Scrubber */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <input
                type="range"
                min={0}
                max={hasRun ? Math.max(0, traceSteps.length - 1) : 0}
                value={hasRun ? activeTraceStepIndex : 0}
                disabled={!hasRun}
                onChange={e => {
                  if (!hasRun) return;
                  setIsPlaying(false);
                  if (onSelectTraceStep) {
                    onSelectTraceStep(parseInt(e.target.value, 10));
                  }
                  if (!showTracePopover && onToggleTracePopover) {
                    onToggleTracePopover();
                  }
                }}
                style={{
                  width: '100%',
                  accentColor: '#3b82f6',
                  cursor: !hasRun ? 'not-allowed' : 'pointer',
                  height: '6px',
                  opacity: !hasRun ? 0.45 : 1,
                }}
                id="scrubber-range-slider"
                aria-label="Scrub through code lines"
              />
            </div>

            {/* Step Back button */}
            <button
              type="button"
              disabled={!hasRun}
              onClick={() => {
                if (!hasRun) return;
                handlePrevStep();
                if (!showTracePopover && onToggleTracePopover) {
                  onToggleTracePopover();
                }
              }}
              title={!hasRun ? 'Run tests first' : 'Step backward one line'}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: `1.5px solid ${!hasRun ? '#cbd5e1' : '#93c5fd'}`,
                backgroundColor: !hasRun ? '#f8fafc' : '#ffffff',
                color: !hasRun ? '#94a3b8' : '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !hasRun ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                fontWeight: 700,
                flexShrink: 0,
                opacity: !hasRun ? 0.6 : 1,
              }}
              id="btn-step-prev"
              aria-label="Previous step"
            >
              ‹
            </button>

            {/* Step Forward button */}
            <button
              type="button"
              disabled={!hasRun}
              onClick={() => {
                if (!hasRun) return;
                handleNextStep();
                if (!showTracePopover && onToggleTracePopover) {
                  onToggleTracePopover();
                }
              }}
              title={!hasRun ? 'Run tests first' : 'Step forward one line'}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: `1.5px solid ${!hasRun ? '#cbd5e1' : '#93c5fd'}`,
                backgroundColor: !hasRun ? '#f8fafc' : '#ffffff',
                color: !hasRun ? '#94a3b8' : '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !hasRun ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                fontWeight: 700,
                flexShrink: 0,
                opacity: !hasRun ? 0.6 : 1,
              }}
              id="btn-step-next"
              aria-label="Next step"
            >
              ›
            </button>

            {/* Toggle switch for What Happened explanation popover */}
            {onToggleTracePopover && (
              <button
                type="button"
                onClick={onToggleTracePopover}
                title={showTracePopover ? 'Hide "What happened" explanation' : 'Show "What happened" explanation'}
                style={{
                  width: '38px',
                  height: '22px',
                  borderRadius: '11px',
                  backgroundColor: showTracePopover ? '#3b82f6' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '2px',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0,
                }}
                id="toggle-details-switch"
                aria-label="Toggle explanation popover"
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    transform: showTracePopover ? 'translateX(16px)' : 'translateX(0px)',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Add Custom Test Case Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.22)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🧪</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
                  Add Custom Test Case
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCustomTest} style={{ margin: 0 }}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Title / Identifier
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Custom Edge Case"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Standard Input (stdin) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={newInput}
                    onChange={e => setNewInput(e.target.value)}
                    placeholder="Enter or paste stdin input (multiple lines supported)..."
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12.5px',
                      fontFamily: 'var(--font-mono)',
                      resize: 'vertical',
                      lineHeight: 1.45,
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Expected Output (stdout){' '}
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>
                      (optional &mdash; leave blank to dry-run and inspect output)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={newExpected}
                    onChange={e => setNewExpected(e.target.value)}
                    placeholder="Enter expected stdout or leave blank..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12.5px',
                      fontFamily: 'var(--font-mono)',
                      resize: 'vertical',
                      lineHeight: 1.45,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  padding: '12px 20px',
                  borderTop: '1px solid #f1f5f9',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newInput.trim()}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: newInput.trim() ? '#2563eb' : '#94a3b8',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: newInput.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: newInput.trim() ? '0 2px 6px rgba(37, 99, 235, 0.3)' : 'none',
                  }}
                >
                  Add Test Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
