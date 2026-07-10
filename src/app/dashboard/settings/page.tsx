"use client";

import React, { useState } from "react";
import { 
  Settings, 
  GitBranch, 
  Webhook, 
  Key, 
  BrainCircuit, 
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Eye,
  Copy
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("integrations");

  return (
    <div className="flex flex-col space-y-8 p-6 md:p-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="h-7 w-7 text-zinc-400" />
            Configuration
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage repository integrations, AI limits, and API webhooks.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors text-sm font-medium">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0">
            <TabButton 
              id="integrations" 
              active={activeTab === "integrations"} 
              onClick={() => setActiveTab("integrations")}
              icon={<GitBranch className="h-4 w-4" />}
              label="Integrations"
            />
            <TabButton 
              id="ai" 
              active={activeTab === "ai"} 
              onClick={() => setActiveTab("ai")}
              icon={<BrainCircuit className="h-4 w-4" />}
              label="AI Preferences"
            />
            <TabButton 
              id="webhooks" 
              active={activeTab === "webhooks"} 
              onClick={() => setActiveTab("webhooks")}
              icon={<Webhook className="h-4 w-4" />}
              label="Webhook Logs"
            />
            <TabButton 
              id="api" 
              active={activeTab === "api"} 
              onClick={() => setActiveTab("api")}
              icon={<Key className="h-4 w-4" />}
              label="Developer API"
            />
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6 md:p-8 backdrop-blur-sm">
          {activeTab === "integrations" && <IntegrationsSettings />}
          {activeTab === "ai" && <AiSettings />}
          {activeTab === "webhooks" && <WebhookSettings />}
          {activeTab === "api" && <ApiSettings />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ id, active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
        active 
          ? "bg-zinc-800 text-white" 
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
      }`}
    >
      {icon}
      {label}
      {active && <ChevronRight className="h-4 w-4 ml-auto lg:block hidden opacity-50" />}
    </button>
  );
}

function IntegrationsSettings() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">GitHub Connection</h2>
        <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
              <GitBranch className="h-6 w-6 text-black" />
            </div>
            <div>
              <h3 className="text-white font-medium">AcmeCorp GitHub Enterprise</h3>
              <p className="text-sm text-zinc-500">Connected 4 months ago • 24 repositories synced</p>
            </div>
          </div>
          <button className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-700 hover:border-zinc-600 rounded transition-colors">
            Configure
          </button>
        </div>
      </div>

      <hr className="border-zinc-800" />

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Sync Preferences</h2>
        <div className="space-y-4">
          <SettingToggle 
            title="Auto-Sync Pull Requests" 
            description="Automatically trigger AI analysis when a PR is opened or updated."
            defaultChecked={true}
          />
          <SettingToggle 
            title="Deep Code Indexing" 
            description="Run AST parsers and vector embedding generators on default branches."
            defaultChecked={true}
          />
          <SettingToggle 
            title="Contributor Profiling" 
            description="Aggregate commit metadata to build developer streak and skill profiles."
            defaultChecked={false}
          />
        </div>
      </div>
    </div>
  );
}

function AiSettings() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Model Selection</h2>
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900 border border-emerald-500/50 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-medium flex items-center gap-2">
                  GPT-4 Turbo <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400">Active</span>
                </h3>
                <p className="text-sm text-zinc-400 mt-1">High intelligence, best for complex code generation and PR reviews.</p>
              </div>
              <input type="radio" name="model" defaultChecked className="h-4 w-4 text-emerald-500 bg-zinc-800 border-zinc-700 mt-1" />
            </div>
          </div>
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-medium">Claude 3.5 Sonnet</h3>
                <p className="text-sm text-zinc-500 mt-1">Excellent context window, extremely fast document analysis.</p>
              </div>
              <input type="radio" name="model" className="h-4 w-4 text-emerald-500 bg-zinc-800 border-zinc-700 mt-1" />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-zinc-800" />

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Limits & Quotas</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-300">Context Window Limit</span>
              <span className="text-zinc-500">64k tokens</span>
            </div>
            <input type="range" min="0" max="100" defaultValue="64" className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-300">Monthly Usage Cap</span>
              <span className="text-zinc-500">$450 / $1000</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WebhookSettings() {
  const logs = [
    { id: "wh_8a7b9c", event: "pull_request.opened", repo: "vercel/next.js", time: "2 mins ago", status: 200, latency: "124ms" },
    { id: "wh_2f4d1e", event: "push", repo: "facebook/react", time: "15 mins ago", status: 200, latency: "89ms" },
    { id: "wh_9g5h3j", event: "issue.created", repo: "tailwindlabs/tailwindcss", time: "1 hour ago", status: 500, latency: "1024ms" },
    { id: "wh_3k6m8n", event: "pull_request.closed", repo: "vercel/next.js", time: "2 hours ago", status: 200, latency: "145ms" },
    { id: "wh_7p9q2r", event: "push", repo: "facebook/react", time: "5 hours ago", status: 200, latency: "76ms" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-white">Recent Deliveries</h2>
        <button className="text-sm text-zinc-400 hover:text-white">Pause webhooks</button>
      </div>
      
      <div className="border border-zinc-800/80 rounded-lg overflow-x-auto bg-zinc-900/50">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 bg-zinc-900/80 border-b border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Event / ID</th>
              <th className="px-4 py-3 font-medium">Repository</th>
              <th className="px-4 py-3 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                    log.status === 200 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {log.status === 200 ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-zinc-200 font-medium">{log.event}</div>
                  <div className="text-zinc-500 text-xs font-mono">{log.id}</div>
                </td>
                <td className="px-4 py-3 text-zinc-400">{log.repo}</td>
                <td className="px-4 py-3 text-right">
                  <div className="text-zinc-300 flex items-center justify-end gap-1.5">
                    <Clock className="h-3 w-3 text-zinc-500" />
                    {log.time}
                  </div>
                  <div className="text-zinc-500 text-xs mt-0.5">{log.latency}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApiSettings() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Personal Access Tokens</h2>
        <p className="text-sm text-zinc-400 mb-6">
          Tokens you have generated that can be used to access the RecallIQ API. Keep these secret.
        </p>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between group">
            <div>
              <h4 className="text-white font-medium flex items-center gap-2">
                CI/CD Pipeline Key
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400">Read & Write</span>
              </h4>
              <p className="text-sm text-zinc-500 mt-1 font-mono">riq_live_*******************a9b2</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded">
                <Copy className="h-4 w-4" />
              </button>
              <button className="p-1.5 text-zinc-400 hover:text-red-400 bg-zinc-800 rounded">
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-md transition-colors">
          Generate New Token
        </button>
      </div>
    </div>
  );
}

function SettingToggle({ title, description, defaultChecked }: { title: string, description: string, defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked || false);
  
  return (
    <div className="flex items-start justify-between py-2">
      <div className="pr-8">
        <h4 className="text-zinc-200 font-medium">{title}</h4>
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      </div>
      <button 
        type="button"
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-emerald-500' : 'bg-zinc-700'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
