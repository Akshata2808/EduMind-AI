/**
 * Local Knowledge Graph & Intent Router for EduMind AI
 * Resolves high-frequency engineering & Mumbai University syllabus topics
 * locally to demonstrate caching, hybrid routing, and speed benefits.
 */

const knowledgeBase = {
  cpu_scheduling: {
    keywords: ['cpu scheduling', 'round robin', 'fcfs', 'sjf', 'scheduling algorithm'],
    topic: 'CPU Scheduling Algorithms (OS)',
    answer: `📚 **CPU Scheduling Algorithms (Operating Systems)**

In Operating Systems, CPU scheduling determines which process in the ready queue gets allocated to the CPU. Here are the core algorithms:

1. **First-Come, First-Served (FCFS)**
   - *Logic*: Simplest algorithm. Processes are dispatched in the order they arrive (FIFO).
   - *Pros*: Simple to write and understand.
   - *Cons*: Non-preemptive. Suffers from the **Convoy Effect** (short processes wait behind long ones).

2. **Shortest Job First (SJF)**
   - *Logic*: Dispatches the process with the shortest CPU burst time next.
   - *Types*: Can be preemptive (Shortest Remaining Time First) or non-preemptive.
   - *Pros*: Proven to give the **minimum average waiting time** for a given set of processes.
   - *Cons*: Difficult to predict the length of the next CPU burst. Can cause **starvation** for long processes.

3. **Round Robin (RR)**
   - *Logic*: Preemptive scheduling designed for time-sharing systems. Each process gets a small unit of CPU time (called a **time quantum**, usually 10-100ms). If a process isn't done, it is preempted and put at the back of the queue.
   - *Pros*: Fair allocation. No starvation.
   - *Cons*: Heavily dependent on the time quantum size. If quantum is too small, context switching overhead degrades performance. If too large, it behaves like FCFS.

📊 **Syllabus Summary Table:**
| Algorithm | Preemptive? | Optimality | Drawback |
| :--- | :--- | :--- | :--- |
| **FCFS** | No | Low | Convoy Effect |
| **SJF** | Both | High (Minimum Wait) | Process Starvation |
| **Round Robin** | Yes | Medium | High Context Switch |`
  },
  database_normalization: {
    keywords: ['normalization', '1nf', '2nf', '3nf', 'bcnf', 'database normal'],
    topic: 'Database Normalization Forms (DBMS)',
    answer: `📊 **Database Normalization (DBMS)**

Normalization is the systematic process of organizing fields and tables of a database to minimize **redundancy** (duplication) and dependency, preventing insertion, update, and deletion anomalies.

1. **First Normal Form (1NF)**
   - *Rule*: All attributes must contain atomic (indivisible) values. No multi-valued or repeating columns.
   - *Example*: A cell cannot contain multiple phone numbers.

2. **Second Normal Form (2NF)**
   - *Rule*: Must be in 1NF AND all non-key columns must be **fully functionally dependent** on the primary key. Eliminates partial dependencies (where a column depends on only part of a composite primary key).

3. **Third Normal Form (3NF)**
   - *Rule*: Must be in 2NF AND there must be no **transitive dependencies**. (If A -> B and B -> C, then C should not depend on A through B; C must depend directly on the primary key).

4. **Boyce-Codd Normal Form (BCNF / 3.5NF)**
   - *Rule*: A stronger version of 3NF. For any functional dependency A -> B, the determinant **A must be a super key**.
   - *Crux*: Resolves anomalies when a table has multiple overlapping candidate keys.

💡 **Quick Cheat-Sheet:**
- **1NF**: Atomic values.
- **2NF**: No partial dependency.
- **3NF**: No transitive dependency.
- **BCNF**: Determinant is a Super Key.`
  },
  tcp_udp: {
    keywords: ['tcp', 'udp', 'tcp vs udp', 'transmission control', 'user datagram'],
    topic: 'TCP vs UDP Protocols (CN)',
    answer: `🌐 **TCP vs UDP Protocols (Computer Networks)**

Both TCP and UDP are Transport Layer protocols used for transmitting data across networks, but they serve different engineering use cases:

1. **Transmission Control Protocol (TCP)**
   - *Characteristics*: Connection-oriented, Reliable, Byte-stream.
   - *Mechanism*: Performs a **3-way handshake** (SYN -> SYN-ACK -> ACK) before transmission. Uses flow control (sliding window) and error recovery.
   - *Best For*: Web browsers, Email, File transfers (HTTP, SMTP, FTP) where data integrity is critical.

2. **User Datagram Protocol (UDP)**
   - *Characteristics*: Connectionless, Unreliable, Packet-stream (Datagrams).
   - *Mechanism*: "Fire-and-forget". Simply sends packets to destination without verifying if they arrived. No handshakes, no packet ordering.
   - *Best For*: Live streaming, VoIP, Gaming, DNS where speed is critical and minor packet loss is acceptable.

🔄 **Comparison Overview:**
| Metric | TCP | UDP |
| :--- | :--- | :--- |
| **Connection** | Connection-Oriented | Connectionless |
| **Speed** | Slower (Overhead) | Faster (No Handshake) |
| **Reliability** | Guaranteed delivery | Best effort (No recovery) |
| **Header Size** | 20-60 bytes | 8 bytes |`
  },
  deadlock: {
    keywords: ['deadlock', 'banker', 'bankers algorithm', 'deadlock prevention', 'deadlock avoidance'],
    topic: 'Deadlock Handling & Bankers Algorithm (OS)',
    answer: `🔒 **Deadlocks & Banker's Algorithm (OS)**

A **Deadlock** is a state where a set of processes are blocked because each process holds a resource and waits for another resource held by some other process in the set.

⚠️ **The 4 Coffman Conditions (Must hold simultaneously):**
1. **Mutual Exclusion**: Only one process can use a resource at a time.
2. **Hold and Wait**: Process holding resources can request new ones.
3. **No Preemption**: Resources cannot be forcibly taken from a process.
4. **Circular Wait**: A closed chain of processes exists where each waits for the next.

🛠️ **Banker's Algorithm (Deadlock Avoidance)**
Developed by Edsger Dijkstra, the Banker's Algorithm determines if allocating a resource will keep the system in a **Safe State**. If the allocation leads to an unsafe state, the request is denied.
- *Inputs*: 
  - **Max** (Maximum resource demands per process)
  - **Allocation** (Currently held resources)
  - **Available** (Unallocated resources)
  - **Need** (Need = Max - Allocation)
- *Process*: Simulates allocation to verify if a sequence exists where all processes can execute to completion.`
  },
  react_hooks: {
    keywords: ['react hook', 'useeffect', 'usestate', 'usecontext', 'hooks in react'],
    topic: 'React Core Hooks (Web Development)',
    answer: `⚛️ **Core React Hooks (Web Development)**

Hooks let you use state and other React features in functional components. The three most essential hooks are:

1. **useState**
   - *Purpose*: Declares state variables in a functional component.
   - *Syntax*: \`const [state, setState] = useState(initialValue);\`
   - *Triggers*: Calling \`setState\` triggers a component re-render.

2. **useEffect**
   - *Purpose*: Performs side effects (API calls, subscriptions, manual DOM changes).
   - *Syntax*:
     \`\`\`javascript
     useEffect(() => {
       // Effect logic
       return () => { /* Cleanup logic */ };
     }, [dependencies]);
     \`\`\`
   - *Rules*: Empty dependency array \`[]\` runs once on mount. Omitting dependency array runs on every render.

3. **useContext**
   - *Purpose*: Subscribes to React context to share global state (like theme or auth status) without manually passing props down through every level (prop drilling).`
  },
  mumbai_syllabus: {
    keywords: ['syllabus', 'mumbai university', 'curriculum', 'course outline'],
    topic: 'Mumbai University Computer Engineering Core Syllabus',
    answer: `🎓 **Mumbai University (MU) Computer Engineering Syllabus**

Here is the standard curriculum outline for Semester 5 and Semester 6 core theory modules:

1. **Operating Systems (OS)**
   - *Topics*: Process Management, CPU Scheduling (FCFS, SJF, RR), Process Synchronization, Deadlocks, Memory Management (Paging, Page Replacement), File Systems, Disk Scheduling.
2. **Database Management Systems (DBMS)**
   - *Topics*: ER Modeling, Relational Algebra, SQL, Normalization (1NF, 2NF, 3NF, BCNF), Transaction Concurrency Control (2PL, Timestamp), Recovery.
3. **Computer Networks (CN)**
   - *Topics*: OSI & TCP/IP Reference Models, Error Control (CRC, Go-Back-N), IP Addressing & Subnetting, Routing Protocols (OSPF, BGP), TCP Handshakes, Congestion Control.
4. **Web Computing / Dev**
   - *Topics*: Frontend Architecture (HTML, CSS, React hooks), Node & Express Backend Servers, REST APIs, Session Management, CORS.

💡 *Tip: Focus heavily on numerical scheduling questions and Normalization proofs to score 90+ in theory papers!*`
  },
  operating_system_overview: {
    keywords: ['operating system', 'operating systems', 'os overview', 'kernel'],
    topic: 'Operating Systems (OS) Syllabus Outline',
    answer: `💻 **Operating Systems (OS) Syllabus Outline**

Essential topics required for exams:

* **Process Management**: CPU Scheduling algorithms (FCFS, SJF, RR, Priority), Process synchronization models, Semaphores, Classic Problems (Producer-Consumer, Dining Philosophers).
* **Deadlocks**: Coffman conditions, Banker's resource avoidance, Prevention & Detection methods.
* **Memory Management**: Paging, Segmentation, Cache mapping, Page replacement algorithms (FIFO, LRU, Optimal).
* **Storage & Security**: Disk scheduling (SSTF, SCAN, C-SCAN), File allocation methods, Directory structures.`
  },
  dbms_overview: {
    keywords: ['dbms', 'database system', 'database overview'],
    topic: 'DBMS Syllabus Outline',
    answer: `📊 **Database Management Systems (DBMS) Syllabus Outline**

Core conceptual areas required for semester exams:

* **ER Modeling**: Entity, Weak Entity, Attribute types, Cardinality, Generalization, Aggregation.
* **Relational Algebra**: Select, Project, Join (Inner, Outer, Self), Division operations.
* **SQL**: Aggregate functions, Nested queries, Group By/Having, Triggers, Views.
* **Normalization**: functional dependency rules, 1NF, 2NF, 3NF, BCNF anomaly resolution.
* **Transactions**: ACID rules, Concurrency anomalies, 2-Phase Locking (2PL), Timestamp-based ordering.`
  },
  computer_networks_overview: {
    keywords: ['computer networks', 'computer network', 'networks overview'],
    topic: 'Computer Networks (CN) Syllabus Outline',
    answer: `🌐 **Computer Networks (CN) Syllabus Outline**

Key concepts to prioritize for networking exams:

* **Protocol Architecture**: OSI 7-Layer model, TCP/IP stack layers, differences and duties.
* **Error & Flow Control**: CRC error detection, Sliding Window Protocols (Stop-and-wait, Go-Back-N, Selective Repeat).
* **IP Addressing**: Subnet masking, CIDR notation, Supernetting, IPv4 vs IPv6 headers.
* **Routing**: Distance Vector (RIP), Link State (OSPF), Path Vector (BGP) routing algorithms.
* **Transport**: TCP connection setup (3-way handshake) and teardown, Flow control, UDP datagrams.`
  }
};

/**
 * Searches the knowledge graph for matching intent.
 * @param {string} prompt User message string
 * @returns {object|null} Matched record or null
 */
export const matchIntent = (prompt) => {
  if (!prompt) return null;
  const text = prompt.toLowerCase();
  
  for (const key of Object.keys(knowledgeBase)) {
    const item = knowledgeBase[key];
    const hasMatch = item.keywords.some(keyword => text.includes(keyword));
    if (hasMatch) {
      return {
        topic: item.topic,
        answer: item.answer
      };
    }
  }
  return null;
};
