"use client"

import { useState } from 'react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { detectFakeNews, DetectFakeNewsOutput } from '@/ai/flows/fake-news-detector';
import { fakeNewsTrainingData } from '@/ai/fake-news-training';
import { AlertCircle, CheckCircle2, Newspaper, ShieldAlert } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function FakeNewsPage() {
  const { t } = useLanguage();
  const { user } = useUser();
  const firestore = useFirestore();

  const [article, setArticle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectFakeNewsOutput | null>(null);

  const handleAnalyze = async () => {
    if (!article.trim()) return;
    setLoading(true);
    try {
      const output = await detectFakeNews({ article });
      setResult(output);

      if (user && firestore) {
        const resultsRef = collection(firestore, 'users', user.uid, 'newsScanResults');
        addDocumentNonBlocking(resultsRef, {
          userId: user.uid,
          articlePreview: article.substring(0, 120),
          resultStatus: output.isFakeNews ? 'fake-news-detected' : 'real-news-verified',
          threatLevel: output.isFakeNews ? 'high' : 'low',
          category: output.category,
          details: output.reasoning,
          flaggedSignals: output.flaggedSignals,
          scanTimestamp: new Date().toISOString(),
          id: doc(resultsRef).id,
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
        <h1 className="text-4xl font-headline font-bold">{t('tools.fakeNews')}</h1>
        <p className="text-muted-foreground">
          Analyze news content using a trained credibility model and real-world fake-news pattern detection.
        </p>
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
          Training dataset size: {fakeNewsTrainingData.length} examples
        </p>
      </div>

      <div className="grid gap-8">
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Article Analysis Console</CardTitle>
            <CardDescription>Paste the headline or full article text to assess whether it appears genuine.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              placeholder="Paste news text, headline, or article content here..."
              className="min-h-[220px] bg-secondary/30 border-white/10 focus:border-primary"
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading || !article.trim()}
              className="w-full bg-primary futuristic-glow h-12 text-lg font-headline"
            >
              {loading ? 'Inspecting Source Integrity...' : 'Run Fake News Detection'}
            </Button>
            {!user && <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">Login to save scan results</p>}
          </CardContent>
        </Card>

        {result && (
          <Card className={`animate-in fade-in slide-in-from-bottom duration-500 bg-card border-2 ${
            result.isFakeNews ? 'border-accent/30' : 'border-green-500/30'
          }`}>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {result.isFakeNews ? <ShieldAlert className="text-accent h-6 w-6" /> : <CheckCircle2 className="text-green-500 h-6 w-6" />}
                  Result: {result.category.toUpperCase()}
                </CardTitle>
                <CardDescription>Credibility assessment powered by local heuristics and AI fallback.</CardDescription>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <Badge variant={result.isFakeNews ? 'destructive' : 'default'} className="h-8 px-4 text-sm">
                  {result.isFakeNews ? 'FLAGGED' : 'VERIFIED'}
                </Badge>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/80 px-3 py-2 text-xs text-muted-foreground">
                  <Newspaper className="h-4 w-4 text-current" />
                  Source credibility: <span className={result.isFakeNews ? 'text-accent font-bold' : 'text-emerald-400 font-bold'}>
                    {result.isFakeNews ? 'Low' : 'High'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/80 px-3 py-2 text-xs text-muted-foreground">
                  <span className={result.confidence >= 70 ? 'text-emerald-400 font-bold' : result.confidence >= 50 ? 'text-amber-400 font-bold' : 'text-accent font-bold'}>
                    Model Confidence: {result.confidence}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                <h4 className="font-bold mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Analysis Rationale
                </h4>
                <p className="text-muted-foreground leading-relaxed">{result.reasoning}</p>
              </div>
              {result.flaggedSignals.length > 0 && (
                <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                  <h4 className="font-bold mb-2 text-sm uppercase tracking-wider">Detected Signals</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {result.flaggedSignals.map((signal, index) => (
                      <li key={index}>{signal}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
