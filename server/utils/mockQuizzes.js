export const mockQuizzes = {
  "database normalization": [
    {
      question: "Which normal form requires all attributes to be atomic (no multi-valued attributes)?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      answer: "1NF"
    },
    {
      question: "To be in Second Normal Form (2NF), a relation must be in 1NF and have no what?",
      options: ["Partial dependencies", "Transitive dependencies", "Multi-valued dependencies", "Join dependencies"],
      answer: "Partial dependencies"
    },
    {
      question: "Third Normal Form (3NF) eliminates what kind of functional dependency?",
      options: ["Transitive dependencies", "Partial dependencies", "Trivial dependencies", "Multi-valued dependencies"],
      answer: "Transitive dependencies"
    },
    {
      question: "A table is in BCNF if and only if for every non-trivial functional dependency X -> Y, X is a:",
      options: ["Super Key", "Candidate Key", "Primary Key", "Foreign Key"],
      answer: "Super Key"
    },
    {
      question: "Which normal form is concerned with multi-valued dependencies (MVDs)?",
      options: ["4NF", "3NF", "BCNF", "5NF"],
      answer: "4NF"
    },
    {
      question: "Lossless-join decomposition and dependency preservation are guaranteed up to which normal form?",
      options: ["3NF", "BCNF", "4NF", "2NF"],
      answer: "3NF"
    },
    {
      question: "What is a functional dependency where a non-prime attribute depends on another non-prime attribute?",
      options: ["Transitive Dependency", "Partial Dependency", "Full Functional Dependency", "Trivial Dependency"],
      answer: "Transitive Dependency"
    },
    {
      question: "If a relation is in BCNF, it is also automatically in:",
      options: ["3NF, 2NF, and 1NF", "4NF and 5NF", "Only 3NF", "None of these"],
      answer: "3NF, 2NF, and 1NF"
    },
    {
      question: "Which anomaly occurs when we cannot insert data because some other data is missing?",
      options: ["Insertion Anomaly", "Deletion Anomaly", "Update Anomaly", "Redundancy Anomaly"],
      answer: "Insertion Anomaly"
    },
    {
      question: "Decomposition of a relation is done to eliminate which database issue?",
      options: ["Redundancy and Anomalies", "Primary Keys", "Table Joins", "Query Speed"],
      answer: "Redundancy and Anomalies"
    }
  ],
  "cpu scheduling": [
    {
      question: "Which scheduling algorithm can result in starvation (indefinite postponement)?",
      options: ["Shortest Job First (SJF)", "Round Robin (RR)", "First-Come First-Served (FCFS)", "FIFO"],
      answer: "Shortest Job First (SJF)"
    },
    {
      question: "What parameter does Round Robin scheduling rely on to preempt running processes?",
      options: ["Time Quantum", "Priority Level", "Burst Time", "Arrival Order"],
      answer: "Time Quantum"
    },
    {
      question: "Which of the following is a non-preemptive scheduling algorithm?",
      options: ["FCFS", "Round Robin", "SRTF", "Preemptive Priority"],
      answer: "FCFS"
    },
    {
      question: "What is the term for the time elapsed from process submission to its completion?",
      options: ["Turnaround Time", "Waiting Time", "Response Time", "Burst Time"],
      answer: "Turnaround Time"
    },
    {
      question: "Which CPU scheduling algorithm is optimal because it minimizes average waiting time?",
      options: ["Shortest Job First (SJF)", "Round Robin", "FCFS", "Priority Scheduling"],
      answer: "Shortest Job First (SJF)"
    },
    {
      question: "In priority scheduling, aging is a technique used to solve the problem of:",
      options: ["Starvation", "Deadlock", "Context Switching", "Race Conditions"],
      answer: "Starvation"
    },
    {
      question: "What is the process of switching the CPU from one process or thread to another called?",
      options: ["Context Switch", "Interrupt Handler", "Process Scheduler", "System Call"],
      answer: "Context Switch"
    },
    {
      question: "Which scheduler controls the degree of multiprogramming by choosing processes from the spool?",
      options: ["Long-term Scheduler", "Short-term Scheduler", "Medium-term Scheduler", "CPU Dispatcher"],
      answer: "Long-term Scheduler"
    },
    {
      question: "Turnaround time is calculated as:",
      options: ["Completion Time - Arrival Time", "Waiting Time - Burst Time", "Burst Time + Response Time", "Completion Time - Burst Time"],
      answer: "Completion Time - Arrival Time"
    },
    {
      question: "What scheduling algorithm assigns the CPU to the process that has the smallest remaining burst time?",
      options: ["Shortest Remaining Time First (SRTF)", "SJF", "Round Robin", "FCFS"],
      answer: "Shortest Remaining Time First (SRTF)"
    }
  ],
  "tcp/ip vs osi layers": [
    {
      question: "How many layers are in the ISO-OSI reference model compared to the standard TCP/IP model?",
      options: ["7 layers in OSI, 4 layers in TCP/IP", "5 layers in OSI, 7 layers in TCP/IP", "7 layers in OSI, 7 layers in TCP/IP", "6 layers in OSI, 5 layers in TCP/IP"],
      answer: "7 layers in OSI, 4 layers in TCP/IP"
    },
    {
      question: "Which OSI layer is responsible for logical addressing, routing, and path determination?",
      options: ["Network Layer", "Transport Layer", "Data Link Layer", "Physical Layer"],
      answer: "Network Layer"
    },
    {
      question: "At which layer of the OSI model does encryption, decryption, and compression occur?",
      options: ["Presentation Layer", "Application Layer", "Session Layer", "Transport Layer"],
      answer: "Presentation Layer"
    },
    {
      question: "What are the protocol data units (PDUs) at the Transport layer called?",
      options: ["Segments", "Packets", "Frames", "Bits"],
      answer: "Segments"
    },
    {
      question: "Which TCP/IP protocol is connection-oriented and guarantees reliable, ordered delivery?",
      options: ["TCP", "UDP", "IP", "ICMP"],
      answer: "TCP"
    },
    {
      question: "Which OSI layer ensures error-free transfer of frames over the physical link using MAC addresses?",
      options: ["Data Link Layer", "Network Layer", "Physical Layer", "Session Layer"],
      answer: "Data Link Layer"
    },
    {
      question: "What is the three-way handshake sequence used by TCP to establish a connection?",
      options: ["SYN, SYN-ACK, ACK", "SYN, ACK, SYN-ACK", "ACK, SYN, SYN-ACK", "SYN, SYN, ACK"],
      answer: "SYN, SYN-ACK, ACK"
    },
    {
      question: "Which protocol operates at the Application layer and resolves human-readable domain names to IP addresses?",
      options: ["DNS", "DHCP", "FTP", "ARP"],
      answer: "DNS"
    },
    {
      question: "What is the role of ARP (Address Resolution Protocol)?",
      options: ["Resolve IP addresses to MAC addresses", "Resolve MAC addresses to IP addresses", "Assign dynamic IP addresses", "Route packets between routers"],
      answer: "Resolve IP addresses to MAC addresses"
    },
    {
      question: "Which layer of the OSI model sits directly between the Network and Session layers?",
      options: ["Transport Layer", "Data Link Layer", "Presentation Layer", "Application Layer"],
      answer: "Transport Layer"
    }
  ],
  "react hooks & lifecycle": [
    {
      question: "Which React hook is used to perform side effects in functional components?",
      options: ["useEffect", "useState", "useContext", "useReducer"],
      answer: "useEffect"
    },
    {
      question: "What does the second argument (dependency array) of useEffect control?",
      options: ["When the effect runs", "The return cleanup function", "The state variable name", "Error handling parameters"],
      answer: "When the effect runs"
    },
    {
      question: "How do you recreate the behavior of 'componentDidMount' using useEffect?",
      options: ["Pass an empty array [] as the dependency list", "Omit the dependency array", "Pass all state variables in the array", "Return a cleanup function"],
      answer: "Pass an empty array [] as the dependency list"
    },
    {
      question: "Which hook should be used to share state globally across multiple components without prop drilling?",
      options: ["useContext", "useRef", "useMemo", "useCallback"],
      answer: "useContext"
    },
    {
      question: "Which hook returns a mutable ref object whose .current property persists across renders without triggering a re-render?",
      options: ["useRef", "useState", "useMemo", "useCallback"],
      answer: "useRef"
    },
    {
      question: "Which hook is designed to memoize computed values so they are not re-calculated on every render?",
      options: ["useMemo", "useCallback", "useReducer", "useRef"],
      answer: "useMemo"
    },
    {
      question: "What is a key rule of React Hooks?",
      options: ["Only call hooks at the top level of your functional component", "Call hooks inside loops or conditions", "Call hooks from standard JavaScript helper functions", "Only use hooks in class components"],
      answer: "Only call hooks at the top level of your functional component"
    },
    {
      question: "How do you perform cleanup (e.g. clear intervals) inside useEffect?",
      options: ["Return a function from the useEffect callback", "Call a cleanUp() system hook", "Omit dependencies", "Run useEffect asynchronously"],
      answer: "Return a function from the useEffect callback"
    },
    {
      question: "Which hook is an alternative to useState for managing complex, multi-state transition logic?",
      options: ["useReducer", "useContext", "useMemo", "useCallback"],
      answer: "useReducer"
    },
    {
      question: "What is the purpose of useCallback hook?",
      options: ["Memoize callback functions to prevent unnecessary child re-renders", "Track the history of state changes", "Fetch remote API data asynchronously", "Bind state directly to input changes"],
      answer: "Memoize callback functions to prevent unnecessary child re-renders"
    }
  ],
  "operating systems deadlocks": [
    {
      question: "Which of the following is NOT one of Coffman's four conditions for deadlock?",
      options: ["Preemption", "Mutual Exclusion", "Hold and Wait", "Circular Wait"],
      answer: "Preemption"
    },
    {
      question: "Which algorithm is used in deadlock avoidance to verify the safety state of a resource allocation?",
      options: ["Banker's Algorithm", "Dijkstra's Algorithm", "Round Robin Algorithm", "Kruskal's Algorithm"],
      answer: "Banker's Algorithm"
    },
    {
      question: "If a system is in a 'Safe State', what does it guarantee?",
      options: ["No deadlock can occur", "A deadlock is guaranteed to occur", "All processes will complete immediately", "Memory is fully optimized"],
      answer: "No deadlock can occur"
    },
    {
      question: "What deadlock resolution strategy involves ignoring the problem entirely, assuming deadlocks are rare?",
      options: ["Ostrich Algorithm", "Deadlock Prevention", "Deadlock Avoidance", "Deadlock Detection"],
      answer: "Ostrich Algorithm"
    },
    {
      question: "In a Resource Allocation Graph (RAG), a cycle guarantees deadlock if and only if:",
      options: ["Each resource type has exactly one instance", "The system is in safe mode", "Multiple instances of each resource type exist", "Circular wait is disabled"],
      answer: "Each resource type has exactly one instance"
    },
    {
      question: "Which condition states that a resource can only be held by one process at a time?",
      options: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "Circular Wait"],
      answer: "Mutual Exclusion"
    },
    {
      question: "To prevent deadlocks, we can eliminate the Hold and Wait condition by:",
      options: ["Requiring processes to request all resources at once before starting", "Allowing resource preemption", "Sharing all resource allocations", "Using time slicing scheduler"],
      answer: "Requiring processes to request all resources at once before starting"
    },
    {
      question: "What is the drawback of deadlock prevention methods?",
      options: ["Low resource utilization and throughput", "High CPU cycles overhead", "Indefinite software lockups", "Requirement of specialized hardware"],
      answer: "Low resource utilization and throughput"
    },
    {
      question: "In the Banker's algorithm, what data structure tracks the maximum resources a process can request?",
      options: ["Max Matrix", "Allocation Matrix", "Available Vector", "Need Matrix"],
      answer: "Max Matrix"
    },
    {
      question: "The equation to calculate the additional resource need of a process is:",
      options: ["Need = Max - Allocation", "Need = Max + Allocation", "Need = Available - Allocation", "Need = Allocation - Max"],
      answer: "Need = Max - Allocation"
    }
  ],
  "data structures (trees & graphs)": [
    {
      question: "What is the worst-case search complexity in a standard Binary Search Tree (BST)?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      answer: "O(n)"
    },
    {
      question: "Which self-balancing binary search tree maintains a height difference (balance factor) of at most 1?",
      options: ["AVL Tree", "Red-Black Tree", "B-Tree", "Splay Tree"],
      answer: "AVL Tree"
    },
    {
      question: "Which tree traversal visits nodes in the order: Left, Right, Root?",
      options: ["Post-order Traversal", "Pre-order Traversal", "In-order Traversal", "Level-order Traversal"],
      answer: "Post-order Traversal"
    },
    {
      question: "Which algorithm is optimal for finding the shortest path in an unweighted graph?",
      options: ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Dijkstra's Algorithm", "Bellman-Ford Algorithm"],
      answer: "Breadth-First Search (BFS)"
    },
    {
      question: "Which data structure is typically used to implement Breadth-First Search (BFS) in a graph?",
      options: ["Queue", "Stack", "Priority Queue", "Linked List"],
      answer: "Queue"
    },
    {
      question: "What is the traversal sequence of an In-order traversal on a Binary Search Tree (BST)?",
      options: ["Ascending sorted order", "Descending sorted order", "Level-by-level order", "Randomized order"],
      answer: "Ascending sorted order"
    },
    {
      question: "Which graph traversal uses a Stack data structure (or recursion) to explore vertices?",
      options: ["DFS", "BFS", "Kruskal's", "Dijkstra's"],
      answer: "DFS"
    },
    {
      question: "What is a Minimum Spanning Tree (MST)?",
      options: ["A subset of edges that connects all vertices without cycles and with minimum total edge weight", "A path between two nodes with the lowest cost", "A balanced binary tree containing all vertices", "A directed acyclic graph representation"],
      answer: "A subset of edges that connects all vertices without cycles and with minimum total edge weight"
    },
    {
      question: "Which algorithm can find a Minimum Spanning Tree (MST) by greedily selecting the smallest edges?",
      options: ["Kruskal's Algorithm", "Dijkstra's Algorithm", "Floyd-Warshall Algorithm", "A* Search Algorithm"],
      answer: "Kruskal's Algorithm"
    },
    {
      question: "What is the maximum number of edges in a simple undirected graph with N vertices?",
      options: ["N*(N-1)/2", "N^2", "N*(N+1)/2", "N - 1"],
      answer: "N*(N-1)/2"
    }
  ],
  "sql vs nosql databases": [
    {
      question: "Which of the following is a primary characteristics of Relational (SQL) databases?",
      options: ["Structured schema and ACID compliance", "Dynamic schemas and horizontal scaling", "Document-oriented storage", "Key-Value pairs only"],
      answer: "Structured schema and ACID compliance"
    },
    {
      question: "What type of data storage does MongoDB use?",
      options: ["Document-based (JSON/BSON)", "Tabular rows and columns", "Wide-column store", "Graph nodes and edges"],
      answer: "Document-based (JSON/BSON)"
    },
    {
      question: "In the CAP Theorem, what do the letters C, A, and P stand for?",
      options: ["Consistency, Availability, Partition Tolerance", "Concurrency, Authority, Performance", "Caching, Availability, Processing", "Consistency, Authenticity, Portability"],
      answer: "Consistency, Availability, Partition Tolerance"
    },
    {
      question: "Which scaling method involves adding more resources (CPU, RAM) to a single database server?",
      options: ["Vertical Scaling", "Horizontal Scaling", "Sharding", "Replication"],
      answer: "Vertical Scaling"
    },
    {
      question: "What database feature enforces that transactions are processed reliably (Atomicity, Consistency, Isolation, Durability)?",
      options: ["ACID Properties", "CAP Theorem", "Normal Forms", "Indexing Rules"],
      answer: "ACID Properties"
    },
    {
      question: "Which SQL constraint ensures that a value in one table matches a value in another table?",
      options: ["Foreign Key", "Primary Key", "Unique Key", "Check Constraint"],
      answer: "Foreign Key"
    },
    {
      question: "Which NoSQL database type is optimal for social networks and recommendation engines?",
      options: ["Graph Store", "Key-Value Store", "Document Store", "Wide-Column Store"],
      answer: "Graph Store"
    },
    {
      question: "In database terminology, sharding refers to:",
      options: ["Splitting data horizontally across multiple database nodes", "Creating read replicas of tables", "Removing duplicate records", "Encrypting database backups"],
      answer: "Splitting data horizontally across multiple database nodes"
    },
    {
      question: "Which of the following is a major disadvantage of SQL databases compared to NoSQL?",
      options: ["Harder to scale horizontally across servers", "Lack of transactional consistency", "No support for complex joins", "Weak data schema enforcement"],
      answer: "Harder to scale horizontally across servers"
    },
    {
      question: "Which database system is an open-source relational database management system?",
      options: ["PostgreSQL", "Redis", "Cassandra", "MongoDB"],
      answer: "PostgreSQL"
    }
  ],
  "computer networks routing": [
    {
      question: "What is the main difference between IPv4 and IPv6 addresses?",
      options: ["IPv4 is 32-bit, IPv6 is 128-bit", "IPv4 is 64-bit, IPv6 is 128-bit", "IPv4 is 32-bit, IPv6 is 64-bit", "IPv4 uses letters, IPv6 uses only numbers"],
      answer: "IPv4 is 32-bit, IPv6 is 128-bit"
    },
    {
      question: "Which routing protocol is a Distance-Vector protocol and uses hop count as its metric?",
      options: ["Routing Information Protocol (RIP)", "Open Shortest Path First (OSPF)", "Border Gateway Protocol (BGP)", "Static Routing"],
      answer: "Routing Information Protocol (RIP)"
    },
    {
      question: "What protocol is used by routers to share routing details between different Autonomous Systems (AS) on the internet?",
      options: ["BGP", "OSPF", "RIP", "EIGRP"],
      answer: "BGP"
    },
    {
      question: "Which OSPF metric parameter is calculated based on the bandwidth of the link?",
      options: ["Cost", "Hop Count", "Delay", "Bandwidth Weight"],
      answer: "Cost"
    },
    {
      question: "What is the network mask for a CIDR notation IP block of /24?",
      options: ["255.255.255.0", "255.255.0.0", "255.255.255.128", "255.0.0.0"],
      answer: "255.255.255.0"
    },
    {
      question: "What type of address is used to send packet data to all hosts on a local subnet?",
      options: ["Broadcast Address", "Multicast Address", "Unicast Address", "Loopback Address"],
      answer: "Broadcast Address"
    },
    {
      question: "What is the primary function of NAT (Network Address Translation)?",
      options: ["Map private IP addresses to a public IP address", "Translate domain names to IP addresses", "Assign dynamic IP addresses automatically", "Encrypt packet headers at the routers"],
      answer: "Map private IP addresses to a public IP address"
    },
    {
      question: "Which loopback IP address is reserved for testing the TCP/IP stack locally on a machine?",
      options: ["127.0.0.1", "192.168.1.1", "10.0.0.1", "255.255.255.255"],
      answer: "127.0.0.1"
    },
    {
      question: "Which routing protocol uses Link-State logic and Dijkstra's algorithm to compute shortest paths?",
      options: ["OSPF", "RIP", "BGP", "ICMP"],
      answer: "OSPF"
    },
    {
      question: "What is the default port number used by HTTP and HTTPS connections respectively?",
      options: ["Port 80 and Port 443", "Port 80 and Port 8080", "Port 21 and Port 22", "Port 443 and Port 80"],
      answer: "Port 80 and Port 443"
    }
  ],
  "object-oriented programming (oop)": [
    {
      question: "Which OOP concept allows a subclass to provide a specific implementation of a method defined in its superclass?",
      options: ["Polymorphism (Method Overriding)", "Encapsulation", "Inheritance", "Abstraction"],
      answer: "Polymorphism (Method Overriding)"
    },
    {
      question: "What is the term for hiding internal object details and showing only essential interfaces?",
      options: ["Abstraction", "Encapsulation", "Polymorphism", "Inheritance"],
      answer: "Abstraction"
    },
    {
      question: "Which OOP pillar bundles state variables and methods into a single class and restricts direct access?",
      options: ["Encapsulation", "Inheritance", "Abstraction", "Interface definition"],
      answer: "Encapsulation"
    },
    {
      question: "What is an abstract class?",
      options: ["A class that cannot be instantiated directly and is meant to be subclassed", "A class with no methods", "A class containing only static constants", "A subclass that overrides all parent methods"],
      answer: "A class that cannot be instantiated directly and is meant to be subclassed"
    },
    {
      question: "Method overloading is an example of what type of polymorphism?",
      options: ["Compile-time Polymorphism", "Run-time Polymorphism", "Dynamic Binding", "Inherited Polymorphism"],
      answer: "Compile-time Polymorphism"
    },
    {
      question: "Which access modifier permits variables or methods to be accessible only within the same class?",
      options: ["private", "public", "protected", "default"],
      answer: "private"
    },
    {
      question: "What is the relationship described by class inheritance?",
      options: ["Is-a relationship", "Has-a relationship", "Part-of relationship", "Uses-a relationship"],
      answer: "Is-a relationship"
    },
    {
      question: "Which constructor is called automatically when no constructor is defined in a class?",
      options: ["Default Constructor", "Parameterized Constructor", "Copy Constructor", "Static Constructor"],
      answer: "Default Constructor"
    },
    {
      question: "What is multiple inheritance?",
      options: ["A class inheriting from more than one parent class", "A class having multiple subclasses", "A subclass inheriting from an interface", "Overloading constructors within a single class"],
      answer: "A class inheriting from more than one parent class"
    },
    {
      question: "Which OOP feature allows objects of different types to be treated as instances of a common superclass?",
      options: ["Polymorphism", "Encapsulation", "Data Hiding", "Composition"],
      answer: "Polymorphism"
    }
  ],
  "web security basics": [
    {
      question: "Which browser security mechanism restricts resources from being loaded from another origin unless permitted?",
      options: ["SOP (Same-Origin Policy)", "CORS (Cross-Origin Resource Sharing)", "CSRF (Cross-Site Request Forgery)", "CSP (Content Security Policy)"],
      answer: "SOP (Same-Origin Policy)"
    },
    {
      question: "What is the vulnerability where attackers inject malicious SQL commands into input fields to bypass database security?",
      options: ["SQL Injection (SQLi)", "Cross-Site Scripting (XSS)", "CSRF", "Man-in-the-Middle (MitM)"],
      answer: "SQL Injection (SQLi)"
    },
    {
      question: "Which attack tricks a user's browser into executing unwanted actions on a trusted site where the user is authenticated?",
      options: ["CSRF", "XSS", "Phishing", "DDoS"],
      answer: "CSRF"
    },
    {
      question: "What type of attack involves injecting executable scripts into web pages viewed by other users?",
      options: ["Cross-Site Scripting (XSS)", "SQL Injection", "CSRF", "DNS Poisoning"],
      answer: "Cross-Site Scripting (XSS)"
    },
    {
      question: "What is the primary protocol used to establish encrypted, secure communication between a browser and a server?",
      options: ["HTTPS (TLS/SSL)", "HTTP", "FTP", "SSH"],
      answer: "HTTPS (TLS/SSL)"
    },
    {
      question: "Which component of JWT (JSON Web Token) contains the actual payload data like user claims?",
      options: ["Payload / Body", "Header", "Signature", "Verify Key"],
      answer: "Payload / Body"
    },
    {
      question: "What is a recommended defense against CSRF attacks?",
      options: ["Anti-CSRF Tokens", "Input sanitization using regex", "HTTPS encryption", "Hashing passwords using bcrypt"],
      answer: "Anti-CSRF Tokens"
    },
    {
      question: "Which password hashing function includes a slow key derivation work factor and salt protection?",
      options: ["bcrypt", "MD5", "SHA-1", "SHA-256"],
      answer: "bcrypt"
    },
    {
      question: "What does the HttpOnly flag on cookies prevent?",
      options: ["Accessing cookies via JavaScript (protecting from XSS)", "Sending cookies over unencrypted HTTP", "Cross-site request forgery submissions", "Accessing cookies from subdomains"],
      answer: "Accessing cookies via JavaScript (protecting from XSS)"
    },
    {
      question: "What is a Salt in cryptography?",
      options: ["Random data added to passwords before hashing to protect against rainbow table attacks", "A key used to sign JWT tokens", "An encryption algorithm parameter", "A firewall configuration block"],
      answer: "Random data added to passwords before hashing to protect against rainbow table attacks"
    }
  ]
};
