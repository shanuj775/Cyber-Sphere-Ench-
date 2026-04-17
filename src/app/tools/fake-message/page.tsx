
"use client"

import { useState } from 'react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { detectFakeMessage, DetectFakeMessageOutput } from '@/ai/flows/fake-message-detector';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function FakeMessagePage() {
  const { t } = useLanguage();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectFakeMessageOutput | null>(null);

  const handleAnalyze = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const output = await detectFakeMessage({ message });
      setResult(output);

      if (user && firestore) {
        const resultsRef = collection(firestore, 'users', user.uid, 'messageScanResults');
        addDocumentNonBlocking(resultsRef, {
          userId: user.uid,
          messageContentPreview: message.substring(0, 100),
          resultStatus: output.isSuspicious ? 'phishing-detected' : 'safe',
          threatLevel: output.isSuspicious ? 'high' : 'low',
          details: output.reasoning,
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold">{t('tools.fakeMessage')}</h1>
        <p className="text-muted-foreground">Advanced linguistic AI analysis to identify scam, phishing, and fraudulent communications.</p>
      </div>

      <div className="grid gap-8">
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Message Input Buffer</CardTitle>
            <CardDescription>Paste the suspicious message below for deep inspection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste email, SMS, or chat message content here..."
              className="min-h-[200px] bg-secondary/30 border-white/10 focus:border-primary"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={loading || !message.trim()}
              className="w-full bg-primary futuristic-glow h-12 text-lg font-headline"
            >
              {loading ? "Analyzing Neural Patterns..." : "Execute Detection Scan"}
            </Button>
            {!user && <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">Login to save scan results</p>}
          </CardContent>
        </Card>

        {result && (
          <Card className={`animate-in fade-in slide-in-from-bottom duration-500 bg-card border-2 ${
            result.isSuspicious ? 'border-accent/30' : 'border-green-500/30'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {result.isSuspicious ? <ShieldAlert className="text-accent h-6 w-6" /> : <CheckCircle2 className="text-green-500 h-6 w-6" />}
                  Analysis Result: {result.category.toUpperCase()}
                </CardTitle>
                <CardDescription>Security confidence verified by Cyber-Sphere Intelligence.</CardDescription>
              </div>
              <Badge variant={result.isSuspicious ? 'destructive' : 'default'} className="h-8 px-4 text-sm">
                {result.isSuspicious ? 'SUSPICIOUS' : 'SECURE'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                <h4 className="font-bold mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> 
                  Reasoning Engine Output
                </h4>
                <p className="text-muted-foreground leading-relaxed">{result.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
