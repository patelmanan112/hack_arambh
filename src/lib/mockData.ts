import { GitHubRepo } from "@/types/github";
import { 
  GitCommit, GitPullRequest, CircleDot, Users, 
  Database, Shield, FileText, Zap, Rocket, 
  HelpCircle, Code2, AlertTriangle, Lightbulb,
  CheckCircle2, AlertCircle, RefreshCw, BarChart2,
  TrendingUp, TrendingDown, Minus
} from "lucide-react";

export interface ExtendedRepo extends GitHubRepo {
  contributors_count: number;
  latest_commit: {
    message: string;
    author: string;
    date: string;
    sha: string;
  };
  health_score: number;
  ai_summary: string;
  risk_indicator: "Low" | "Medium" | "High";
  repository_activity: number[];
}

export const mockRepositories: ExtendedRepo[] = [
  {
    id: 1,
    name: "recall-iq-app",
    full_name: "RecallIQ/recall-iq-app",
    private: true,
    description: "AI-powered Engineering Intelligence platform and analytics dashboard frontend. Integrates with GitHub Enterprise APIs and Vector DB.",
    html_url: "https://github.com/RecallIQ/recall-iq-app",
    language: "TypeScript",
    stargazers_count: 248,
    forks_count: 36,
    open_issues_count: 12,
    size: 24530, // in KB
    default_branch: "main",
    fork: false,
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    pushed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    owner: {
      login: "RecallIQ",
      avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80",
      html_url: "https://github.com/RecallIQ"
    },
    visibility: "private",
    contributors_count: 8,
    latest_commit: {
      message: "feat: integrate cascadeflow v2 vector agent sync",
      author: "Manan",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sha: "f9b2a8d"
    },
    health_score: 94,
    ai_summary: "Main frontend dashboard code. High test coverage (92%). Active deployment pipelines. Security audit clean. Recent commits focus on AI Copilot integrations.",
    risk_indicator: "Low",
    repository_activity: [30, 45, 38, 62, 50, 70, 85, 92, 94]
  },
  {
    id: 2,
    name: "ai-sync-service",
    full_name: "RecallIQ/ai-sync-service",
    private: true,
    description: "Backend microservice coordinating LLM orchestration, document chunking, embeddings generation, and vector DB indexing.",
    html_url: "https://github.com/RecallIQ/ai-sync-service",
    language: "Python",
    stargazers_count: 112,
    forks_count: 14,
    open_issues_count: 4,
    size: 18240,
    default_branch: "main",
    fork: false,
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
    pushed_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    owner: {
      login: "RecallIQ",
      avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80",
      html_url: "https://github.com/RecallIQ"
    },
    visibility: "private",
    contributors_count: 4,
    latest_commit: {
      message: "fix: reduce retry backoff multiplier in vector DB pipeline",
      author: "Aman",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      sha: "c3d1b8a"
    },
    health_score: 89,
    ai_summary: "Orchestrates API extraction. Caching systems active. Some minor tech debt detected in legacy PDF parser modules, but database integration remains highly stable.",
    risk_indicator: "Low",
    repository_activity: [40, 32, 55, 48, 60, 52, 70, 64, 80]
  },
  {
    id: 3,
    name: "vector-ops-engine",
    full_name: "RecallIQ/vector-ops-engine",
    private: false,
    description: "High-performance vector operations, distance computations, and semantic similarity searching written in Rust.",
    html_url: "https://github.com/RecallIQ/vector-ops-engine",
    language: "Rust",
    stargazers_count: 850,
    forks_count: 98,
    open_issues_count: 8,
    size: 12050,
    default_branch: "master",
    fork: false,
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1d ago
    pushed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    owner: {
      login: "RecallIQ",
      avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80",
      html_url: "https://github.com/RecallIQ"
    },
    visibility: "public",
    contributors_count: 6,
    latest_commit: {
      message: "perf: optimize cosine distance via AVX-512 intrinsics",
      author: "Sarah",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      sha: "a5e9d2c"
    },
    health_score: 96,
    ai_summary: "Core calculations module. Excellent test coverage (98%). High compiler strictness. Releases are stable with zero regression flags.",
    risk_indicator: "Low",
    repository_activity: [70, 75, 80, 85, 90, 88, 92, 94, 96]
  },
  {
    id: 4,
    name: "recall-cli-tool",
    full_name: "RecallIQ/recall-cli-tool",
    private: false,
    description: "Command line interface tool for local knowledge chunk ingestion, Markdown ADR parsing, and developer offline query generation.",
    html_url: "https://github.com/RecallIQ/recall-cli-tool",
    language: "Go",
    stargazers_count: 92,
    forks_count: 8,
    open_issues_count: 14,
    size: 8940,
    default_branch: "main",
    fork: false,
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3d ago
    pushed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    owner: {
      login: "RecallIQ",
      avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80",
      html_url: "https://github.com/RecallIQ"
    },
    visibility: "public",
    contributors_count: 3,
    latest_commit: {
      message: "feat: add support for parsing Notion DB exports",
      author: "Rahul",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      sha: "e4c2b9f"
    },
    health_score: 78,
    ai_summary: "Developer tool utility. Moderate security risk due to outdated dependencies. Testing coverage is currently at 65% and requires expansion.",
    risk_indicator: "Medium",
    repository_activity: [40, 42, 38, 45, 52, 48, 62, 58, 65]
  },
  {
    id: 5,
    name: "legacy-data-ingest",
    full_name: "RecallIQ/legacy-data-ingest",
    private: true,
    description: "Archived repository previously used for SQL dumps extraction. Currently in maintenance mode.",
    html_url: "https://github.com/RecallIQ/legacy-data-ingest",
    language: "JavaScript",
    stargazers_count: 14,
    forks_count: 2,
    open_issues_count: 23,
    size: 42300,
    default_branch: "master",
    fork: false,
    updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45d ago
    pushed_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    owner: {
      login: "RecallIQ",
      avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80",
      html_url: "https://github.com/RecallIQ"
    },
    visibility: "private",
    contributors_count: 2,
    latest_commit: {
      message: "chore: deprecation notice in readme",
      author: "Aman",
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      sha: "9a2d8e4"
    },
    health_score: 55,
    ai_summary: "High tech debt. Repository is no longer active. Contains 7 critical security warnings. Deprecated and scheduled for deletion.",
    risk_indicator: "High",
    repository_activity: [20, 18, 15, 12, 10, 8, 5, 2, 0]
  }
];

