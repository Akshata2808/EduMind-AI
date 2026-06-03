import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import pdf from 'pdf-parse';
import { protect, optionalProtect } from '../middleware/auth.js';
import Note from '../models/Note.js';
import { generateText } from '../utils/geminiClient.js';
import Memory from '../models/Memory.js';
import { matchIntent } from '../utils/knowledgeGraph.js';
import { mockRoadmaps } from '../utils/mockRoadmaps.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/chat', optionalProtect, async (req, res) => {
  try {
    const { message, mode } = req.body;
    
    // Check if the query matches our local curriculum knowledge graph
    const match = matchIntent(message);
    if (match) {
      return res.json({ 
        answer: match.answer, 
        isLocal: true, 
        source: match.topic 
      });
    }

    const system = mode === 'mumbai' ? 'Explain like a Mumbai engineering student, friendly and practical.' : 'Explain clearly for an engineering student.';
    const prompt = `${system}\nUser: ${message}\nAssistant:`;
    const answer = await generateText(prompt);
    return res.json({ answer, isLocal: false });
  } catch (error) {
    console.warn("Gemini Chat failed, utilizing local fallback chat routing:", error.message);
    const msg = req.body.message?.toLowerCase().trim() || '';
    let fallbackText = '';

    if (msg.includes('syllabus') || msg.includes('mumbai') || msg.includes('mu') || msg.includes('curriculum')) {
      fallbackText = `🎓 **Mumbai University (MU) Computer Engineering Syllabus Outline**

Semester 5 & 6 Core Theory Subjects:
* **Operating Systems**: Processes, Threading, Scheduling (FCFS, SJF, RR), Semaphores, Deadlocks, Paging, Page Replacement, Disk IO.
* **Database Management Systems**: Schema design, Relational Algebra, SQL triggers, Normalization (1NF to BCNF), Transaction ACID, Recovery.
* **Computer Networks**: OSI vs TCP/IP models, Data link flow protocols, Subnet calculations, Distance/Link-State routing, TCP handshake, UDP.
* **Web Computing**: Modern frontend UI (React components, state/hooks), Node & Express endpoints, REST architecture, Session management.

*(Note: Gemini AI is currently offline or rate-limited. This curriculum checklist was loaded locally by the EduMind AI router.)*`;
    } else if (msg.includes('operating') || msg.includes('os') || msg.includes('kernel') || msg.includes('scheduling')) {
      fallbackText = `💻 **Operating Systems (OS) Core Study Guide**

Here are key syllabus concepts you should focus on for your OS exam:
1. **CPU Scheduling**: FCFS, Shortest Job First (SJF), and Round Robin (RR). Remember that Round Robin is preemptive and FCFS is non-preemptive.
2. **Deadlocks**: The four Coffman conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait) and Banker's Avoidance algorithm.
3. **Memory Management**: Virtual Memory, Paging, and Page replacement algorithms (FIFO, LRU, Optimal).
4. **Disk Scheduling**: FCFS, SSTF, SCAN, and LOOK algorithms.

*(Note: Gemini AI is currently offline or rate-limited. This OS guide was loaded locally by the EduMind AI router.)*`;
    } else if (msg.includes('dbms') || msg.includes('database') || msg.includes('sql') || msg.includes('norm')) {
      fallbackText = `📊 **Database Management Systems (DBMS) Core Study Guide**

Focus on these concepts to secure maximum marks in university papers:
1. **ER Diagrams**: Strong vs Weak entity sets, cardinalities, generalization, and aggregation.
2. **Relational Schema**: Translating ER models to tables and writing Relational Algebra queries.
3. **SQL Queries**: Joins, subqueries, grouping (GROUP BY, HAVING), and triggers.
4. **Normalization**: Eliminating anomalies using 1NF, 2NF, 3NF, and BCNF rules.
5. **Transactions**: Ensuring ACID properties and resolving concurrency issues using 2-Phase Locking (2PL).

*(Note: Gemini AI is currently offline or rate-limited. This DBMS guide was loaded locally by the EduMind AI router.)*`;
    } else if (msg.includes('network') || msg.includes('cn') || msg.includes('tcp') || msg.includes('udp') || msg.includes('ip')) {
      fallbackText = `🌐 **Computer Networks (CN) Core Study Guide**

Top concepts to study for your networking paper:
1. **Model Stack**: OSI 7-Layer reference model vs the TCP/IP stack layers.
2. **Flow & Error Control**: Sliding window mechanics (Stop-and-Wait, Go-Back-N, Selective Repeat) and CRC checksums.
3. **IP Subnetting**: Classless routing (CIDR), subnet masks, and network ranges.
4. **Routing Algorithms**: Distance Vector routing (RIP) and Link State routing (OSPF).
5. **Transport Layer**: Reliable connection setup via the TCP 3-Way Handshake vs UDP datagram transmission.

*(Note: Gemini AI is currently offline or rate-limited. This networking guide was loaded locally by the EduMind AI router.)*`;
    } else {
      fallbackText = `👋 **Hello! I am EduMind AI, your Mumbai University engineering chatbot.**

I am currently operating in cached hybrid mode due to high external AI traffic. I can answer questions about your core syllabus topics immediately! 

Try asking me about:
* **"What is the syllabus for Operating Systems?"**
* **"Explain CPU Scheduling algorithms"**
* **"What is the difference between TCP and UDP?"**
* **"Explain Database Normalization (1NF, 2NF, 3NF)"**
* **"What are React Hooks?"**

*(Note: Gemini AI is currently offline or rate-limited. This fallback help card was loaded locally by the EduMind AI router.)*`;
    }

    return res.json({ answer: fallbackText, isLocal: true });
  }
});

