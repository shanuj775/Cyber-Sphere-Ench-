
"use client"

import { useState } from 'react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { scanLink, LinkScannerOutput } from '@/ai/flows/link-scanner-flow';
import { Globe, AlertTriangle, ShieldCheck, Search, ArrowRight, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function LinkScannerPage() {
  const { t } = useLanguage();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkScannerOutput | null>(null);

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const output = await scanLink({ url });
      setResult(output);

      // Save to database if user is logged in
      if (user && firestore) {
        const scanResultsRef = collection(firestore, 'users', user.uid, 'linkScanResults');
        addDocumentNonBlocking(scanResultsRef, {
          userId: user.uid,
          scannedUrl: url,
          resultStatus: output.isSafe ? 'safe' : 'malicious',
          threatLevel: output.riskScore > 75 ? 'critical' : output.riskScore > 40 ? 'medium' : 'low',
          details: output.details,
          scanTimestamp: new Date().toISOString(),
          id: doc(scanResultsRef).id
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold">{t('tools.linkScanner')}</h1>
        <p className="text-muted-foreground">Global threat intelligence database lookup and heuristic URL analysis.</p>
      </div>

      <div className="grid gap-8">
        <Card className="bg-card border-white/5 overflow-hidden">
          <div className="h-1 bg-primary/20 relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-primary animate-scan w-full" />}
          </div>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Network Entry Point
            </CardTitle>
            <CardDescription>Input a URL to perform a multi-layer security validation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/suspicious-path"
                className="bg-secondary/30 border-white/10 h-12"
              />
              <Button 
                onClick={handleScan} 
                disabled={loading || !url.trim()}
                className="bg-primary h-12 px-6"
              >
                {loading ? <Search className="animate-spin" /> : "Scan Link"}
              </Button>
            </div>
            {!user && <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">Login to save scan history</p>}
          </CardContent>
        </Card>

        {result && (
          <Card className={`animate-in fade-in slide-in-from-bottom duration-500 bg-card border-2 ${
            result.isSafe ? 'border-green-500/30' : 'border-accent/30'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {result.isSafe ? <ShieldCheck className="text-green-500 h-6 w-6" /> : <AlertTriangle className="text-accent h-6 w-6" />}
                  Security Status: {result.isSafe ? 'VERIFIED SAFE' : 'THREAT DETECTED'}
                </CardTitle>
                <CardDescription>Analysis completed at node CS-CORE-01.</CardDescription>
              </div>
              <Badge variant={result.isSafe ? 'default' : 'destructive'}>
                RISK: {result.riskScore}%
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Threat Level Gradient</span>
                  <span>{result.riskScore}% Probability</span>
                </div>
                <Progress value={result.riskScore} className={`h-2 ${result.isSafe ? 'bg-secondary' : 'bg-accent/20'}`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold mb-2 uppercase text-primary flex items-center gap-2">
                    <Activity className="h-3 w-3" /> Technical Breakdown
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.details}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold mb-2 uppercase text-accent flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" /> Recommendation
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