export const healthMetrics = [
  {
    id: "quality",
    name: "Code Quality",
    score: 94,
    trend: "+2%",
    status: "success",
    explanation: "Linting violations and duplicate code blocks reduced by 14% this sprint after implementing static code analysis checks.",
    comparison: "vs last sprint"
  },
  {
    id: "velocity",
    name: "PR Velocity",
    score: 92,
    trend: "+8%",
    status: "success",
    explanation: "Average PR merge times improved from 28h to 12h after reducing average PR sizes to under 200 lines.",
    comparison: "vs last sprint"
  },
  {
    id: "activity",
    name: "Repository Activity",
    score: 88,
    trend: "-3%",
    status: "info",
    explanation: "Fewer total commits logged this week due to team focusing on design sessions and national holidays.",
    comparison: "vs last week"
  },
  {
    id: "docs",
    name: "Documentation",
    score: 90,
    trend: "+5%",
    status: "success",
    explanation: "Added 12 new ADR docs and refreshed setup guides. Markdown validation tools added to git hooks.",
    comparison: "vs last month"
  },
  {
    id: "collab",
    name: "Collaboration",
    score: 95,
    trend: "+1%",
    status: "success",
    explanation: "91% of pull requests received reviews within 4 hours. Pair programming sessions on vector database optimized knowledge sharing.",
    comparison: "vs last week"
  },
  {
    id: "issues",
    name: "Issue Resolution",
    score: 89,
    trend: "+4%",
    status: "success",
    explanation: "Average bug ticket lifespan dropped to 1.2 days. Weekly backlog grooming sessions cleared 15 stale issues.",
    comparison: "vs last week"
  }
];

