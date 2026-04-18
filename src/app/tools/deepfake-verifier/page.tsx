"use client"

import { useState, useRef } from 'react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { verifyDeepfake, DeepfakeVerifierOutput } from '@/ai/flows/deepfake-verifier-flow';
import { Eye, ShieldAlert, Upload, Image as ImageIcon, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function DeepfakeVerifierPage() {
  const { t } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeepfakeVerifierOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const output = await verifyDeepfake({ photoDataUri: image });
      if (!output || typeof output.isDeepfake !== 'boolean') {
        throw new Error('Invalid verification response');
      }
      setResult(output);
    } catch (err) {
      console.error(err);
      setError('Deepfake verification failed. Please try again or use the local fallback analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold">{t('tools.deepfakeVerifier')}</h1>
        <p className="text-muted-foreground">Neural network analysis to detect AI-generated facial manipulation and synthetic media.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Media Ingestion
            </CardTitle>
            <CardDescription>Upload an image for pixel-level forensics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-secondary/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all group relative overflow-hidden"
            >
              {image ? (
                <Image src={image} alt="Upload Preview" fill className="object-cover" />
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-muted-foreground">Click to upload or drag & drop</span>
                  <span className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-widest">JPG, PNG (Max 5MB)</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*" 
            />
            <div className="flex gap-4">
              <Button 
                onClick={handleVerify} 
                disabled={loading || !image}
                className="flex-1 bg-primary h-12 text-lg font-headline futuristic-glow"
              >
                {loading ? "Analyzing Neural Weights..." : "Execute Forensics"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => { setImage(null); setResult(null); }}
                className="h-12 px-4 border-white/10"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {!result && !loading && (
            <div className="h-full flex items-center justify-center p-8 border border-white/5 rounded-2xl bg-secondary/10">
              <div className="text-center space-y-4">
                <Camera className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                <p className="text-sm text-muted-foreground">Awaiting media input for verification...</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center p-8 border border-primary/20 rounded-2xl bg-primary/5 animate-pulse">
              <div className="text-center space-y-4">
                <Eye className="h-12 w-12 text-primary mx-auto animate-bounce" />
                <p className="text-sm font-bold text-primary uppercase tracking-widest">Scanning Digital Artifacts...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="h-full flex items-center justify-center p-6 border border-red-500/20 rounded-2xl bg-red-500/10">
              <div className="text-center space-y-3">
                <p className="text-sm font-bold text-red-500">{error}</p>
                <p className="text-xs text-muted-foreground">If the AI verification fails, the local heuristic will still inspect the image on the server.</p>
              </div>
            </div>
          )}

          {result && (
            <Card className={`h-full bg-card border-2 animate-in zoom-in duration-300 ${
              result.isDeepfake ? 'border-accent/30' : 'border-green-500/30'
            }`}>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <Badge variant={result.isDeepfake ? 'destructive' : 'default'} className="h-6">
                    {result.isDeepfake ? 'MANIPULATED' : 'AUTHENTIC'}
                  </Badge>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Confidence: {result.confidence}%</span>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {result.isDeepfake ? <ShieldAlert className="text-accent h-6 w-6" /> : <CheckCircle2 className="text-green-500 h-6 w-6" />}
                  {result.isDeepfake ? "AI Manipulation Detected" : "Media Integrity Verified"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-background/50 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold mb-2 uppercase text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" /> Forensics Summary
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest">Identified Anomalies</h4>
                  <div className="space-y-2">
                    {result.anomalies.map((anomaly, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-secondary/20 p-2 rounded-lg border border-white/5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {anomaly}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
