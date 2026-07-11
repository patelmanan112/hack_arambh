# 🧠 RecallIQ – AI-Powered Engineering Intelligence Platform

## 📖 Overview

RecallIQ is an AI-powered Engineering Intelligence Platform that transforms scattered engineering knowledge into a single searchable memory system. It connects with GitHub, Slack, Notion, and meeting documents to understand an organization's technical knowledge and allows developers to retrieve accurate, context-aware answers using natural language.

Instead of manually searching through commits, pull requests, issues, documentation, and chat history, developers can simply ask RecallIQ questions and receive evidence-backed answers within seconds.

## 🚨 Problem Statement

Modern engineering teams store knowledge across multiple platforms:

- GitHub repositories
- Pull Requests
- Issues
- Slack discussions
- Notion documentation
- Meeting notes
- Technical documents

As projects grow, valuable engineering knowledge becomes fragmented, making it difficult for developers to quickly understand decisions, architecture, and implementation details.

Engineers often spend hours searching across multiple tools instead of building products.

## 💡 Our Solution

RecallIQ creates a centralized Engineering Memory Layer by collecting engineering knowledge from multiple sources and making it searchable through AI.

The platform processes repositories, documentation, discussions, and meeting notes into a semantic knowledge base. Developers can ask questions in natural language, and RecallIQ retrieves the most relevant information before generating evidence-based responses.

## ✨ Key Features

### 🔐 Secure Authentication
- GitHub OAuth 2.0
- Google OAuth 2.0
- Session-based authentication
- Workspace management

### 🐙 GitHub Intelligence
Analyze repositories with AI. Features include:
- Repository Analysis
- Commit History
- Pull Request Analysis
- Issue Tracking
- Contributor Analytics
- Repository Health
- Language Detection
- README Analysis

### 🤖 AI Engineering Copilot
Ask engineering questions like:
- "Explain the authentication system."
- "Who implemented the payment module?"
- "Summarize recent pull requests."
- "Explain repository architecture."
- "Show recent breaking changes."

The AI answers using your company's engineering knowledge instead of generic internet knowledge.

### 🧠 Engineering Memory
RecallIQ remembers previous engineering conversations using Hindsight. This enables:
- Context-aware conversations
- Follow-up questions
- Long-term engineering memory
- Personalized developer assistance

### ⚡ Runtime Intelligence
Powered by cascadeflow. Features include:
- Intelligent model routing
- Provider routing
- Retry strategies
- Runtime monitoring
- Latency tracking
- Token usage analytics
- Cost optimization
- Fallback handling

### 📚 Knowledge Sources
RecallIQ connects multiple engineering knowledge sources:

**GitHub**
- Repositories
- Commits
- Pull Requests
- Issues
- Contributors
- README

**Slack**
- Team discussions
- Engineering decisions
- Technical conversations

**Notion**
- Architecture documentation
- API documentation
- Product specifications
- Engineering documentation

**Meeting Documents**
- Supports: PDF, DOCX, TXT, Markdown
- Automatically generates:
  - Meeting summaries
  - Action items
  - Engineering decisions
  - Deadlines

## 🏗️ AI Architecture

```
GitHub
Slack
Notion
Meeting Documents
        │
        ▼
Data Collection
        │
        ▼
Data Cleaning
        │
        ▼
Chunking
        │
        ▼
Embedding Generation
        │
        ▼
Qdrant Vector Database
        │
────────────────────────────────────
Developer Question
        │
        ▼
Question Embedding
        │
        ▼
Semantic Search
        │
        ▼
Top Relevant Chunks
        │
        ▼
Hindsight Memory
        │
        ▼
cascadeflow Runtime
        │
        ▼
Groq / Gemini LLM
        │
        ▼
AI Response with Source Citations
```

## 🧠 How RecallIQ Works

1. User authenticates using GitHub or Google.
2. GitHub repositories are connected.
3. Repository data is fetched.
4. Data is cleaned and divided into semantic chunks.
5. Chunks are converted into embeddings.
6. Embeddings are stored in Qdrant.
7. User asks a question.
8. The question is converted into an embedding.
9. Qdrant retrieves the most relevant engineering knowledge.
10. Hindsight provides previous conversation context.
11. cascadeflow intelligently routes the AI request.
12. The LLM generates an accurate, evidence-based response.
13. The conversation is stored for future context.

## 🚀 Tech Stack

### Frontend
- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI**
- **Framer Motion**
- **React Query**
- **Recharts**
- **Lucide React**

### Backend
- **Node.js**
- **Express.js**
- **TypeScript**
- **Passport.js**
- **JWT**
- **Express Session**
- **REST APIs**

### Database
- **MongoDB Atlas**
- **Mongoose**

### AI & Runtime
- **Groq**
- **Google Gemini**
- **Hindsight**
- **cascadeflow**
- **RAG (Retrieval-Augmented Generation)**

### Vector Database
- **Qdrant**

### Integrations
- **GitHub API**
- **Slack API**
- **Notion API**

### Deployment
- **Vercel** (Frontend)
- **Render** (Backend)
- **MongoDB Atlas**
- **Qdrant Cloud**

## 📊 Dashboard Highlights

- Engineering Health Score
- Repository Analytics
- Commit Activity
- Pull Request Analytics
- Issue Tracking
- Contributor Leaderboard
- Repository Insights
- AI Copilot
- Knowledge Sources
- Runtime Monitoring
- Engineering Timeline

## 🎯 Use Cases

RecallIQ is designed for:
- Software Development Teams
- Engineering Managers
- Startups
- Open Source Organizations
- Product Teams
- DevOps Teams
- Enterprise Engineering Organizations

## 🔮 Future Scope

- Jira Integration
- Microsoft Teams Integration
- Confluence Integration
- CI/CD Pipeline Analysis
- AI Sprint Planning
- Engineering Risk Prediction
- Code Quality Intelligence
- Automated Weekly Engineering Reports
- Multi-workspace Support

## 🌐 Live Deployment

- **Frontend**: https://re-calliq.vercel.app/
- **Backend**: https://hack-arambh.onrender.com/

## 👥 Team

**Team Name**: RecallIQ

Built during a Startup Innovation Hackathon to solve the challenge of fragmented engineering knowledge using AI, semantic search, and intelligent runtime orchestration.

## 📜 License

This project is developed for educational, research, and hackathon purposes.

---

## ⭐ Repository Description (Short Version)

RecallIQ is an AI-powered Engineering Intelligence Platform that connects GitHub, Slack, Notion, and meeting documents to create a searchable engineering memory. Using RAG, Qdrant, Hindsight, and cascadeflow, it delivers accurate, context-aware answers with source citations, helping engineering teams retrieve knowledge faster and make informed decisions.