export const commitAnalytics = {
  weeklyCommits: [
    { week: "Wk 1", commits: 145, prs: 18, meetings: 6 },
    { week: "Wk 2", commits: 160, prs: 22, meetings: 8 },
    { week: "Wk 3", commits: 120, prs: 15, meetings: 5 },
    { week: "Wk 4", commits: 180, prs: 28, meetings: 10 },
    { week: "Wk 5", commits: 210, prs: 32, meetings: 12 },
    { week: "Wk 6", commits: 195, prs: 26, meetings: 8 },
    { week: "Wk 7", commits: 230, prs: 35, meetings: 14 },
    { week: "Wk 8", commits: 245, prs: 38, meetings: 15 },
    { week: "Wk 9", commits: 190, prs: 24, meetings: 7 },
    { week: "Wk 10", commits: 220, prs: 30, meetings: 10 },
    { week: "Wk 11", commits: 260, prs: 41, meetings: 16 },
    { week: "Wk 12", commits: 285, prs: 45, meetings: 18 }
  ],
  monthlyCommits: [
    { name: "Jan", commits: 640 },
    { name: "Feb", commits: 710 },
    { name: "Mar", commits: 880 },
    { name: "Apr", commits: 920 },
    { name: "May", commits: 1100 },
    { name: "Jun", commits: 1250 }
  ],
  peakHours: [
    { hour: "00:00", commits: 12 }, { hour: "02:00", commits: 4 },
    { hour: "04:00", commits: 2 },  { hour: "06:00", commits: 8 },
    { hour: "08:00", commits: 45 }, { hour: "10:00", commits: 188 },
    { hour: "12:00", commits: 142 }, { hour: "14:00", commits: 210 },
    { hour: "16:00", commits: 175 }, { hour: "18:00", commits: 95 },
    { hour: "20:00", commits: 48 }, { hour: "22:00", commits: 28 }
  ],
  heatmap: [
    { day: "Mon", Morning: 45, Afternoon: 55, Evening: 20, Night: 5 },
    { day: "Tue", Morning: 62, Afternoon: 70, Evening: 35, Night: 8 },
    { day: "Wed", Morning: 55, Afternoon: 82, Evening: 42, Night: 12 },
    { day: "Thu", Morning: 68, Afternoon: 60, Evening: 28, Night: 6 },
    { day: "Fri", Morning: 40, Afternoon: 50, Evening: 15, Night: 4 }
  ],
  aiSummary: "Commit activity is highly concentrated during work hours (10 AM to 4 PM), indicating healthy work boundaries. Go code integration has decreased by 18%, while TypeScript and Python account for 80% of total commit logs over the past month."
};

export const prAnalytics = {
  openVsClosed: [
    { name: "Open", value: 12, color: "#3B82F6" },
    { name: "Merged", value: 148, color: "#7C3AED" },
    { name: "Closed", value: 18, color: "#EF4444" }
  ],
  mergeTimeTrend: [
    { week: "Wk 1", time: 24.5 },
    { week: "Wk 2", time: 22.0 },
    { week: "Wk 3", time: 18.2 },
    { week: "Wk 4", time: 15.0 },
    { week: "Wk 5", time: 12.4 },
    { week: "Wk 6", time: 9.8 }
  ],
  reviewTimeTrend: [
    { week: "Wk 1", time: 12.2 },
    { week: "Wk 2", time: 10.5 },
    { week: "Wk 3", time: 8.8 },
    { week: "Wk 4", time: 6.2 },
    { week: "Wk 5", time: 4.8 },
    { week: "Wk 6", time: 3.5 }
  ],
  averagePrSize: [
    { week: "Wk 1", size: 450 },
    { week: "Wk 2", size: 380 },
    { week: "Wk 3", size: 310 },
    { week: "Wk 4", size: 220 },
    { week: "Wk 5", size: 185 },
    { week: "Wk 6", size: 142 }
  ],
  longestOpenPrs: [
    { title: "Refactor Database Schema Migrations", author: "Aman", daysOpen: 18, size: "+820 -150", link: "#" },
    { title: "Migrate vector DB storage to Pinecone", author: "Manan", daysOpen: 11, size: "+1200 -450", link: "#" },
    { title: "Configure Kubernetes staging deploy configuration", author: "Sarah", daysOpen: 9, size: "+145 -22", link: "#" }
  ],
  largestPrs: [
    { title: "feat: add LLM knowledge graph parser runtime", author: "Manan", size: "+2,480 lines", date: "3d ago", link: "#" },
    { title: "refactor: design component library layout tokens", author: "Rahul", size: "+1,240 lines", date: "5d ago", link: "#" },
    { title: "test: integrate client integration test harness", author: "Aman", size: "+950 lines", date: "1w ago", link: "#" }
  ],
  reviewerWorkload: [
    { name: "Rahul", active: 3, completed: 42, avgTime: "2.4h" },
    { name: "Aman", active: 2, completed: 35, avgTime: "4.1h" },
    { name: "Manan", active: 4, completed: 28, avgTime: "3.2h" },
    { name: "Sarah", active: 1, completed: 31, avgTime: "1.8h" }
  ],
  bottlenecks: [
    { factor: "Complex Database Migrations", delay: "Avg +14h", risk: "High" },
    { factor: "Insufficient Unit Test Coverage", delay: "Avg +8h", risk: "Medium" },
    { factor: "Single Point of Approval (DevOps)", delay: "Avg +18h", risk: "High" }
  ],
  aiSummary: "Average PR sizes dropped from 450 lines to 142 lines, driving down merge latency by 60%. The principal bottleneck is Sarah reviewing deployment configs; adding Aman as a backup reviewer is recommended."
};

