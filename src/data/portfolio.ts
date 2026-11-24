export type SectionId = 'overview' | 'devops' | 'projects' | 'stack'

export type GeometryKind = 'icosahedron' | 'torusKnot' | 'octahedron' | 'dodecahedron' | 'box'

export type SceneTheme = {
  primary: string
  secondary: string
  speed: number
  camera: [number, number, number]
  coreOffset: [number, number, number]
  geometry: GeometryKind
}

export const COLORS = {
  gold: '#D4AF37',
  champagne: '#F5D061',
  amber: '#F59E0B',
  cyan: '#D4AF37',
  emerald: '#F59E0B',
  violet: '#F5D061',
} as const

export const profile = {
  name: 'Gayathri Kalluri',
  title: 'Software Engineer',
  focus: ['Backend', 'CI/CD', 'Cloud'],
  languages: ['Java', 'C++', 'Python'],
  location: 'Chennai, Tamil Nadu',
  email: 'gayathrikalluri17@gmail.com',
  phone: '+91 91001 61895',
  phoneHref: 'tel:+919100161895',
  summary:
    'Computer Science (AI) undergraduate (CGPA 8.5/10, no standing arrears) with two DevOps internships building CI/CD pipelines and deploying containerized microservices on Kubernetes across AWS, GCP, and Azure. Writes tested, production-quality code in Java, C++, C, and Python, with a multithreaded game-engine project built on OOP and design patterns.',
  links: {
    github: 'https://github.com/Gayathrikalluri2006',
    linkedin: 'https://www.linkedin.com/in/gayathri-kalluri-189652304/',
    resume: '/resume.pdf',
  },
}

export type Kpi = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  detail: string
  progress: number
  color: string
}

export const kpis: Kpi[] = [
  { value: 2, suffix: 'x', label: 'DevOps Internships', detail: 'AWS · GCP · Azure', progress: 0.66, color: COLORS.cyan },
  { prefix: '~', value: 25, suffix: '%', label: 'Faster CI/CD Builds', detail: 'Jenkins & GitHub Actions', progress: 0.75, color: COLORS.emerald },
  { value: 88, suffix: '%', label: 'ML Accuracy', detail: '200+ concurrent Cloud Run requests', progress: 0.88, color: COLORS.violet },
  { value: 8.5, decimals: 1, suffix: ' / 10', label: 'CGPA', detail: 'B.E. CSE-AI, SIMATS Engineering', progress: 0.85, color: COLORS.cyan },
]

export type PipelineStage = {
  id: string
  label: string
  description: string
  tools: string[]
}

export const pipelineStages: PipelineStage[] = [
  {
    id: 'code',
    label: 'Code',
    description: 'Version-controlled source and Infrastructure-as-Code configs, reviewed through pull requests before any pipeline runs.',
    tools: ['Git', 'GitHub', 'GitLab', 'IaC'],
  },
  {
    id: 'build',
    label: 'Build',
    description: 'Automated build and test workflows with test-driven validation — 2–3 pipelines built from scratch and ~10 existing workflows updated.',
    tools: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'Python', 'Shell'],
  },
  {
    id: 'docker',
    label: 'Docker',
    description: 'Microservices packaged into containers for consistent dev-to-prod environments — 4 services containerized.',
    tools: ['Docker', 'Container Registry', 'Multi-stage builds'],
  },
  {
    id: 'k8s',
    label: 'K8s',
    description: 'Containerized microservices deployed to Dev and QA clusters, with Staging rollouts, scaling, and rollbacks.',
    tools: ['Kubernetes', 'AWS', 'GCP', 'Azure'],
  },
  {
    id: 'prod',
    label: 'Production',
    description: 'Live-production runtime anomalies debugged with uptime dashboards and logs to reduce mean time to resolution.',
    tools: ['Uptime dashboards', 'Logs', 'Post-mortems', 'MTTR'],
  },
]

export type Experience = {
  role: string
  company: string
  location: string
  period: string
  color: string
  metrics: { label: string; value: string }[]
  bullets: string[]
  tags: string[]
}

