'use client';

import React from 'react';
import Link from 'next/link';
import { SupportedLanguage, UserProgress } from '../../types';

export type WorkspaceTab = 'instructions' | 'log';

interface InstructionsHeaderProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  logCount?: number;
  currentLanguage?: SupportedLanguage;
  onOpenSettings?: () => void;
  onOpenAccount?: () => void;
  currentUser?: UserProgress;
}

export const InstructionsHeader: React.FC<InstructionsHeaderProps> = ({
  activeTab,
  onSelectTab,
  logCount = 0,
  currentLanguage = 'cpp',
  onOpenSettings,
  onOpenAccount,
  currentUser,
}) => {
  const langDisplayMap: Record<string, string> = {
    cpp: 'C++',
    c: 'C',
    java: 'Java',
    kotlin: 'Kotlin',
    python: 'Python',
  };

  return (
    <div className="instructions-window-header">
      {/* Tab controls */}
      <div
        role="tablist"
        aria-label="Problem workspace tabs"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <button
          role="tab"
          aria-selected={activeTab === 'instructions'}
          aria-controls="panel-instructions"
          className={`instructions-tab-btn ${activeTab === 'instructions' ? 'active' : ''}`}
          onClick={() => onSelectTab('instructions')}
          id="tab-instructions"
        >
          <span>Instructions</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'log'}
          aria-controls="panel-log"
          className={`instructions-tab-btn ${activeTab === 'log' ? 'active' : ''}`}
          onClick={() => onSelectTab('log')}
          id="tab-log"
        >
          <span>Log</span>
          {logCount > 0 && (
            <span className="instructions-tab-badge" aria-label={`${logCount} log entries`}>
              {logCount}
            </span>
          )}
        </button>
      </div>

      {/* Right side: Dashboard circular button with arrow */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          href="/"
          className="instructions-dashboard-btn"
          id="btn-nav-dashboard"
          title="Back to Learning Roadmap"
          aria-label="Back to Learning Roadmap"
        >
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
};
