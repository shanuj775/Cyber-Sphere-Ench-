"use client"

import { useState } from 'react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { scanQrCode, QrScannerOutput } from '@/ai/flows/qr-scanner-flow';
import { QrCode, ShieldAlert, ShieldCheck, Activity, Search, AlertCircle, ScanLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function QrScannerPage() {
  const { t } = useLanguage();
  const { user } = useUser();
  const firestore = useFirestore();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QrScannerOutput | null>(null);

  const handleScan = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const output = await scanQrCode({ qrContent: content });
      setResult(output);

      if (user && firestore) {
        const resultsRef = collection(firestore, 'users', user.uid, 'qrCodeScanResults');
        addDocumentNonBlocking(resultsRef, {
          userId: user.uid,
          scannedContent: content,
          resultStatus: output.isSafe ? 'safe' : 'malicious-link',
          threatLevel: output.riskScore > 70 ? 'high' : output.riskScore > 30 ? 'medium' : 'low',
          details: output.analysis,
          scanTimestamp: new Date().toISOString(),
          id: doc(resultsRef).id
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold">{t('tools.qrScanner')}</h1>
        <p className="text-muted-foreground">Decode and neutralize "Qishing" threats by verifying QR code destinations before access.</p>
      </div>

      <div className="grid gap-8">
        <Card className="bg-card border-white/5 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Content Buffer
            </CardTitle>
            <CardDescription>Input the URL or text extracted from a QR code for deep inspection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste QR code URL or text..."
                className="bg-secondary/30 border-white/10 h-12 flex-1"
              />
              <Button 
                onClick={handleScan} 
                disabled={loading || !content.trim()}
                className="bg-primary h-12 px-8 futuristic-glow"
              >
                {loading ? <ScanLine className="animate-bounce" /> : "Verify Origin"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className={`animate-in zoom-in duration-500 bg-card border-2 ${
            result.isSafe ? 'border-green-500/30' : 'border-accent/30'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {result.isSafe ? <ShieldCheck className="text-green-500 h-6 w-6" /> : <ShieldAlert className="text-accent h-6 w-6" />}
                  Audit Result: {result.threatType.toUpperCase()}
                </CardTitle>
                <CardDescription>Content structural integrity scan completed.</CardDescription>
              </div>
              <Badge variant={result.isSafe ? 'default' : 'destructive'} className="h-8">
                RISK: {result.riskScore}%
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                  <span>Malicious Probability</span>
                  <span>{result.riskScore}%</span>
                </div>
                <Progress value={result.riskScore} className="h-2 bg-secondary" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold mb-2 uppercase text-primary flex items-center gap-2">
                    <Search className="h-3 w-3" /> Forensic Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.analysis}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold mb-2 uppercase text-accent flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" /> Protocol Recommendation
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium text-foreground">{result.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
