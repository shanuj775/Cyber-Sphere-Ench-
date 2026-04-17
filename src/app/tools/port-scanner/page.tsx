"use client"

import { useState } from 'react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { simulatePortScan, PortScannerOutput } from '@/ai/flows/port-scanner-flow';
import { Terminal, ShieldAlert, ShieldCheck, Activity, Search, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function PortScannerPage() {
  const { t } = useLanguage();
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PortScannerOutput | null>(null);

  const handleScan = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const output = await simulatePortScan({ target });
      setResult(output);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold">{t('tools.portScanner')}</h1>
        <p className="text-muted-foreground">Simulate network vulnerability assessments and audit open service ports.</p>
      </div>

      <div className="grid gap-8">
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Target Node Definition
            </CardTitle>
            <CardDescription>Enter an IP address or hostname for a simulated audit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g., 192.168.1.1 or scan-me.node"
                className="bg-secondary/30 border-white/10 h-12 font-mono"
              />
              <Button 
                onClick={handleScan} 
                disabled={loading || !target.trim()}
                className="bg-primary h-12 px-8 futuristic-glow"
              >
                {loading ? <Search className="animate-spin" /> : "Initialize Audit"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className={`animate-in fade-in slide-in-from-bottom duration-500 bg-card border-2 ${
            result.overallRiskScore > 50 ? 'border-accent/30' : 'border-green-500/30'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" />
                  Network Security Posture
                </CardTitle>
                <CardDescription>Audit results for node: {target}</CardDescription>
              </div>
              <Badge variant={result.overallRiskScore > 50 ? 'destructive' : 'default'}>
                RISK SCORE: {result.overallRiskScore}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Vulnerability Saturation</span>
                  <span>{result.overallRiskScore}%</span>
                </div>
                <Progress value={result.overallRiskScore} className="h-2 bg-secondary" />
              </div>

              <div className="grid gap-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Detected Service Nodes</h4>
                {result.openPorts.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-primary font-bold">PORT {p.port}</div>
                      <div>
                        <div className="text-sm font-bold">{p.service}</div>
                        <div className="text-xs text-muted-foreground">{p.description}</div>
                      </div>
                    </div>
                    <Badge variant={p.risk === 'Critical' || p.risk === 'High' ? 'destructive' : 'outline'}>
                      {p.risk}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <h4 className="text-xs font-bold mb-2 uppercase text-primary flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3" /> Executive Summary
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