export const issueAnalytics = {
  openVsClosed: [
    { name: "Open Issues", value: 16, color: "#F59E0B" },
    { name: "Closed Issues", value: 144, color: "#10B981" }
  ],
  labelDistribution: [
    { name: "Critical Bug", value: 12, color: "#EF4444" },
    { name: "Feature Request", value: 45, color: "#3B82F6" },
    { name: "Tech Debt", value: 28, color: "#A78BFA" },
    { name: "Documentation", value: 15, color: "#10B981" }
  ],
  resolutionTimeTrend: [
    { week: "Wk 1", days: 4.5 },
    { week: "Wk 2", days: 3.8 },
    { week: "Wk 3", days: 3.0 },
    { week: "Wk 4", days: 2.4 },
    { week: "Wk 5", days: 1.8 },
    { week: "Wk 6", days: 1.2 }
  ],
  aging: [
    { range: "0-5 days", count: 8 },
    { range: "5-15 days", count: 5 },
    { range: "15-30 days", count: 2 },
    { range: "30+ days", count: 1 }
  ],
  trends: [
    { week: "Wk 1", opened: 12, closed: 10 },
    { week: "Wk 2", opened: 15, closed: 18 },
    { week: "Wk 3", opened: 8, closed: 12 },
    { week: "Wk 4", opened: 10, closed: 14 },
    { week: "Wk 5", opened: 6, closed: 11 },
    { week: "Wk 6", opened: 4, closed: 9 }
  ],
  aiSummary: "The 'Opened vs Closed' issue ratio has entered a net-negative state, indicating the backlog is actively burning down. Technical debt represents 28% of open issues and should be triaged in the upcoming sprint."
};

export const languageAnalytics = [
  { name: "TypeScript", percentage: 58.2, loc: "142,500", repos: 4, growth: "+12.4%", trend: "up", explanation: "TypeScript remains the dominant language. Expansion driven by migrating custom dashboard components to React Query and Radix." },
  { name: "Python", percentage: 22.4, loc: "54,800", repos: 2, growth: "+24.1%", trend: "up", explanation: "Python expanded for LLM coordination. Integrating document parsers and embeddings scripts with vector database pipelines." },
  { name: "Rust", percentage: 10.5, loc: "25,700", repos: 1, growth: "+5.0%", trend: "stable", explanation: "Used strictly for high-performance vector searching operations inside vector-ops-engine." },
  { name: "Go", percentage: 6.3, loc: "15,400", repos: 1, growth: "-2.1%", trend: "down", explanation: "Cli tool functionality in Go is stabilized. Several services migrated to TypeScript endpoints." },
  { name: "CSS/Shell", percentage: 2.6, loc: "6,400", repos: 5, growth: "+1.2%", trend: "stable", explanation: "Configuration files and Tailwind custom layers." }
];

