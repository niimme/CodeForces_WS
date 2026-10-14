'use client';

import React from 'react';
import Link from 'next/link';
import { ProblemMetadata } from '../../types';
import { MathRenderer } from '../ui/MathRenderer';
import { WorkspaceTab } from './WorkspaceNav';

interface ProblemStatementProps {
  problem: ProblemMetadata;
  activeTab?: WorkspaceTab;
  capturedLogs?: string[];
  userCode?: string;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  language?: 'cpp' | 'c' | 'kotlin' | 'java' | 'python';
}

export const ProblemStatement: React.FC<ProblemStatementProps> = ({
  problem,
}) => {
  return (
    <div
      className="problem-details-panel"
      id="panel-instructions"
      role="region"
      aria-label="Problem Statement and Instructions"
    >
      {/* Anchor target for Skip to main content link (WCAG 2.4.1) */}
      <div id="main-content" tabIndex={-1} style={{ outline: 'none' }} />

      <div className="problem-header">
        {/* Top row: Emoji on left, Circle arrow button on right (in same section) */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div className="problem-emoji-hero" style={{ marginBottom: 0 }} aria-hidden="true">
            {problem.emoji}
          </div>
          <Link
            href="/"
            className="instructions-dashboard-btn"
            id="btn-nav-dashboard"
            title="Back to Learning Roadmap"
            aria-label="Back to Learning Roadmap"
          >
            <span aria-hidden="true">&rarr;</span>
          </Link>
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
        Problem Statement
      </h2>
      <div className="statement-text">
        <MathRenderer content={problem.descriptionHtml} />
      </div>

      {problem.inputSpecificationHtml && (
        <>
          <h2 className="section-heading">
            Input Specification
          </h2>
          <div className="statement-text">
            <MathRenderer content={problem.inputSpecificationHtml} />
          </div>
        </>
      )}

      {problem.outputSpecificationHtml && (
        <>
          <h2 className="section-heading">
            Output Specification
          </h2>
          <div className="statement-text">
            <MathRenderer content={problem.outputSpecificationHtml} />
          </div>
        </>
      )}
    </div>
  );
};