// Smart revision generator
router.post('/revision', optionalProtect, async (req, res) => {
  const { subjects = [], examDate } = req.body;
  try {
    const subjText = subjects.length ? `Subjects: ${subjects.join(', ')}` : '';
    const prompt = `You are an AI revision assistant for engineering students. ${subjText}\nInstructions: Identify important topics, generate quick revision notes, probable viva questions, and prioritize chapters by scoring. Provide JSON output with keys: topics (array), notes (string), questions (array), priorities (array of {chapter,score}).`;
    const aiText = await generateText(prompt);
    // store weak subjects into Memory weakSubjects (only if logged in)
    if (req.user && subjects.length) {
      await Memory.findOneAndUpdate({ user: req.user._id }, { $addToSet: { weakSubjects: { $each: subjects } } }, { upsert: true });
    }
    return res.json({ raw: aiText });
  } catch (error) {
    console.error("Revision AI failed. Using local fallback.");
    const fallbackData = {
      topics: [
        `Core concepts of ${subjects.join(', ') || 'your subjects'}`,
        'Architectural design rules and trade-offs',
        'Numerical problems and performance models',
        'Best practices for optimization'
      ],
      notes: `### Quick Study Notes for ${subjects.join(', ') || 'Engineering Subjects'}\n\nHere are some high-yield study points to focus on:\n\n* **Divide & Conquer**: Break down your syllabus into manageable parts.\n* **Prioritize High-Scoring Modules**: Focus on chapters that carry the most weight in exam papers.\n* **Solve Old Papers**: Practice previous university exams for better retention.\n\n*(Note: Gemini API is currently unavailable or experiencing high demand. This basic study package was generated locally by the local EduMind revision coach.)*`,
      questions: [
        'What is the fundamental working principle of the main topics?',
        'Explain the core parameters and performance indicators.',
        'What are the common errors or exceptions encountered in this domain?',
        'Discuss how to scale or optimize this system.'
      ],
      priorities: [
        { chapter: `${subjects[0] || 'Unit 1'}: Foundational Concepts`, score: 90 },
        { chapter: `${subjects[1] || 'Unit 2'}: Architecture & Logic`, score: 85 },
        { chapter: 'Unit 3: Implementation & Analysis', score: 70 },
        { chapter: 'Unit 4: Advanced Scenarios & Testing', score: 50 }
      ]
    };
    return res.json({ raw: JSON.stringify(fallbackData) });
  }
});