export const experiences: Experience[] = [
  {
    role: 'DevOps Engineer Intern',
    company: 'Sri Karthikeya Security Services',
    location: 'Hyderabad',
    period: 'Oct 2025 – Dec 2025',
    color: COLORS.emerald,
    metrics: [
      { label: 'New pipelines', value: '2–3' },
      { label: 'Workflows updated', value: '~10' },
      { label: 'Clouds', value: 'AWS · GCP' },
    ],
    bullets: [
      'Deployed containerized microservices to Dev and QA on Kubernetes across AWS and GCP; supported Staging releases (rollouts, scaling, rollbacks).',
      'Built 2–3 new CI/CD pipelines from scratch and updated ~10 existing workflows in GitHub Actions and GitLab CI using Python and shell scripting.',
      'Debugged runtime anomalies in live production using uptime dashboards and logs, reducing mean time to resolution (MTTR).',
      'Applied Infrastructure-as-Code (IaC) and version-controlled configs; contributed to sprint planning and post-mortems.',
    ],
    tags: ['Kubernetes', 'AWS', 'GCP', 'GitHub Actions', 'GitLab CI', 'Python', 'Shell', 'IaC'],
  },
  {
    role: 'DevOps Engineer Intern',
    company: 'Vysra Information Technologies',
    location: 'Hyderabad',
    period: 'Aug 2025 – Sep 2025',
    color: COLORS.cyan,
    metrics: [
      { label: 'Build time', value: '−25%' },
      { label: 'Pipelines', value: '2' },
      { label: 'Microservices', value: '4' },
    ],
    bullets: [
      'Built 2 automated CI/CD pipelines with Jenkins and GitHub Actions for Dev/QA deployments, cutting build times by ~25%.',
      'Containerized 4 microservices with Docker for consistent dev-to-prod environments.',
      'Automated build/release workflows on Azure with shell scripting and test-driven validation.',
    ],
    tags: ['Jenkins', 'GitHub Actions', 'Docker', 'Azure', 'Shell', 'TDD'],
  },
]

export type Project = {
  id: string
  name: string
  tagline: string
  type: string
  stack: string[]
  highlights: string[]
  architecture: string[]
  metrics: { label: string; value: string; bar: number }[]
  theme: Pick<SceneTheme, 'primary' | 'secondary' | 'geometry'>
}

