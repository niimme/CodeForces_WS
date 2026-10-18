export interface ProcessSpec {
  pid: number;
  burst: number;
  arrival: number;
  priority: number;
}

export interface SampleInterval {
  interval: string;
  who: string;
  queue: string;
  reason: string;
}

export interface SampleCase {
  id: string;
  title: string;
  subtitle: string;
  input: string;
  output: string;
  description: string;
  intervals: SampleInterval[];
  metrics: {
    response: { [pid: string]: number };
    turnaround: { [pid: string]: number };
    waiting: { [pid: string]: number };
    utilization: string;
  };
}

export interface PCBField {
  name: string;
  cppType: string;
  category: 'identity' | 'progress' | 'metrics' | 'state';
  description: string;
  justification: string;
}

export interface QueueRule {
  id: string;
  name: string;
  algorithm: string;
  allotment: string;
  priorityBehavior: string;
  tieBreaker: string;
  demotionRule: string;
  color: string;
  badge: string;
}

export interface ProjectInfo {
  id: string;
  code: string;
  term: string;
  title: string;
  subtitle: string;
  dueDate: string;
  dueDateTime: string;
  latePolicy: string;
  status: 'active' | 'upcoming' | 'completed';
  tags: string[];
  overview: string;
  assumptions: string[];
  learningGoals: string[];
  queueRules: QueueRule[];
  pcbFields: PCBField[];
  eventLoopSteps: {
    step: number;
    title: string;
    action: string;
    details: string;
    badge: string;
  }[];
  metricsFormulas: {
    name: string;
    formula: string;
    description: string;
    formatNote: string;
  }[];
  samples: SampleCase[];
  submission: {
    gradescope: string[];
    canvas: string[];
    compilerLinux: string;
    compilerMac: string;
    runCommand: string;
    diffCommand: string;
    reportRequirements: string[];
    edgeCaseRequirements: string[];
  };
  aiPolicy: {
    summary: string;
    allowed: string[];
    prohibited: string[];
    appendixRequirement: string;
  };
  starterInputParserCpp: string;
}