// Career roadmap generator
router.post('/roadmap', protect, async (req, res) => {
  const { goal = '', branch = '', semester = '' } = req.body;
  try {
    const prompt = `Create a practical, student-friendly career roadmap for an engineering student whose goal is: "${goal}".
    Mention specific details tailored for engineering branch: "${branch}" and current semester: "${semester}".
    
    You must output a single valid JSON object ONLY. Do not write any conversational introduction or notes.
    
    The JSON structure MUST follow this exact schema:
    {
      "roadmap": [
        {
          "title": "Phase name (e.g. Phase 1: Foundations)",
          "description": "Short overview description of this phase (maximum 2 sentences).",
          "tasks": [
            "Actionable task or milestone 1 (very concise, 1 line)",
            "Actionable task or milestone 2 (very concise, 1 line)",
            "Actionable task or milestone 3 (very concise, 1 line)"
          ]
        }
      ],
      "skills": ["Skill 1", "Skill 2"],
      "projects": [
        {
          "name": "Project Name",
          "description": "Brief project description, stack, and functionality."
        }
      ],
      "interviewPrep": [
        "Core question/concept to study 1",
        "Core question/concept to study 2"
      ]
    }`;
    const aiText = await generateText(prompt);
    return res.json({ raw: aiText });
  } catch (error) {
    console.warn("Gemini career roadmap generation failed, utilizing local fallback roadmap:", error.message);
    
    // Match the user's goal keywords to the closest local preseeded roadmap
    const selectLocalRoadmap = (targetGoal) => {
      const normalized = targetGoal.toLowerCase().trim();
      if (normalized.includes('front') || normalized.includes('web') || normalized.includes('html') || normalized.includes('ui') || normalized.includes('react')) {
        return mockRoadmaps.frontend;
      }
      if (normalized.includes('back') || normalized.includes('server') || normalized.includes('database') || normalized.includes('node') || normalized.includes('sql') || normalized.includes('api')) {
        return mockRoadmaps.backend;
      }
      if (normalized.includes('ai') || normalized.includes('ml') || normalized.includes('machine') || normalized.includes('data') || normalized.includes('intelligence') || normalized.includes('deep')) {
        return mockRoadmaps.ai;
      }
      if (normalized.includes('devops') || normalized.includes('cloud') || normalized.includes('docker') || normalized.includes('kubernetes') || normalized.includes('aws') || normalized.includes('system')) {
        return mockRoadmaps.devops;
      }
      return mockRoadmaps.default;
    };

    const fallback = selectLocalRoadmap(goal);
    // Personalize the timeline steps using the user's branch and semester info
    const enrichedRoadmap = {
      ...fallback,
      roadmap: fallback.roadmap.map((phase, idx) => {
        let suffix = "";
        if (idx === 0) suffix = ` (${semester} - Kickstart)`;
        if (idx === 1) suffix = ` (${branch} Foundations)`;
        return {
          title: phase.title + suffix,
          description: phase.description,
          tasks: phase.tasks || []
        };
      })
    };

    return res.json({ raw: JSON.stringify(enrichedRoadmap) });
  }
});