export const contributorIntelligence = [
  {
    name: "Rahul",
    role: "Frontend Lead",
    avatar: "R",
    commits: 248,
    prs: 42,
    reviews: 65,
    issuesClosed: 38,
    activityScore: 98,
    aiProductivityScore: 96,
    streak: 12,
    trend: [10, 15, 20, 22, 28, 32, 40],
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"
  },
  {
    name: "Manan",
    role: "AI Architect",
    avatar: "M",
    commits: 185,
    prs: 28,
    reviews: 32,
    issuesClosed: 19,
    activityScore: 96,
    aiProductivityScore: 99,
    streak: 8,
    trend: [8, 12, 10, 18, 15, 22, 25],
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80"
  },
  {
    name: "Aman",
    role: "Backend Engineer",
    avatar: "A",
    commits: 204,
    prs: 31,
    reviews: 44,
    issuesClosed: 29,
    activityScore: 92,
    aiProductivityScore: 91,
    streak: 5,
    trend: [12, 14, 18, 16, 20, 18, 22],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
  },
  {
    name: "Sarah",
    role: "DevOps Engineer",
    avatar: "S",
    commits: 96,
    prs: 14,
    reviews: 58,
    issuesClosed: 15,
    activityScore: 89,
    aiProductivityScore: 93,
    streak: 3,
    trend: [5, 4, 8, 10, 9, 12, 11],
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
  }
];

export const repositoryHealth = [
  {
    title: "Documentation",
    score: 90,
    trend: "▲ +5%",
    trendType: "up",
    recommendation: "Ensure 100% of API endpoints have matching Swagger comments. Create custom JSDoc hooks for Radix components."
  },
  {
    title: "Testing Coverage",
    score: 92,
    trend: "▲ +3%",
    trendType: "up",
    recommendation: "Expand integration tests for the authentication router. Target 95% line coverage in next-core utilities."
  },
  {
    title: "Security Rating",
    score: 98,
    trend: "— Stable",
    trendType: "stable",
    recommendation: "Run npm audit fix to resolve 2 moderate warnings. Set up auto-dependency scanning for PRs using GitHub Dependabot."
  },
  {
    title: "Code Review",
    score: 95,
    trend: "▲ +4%",
    trendType: "up",
    recommendation: "Automate code reviews check status with GitHub Actions. Ensure no PR merges without 2 reviews."
  },
  {
    title: "CI/CD Speed",
    score: 87,
    trend: "▼ -2%",
    trendType: "down",
    recommendation: "Github Actions execution time increased to 7.5 min. Cache node_modules and Docker build layers to optimize runtime."
  },
  {
    title: "Release Stability",
    score: 94,
    trend: "▲ +2%",
    trendType: "up",
    recommendation: "Integrate Sentry alerts in main. Ensure rollbacks are triggered if runtime exceptions increase by >1%."
  },
  {
    title: "Technical Debt",
    score: 85,
    trend: "▲ +1%",
    trendType: "up",
    recommendation: "Refactor legacy SVG icons into lucide-react components. Prune unused dependencies in backend package.json."
  }
];

export const recentTimeline = [
  { id: 1, title: "Deployment: Production Sync", type: "deployment", icon: Rocket, color: "text-emerald-400", time: "10m ago", author: "Sarah" },
  { id: 2, title: "PR Merged: #245 Integrate cascadeflow v2 vector agent sync", type: "pr-merge", icon: GitPullRequest, color: "text-purple-400", time: "2h ago", author: "Manan" },
  { id: 3, title: "Commit: feat: integrate cascadeflow v2 vector agent sync", type: "commit", icon: GitCommit, color: "text-blue-400", time: "2h ago", author: "Manan" },
  { id: 4, title: "Issue Closed: #182 Fix JWT token expiration on reload", type: "issue-close", icon: CircleDot, color: "text-emerald-500", time: "5h ago", author: "Aman" },
  { id: 5, title: "PR Created: #245 Integrate cascadeflow v2 vector agent sync", type: "pr-create", icon: GitPullRequest, color: "text-blue-500", time: "8h ago", author: "Manan" },
  { id: 6, title: "Branch Created: feature/cascadeflow-sync", type: "branch", icon: GitCommit, color: "text-cyan-400", time: "1d ago", author: "Manan" },
  { id: 7, title: "Release: v1.2.0 Engineering Intelligence core API", type: "release", icon: Zap, color: "text-yellow-400", time: "2d ago", author: "Sarah" },
  { id: 8, title: "Issue Created: #182 Fix JWT token expiration on reload", type: "issue-create", icon: CircleDot, color: "text-amber-500", time: "3d ago", author: "Rahul" }
];

