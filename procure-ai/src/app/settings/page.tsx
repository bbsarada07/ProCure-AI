'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Key, 
  Cpu, 
  Globe, 
  Shield, 
  Database,
  Save,
  RefreshCw,
  Server,
  Terminal,
  Activity
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [isLocalLLM, setIsLocalLLM] = useState(false);
  return (
    <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">System Settings</h2>
        <p className="text-slate-500 mt-1">Configure platform parameters, security, and AI model integrations.</p>
      </div>

      <Tabs defaultValue="ai" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 border border-slate-200">
          <TabsTrigger value="ai" className="gap-2 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Cpu className="w-4 h-4" /> AI Models
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Shield className="w-4 h-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="infrastructure" className="gap-2 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Server className="w-4 h-4" /> Infrastructure
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-6">
          <Card className="border-none shadow-lg bg-white">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Key className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>LLM API Configuration</CardTitle>
                  <CardDescription>Primary and fallback models for criteria extraction and analysis.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="api_key">Gemini API Key</Label>
                  <div className="flex gap-4">
                    <Input id="api_key" type="password" value="••••••••••••••••••••••••••••••" className="bg-slate-50 border-slate-200 font-mono" />
                    <Button variant="outline" className="gap-2 whitespace-nowrap">
                      <RefreshCw className="w-4 h-4" /> Rotate Key
                    </Button>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">Connected to Project: CRPF-AI-PROD-2026</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Primary Model</Label>
                    <select className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Gemini 1.5 Pro (Default)</option>
                      <option>Gemini 1.5 Flash</option>
                      <option>Gemini 2.0 experimental</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>OCR Provider</Label>
                    <select className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Google Document AI</option>
                      <option>Amazon Textract</option>
                      <option>Azure AI Vision</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-4">
                <Globe className="w-5 h-5 text-blue-600 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-blue-900">Regional Endpoint</h4>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    By default, data is routed to the India-South region (Mumbai) to comply with data residency laws.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Database className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <CardTitle>Autonomous Processing</CardTitle>
                  <CardDescription>Control how AI handles ambiguous cases and disqualifications.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Strict Manual Review Protocol</Label>
                  <p className="text-sm text-slate-500">Always flag cases with confidence score below 85%.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-red-600 font-bold">Auto-Disqualification</Label>
                  <p className="text-sm text-slate-500">Allow system to disqualify bidders without human intervention.</p>
                </div>
                <Switch className="data-[state=checked]:bg-red-600" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="border-b bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-lg">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Model Infrastructure</CardTitle>
                  <CardDescription>Configure deployment environment for data sovereignty.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/50">
                  <div className="space-y-1">
                    <Label className="text-lg font-bold text-slate-900">Deployment Architecture</Label>
                    <p className="text-sm text-slate-500">Switch between high-performance cloud and high-security air-gapped processing.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white p-1 rounded-xl border shadow-sm">
                    <button 
                      onClick={() => setIsLocalLLM(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isLocalLLM ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Cloud LLM (Gemini 2.0)
                    </button>
                    <button 
                      onClick={() => setIsLocalLLM(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isLocalLLM ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Air-Gapped Local LLM
                    </button>
                  </div>
                </div>

                {isLocalLLM && (
                  <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 w-fit">
                      <Activity className="w-3.5 h-3.5 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Local Instance Active</span>
                    </div>
                    
                    <div className="rounded-xl bg-slate-950 p-4 font-mono text-[11px] text-emerald-400 shadow-2xl border border-slate-800">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
                        <Terminal className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-500">system_node@procure-ai-secure: ~</span>
                      </div>
                      <div className="space-y-1">
                        <p><span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-blue-400">INFO:</span> Initializing Llama-3-8B-Instruct-Q8_0.gguf...</p>
                        <p><span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-blue-400">INFO:</span> GPU Acceleration enabled (CUDA 12.1)</p>
                        <p><span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-emerald-400 font-bold">SUCCESS:</span> Local weights loaded successfully on secure intranet.</p>
                        <p><span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-slate-300">system:</span> Listening on 127.0.0.1:8080</p>
                        <div className="w-2 h-4 bg-emerald-400 animate-pulse inline-block align-middle ml-1" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Local Latency</div>
                  <div className="text-xl font-bold text-slate-900">14.2 ms</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Security Tier</div>
                  <div className="text-xl font-bold text-blue-600">Level 5 (Restricted)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end p-6 border-t mt-8 sticky bottom-0 bg-slate-50/80 backdrop-blur z-20">
        <Button className="bg-slate-900 hover:bg-slate-800 gap-2 px-8 py-6 h-auto shadow-xl">
          <Save className="w-5 h-5" /> Save System Configuration
        </Button>
      </div>
    </div>
  );
}