// Flashcards generator
router.post('/flashcards', protect, async (req, res) => {
  const { topic = '', count = 10 } = req.body;
  try {
    const prompt = `Generate ${count} concise flashcards for the topic: ${topic}. Output as numbered lines Q: <question> - A: <answer>.`;
    const aiText = await generateText(prompt);
    return res.json({ raw: aiText });
  } catch (error) {
    console.warn("Gemini Flashcard generation failed, utilizing local fallback flashcards:", error.message);
    const normalized = req.body.topic?.toLowerCase().trim() || '';
    let mockResponse = '';

    if (normalized.includes('database') || normalized.includes('sql') || normalized.includes('norm') || normalized.includes('dbms') || normalized.includes('relation')) {
      mockResponse = `1. Q: What is Database Normalization? - A: The process of structuring a relational database to reduce data redundancy and improve data integrity.
2. Q: What is the main condition for First Normal Form (1NF)? - A: All attributes in a relation must have atomic values and no repeating groups.
3. Q: Explain Second Normal Form (2NF). - A: A relation is in 2NF if it is in 1NF and no non-prime attribute is transitionally or partially dependent on any candidate key.
4. Q: What is a Transitive Dependency in 3NF? - A: A functional dependency X -> Z where Y -> Z holds, and X -> Y holds, but Y does not functionally determine X.
5. Q: What is Boyce-Codd Normal Form (BCNF)? - A: A stronger version of 3NF where for every dependency X -> Y, the left side X must be a superkey.
6. Q: What is a Foreign Key? - A: A field in one table that uniquely identifies a row of another table, enforcing referential integrity.
7. Q: Explain the difference between JOIN and UNION. - A: JOIN combines columns from different tables based on a related column, while UNION combines the result-set of two or more queries vertically.
8. Q: What are ACID properties in DBMS? - A: Atomicity, Consistency, Isolation, and Durability, which guarantee database transactions are processed reliably.
9. Q: What is a Database Index? - A: A data structure that improves the speed of data retrieval operations on a table at the cost of additional writes and storage.
10. Q: What is the difference between Clustered and Non-Clustered Indexes? - A: A clustered index defines the physical order of data in the table, while a non-clustered index has a separate structure pointing to the data rows.`;
    } else if (normalized.includes('cpu') || normalized.includes('sched') || normalized.includes('process') || normalized.includes('os') || normalized.includes('operating')) {
      mockResponse = `1. Q: What is CPU Scheduling? - A: The process of allocating CPU time to processes in the ready queue to maximize processor utilization.
2. Q: What is the difference between Preemptive and Non-Preemptive scheduling? - A: Preemptive scheduling allows the OS to interrupt a running process, whereas non-preemptive scheduling runs the process until it yields or terminates.
3. Q: Explain First-Come, First-Served (FCFS) Scheduling. - A: A non-preemptive algorithm where the process that requests the CPU first gets allocated first. It suffers from the Convoy Effect.
4. Q: Explain Shortest Job First (SJF) Scheduling. - A: An algorithm that selects the process with the shortest CPU burst time. It is optimal but hard to predict in practice.
5. Q: What is Round Robin Scheduling? - A: A preemptive algorithm where each process is assigned a small fixed time slot (quantum) in a cyclic queue.
6. Q: What is a Deadlock? - A: A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process in the set.
7. Q: What are the 4 Coffman conditions for Deadlock? - A: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.
8. Q: What is Virtual Memory? - A: A memory management technique that uses secondary storage to make the computer appear to have more physical main memory than it does.
9. Q: Explain Paging and Page Faults. - A: Paging divides physical memory into blocks (frames) and logical memory into pages. A Page Fault occurs when a page requested by CPU is not currently in RAM.
10. Q: What is Thrashing in OS? - A: A state where the system spends more time swapping pages in and out of disk than executing instructions.`;
    } else if (normalized.includes('network') || normalized.includes('tcp') || normalized.includes('osi') || normalized.includes('ip') || normalized.includes('layer') || normalized.includes('handshake')) {
      mockResponse = `1. Q: What is the OSI Model? - A: Open Systems Interconnection model is a 7-layer conceptual framework for network communications.
2. Q: Name the 7 layers of the OSI model from bottom to top. - A: Physical, Data Link, Network, Transport, Session, Presentation, Application.
3. Q: Explain the TCP 3-way Handshake. - A: The process used to establish a TCP/IP connection: 1. client sends SYN, 2. server responds with SYN-ACK, 3. client replies with ACK.
4. Q: What is DNS (Domain Name System)? - A: A system that translates human-readable domain names (like google.com) into machine-readable IP addresses.
5. Q: What is the difference between TCP and UDP? - A: TCP is connection-oriented, reliable, and slower. UDP is connectionless, unreliable, and faster (used for streaming).
6. Q: What is an IP Address? - A: A unique numerical label assigned to each device participating in a computer network (IPv4 has 32 bits, IPv6 has 128 bits).
7. Q: Explain the purpose of the Network Layer. - A: It is responsible for routing packets from source to destination across multiple networks (utilizing IP addresses).
8. Q: What is a MAC Address? - A: Media Access Control address is a physical, hardware-encoded unique identifier assigned to a network interface controller (48 bits).
9. Q: What is the function of DHCP (Dynamic Host Configuration Protocol)? - A: Automatically assigns IP addresses and network configuration parameters to devices on a network.
10. Q: What is the difference between a Router and a Switch? - A: A router connects multiple networks (working at layer 3), while a switch connects devices within the same network (working at layer 2).`;
    } else if (normalized.includes('react') || normalized.includes('hook') || normalized.includes('front') || normalized.includes('state') || normalized.includes('prop')) {
      mockResponse = `1. Q: What is React.js? - A: A component-based open-source JavaScript library for building interactive user interfaces.
2. Q: What are React Components? - A: Reusable, independent blocks of UI code that accept inputs (props) and return React elements detailing what should appear on screen.
3. Q: What is useState? - A: A built-in React hook that allows functional components to declare and update local state variables.
4. Q: What is useEffect? - A: A React hook designed to perform side effects (like data fetching or subscription updates) in functional components.
5. Q: Explain React Props. - A: Properties passed from a parent component to a child component, which are read-only within the child.
6. Q: What is the Virtual DOM in React? - A: A lightweight in-memory representation of the real DOM. React updates the virtual DOM first, diffs it, and then patches the real DOM.
7. Q: What is the difference between state and props? - A: State is managed locally within the component and can change; props are passed from parents and are immutable.
8. Q: What are React Hooks? - A: Functions that let you "hook into" React state and lifecycle features from functional components.
9. Q: Why do React lists need "keys"? - A: Keys help React identify which items have changed, been added, or been removed, ensuring efficient re-rendering.
10. Q: What is Redux? - A: A predictable state container library for managing global application state across complex React components.`;
    } else {
      mockResponse = `1. Q: What are the fundamental principles of ${req.body.topic || 'the topic'}? - A: It encompasses core architectural guidelines, trade-offs, and standards of engineering systems.
2. Q: What are the main benefits of using ${req.body.topic || 'this topic'}? - A: It enables system modularity, scaling capabilities, and optimization of resource consumption.
3. Q: What are the primary trade-offs in implementing ${req.body.topic || 'this topic'}? - A: System design requires balancing computational overhead, developer experience, and runtime latency.
4. Q: What is the standard industry recommendation for this? - A: Modern software teams use automated testing, static analysis, and CI/CD pipelines to validate configurations.
5. Q: How do engineers measure performance in this domain? - A: They use key telemetry metrics, tracing databases, and profiling benchmarks to find bottlenecks.
6. Q: What is the first step in troubleshooting a failure here? - A: Isolate the component stack, review trace logs, and inspect local test conditions.
7. Q: Discuss the integration properties for this setup. - A: It uses standard API contracts and clean serialization formats (like JSON) to transfer states.
8. Q: How does scaling affect this system? - A: Horizontal scaling partitions workloads across nodes, while vertical scaling adds resources to a single node.
9. Q: Detail a security consideration for this setup. - A: Secure transport protocols, access tokens, and parameter validation are required to prevent data leakage.
10. Q: What is the expected lifecycle of these resources? - A: They are initialized on-demand, cached for rapid access, and garbage collected when idle.`;
    }

    const cardsArray = mockResponse.split('\n');
    const finalCards = cardsArray.slice(0, Math.min(count, cardsArray.length)).join('\n');
    return res.json({ raw: finalCards });
  }
});

