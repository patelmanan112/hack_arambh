# Recall IQ

Recall IQ is an advanced AI analytics and intelligence platform. It provides deep insights into your codebase's health, developer activity, and project timeline, supercharged with an AI Copilot to help you make informed decisions.

## 🚀 Features

*   **Comprehensive Dashboard**: Get a birds-eye view of your project's health, runtime status, and overview statistics.
*   **Activity & Contribution Tracking**: Visualize commit activity, track top contributors, and monitor pull requests and issues.
*   **AI Copilot**: An integrated AI assistant to help you understand complex code decisions and project trajectories.
*   **Decision Graph**: Visualize the architectural and project decisions over time.
*   **GitHub Integration**: Seamless OAuth login and repository syncing.

## 🛠️ Tech Stack

This project is structured as a monorepo containing a Next.js frontend and an Express backend.

### Frontend
*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **UI Library**: [React 19](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Components**: [Radix UI](https://www.radix-ui.com/) (Accessible headless components) & [Lucide React](https://lucide.dev/) (Icons)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Data Fetching**: [React Query](https://tanstack.com/query/latest) (@tanstack/react-query)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

### Backend (Server)
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ORM
*   **Authentication**: [Passport.js](https://www.passportjs.org/) (GitHub OAuth Strategy) & JWT
*   **GitHub API**: [Octokit](https://github.com/octokit/octokit.js) (For fetching repo data, commits, PRs, etc.)

## 🔄 Core Workflows

For hackathon judges and evaluators, here is a breakdown of the core workflows in Recall IQ:

### 1. Authentication & Onboarding Workflow
1.  User clicks "Login with GitHub" on the frontend.
2.  The request is routed to the Express backend, which initiates the Passport.js GitHub OAuth flow.
3.  Upon successful authentication, the backend issues a JWT (JSON Web Token) to the client.
4.  The user is redirected to the onboarding flow to select and sync their GitHub repositories into a "Workspace".

### 2. Data Synchronization Workflow
1.  Once a repository is added to a workspace, the backend creates a `ProcessingJob`.
2.  Using the `Octokit` library, the server communicates with the GitHub API to fetch historical and current data:
    *   Commits
    *   Pull Requests
    *   Issues
    *   Contributors
3.  This data is parsed, normalized, and stored in the MongoDB database according to the defined Mongoose schemas (e.g., `Commit.model.ts`, `Issue.model.ts`).

### 3. Analytics & Dashboard Workflow
1.  When the user visits the dashboard, the Next.js frontend makes API requests to the Express backend.
2.  **React Query** manages the data fetching, caching, and state on the client side.
3.  The backend aggregates the MongoDB data to calculate metrics like the "Health Score" and "Activity Trends".
4.  The frontend renders this data using **Recharts** to display the Activity Chart and Timeline, and custom UI components for the Overview Stats.

### 4. AI Copilot Workflow
1.  The user queries the AI Copilot on the dashboard regarding repository insights.
2.  The backend processes the query, combining it with the contextual data fetched from GitHub (commits, PRs) stored in the database.
3.  *(Implementation specific)* The query is sent to an LLM to generate insights, explain architectural choices, or summarize project health, presenting the result back to the user via the Copilot UI.

## 🏃‍♂️ Running the Project Locally

First, ensure you have the required environment variables set up. You will need:
- MongoDB connection string.
- GitHub OAuth App credentials (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`).
- JWT Secret.

Copy the `.env.local.example` to `.env.local` or `.env` and fill in the values.

The project uses `concurrently` to run both the frontend and backend with a single command.

```bash
# Install dependencies in the root (frontend)
npm install

# Install dependencies in the server directory
cd server && npm install
cd ..

# Run both frontend and backend concurrently
npm run dev:all
```

- Frontend runs on `http://localhost:3000`
- Backend API typically runs on a dedicated port (e.g., `http://localhost:5000` or `8080` based on your setup).

## 🗂️ Project Structure Highlights
- `/src/app`: Next.js App Router pages (Dashboard, Login, Onboarding).
- `/src/components/dashboard`: Core UI components for the analytics views.
- `/server/src/models`: MongoDB schemas for tracking GitHub data (User, Repo, Commits, PRs).
- `/server/src/routes`: Express API endpoints for Auth, Workspaces, and GitHub data.
- `/server/src/github`: Services for interacting with the Octokit SDK.
