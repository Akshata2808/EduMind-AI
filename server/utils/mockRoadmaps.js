export const mockRoadmaps = {
  "frontend": {
    roadmap: [
      {
        title: "Phase 1: Web Fundamentals & Modern JavaScript",
        description: "Master the building blocks of the web and core client-side scripting.",
        tasks: [
          "Master semantic HTML5 and responsive layout models (CSS Grid & Flexbox).",
          "Develop asynchronous JavaScript proficiency (promises, closures, API fetches).",
          "Learn Git version control and GitHub workflow basics."
        ]
      },
      {
        title: "Phase 2: React Core & Component Design",
        description: "Learn modern frontend framework architecture and design patterns.",
        tasks: [
          "Master React state management using useState, useEffect, and Context API.",
          "Style responsive interfaces with TailwindCSS and Framer Motion micro-animations.",
          "Configure bundlers like Vite and organize scalable folder structures."
        ]
      },
      {
        title: "Phase 3: State Management & Build Tooling",
        description: "Add complexity with global states, API caching, and automated tests.",
        tasks: [
          "Integrate Redux Toolkit or Zustand for robust global state management.",
          "Write core unit tests using Vitest/Jest and practice mock APIs.",
          "Implement react-router-dom for client-side nested routing."
        ]
      },
      {
        title: "Phase 4: Optimization & Deployment",
        description: "Focus on optimization, web security, and cloud release.",
        tasks: [
          "Optimize rendering speed via code-splitting, lazy-loading, and memoization.",
          "Defend against client-side vulnerabilities (XSS, CSRF, and data sanitization).",
          "Deploy build bundles to Vercel/Netlify with custom domain configurations."
        ]
      }
    ],
    skills: ["React.js", "JavaScript (ES6+)", "TailwindCSS", "CSS Grid & Flexbox", "State Management (Redux/Zustand)", "Vite Build System", "REST APIs Integration"],
    projects: [
      { name: "Interactive Learning Dashboard", description: "A high-fidelity dashboard built with React, styled with TailwindCSS, containing stats grids, dark-mode, and animations." },
      { name: "Real-time Chat Portal", description: "A communication platform using WebSockets (Socket.io) with user sessions, message history, and responsive layout." }
    ],
    interviewPrep: [
      "Explain React's virtual DOM reconciliation algorithm and keys constraint.",
      "What is the difference between client-side rendering (CSR) and server-side rendering (SSR)?",
      "Describe event delegation and how closure scope binds in JavaScript.",
      "How do you optimize React component rendering performance to prevent unnecessary re-renders?"
    ]
  },
  "backend": {
    roadmap: [
      {
        title: "Phase 1: Backend Language & Core Logic",
        description: "Develop server-side programming foundations and command line skills.",
        tasks: [
          "Master Node.js runtime environment, event loop, and asynchronous runtime logic.",
          "Learn standard scripting logic using Python or JavaScript.",
          "Use terminal commands and basic Linux file system operations."
        ]
      },
      {
        title: "Phase 2: API Architecture & Server Frameworks",
        description: "Learn to design structured routing pipelines and middleware systems.",
        tasks: [
          "Build robust RESTful API servers using Express.js or FastAPI.",
          "Create custom request validation and authentication middleware layers.",
          "Manage file upload parsing and configure CORS headers properly."
        ]
      },
      {
        title: "Phase 3: Database Integration & Caching",
        description: "Design relational or document schemas and implement caching databases.",
        tasks: [
          "Integrate MongoDB or PostgreSQL using Mongoose/Prisma ORMs.",
          "Master database indexing, migrations, and transactional isolation.",
          "Implement high-speed Redis caching for frequently queried endpoints."
        ]
      },
      {
        title: "Phase 4: Security, Authentication & Devops",
        description: "Secure and package backend microservices for server deployment.",
        tasks: [
          "Implement JWT authorization, password hashing (bcrypt), and rate limiters.",
          "Package the server dependencies into portable Docker container images.",
          "Deploy containerized microservices to AWS EC2 or Render."
        ]
      }
    ],
    skills: ["Node.js / Express.js", "MongoDB / PostgreSQL", "RESTful API Design", "Authentication (JWT & OAuth)", "Docker Containerization", "Redis Caching", "System Design Patterns"],
    projects: [
      { name: "Collaborative API Gateway", description: "A microservice API gateway handling JWT auth, rate-limiting middlewares, and database transactions." },
      { name: "File Storage & Media Processor Service", description: "A server system allowing file uploads, background compression tasks, and secure pre-signed download URLs." }
    ],
    interviewPrep: [
      "Describe Node.js event-driven architecture and how it processes non-blocking I/O.",
      "Explain database normalization (1NF to BCNF) vs denormalization in NoSQL databases.",
      "What are SQL indexes and how do they improve query lookup speed? What are the trade-offs?",
      "How do you secure server endpoints against SQL injection, XSS, and CSRF attacks?"
    ]
  },
  "ai": {
    roadmap: [
      {
        title: "Phase 1: Mathematical Foundations & Programming",
        description: "Establish core programming and key mathematics metrics for model analysis.",
        tasks: [
          "Master Python programming basics, data structures, and OOP patterns.",
          "Learn Linear Algebra (matrices, eigenvalues) and Calculus (derivatives, gradients).",
          "Study Probability, statistics, distributions, and hypothesis tests."
        ]
      },
      {
        title: "Phase 2: Data Manipulation & Classical ML",
        description: "Learn to process data frames and train classical models.",
        tasks: [
          "Manipulate structured data with Pandas, NumPy, and Matplotlib/Seaborn.",
          "Implement regression, decision trees, and clustering with Scikit-Learn.",
          "Apply feature scaling, cross-validation, and metrics evaluations."
        ]
      },
      {
        title: "Phase 3: Deep Learning & Neural Networks",
        description: "Deep dive into complex neural architectures and optimizers.",
        tasks: [
          "Build multi-layer neural networks using PyTorch or TensorFlow.",
          "Understand backpropagation, activation functions, and gradient descent.",
          "Explore convolutional models (CNNs) and recurrent models (LSTMs)."
        ]
      },
      {
        title: "Phase 4: Domain Specialization & Generative AI",
        description: "Focus on modern transformer models, vector stores, and prompt design.",
        tasks: [
          "Understand self-attention mechanisms and train Transformer models.",
          "Build RAG (Retrieval-Augmented Generation) pipelines using vector indexes (Chroma).",
          "Deploy custom ML model endpoints using Flask/FastAPI."
        ]
      }
    ],
    skills: ["Python", "NumPy & Pandas", "Scikit-Learn (ML)", "PyTorch / TensorFlow", "Neural Networks", "Generative AI & LLMs", "Vector Databases (Pinecone/Chroma)"],
    projects: [
      { name: "Predictive Housing Valuation Model", description: "A regression pipeline analyzing house attributes to forecast values with feature scaling and cross-validation." },
      { name: "Document RAG Chatbot Companion", description: "An AI system utilizing LangChain, Gemini API, and a vector store to retrieve and answer questions about PDFs." }
    ],
    interviewPrep: [
      "What is the difference between supervised, unsupervised, and reinforcement learning?",
      "Explain the bias-variance trade-off and methods to prevent overfitting (regularization, dropout).",
      "Describe how gradient descent optimizes weights and the purpose of learning rates.",
      "What is a Transformer model and how does the self-attention mechanism work?"
    ]
  },
  "devops": {
    roadmap: [
      {
        title: "Phase 1: System Admin & Scripting",
        description: "Master basic Linux operating systems and core scripting languages.",
        tasks: [
          "Master Linux command line, file hierarchies, and permission configs.",
          "Write task automation scripts using Bash or Python.",
          "Understand TCP/IP networking parameters (ports, DNS, firewalls)."
        ]
      },
      {
        title: "Phase 2: CI/CD Pipelines & Version Control",
        description: "Automate code validations and tests on remote commits.",
        tasks: [
          "Master Git branching models and merge conflict resolutions.",
          "Build CI/CD pipelines using GitHub Actions or GitLab CI.",
          "Automate build compiles and run unit testing sequences."
        ]
      },
      {
        title: "Phase 3: Containerization & Orchestration",
        description: "Isolate application runtimes and manage microservice clusters.",
        tasks: [
          "Containerize backend servers and frontend assets using Docker.",
          "Orchestrate multi-container deployments using Docker Compose.",
          "Manage auto-scaling and node failovers using Kubernetes."
        ]
      },
      {
        title: "Phase 4: Cloud Infrastructure & Monitoring",
        description: "Define infrastructure declarative scripts and observe system health.",
        tasks: [
          "Provision cloud environments (AWS, GCP) via Terraform IaC.",
          "Configure metrics logging and alarms using Prometheus and Grafana.",
          "Implement log rotation and secure network VPC policies."
        ]
      }
    ],
    skills: ["Linux & Bash Scripting", "CI/CD (GitHub Actions)", "Docker Containerization", "Kubernetes Orchestration", "Terraform (IaC)", "AWS / GCP Services", "Prometheus & Grafana"],
    projects: [
      { name: "Automated Multi-Stage CI/CD Pipeline", description: "A pipeline that runs unit tests, builds Docker images, and deploys to staging servers on git tags." },
      { name: "Infrastructure provisioning with Terraform", description: "Provision VPCs, EC2 instances, and RDS databases on AWS automatically using declarative script structures." }
    ],
    interviewPrep: [
      "What is the difference between virtualization (VMs) and containerization (Docker)?",
      "Describe the steps in a standard CI/CD pipeline from code commit to production release.",
      "What is Infrastructure as Code (IaC) and what are the benefits of declarative configurations?",
      "Explain Kubernetes architecture: Pods, Services, Deployments, and the role of the control plane."
    ]
  },
  "default": {
    roadmap: [
      {
        title: "Phase 1: Programming Foundations & Git",
        description: "Establish core logic, OOP basics, and code tracking practices.",
        tasks: [
          "Acquire basic language proficiency in Python, JavaScript, C++, or Java.",
          "Master object-oriented programming (OOP) principles and class design.",
          "Configure Git version control and practice committing changes."
        ]
      },
      {
        title: "Phase 2: Data Structures & Core Logic",
        description: "Master fundamental layout structures and database queries.",
        tasks: [
          "Learn standard arrays, lists, hash tables, trees, and Big O notation.",
          "Write basic database queries and design structured database schemas.",
          "Build standard command-line utility tools to practice algorithm logic."
        ]
      },
      {
        title: "Phase 3: Portfolio Engineering & Projects",
        description: "Convert knowledge into structured projects with clean code.",
        tasks: [
          "Design and build 2-3 custom software applications.",
          "Document your projects with markdown README files on GitHub.",
          "Write unit tests to verify component outputs."
        ]
      },
      {
        title: "Phase 4: Career Prep & Networking",
        description: "Structure professional portfolios and prepare for interviews.",
        tasks: [
          "Format resumes and clean up professional LinkedIn/GitHub profiles.",
          "Practice mock interview questions and oral viva explanations.",
          "Apply for targeted engineering internships and join local tech forums."
        ]
      }
    ],
    skills: ["Programming Foundations", "Git Version Control", "Data Structures", "Algorithms (Big O)", "SQL Basics", "Core System Architecture"],
    projects: [
      { name: "Personal Portfolio Site", description: "A static webpage outlining your credentials, project achievements, and contact details." },
      { name: "Custom Utility Web App", description: "A client application (e.g. task manager, weather tracker) fetching data from public APIs." }
    ],
    interviewPrep: [
      "Explain the differences between compiling a program and interpreting it.",
      "What are the benefits of using Git for version control in engineering teams?",
      "Describe what Big O complexity represents and why algorithmic efficiency is important.",
      "How do you test and verify the correctness of your software components?"
    ]
  }
};
