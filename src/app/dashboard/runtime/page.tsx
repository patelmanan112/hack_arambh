"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Cpu, 
  Database, 
  HardDrive, 
  Layers, 
  RefreshCcw, 
  Server, 
  Terminal, 
  Wifi, 
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";

// Mock data for runtime metrics
const latencyData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  latency: Math.floor(Math.random() * 40) + 20, // 20-60ms
  tokens: Math.floor(Math.random() * 5000) + 1000,
}));

const services = [
  { name: "Code Analyzer", status: "Operational", latency: "24ms", model: "GPT-4-Turbo", uptime: "99.99%", load: "34%" },
  { name: "PR Summarizer", status: "Operational", latency: "38ms", model: "Claude-3-Sonnet", uptime: "99.98%", load: "42%" },
  { name: "Vector Indexer", status: "Syncing", latency: "112ms", model: "text-embedding-3", uptime: "99.95%", load: "87%" },
  { name: "RAG Engine", status: "Operational", latency: "45ms", model: "GPT-4o", uptime: "100%", load: "28%" },
  { name: "Knowledge Graph", status: "Operational", latency: "18ms", model: "Neo4j Backend", uptime: "99.99%", load: "12%" },
];

const queues = [
  { task: "Sync 'facebook/react' AST", priority: "High", status: "Processing", progress: 68 },
  { task: "Update PR #28441 Embeddings", priority: "Medium", status: "Pending", progress: 0 },
  { task: "Reindex 'vercel/next.js' Issues", priority: "Low", status: "Pending", progress: 0 },
];

export default function RuntimeStatusPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col space-y-8 p-6 md:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="h-7 w-7 text-emerald-400" />
            AI Runtime Status
          </h1>
          <p className="text-zinc-400 mt-1">
            Live monitoring of intelligence services, vector indices, and synchronization queues.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Operational
          </span>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-medium">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Global API Latency" 
          value="34ms" 
          trend="-2ms" 
          trendPositive={true} 
          icon={<Zap className="h-5 w-5 text-yellow-400" />} 
        />
        <MetricCard 
          title="Tokens Processed (24h)" 
          value="1.4M" 
          trend="+12%" 
          trendPositive={false} 
          icon={<Terminal className="h-5 w-5 text-blue-400" />} 
        />
        <MetricCard 
          title="Vector Embeddings" 
          value="24.8M" 
          trend="+4.2%" 
          trendPositive={true} 
          icon={<Database className="h-5 w-5 text-indigo-400" />} 
        />
        <MetricCard 
          title="Active Sync Queues" 
          value="3" 
          subtext="1 Processing, 2 Pending"
          icon={<Layers className="h-5 w-5 text-purple-400" />} 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Chart */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Wifi className="h-5 w-5 text-zinc-400" />
                Inference Latency
              </h3>
              <p className="text-sm text-zinc-500 mt-1">Average response time over last 24 hours</p>
            </div>
            <div className="text-2xl font-semibold text-white">34<span className="text-sm text-zinc-500 ml-1">ms</span></div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}ms`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#10b981" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tokens Chart */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-zinc-400" />
                Token Consumption
              </h3>
              <p className="text-sm text-zinc-500 mt-1">LLM token usage volume</p>
            </div>
            <div className="text-2xl font-semibold text-white">1.4<span className="text-sm text-zinc-500 ml-1">M</span></div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="tokens" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Status Table */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <Server className="h-5 w-5 text-zinc-400" />
            Intelligence Services
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800/80">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Service</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Latency</th>
                  <th className="px-4 py-3 font-medium">Model Backend</th>
                  <th className="px-4 py-3 font-medium">Load</th>
                  <th className="px-4 py-3 font-medium rounded-tr-lg">Uptime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {services.map((service, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-4 py-4 font-medium text-zinc-200">{service.name}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                        service.status === 'Operational' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {service.status === 'Operational' ? <CheckCircle2 className="h-3 w-3" /> : <RefreshCcw className="h-3 w-3 animate-spin" />}
                        {service.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-zinc-300">{service.latency}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-zinc-400 bg-zinc-800/60 px-2 py-1 rounded">
                        {service.model}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-zinc-300">
                      <div className="flex items-center gap-2">
                        <span className="w-8">{service.load}</span>
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${parseInt(service.load) > 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`} 
                            style={{ width: service.load }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-zinc-300">{service.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Database & Index Queues */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-zinc-400" />
              Index Sync Queues
            </h3>
            <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full">3 Tasks</span>
          </div>

          <div className="space-y-4">
            {queues.map((q, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800/80 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-zinc-200 line-clamp-1" title={q.task}>{q.task}</h4>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    q.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                    q.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {q.priority}
                  </span>
                </div>
                
                {q.status === 'Processing' ? (
                  <>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1.5 mt-3">
                      <span className="flex items-center gap-1"><RefreshCcw className="h-3 w-3 animate-spin text-emerald-400" /> Syncing...</span>
                      <span>{q.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${q.progress}%` }} />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mt-3">
                    <AlertCircle className="h-3 w-3" /> Waiting in queue
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 border border-zinc-800 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendPositive, subtext, icon }: any) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-zinc-700/80 transition-colors">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-zinc-800/20 rounded-full blur-2xl group-hover:bg-zinc-700/30 transition-colors"></div>
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            {trend && (
              <span className={`text-xs font-medium ${trendPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend}
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-zinc-500 mt-1">{subtext}</p>}
        </div>
        <div className="p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50 text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}