export const projects: Project[] = [
  {
    id: 'engine',
    name: 'Java OOP Strategy Game Engine',
    tagline: 'Modular, multithreaded turn-based engine',
    type: 'Personal Project',
    stack: ['Java', 'C++', 'Factory Pattern', 'MVC', 'Multithreading', 'JUnit'],
    highlights: [
      'Modular turn-based game engine using the Factory Pattern, polymorphism, and MVC, cutting code duplication by 50%.',
      'Thread-safe shared game-state management across concurrent game loops.',
      'Performance-critical modules written in C++.',
      'TDD validation with automated JUnit test suites.',
    ],
    architecture: ['View Layer (MVC)', 'Controller · Turn Scheduler', 'Unit Factory · Polymorphic Entities', 'Thread-safe Game State', 'C++ Performance Modules'],
    metrics: [
      { label: 'Code duplication cut', value: '50%', bar: 0.5 },
      { label: 'Concurrency model', value: 'Thread-safe', bar: 0.9 },
      { label: 'Test approach', value: 'TDD · JUnit', bar: 0.8 },
    ],
    theme: { primary: COLORS.gold, secondary: COLORS.champagne, geometry: 'box' },
  },
  {
    id: 'aegis-ai',
    name: 'Aegis Route AI',
    tagline: 'ML risk engine & cloud agent',
    type: 'Cloud Prototype',
    stack: ['Python', 'FastAPI', 'Docker', 'Google ADK', 'Vertex AI', 'BigQuery', 'Cloud Run', 'OpenTelemetry', 'Langfuse'],
    highlights: [
      'Real-time ML risk-scoring engine with ~88% accuracy, cutting unsafe route suggestions by ~42%.',
      'Handles 200+ concurrent requests via containerized REST APIs on Cloud Run.',
      'AI route-safety agent with Gemini on Vertex AI, Google Maps and Weather APIs, and BigQuery.',
      'Full observability tracing with OpenTelemetry and Langfuse.',
    ],
    architecture: ['Client · REST', 'FastAPI on Cloud Run', 'ML Risk-Scoring Engine', 'Gemini Agent · Google ADK', 'BigQuery · Maps · Weather', 'OpenTelemetry · Langfuse'],
    metrics: [
      { label: 'Model accuracy', value: '~88%', bar: 0.88 },
      { label: 'Unsafe suggestions cut', value: '~42%', bar: 0.42 },
      { label: 'Concurrent requests', value: '200+', bar: 0.8 },
    ],
    theme: { primary: COLORS.amber, secondary: COLORS.champagne, geometry: 'torusKnot' },
  },
  {
    id: 'navigator',
    name: 'Aegis Route Navigator',
    tagline: 'Safety-scored navigation for web + mobile',
    type: 'Web + Mobile',
    stack: ['Java', 'React', 'Vite', 'Supabase', 'OSRM', 'REST APIs', 'Selenium'],
    highlights: [
      'Full-stack navigation app rating routes 0–100 across 8 weighted risk factors.',
      'Supabase OTP auth, OSRM routing, and Open-Meteo weather integration.',
      'Automated 68 Selenium test cases across 9 test classes.',
      'Packaged for Android.',
    ],
    architecture: ['React + Vite Client', 'Supabase OTP Auth', 'Safety Scoring · 8 Factors', 'OSRM Routing', 'Open-Meteo Weather', 'Android Package'],
    metrics: [
      { label: 'Risk factors', value: '8', bar: 0.8 },
      { label: 'Selenium tests', value: '68', bar: 0.68 },
      { label: 'Test classes', value: '9', bar: 0.9 },
    ],
    theme: { primary: COLORS.gold, secondary: COLORS.amber, geometry: 'octahedron' },
  },
  {
    id: 'vahana',
    name: 'Vahana',
    tagline: 'Zero-commission ride-booking platform',
    type: 'Personal Project',
    stack: ['C', 'Web', 'Mobile'],
    highlights: [
      'Rapido-style ride-booking app with rider and driver dashboards.',
      'Zero-commission driver subscription model with daily to yearly plans.',
      'Core logic modules implemented in C.',
    ],
    architecture: ['Rider Dashboard', 'Driver Dashboard', 'Booking & Matching Logic (C)', 'Subscription Engine', 'Web + Mobile Clients'],
    metrics: [
      { label: 'Driver commission', value: '0%', bar: 1 },
      { label: 'Plan tiers', value: 'Daily → Yearly', bar: 0.75 },
      { label: 'Dashboards', value: '2', bar: 0.6 },
    ],
    theme: { primary: COLORS.champagne, secondary: COLORS.gold, geometry: 'dodecahedron' },
  },
]