// Basic study analytics summary (AI assisted)
router.post('/analytics', protect, async (req, res) => {
  try {
    const { summaryData = '' } = req.body;
    const prompt = `You are a study analytics assistant. Given this data: ${summaryData}\nProvide a very concise, punchy, on-point diagnostic report with direct insights about consistency, retention, materials, and exam eligibility. Limit the response to 4 short bullet points and a brief conclusion, keeping it under 120 words total. Do not use verbose introductions.`;
    const aiText = await generateText(prompt);
    return res.json({ raw: aiText });
  } catch (error) {
    console.warn("Analytics AI failed. Using local fallback.");
    const { summaryData = '' } = req.body;
    let attendance = '75%';
    let notes = '0';
    let accuracy = '70%';
    let progress = '50%';
    let streak = '0 days';

    const attMatch = summaryData.match(/Attendance:\s*(\d+%?)/i);
    const notesMatch = summaryData.match(/Notes Uploaded:\s*(\d+)/i);
    const accMatch = summaryData.match(/Quiz Accuracy:\s*(\d+%?)/i);
    const progMatch = summaryData.match(/Planner Progress:\s*(\d+%?)/i);
    const streakMatch = summaryData.match(/Study Streak:\s*(\d+\s*\w*)/i);
    
    if (attMatch) attendance = attMatch[1];
    if (notesMatch) notes = notesMatch[1];
    if (accMatch) accuracy = accMatch[1];
    if (progMatch) progress = progMatch[1];
    if (streakMatch) streak = streakMatch[1];

    const attNum = parseInt(attendance) || 0;
    const accNum = parseInt(accuracy) || 0;
    const progNum = parseInt(progress) || 0;

    const fallbackReport = `### 📋 EduMind Academic Audit

**Syllabus Metrics:**
* **Attendance:** ${attendance} (${attNum >= 75 ? 'Eligible' : 'Debarment Risk'})
* **Material Uploaded:** ${notes} items
* **Quiz Accuracy:** ${accuracy}
* **Planner Progress:** ${progress}
* **Active Streak:** ${streak}

---

#### 🔍 Critical Diagnostics:
* **Consistency**: ${progNum >= 80 ? 'Planner progress is excellent. Keep this pace!' : 'Planner progress is low. Dedicate 20 mins/day to clear pending units.'}
* **Retention**: ${accNum >= 60 ? 'Quiz accuracy is solid. Maintain weekly tests.' : 'Quiz accuracy is weak. Review concepts in AI Chat before testing.'}
* **Exam Ready**: ${attNum >= 75 ? 'Attendance is on track. You are exam-eligible.' : 'Warning: Attendance is below 75%. Prioritize next lectures.'}`;

    return res.json({ raw: fallbackReport });
  }
});

