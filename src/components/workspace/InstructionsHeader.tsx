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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className={`instructions-tab-btn ${activeTab === 'instructions' ? 'active' : ''}`}
          onClick={() => onSelectTab('instructions')}
          id="tab-instructions"
        >
          <span>📄</span>
          <span>Instructions</span>
        </button>

        <button
          className={`instructions-tab-btn ${activeTab === 'log' ? 'active' : ''}`}
          onClick={() => onSelectTab('log')}
          id="tab-log"
        >
          <span>📋</span>
          <span>Log</span>
          {logCount > 0 && (
            <span className="instructions-tab-badge">
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
          aria-label="Dashboard"
        >
          →
        </Link>
      </div>
    </div>
  );
};
