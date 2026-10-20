'use client';

import React from 'react';
import { LearningPathNode, ProblemMetadata, UserProgress } from '../../types';
import { PathNodeCard } from './PathNodeCard';

interface LearningPathProps {
  problems: ProblemMetadata[];
  userProgress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  problems,
  userProgress,
  onUpdateProgress,
}) => {
  // Generate learning nodes strictly for the exact 20 exercises
  const completedSet = new Set(userProgress.completedProblemIds.map(id => id.toUpperCase()));

  const nodes: LearningPathNode[] = [
    // --- CHAPTER 1: LOGIC & SYSTEMS (5 exercises) ---
    {
      id: 'node_4A',
      type: 'exercise',
      problemId: '4A',
      title: '4A. Watermelon',
      subtitle: 'Pete & Billy division • Math & Parity',
      emoji: '🍉',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('4A'),
    },
    {
      id: 'node_71A',
      type: 'exercise',
      problemId: '71A',
      title: '71A. Way Too Long Words',
      subtitle: 'String length filtering & abbreviation format',
      emoji: '🔤',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('71A'),
    },
    {
      id: 'node_231A',
      type: 'exercise',
      problemId: '231A',
      title: '231A. Team',
      subtitle: 'Consensus voting of three friends • Brute Force',
      emoji: '👥',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('231A'),
    },
    {
      id: 'node_158A',
      type: 'exercise',
      problemId: '158A',
      title: '158A. Next Round',
      subtitle: 'Filtering qualifying cutoff scores • Arrays',
      emoji: '🏁',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('158A'),
    },
    {
      id: 'node_50A',
      type: 'exercise',
      problemId: '50A',
      title: '50A. Domino Piling',
      subtitle: '2x1 tiling on rectangular boards • Math / Geometry',
      emoji: '🁓',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('50A'),
    },

    // --- CHAPTER 2: SIMULATION & STATE (5 exercises) ---
    {
      id: 'node_282A',
      type: 'exercise',
      problemId: '282A',
      title: '282A. Bit',
      subtitle: 'Variable mutation simulation • Implementation',
      emoji: '💻',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('282A'),
    },
    {
      id: 'node_112A',
      type: 'exercise',
      problemId: '112A',
      title: '112A. Petya and Strings',
      subtitle: 'Case-insensitive lexicographical ordering',
      emoji: '🔡',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('112A'),
    },
    {
      id: 'node_263A',
      type: 'exercise',
      problemId: '263A',
      title: '263A. Beautiful Matrix',
      subtitle: 'Manhattan distance centering • 2D Matrices',
      emoji: '🔲',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('263A'),
    },
    {
      id: 'node_339A',
      type: 'exercise',
      problemId: '339A',
      title: '339A. Helpful Maths',
      subtitle: 'Rearranging summands • Sorting & Strings',
      emoji: '➕',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('339A'),
    },
    {
      id: 'node_266A',
      type: 'exercise',
      problemId: '266A',
      title: '266A. Stones on the Table',
      subtitle: 'Adjacent duplicate filtering • Greedy',
      emoji: '💎',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('266A'),
    },

    // --- CHAPTER 3: STRINGS, LOGIC & ARITHMETIC (5 exercises) ---
    {
      id: 'node_236A',
      type: 'exercise',
      problemId: '236A',
      title: '236A. Boy or Girl',
      subtitle: 'Distinct character frequency • Hash Sets',
      emoji: '🚻',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('236A'),
    },
    {
      id: 'node_977A',
      type: 'exercise',
      problemId: '977A',
      title: '977A. Wrong Subtraction',
      subtitle: 'Tanya subtraction algorithm • Base-10 Digits',
      emoji: '➖',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('977A'),
    },
    {
      id: 'node_546A',
      type: 'exercise',
      problemId: '546A',
      title: '546A. Soldier and Bananas',
      subtitle: 'Arithmetic progression sum • Math',
      emoji: '🍌',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('546A'),
    },
    {
      id: 'node_116A',
      type: 'exercise',
      problemId: '116A',
      title: '116A. Tram',
      subtitle: 'Passenger load tracking • Peak Capacity',
      emoji: '🚊',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('116A'),
    },
    {
      id: 'node_59A',
      type: 'exercise',
      problemId: '59A',
      title: '59A. Word',
      subtitle: 'Uppercase vs lowercase casing conversion',
      emoji: '🔤',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('59A'),
    },

    // --- CHAPTER 4: VECTORS, QUEUES & GREEDY SEQUENCES (5 exercises) ---
    {
      id: 'node_69A',
      type: 'exercise',
      problemId: '69A',
      title: '69A. Young Physicist',
      subtitle: '3D vector equilibrium check • Math',
      emoji: '⚛️',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('69A'),
    },
    {
      id: 'node_266B',
      type: 'exercise',
      problemId: '266B',
      title: '266B. Queue at the School',
      subtitle: 'Discrete time queue swap simulation',
      emoji: '🚶',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('266B'),
    },
    {
      id: 'node_160A',
      type: 'exercise',
      problemId: '160A',
      title: '160A. Twins',
      subtitle: 'Greedy coin sum strictly greater than half',
      emoji: '🪙',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('160A'),
    },
    {
      id: 'node_520A',
      type: 'exercise',
      problemId: '520A',
      title: '520A. Pangram',
      subtitle: 'English alphabet coverage verification',
      emoji: '🔤',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('520A'),
    },
    {
      id: 'node_580A',
      type: 'exercise',
      problemId: '580A',
      title: '580A. Kefa and First Steps',
      subtitle: 'Longest non-decreasing subsegment • Dynamic Programming',
      emoji: '📈',
      badgeLabel: '📝 Exercise',
      completed: completedSet.has('580A'),
    },
  ];

  return (
    <div className="tree-container">
      {/* Vertical Connecting Line */}
      <div className="tree-vertical-line" />

      {/* Nodes list */}
      {nodes.map((node) => (
        <div className="tree-node-wrapper" key={node.id}>
          <PathNodeCard node={node} />
        </div>
      ))}
    </div>
  );
};