// AI Maths solver step-by-step
router.post('/maths', protect, async (req, res) => {
  try {
    const { problem = '' } = req.body;
    const prompt = `You are an expert engineering mathematics solver.
Solve the following mathematical problem step-by-step: "${problem}".

You must output a single valid JSON object ONLY. Do not write any conversational introduction, markdown codeblock wrapper, or extra text.

The JSON structure MUST follow this exact schema:
{
  "overview": "Short introduction or formula to be used.",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Title of the step (e.g. Find Determinant)",
      "explanation": "Detailed explanation of this step, writing all math equations in clean LaTeX formatting.",
      "diagramLabel": "A short 1-3 word label for a flowchart node representing this step (e.g. 'Det Matrix')"
    }
  ],
  "finalAnswer": "The final mathematical result formatted in LaTeX."
}`;
    const aiText = await generateText(prompt);
    return res.json({ raw: aiText });
  } catch (error) {
    console.warn("Math AI Solver failed, utilizing local fallback solver:", error.message);
    const prob = req.body.problem?.toLowerCase().trim() || '';
    let fallbackData = {};

    if (prob.includes('inverse') || prob.includes('matrix')) {
      fallbackData = {
        overview: "Find the inverse of a 3x3 matrix $$A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{pmatrix}$$ using the Adjunct Formula: $$A^{-1} = \\frac{1}{|A|} \\cdot \\text{adj}(A)$$.",
        steps: [
          {
            stepNumber: 1,
            title: "Calculate the Determinant",
            explanation: "Find $|A|$ by expanding along the first row:\n$$|A| = 1(1(0) - 4(6)) - 2(0(0) - 4(5)) + 3(0(6) - 1(5))$$\n$$|A| = 1(-24) - 2(-20) + 3(-5) = -24 + 40 - 15 = 1$$. Since $|A| \\neq 0$, the inverse exists.",
            diagramLabel: "Det Calculation"
          },
          {
            stepNumber: 2,
            title: "Find Matrix of Co-factors",
            explanation: "Compute co-factors $C_{ij} = (-1)^{i+j} M_{ij}$ for all 9 cells:\n* $C_{11} = -24$, $C_{12} = 20$, $C_{13} = -5$\n* $C_{21} = 18$, $C_{22} = -15$, $C_{23} = 4$\n* $C_{31} = 5$, $C_{32} = -4$, $C_{33} = 1$",
            diagramLabel: "Co-factor Matrix"
          },
          {
            stepNumber: 3,
            title: "Transpose to Find Adjunct",
            explanation: "Transpose the co-factor matrix to obtain $\\text{adj}(A)$:\n$$\\text{adj}(A) = C^T = \\begin{pmatrix} -24 & 18 & 5 \\\\ 20 & -15 & -4 \\\\ -5 & 4 & 1 \\end{pmatrix}$$.",
            diagramLabel: "Transpose Matrix"
          },
          {
            stepNumber: 4,
            title: "Divide Adjunct by Determinant",
            explanation: "Since $|A| = 1$, the final inverse is simply equal to the adjunct matrix.",
            diagramLabel: "Final Division"
          }
        ],
        finalAnswer: "$$A^{-1} = \\begin{pmatrix} -24 & 18 & 5 \\\\ 20 & -15 & -4 \\\\ -5 & 4 & 1 \\end{pmatrix}$$"
      };
    } else if (prob.includes('integral') || prob.includes('calculus') || prob.includes('dx')) {
      fallbackData = {
        overview: "Evaluate the integral of $x \\ln(x) \\, dx$ using Integration by Parts formula: $$\\int u \\, dv = uv - \\int v \\, du$$.",
        steps: [
          {
            stepNumber: 1,
            title: "Choose Parts (LIATE Rule)",
            explanation: "By LIATE rule, logarithmic functions take priority for $u$:\n* Let $u = \\ln(x) \\implies du = \\frac{1}{x} \\, dx$\n* Let $dv = x \\, dx \\implies v = \\frac{x^2}{2}$",
            diagramLabel: "Parts Definition"
          },
          {
            stepNumber: 2,
            title: "Apply Integration by Parts Formula",
            explanation: "Substitute parts into the formula:\n$$\\int x \\ln(x) \\, dx = \\ln(x) \\cdot \\frac{x^2}{2} - \\int \\frac{x^2}{2} \\cdot \\frac{1}{x} \\, dx$$\n$$\\int x \\ln(x) \\, dx = \\frac{x^2 \\ln(x)}{2} - \\frac{1}{2} \\int x \\, dx$$",
            diagramLabel: "Formula Expansion"
          },
          {
            stepNumber: 3,
            title: "Integrate Remaining Term",
            explanation: "Find the integral of the second half:\n$$\\frac{1}{2} \\int x \\, dx = \\frac{1}{2} \\cdot \\frac{x^2}{2} = \\frac{x^2}{4}$$\nCombine terms and add the constant of integration $C$.",
            diagramLabel: "Integration Step"
          }
        ],
        finalAnswer: "$$\\int x \\ln(x) \\, dx = \\frac{x^2 \\ln(x)}{2} - \\frac{x^2}{4} + C$$"
      };
    } else {
      fallbackData = {
        overview: "Solve the linear equation $2x + 5 = 15$ for variable $x$.",
        steps: [
          {
            stepNumber: 1,
            title: "Isolate Variable Term",
            explanation: "Subtract 5 from both sides of the equation:\n$$2x = 15 - 5$$\n$$2x = 10$$",
            diagramLabel: "Isolate x"
          },
          {
            stepNumber: 2,
            title: "Divide to Solve",
            explanation: "Divide both sides by 2:\n$$x = \\frac{10}{2}$$\n$$x = 5$$",
            diagramLabel: "Solve Variable"
          }
        ],
        finalAnswer: "$$x = 5$$"
      };
    }

    return res.json({ raw: JSON.stringify(fallbackData) });
  }
});