export type SkillCategory = {
  id: string
  label: string
  color: string
  skills: { name: string; level: number }[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    label: 'Languages',
    color: COLORS.cyan,
    skills: [
      { name: 'Java', level: 5 },
      { name: 'C++', level: 5 },
      { name: 'Python', level: 5 },
      { name: 'C', level: 4 },
      { name: 'SQL', level: 4 },
      { name: 'JavaScript', level: 4 },
      { name: 'C#', level: 3 },
      { name: 'Go', level: 3 },
    ],
  },
  {
    id: 'core',
    label: 'Core CS',
    color: COLORS.violet,
    skills: [
      { name: 'Data Structures & Algorithms', level: 5 },
      { name: 'OOP', level: 5 },
      { name: 'Design Patterns', level: 4 },
      { name: 'Multithreading', level: 4 },
      { name: 'SDLC', level: 4 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    color: COLORS.emerald,
    skills: [
      { name: 'Microservices', level: 5 },
      { name: 'REST APIs', level: 5 },
      { name: 'FastAPI', level: 4 },
      { name: 'Node.js', level: 4 },
      { name: 'Flask', level: 3 },
      { name: 'MySQL', level: 4 },
      { name: 'Supabase', level: 4 },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps & Cloud',
    color: COLORS.cyan,
    skills: [
      { name: 'Kubernetes', level: 5 },
      { name: 'Docker', level: 5 },
      { name: 'Jenkins', level: 4 },
      { name: 'GitHub Actions', level: 5 },
      { name: 'GitLab CI', level: 4 },
      { name: 'Git', level: 5 },
      { name: 'Linux', level: 4 },
      { name: 'Shell Scripting', level: 4 },
      { name: 'IaC', level: 4 },
      { name: 'AWS', level: 4 },
      { name: 'GCP · Cloud Run', level: 4 },
      { name: 'BigQuery', level: 3 },
      { name: 'Vertex AI', level: 4 },
      { name: 'Azure', level: 3 },
    ],
  },
  {
    id: 'testing',
    label: 'Testing',
    color: COLORS.violet,
    skills: [
      { name: 'Automated Testing', level: 5 },
      { name: 'JUnit', level: 4 },
      { name: 'Selenium', level: 5 },
      { name: 'TDD', level: 4 },
    ],
  },
  {
    id: 'ai-ml',
    label: 'AI/ML',
    color: COLORS.amber,
    skills: [
      { name: 'Machine Learning', level: 4 },
      { name: 'NLP', level: 3 },
      { name: 'spaCy', level: 3 },
      { name: 'Prompt Engineering', level: 4 },
    ],
  },
]

export const education = {
  degree: 'B.E. Computer Science & Engineering (AI)',
  school: 'SIMATS Engineering',
  period: '2023 – 2027',
  scores: [
    { label: 'CGPA', value: '8.5 / 10' },
    { label: 'Class XII', value: '93.2%' },
    { label: 'Class X', value: '99.8%' },
  ],
}

export const research = [
  {
    title: 'Algorithm Optimization',
    detail: 'Benchmarking sorting and search algorithms across complexity classes.',
  },
  {
    title: 'AI/ML Model Analysis',
    detail: 'Evaluating model accuracy against computational cost.',
  },
]

export const certifications = [
  { name: 'Oracle Database SQL Specialist', issuer: 'Oracle · 1Z0-914' },
  { name: 'Java Full-Stack Training', issuer: 'Oracle' },
  { name: 'Cloud Foundations', issuer: 'Great Learning' },
  { name: 'Python for Machine Learning', issuer: 'Great Learning' },
]

export const activities = ['Hackathons', 'LeetCode competitive coder']
export const spokenLanguages = ['English', 'Telugu', 'Hindi', 'Tamil']

export const sections: { id: SectionId; index: string; label: string; short: string }[] = [
  { id: 'overview', index: '01', label: 'Overview', short: 'Overview' },
  { id: 'devops', index: '02', label: 'DevOps & Cloud', short: 'DevOps' },
  { id: 'projects', index: '03', label: 'Projects', short: 'Projects' },
  { id: 'stack', index: '04', label: 'Stack & Credentials', short: 'Stack' },
]

export const sectionThemes: Record<SectionId, SceneTheme> = {
  overview: {
    primary: COLORS.cyan,
    secondary: COLORS.violet,
    speed: 1,
    camera: [0, 0, 9],
    coreOffset: [2.8, 0, 0],
    geometry: 'icosahedron',
  },
  devops: {
    primary: COLORS.emerald,
    secondary: COLORS.cyan,
    speed: 2,
    camera: [-3.6, 1.8, 8.4],
    coreOffset: [0, 0, -1],
    geometry: 'icosahedron',
  },
  projects: {
    primary: COLORS.violet,
    secondary: COLORS.cyan,
    speed: 1.3,
    camera: [3.6, -1.4, 8.6],
    coreOffset: [-2.6, 0, -1],
    geometry: 'box',
  },
  stack: {
    primary: COLORS.violet,
    secondary: COLORS.emerald,
    speed: 0.6,
    camera: [0, 4, 9.5],
    coreOffset: [0, 0, -2],
    geometry: 'dodecahedron',
  },
}