export const aiInsights = [
  {
    icon: Lightbulb,
    title: "Repository Summary",
    summary: "Active development centered on the AI sync service and React frontend, with a total of 24 PRs merged this week. Core platform modules are stable, but documentation index coverage dropped from 94% to 90%.",
    confidence: 98,
    references: ["recall-iq-app #245", "ai-sync-service #110"]
  },
  {
    icon: GitCommit,
    title: "Commit Summary",
    summary: "Authentication refactors represent 41% of frontend commits. Performance optimizations in Rust (AVX-512 integration) reduced semantic query lookup times by 32% (from 14ms to 9.5ms).",
    confidence: 96,
    references: ["vector-ops-engine a5e9d"]
  },
  {
    icon: CircleDot,
    title: "Issue Summary",
    summary: "Issue creation velocity has stabilized. The average bug resolution window is 1.2 days, a 30% reduction from last week. Active grooming successfully closed out 15 stale bug tickets.",
    confidence: 94,
    references: ["recall-cli-tool #182", "recall-iq-app #190"]
  },
  {
    icon: GitPullRequest,
    title: "Pull Request Summary",
    summary: "Reducing PR sizes to <150 lines of code successfully drove down code review wait times from 28h to 9.8h. Sarah is currently reviewing 3 critical Docker configurations, presenting a review bottleneck.",
    confidence: 95,
    references: ["recall-iq-app #245", "ai-sync-service #124"]
  },
  {
    icon: Zap,
    title: "Sprint Summary",
    summary: "Sprint objectives met at 92%. CI/CD build cache configurations needs priority update in the next sprint to reduce deploy queue times. Feature release v1.2.0 successfully shipped.",
    confidence: 90,
    references: ["v1.2.0 release", "Github Actions config L25"]
  },
  {
    icon: Code2,
    title: "Architecture Summary",
    summary: "Go dependencies in the CLI tool are showing package vulnerability warnings. Migrating local file parsers to Node.js / TypeScript is recommended to share schemas and optimize maintenance.",
    confidence: 92,
    references: ["recall-cli-tool tsconfig.json", "package.json"]
  },
  {
    icon: AlertTriangle,
    title: "Technical Debt Summary",
    summary: "Vector engine coverage is optimal (98%), but CLI tools test coverage sits at 65%. High redundancy found in PDF processing logic; recommend abstracting helper methods into a shared lib.",
    confidence: 88,
    references: ["recall-cli-tool/parser.go", "legacy-data-ingest"]
  },
  {
    icon: AlertCircle,
    title: "Risk Detection",
    summary: "High risk identified in single-person dependency for DevOps approvals (Sarah). Moderate risk identified in out-of-date Go CLI dependencies. Caching layer holds active connections with zero memory leaks.",
    confidence: 97,
    references: ["ai-sync-service server.ts", "package.json"]
  },
  {
    icon: CheckCircle2,
    title: "Engineering Recommendations",
    summary: "Add Aman as a backup reviewer for DevOps files to unlock pipelines. Prune Go parser modules to lower security risks. Schedule build pipeline optimization sprint.",
    confidence: 95,
    references: ["GitHub Actions yml", "recall-cli-tool go.mod"]
  }
];

export const aiExecutiveSummary = {
  text: "Repository activity increased by 24% this week. Authentication work accounts for 41% of commits. Documentation quality decreased. Three pull requests require urgent review. Overall engineering health improved from 84 to 91.",
  metrics: [
    { label: "Weekly Commit Volume", value: "+24.1%", positive: true },
    { label: "Auth Commits Ratio", value: "41%", positive: true },
    { label: "Docs Score Decay", value: "-5%", positive: false },
    { label: "PRs Needing Review", value: "3 PRs", positive: false },
    { label: "Health Index Shift", value: "84 → 91", positive: true }
  ]
};