router.post('/summarize', protect, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'PDF file required' });
  try {
    const dataBuffer = await fs.readFile(req.file.path);
    const data = await pdf(dataBuffer);
    const text = data.text.slice(0, 12000);
    let summary, points, questions;
    try {
      summary = await generateText(`Summarize these notes in a calm premium UI style:\n${text}`);
    } catch (e) {
      console.warn("Gemini Summary failed. Using local fallback.");
      summary = `**Document Overview:**\nThis document (titled "${req.file.originalname}") contains lecture notes and reference materials.\n\n**Key Context Extract:**\n${text.slice(0, 800).trim()}...\n\n*(Note: Gemini API is currently unavailable or experiencing high demand. This overview has been generated locally by the EduMind indexing engine.)*`;
    }

    try {
      points = await generateText(`List 5 important points from these notes:\n${text}`);
    } catch (e) {
      console.warn("Gemini Points failed. Using local fallback.");
      const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 25).slice(0, 5);
      if (sentences.length < 3) {
        points = "1. Verify key definitions and terms in the text.\n2. Review any diagrams and flowcharts in your lecture slide.\n3. Solve the numerical problems in the exercises.\n4. Study the core architectural constraints.\n5. Compare trade-offs between standard parameters.";
      } else {
        points = sentences.map((s, idx) => `${idx + 1}. ${s}.`).join('\n');
      }
    }

    try {
      questions = await generateText(`Create 4 viva questions based on these notes:\n${text}`);
    } catch (e) {
      console.warn("Gemini Questions failed. Using local fallback.");
      questions = "1. What is the main engineering problem addressed in these notes?\n2. Detail the primary advantages and disadvantages of this setup.\n3. Explain the step-by-step logic or algorithm described.\n4. How would you optimize the performance of this system?";
    }

    const note = await Note.create({
      user: req.user._id,
      title: req.file.originalname,
      summary,
      highlights: points.split('\n').filter(Boolean),
      questions: questions.split('\n').filter(Boolean),
      fileName: req.file.originalname
    });
    await fs.unlink(req.file.path).catch(() => {});
    return res.json({ note });
  } catch (error) {
    return res.status(500).json({ message: 'PDF processing failed', error: error.message });
  }
});

export default router;