export const PROJECT_1_DATA: ProjectInfo = {
  id: 'project-1',
  code: 'CS 3113',
  term: 'Fall 2026',
  title: 'Project 1: Multilevel Feedback Queue Simulator',
  subtitle: 'Three-Level MLFQ CPU Scheduling Engine & PCB Design in C++',
  dueDate: 'Thursday, October 22, 2026',
  dueDateTime: 'Thursday, Oct 22, 2026 at 11:59 PM',
  latePolicy: 'Up to 5 late days, 5% deduction per day; zero credit afterwards.',
  status: 'active',
  tags: ['MLFQ', 'Operating Systems', 'PCB Design', 'Preemption', 'C++11', 'Gradescope'],
  overview:
    'In Project 1 you will build a CPU scheduling simulator in C++ that models a three-level multilevel feedback queue (MLFQ). Processes start in the highest queue and are demoted when they consume the allotment of that queue. Higher queues always have priority over lower queues and preempt them. Inside Q0, different priorities are preemptive; processes that share a priority share the CPU by Round-Robin with quantum q0. You will also design and justify a Process Control Block (PCB).',
  assumptions: [
    'Every process is CPU-bound (no I/O waits, no blocking).',
    'There is a single CPU core.',
    'One burst unit is exactly one time unit on the CPU.',
    'Context-switch cost is zero.',
    'Processes may arrive at different times, including after the CPU has already started running (arrival >= 0).',
    'N is between 1 and 10 processes; bursts are 1 to 80 units; priorities >= 1 (1 = highest urgency).'
  ],
  learningGoals: [
    'Design a PCB as a C++ struct or class and justify every field in your design report.',
    'Represent three ready queues with distinct scheduling disciplines: Preemptive Priority with RR among equals (Q0), SRTF (Q1), and FCFS (Q2).',
    'Implement preemption between queues (Q0 > Q1 > Q2) and inside Q0 and Q1.',
    'Compute exact response time, waiting time, turnaround time, and unreduced CPU utilization.',
    'Produce output that matches the required Gradescope format exactly.'
  ],
  queueRules: [
    {
      id: 'q0',
      name: 'Queue 0 (Q0)',
      algorithm: 'Preemptive Priority; Round-Robin (RR) among equals',
      allotment: 'q0 (from input line 1)',
      priorityBehavior:
        'Smaller priority number = higher urgency (1 is highest). Different priorities preempt immediately when a strictly higher priority process arrives. Equal priorities share the CPU via Round-Robin with time quantum q0.',
      tieBreaker:
        'Round-Robin order. A same-priority arrival does NOT preempt the runner; it appends to the RR tail for that priority.',
      demotionRule:
        'When a process consumes a full q0 quantum in Q0 without finishing, it is demoted to Q1. It does not get another Q0 turn. Preemption by a higher priority does NOT reset this budget (leftover quantum is preserved until total consumed equals q0).',
      color: '#3b82f6',
      badge: 'Highest Urgency'
    },
    {
      id: 'q1',
      name: 'Queue 1 (Q1)',
      algorithm: 'Shortest Remaining Time First (SRTF)',
      allotment: 'q1 (from input line 1)',
      priorityBehavior:
        'Priority numbers are IGNORED in Q1. Always select the process with the smallest remaining CPU burst.',
      tieBreaker:
        '1) Earlier time of entry into Q1, then 2) Smaller PID.',
      demotionRule:
        'After a process consumes q1 CPU units while in Q1 without finishing, it is demoted to Q2. Like Q0, the allotment is tracked across dispatches if preempted.',
      color: '#8b5cf6',
      badge: 'Mid Level (SRTF)'
    },
    {
      id: 'q2',
      name: 'Queue 2 (Q2)',
      algorithm: 'First Come First Served (FCFS)',
      allotment: 'None (runs to completion)',
      priorityBehavior:
        'Priority numbers are IGNORED in Q2. Runs the process that entered Q2 earliest until it finishes.',
      tieBreaker: 'Time of entry into Q2 is its FCFS key.',
      demotionRule:
        'None. A Q2 process may be preempted by higher queues (Q0 or Q1 arrivals), but keeps its place at the head of Q2.',
      color: '#059669',
      badge: 'Lowest Level (FCFS)'
    }
  ],
  pcbFields: [
    {
      name: 'pid',
      cppType: 'int',
      category: 'identity',
      description: 'Process identifier (unique among 1..N).',
      justification: 'Required for output printing and resolving tie-breakers in Q1.'
    },
    {
      name: 'burst',
      cppType: 'int',
      category: 'identity',
      description: 'Total original CPU burst time (1-80 units).',
      justification: 'Required to compute waiting time: Turnaround Time - burst.'
    },
    {
      name: 'arrival',
      cppType: 'int',
      category: 'identity',
      description: 'Time process arrives and enters Q0 (>= 0).',
      justification: 'Determines when process enters Q0 and calculates response and turnaround times.'
    },
    {
      name: 'priority',
      cppType: 'int',
      category: 'identity',
      description: 'Priority level (>= 1, 1 is highest urgency).',
      justification: 'Used exclusively in Q0 to order dispatches and trigger priority preemptions.'
    },
    {
      name: 'remaining_burst',
      cppType: 'int',
      category: 'progress',
      description: 'Remaining CPU burst units left to execute.',
      justification: 'Essential for SRTF selection in Q1 and detecting termination (remaining == 0).'
    },
    {
      name: 'current_queue',
      cppType: 'int',
      category: 'progress',
      description: 'Current queue index (0 for Q0, 1 for Q1, 2 for Q2).',
      justification: 'Tracks which queue level the process currently resides in across dispatches.'
    },
    {
      name: 'leftover_q0_budget',
      cppType: 'int',
      category: 'progress',
      description: 'Remaining quantum budget in Q0 (initialized to q0).',
      justification: 'Preemptions do not reset Q0 budget; preserves remaining quantum until 0 triggers demotion.'
    },
    {
      name: 'q1_consumed',
      cppType: 'int',
      category: 'progress',
      description: 'Total CPU time units consumed while in Q1.',
      justification: 'Accumulates execution in Q1 across preemptions until reaching q1 allotment.'
    },
    {
      name: 'q1_entry_time',
      cppType: 'int',
      category: 'progress',
      description: 'Simulation timestamp when process was demoted into Q1.',
      justification: 'Used as the primary tie-breaker for processes with equal remaining burst in Q1 SRTF.'
    },
    {
      name: 'q2_entry_time',
      cppType: 'int',
      category: 'progress',
      description: 'Simulation timestamp when process was demoted into Q2.',
      justification: 'Serves as the FCFS key ordering processes in Q2.'
    },
    {
      name: 'first_dispatch_time',
      cppType: 'int',
      category: 'metrics',
      description: 'Timestamp when process is first selected to run on CPU (-1 if not yet run).',
      justification: 'Used to calculate Response Time = first_dispatch_time - arrival.'
    },
    {
      name: 'finish_time',
      cppType: 'int',
      category: 'metrics',
      description: 'Timestamp when process completes its final burst unit and terminates.',
      justification: 'Used to compute Turnaround Time = finish_time - arrival.'
    },
    {
      name: 'state',
      cppType: 'enum ProcessState { NEW, READY, RUNNING, TERMINATED }',
      category: 'state',
      description: 'Current operational state in OS lifecycle.',
      justification: 'Reflects kernel process lifecycle; essential for PCB validity and state tracking.'
    }
  ],
  eventLoopSteps: [
    {
      step: 1,
      title: 'Admit Arrivals',
      badge: 'Step 1: t = clock',
      action: 'Admit every process whose arrival time equals current time t into Q0.',
      details:
        'Processes enter Q0 in the order they appeared in the input file. Initialize their Q0 budget to q0 and state to READY.'
    },
    {
      step: 2,
      title: 'Preempt Check',
      badge: 'Step 2: Preempt Check',
      action: 'If a process is currently RUNNING and is no longer the one that should run, preempt it.',
      details:
        'The preempted process stays in its current queue level (keeps leftover budget). Close the current execution slice in the trace with ", preempted".'
    },
    {
      step: 3,
      title: 'Select Next Process',
      badge: 'Step 3: Select Winner',
      action: 'Determine which process should occupy the CPU core.',
      details:
        'Check queues in order: (1) If Q0 is nonempty: select waiting Q0 process with smallest priority number. If tied, pick head of that priority\'s RR list. (2) Else if Q1 is nonempty: select smallest remaining burst (ties: earlier Q1 entry time, then smallest PID). (3) Else if Q2 is nonempty: take head of Q2. (4) Else CPU is idle. First time a process is selected records first_dispatch_time for Response Time.'
    },
    {
      step: 4,
      title: 'Run One Time Unit',
      badge: 'Step 4: Execute Slice',
      action: 'Execute the chosen process for 1 time unit (or jump clock if CPU is idle).',
      details:
        'Advance simulation clock t by 1. Decrement remaining_burst. If running in Q0, decrement Q0 budget. If in Q1, increment Q1 consumed. If idle, jump clock directly to next arrival time.'
    },
    {
      step: 5,
      title: 'Finish or Demote',
      badge: 'Step 5: End of Unit',
      action: 'Evaluate process state at the end of the time unit in strict order:',
      details:
        '(a) If remaining_burst == 0 -> TERMINATE and record finish_time; (b) Else if process is in Q0 and leftover Q0 budget == 0 -> DEMOTE to Q1, record q1_entry_time; (c) Else if process is in Q1 and q1_consumed == q1 -> DEMOTE to Q2, record q2_entry_time.'
    }
  ],
  metricsFormulas: [
    {
      name: 'Response Time (p)',
      formula: 'Response Time(p) = S_p - A_p',
      description: 'Difference between time of first CPU dispatch (S_p) and original arrival time (A_p).',
      formatNote: 'Printed as "P<id> = <int>" under "Response Time" block.'
    },
    {
      name: 'Turnaround Time (p)',
      formula: 'Turnaround Time(p) = F_p - A_p',
      description: 'Total elapsed time from arrival (A_p) until process terminates (F_p).',
      formatNote: 'Printed as "P<id> = <int>" under "Turnaround Time" block.'
    },
    {
      name: 'Waiting Time (p)',
      formula: 'Waiting Time(p) = Turnaround Time(p) - W_p',
      description: 'Total time spent waiting in Q0, Q1, or Q2 while not actively running. (W_p is original burst).',
      formatNote: 'Printed as "P<id> = <int>" under "Waiting Time" block.'
    },
    {
      name: 'CPU Utilization Rate',
      formula: 'CPU Utilization = busy time units / T',
      description: 'Fraction of total makespan T (when last process terminates) where CPU was busy executing processes.',
      formatNote: 'MUST be printed as an unreduced fraction "busy/T" (e.g. 21/25, or 94/94 if 100%). Never decimals or reduced fractions like 1/1.'
    }
  ],
  samples: [
    {
      id: 'sample-1',
      title: 'Sample 1: Priority Preemption in Q0',
      subtitle: 'Higher priority arrival mid-quantum + leftover budget preservation',
      description:
        'P1 arrives at time 0 with priority 2 and starts in Q0. At time 3, P2 arrives with priority 1 (higher urgency) and preempts P1. P1 keeps a leftover Q0 budget of 7. P2 finishes inside Q0. P1 then resumes, burns its remaining budget, demotes to Q1, consumes Q1 allotment, demotes to Q2, and terminates.',
      input: `10 5\n2\n1 20 0 2\n2 5 3 1`,
      output: `Time 0-3: P1, from Q0, preempted\nTime 3-8: P2, from Q0, terminated\nTime 8-15: P1, from Q0 to Q1\nTime 15-20: P1, from Q1 to Q2\nTime 20-25: P1, from Q2, terminated\n\nResponse Time\nP1 = 0\nP2 = 0\n\nTurnaround Time\nP1 = 25\nP2 = 5\n\nWaiting Time\nP1 = 5\nP2 = 0\n\nCPU Utilization Rate\n25/25`,
      intervals: [
        { interval: '0–3', who: 'P1', queue: 'Q0', reason: 'Preempted by P2 (priority 1 < 2)' },
        { interval: '3–8', who: 'P2', queue: 'Q0', reason: 'Terminated (burst 5 < q0)' },
        { interval: '8–15', who: 'P1', queue: 'Q0', reason: 'Leftover budget 7 used; demoted to Q1' },
        { interval: '15–20', who: 'P1', queue: 'Q1', reason: 'q1 = 5 consumed; demoted to Q2' },
        { interval: '20–25', who: 'P1', queue: 'Q2', reason: 'Terminated' }
      ],
      metrics: {
        response: { P1: 0, P2: 0 },
        turnaround: { P1: 25, P2: 5 },
        waiting: { P1: 5, P2: 0 },
        utilization: '25/25'
      }
    },
    {
      id: 'sample-2',
      title: 'Sample 2: Idle CPU Gap & Full Migration',
      subtitle: 'CPU idle period between process arrivals + walk through Q0 -> Q1 -> Q2',
      description:
        'P1 uses full Q0 quantum (5), then finishes in Q1 at time 6. The CPU sits idle from 6 to 10. P2 arrives at 10 and walks through Q0 -> Q1 -> Q2 before finishing.',
      input: `5 5\n2\n1 6 0 1\n2 15 10 1`,
      output: `Time 0-5: P1, from Q0 to Q1\nTime 5-6: P1, from Q1, terminated\nTime 6-10: Idle\nTime 10-15: P2, from Q0 to Q1\nTime 15-20: P2, from Q1 to Q2\nTime 20-25: P2, from Q2, terminated\n\nResponse Time\nP1 = 0\nP2 = 0\n\nTurnaround Time\nP1 = 6\nP2 = 15\n\nWaiting Time\nP1 = 0\nP2 = 0\n\nCPU Utilization Rate\n21/25`,
      intervals: [
        { interval: '0–5', who: 'P1', queue: 'Q0', reason: 'Full Q0 quantum used; demoted to Q1' },
        { interval: '5–6', who: 'P1', queue: 'Q1', reason: 'Terminated (1 burst unit left)' },
        { interval: '6–10', who: 'Idle', queue: 'CPU', reason: 'No processes ready' },
        { interval: '10–15', who: 'P2', queue: 'Q0', reason: 'Full Q0 quantum used; demoted to Q1' },
        { interval: '15–20', who: 'P2', queue: 'Q1', reason: 'q1 = 5 consumed; demoted to Q2' },
        { interval: '20–25', who: 'P2', queue: 'Q2', reason: 'Terminated' }
      ],
      metrics: {
        response: { P1: 0, P2: 0 },
        turnaround: { P1: 6, P2: 15 },
        waiting: { P1: 0, P2: 0 },
        utilization: '21/25'
      }
    }
  ],
  submission: {
    gradescope: [
      'project1.cpp: Full C++ source code.',
      'Must compile cleanly with: g++ -std=c++11 project1.cpp -o project1',
      'Reads standard input, writes strictly formatted output to standard output.',
      'Hidden tests will evaluate exact string matching including tie breaks.'
    ],
    canvas: [
      'DesignReportProject1.pdf (1-3 pages, plus AI appendix if needed)',
      'inputA.txt & inputB.txt (two boundary edge cases designed by you)',
      'outputA.txt & outputB.txt (outputs generated by your simulator)'
    ],
    compilerLinux: 'g++ -std=c++11 project1.cpp -o project1',
    compilerMac: 'clang++ -std=c++11 project1.cpp -o project1',
    runCommand: './project1 < input.txt',
    diffCommand: './project1 < input1.txt > my1.txt && diff -u output1.txt my1.txt',
    reportRequirements: [
      'The PCB: every field, its C++ type, and detailed justification for why it exists.',
      'Data structures used for Q0, Q1, and Q2 (justifying selection, e.g. FIFOs, priority list, deque).',
      'Two realistic edge cases actually executed (not single process alone at t=0).',
      'For each edge case: input, why it is an edge case, critical decision at boundary, Gantt chart, metrics.'
    ],
    edgeCaseRequirements: [
      'Simultaneous events occurring at the exact same integer tick t (e.g. arrival vs finish vs demote).',
      'Quantum expiration occurring on the exact same tick a process finishes.',
      'Ties in Q1 SRTF (same remaining burst, resolved by entry time then PID).',
      'Process preempted by arrival with identical vs higher priority in Q0.',
      'CPU idle gaps and transitions.'
    ]
  },
  aiPolicy: {
    summary:
      'The course strictly mandates that students write their own simulator, PCB, and queue scheduling logic.',
    allowed: [
      'Asking AI to help parse redirected std::cin input (reading q0, q1, N, and N lines).',
      'Troubleshooting specific bugs in code you already wrote (showing failing input + your code).',
      'Clarifying hand traces of sample scenarios.'
    ],
    prohibited: [
      'Uploading this handout or substantial copies to an AI tool.',
      'Asking AI to write the scheduler, PCB, queue logic, or complete simulator.',
      'Submitting AI-generated code as your own work.'
    ],
    appendixRequirement:
      'If any generative AI was used, an appendix must list prompts, what did not work and why, and the hardest bug fixed yourself.'
  },
  starterInputParserCpp: `/**
 * CS 3113 - Operating Systems - Fall 2026
 * Project 1: Multilevel Feedback Queue (MLFQ) Simulator
 * File: project1.cpp
 *
 * Compilation:
 *   Linux: g++ -std=c++11 project1.cpp -o project1
 *   macOS: clang++ -std=c++11 project1.cpp -o project1
 * Execution:
 *   ./project1 < input.txt
 *
 * AI Policy Compliance Note:
 *   Standard input parsing boilerplate permitted per course guidelines.
 *   Core scheduling, queues, and PCB logic must be written by the student.
 */

#include <iostream>
#include <vector>
#include <deque>
#include <string>
#include <algorithm>

using namespace std;

// Process State Enum
enum ProcessState {
    NEW,
    READY,
    RUNNING,
    TERMINATED
};

// Process Control Block (PCB)
struct PCB {
    int pid;                // Process ID
    int burst;              // Original total CPU burst
    int arrival;            // Arrival time in Q0
    int priority;           // Priority (1 = highest urgency)
    
    int remaining_burst;    // Remaining CPU burst time
    int current_queue;      // 0 = Q0, 1 = Q1, 2 = Q2
    int leftover_q0_budget; // Remaining q0 quantum
    int q1_consumed;        // Time spent in Q1
    int q1_entry_time;      // Timestamp of entry into Q1 (for ties)
    int q2_entry_time;      // Timestamp of entry into Q2 (FCFS key)
    
    int first_dispatch_time;// Time of first CPU dispatch (for response time)
    int finish_time;        // Time of termination (for turnaround time)
    ProcessState state;     // NEW, READY, RUNNING, TERMINATED
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int q0, q1;
    if (!(cin >> q0 >> q1)) return 0;

    int N;
    if (!(cin >> N)) return 0;

    vector<PCB> processes;
    processes.reserve(N);

    for (int i = 0; i < N; ++i) {
        PCB p;
        cin >> p.pid >> p.burst >> p.arrival >> p.priority;
        p.remaining_burst = p.burst;
        p.current_queue = 0;
        p.leftover_q0_budget = q0;
        p.q1_consumed = 0;
        p.q1_entry_time = -1;
        p.q2_entry_time = -1;
        p.first_dispatch_time = -1;
        p.finish_time = -1;
        p.state = NEW;
        processes.push_back(p);
    }

    // TODO: Implement Simulator Loop at each integer time t:
    // 1. Admit arrivals (arrival == t) into Q0
    // 2. Preempt if needed (close slice with ", preempted")
    // 3. Select next process according to Q0 -> Q1 -> Q2 rules
    // 4. Run 1 time unit (or jump clock if idle)
    // 5. Finish or demote (terminate if remaining == 0, demote to Q1 if Q0 budget == 0, demote to Q2 if Q1 consumed == q1)

    return 0;
}
`
};
