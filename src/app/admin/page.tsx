"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/components/language-context';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { Shield, Users, Activity, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';

const data = [
  { name: 'Mon', score: 45 },
  { name: 'Tue', score: 38 },
  { name: 'Wed', score: 62 },
  { name: 'Thu', score: 48 },
  { name: 'Fri', score: 75 },
  { name: 'Sat', score: 32 },
  { name: 'Sun', score: 41 },
];

const scanResults = [
  { name: 'Phishing', value: 400, color: '#1E5699' },
  { name: 'Malware', value: 300, color: '#E63333' },
  { name: 'Deepfake', value: 200, color: '#8B5CF6' },
  { name: 'Safe', value: 1100, color: '#22C55E' },
];

export default function AdminDashboard() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold">Admin Risk Console</h1>
          <p className="text-muted-foreground">Aggregated security telemetry and predictive risk assessment.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-primary/10 border border-primary/30 p-4 rounded-2xl flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">84%</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Safety Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-white/5 p-6 space-y-2">
          <div className="flex justify-between items-center">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-[10px] text-green-500 font-bold">+12%</span>
          </div>
          <div className="text-3xl font-headline font-bold">12,482</div>
          <div className="text-sm text-muted-foreground">Global User Nodes</div>
        </Card>
        <Card className="bg-card border-white/5 p-6 space-y-2">
          <div className="flex justify-between items-center">
            <Activity className="h-5 w-5 text-blue-500" />
            <span className="text-[10px] text-primary font-bold">STABLE</span>
          </div>
          <div className="text-3xl font-headline font-bold">452ms</div>
          <div className="text-sm text-muted-foreground">Avg. Scan Latency</div>
        </Card>
        <Card className="bg-card border-white/5 p-6 space-y-2">
          <div className="flex justify-between items-center">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <span className="text-[10px] text-accent font-bold">HIGH</span>
          </div>
          <div className="text-3xl font-headline font-bold">14</div>
          <div className="text-sm text-muted-foreground">Critical Vulnerabilities</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Weekly System Risk Trend
            </CardTitle>
            <CardDescription>Predictive scoring based on detected anomalies.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141A1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#1E5699' }}
                />
                <Line type="monotone" dataKey="score" stroke="#1E5699" strokeWidth={3} dot={{ r: 4, fill: '#1E5699' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-accent" />
              Threat Distribution
            </CardTitle>
            <CardDescription>Categorization of scanned content across the network.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scanResults}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {scanResults.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#141A1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {scanResults.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-white/5 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Real-time Node Telemetry</CardTitle>
          <CardDescription>Active scanning sessions in the mesh network.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 'NODE-XF42', type: 'Link Scan', status: 'COMPLETE', res: 'SAFE', time: '2s ago' },
              { id: 'NODE-ZA90', type: 'Port Scan', status: 'IN PROGRESS', res: 'SCANNING', time: 'Now' },
              { id: 'NODE-KP11', type: 'Deepfake', status: 'ALERT', res: 'TAMPERED', time: '1m ago' },
              { id: 'NODE-LW03', type: 'Malware', status: 'COMPLETE', res: 'SAFE', time: '5m ago' },
            ].map((node, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background/50 border border-white/5 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`h-2 w-2 rounded-full ${node.res === 'SAFE' ? 'bg-green-500' : node.res === 'TAMPERED' ? 'bg-accent' : 'bg-primary animate-pulse'}`}></div>
                  <div>
                    <div className="text-xs font-bold font-mono">{node.id}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{node.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-bold ${node.status === 'ALERT' ? 'text-accent' : 'text-primary'}`}>{node.status}</div>
                  <div className="text-[10px] text-muted-foreground">{node.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}