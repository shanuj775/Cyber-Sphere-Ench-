"use client"

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { analyzeLocationSafety, LocationSafetyOutput } from '@/ai/flows/location-safety-flow';
import { MapPin, ShieldAlert, Globe, Activity, Search, AlertCircle, Info, ScanSearch, Target } from 'lucide-react';

export default function LocationSafetyPage() {
  const { t } = useLanguage();
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LocationSafetyOutput | null>(null);
  const [mapNodes, setMapNodes] = useState<{ x: number, y: number }[]>([]);

  useEffect(() => {
    if (result) {
      setMapNodes([...Array(5)].map(() => ({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      })));
    }
  }, [result]);

  const handleAnalyze = async () => {
    if (!location.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const output = await analyzeLocationSafety({ location });
      setResult(output);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-1000">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Geospatial Risk Analysis</h1>
        <p className="text-muted-foreground text-lg">Global threat intelligence mapped to specific regional incident nodes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-12 bg-card border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Perimeter Definition
            </CardTitle>
            <CardDescription>Target a specific geographical node for forensic risk assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Delhi, India"
                  className="bg-secondary/30 border-white/10 h-14 pl-12 text-lg rounded-2xl"
                />
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !location.trim()}
                className="bg-primary h-14 px-10 futuristic-glow rounded-2xl text-lg font-headline"
              >
                {loading ? <Activity className="animate-spin h-5 w-5" /> : "Initiate Geoscan"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <>
            {/* Futuristic Map Overlay */}
            <Card className="lg:col-span-5 bg-black/40 border-white/5 min-h-[400px] relative overflow-hidden flex flex-col items-center justify-center group">
               <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-1000"></div>
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
               
               {/* Geographic Map Backdrop */}
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full fill-primary/5 stroke-primary/10 stroke-[0.2] opacity-40">
                  <path d="M10,20 Q30,10 50,30 T90,20 V80 Q70,90 50,70 T10,80 Z" />
                  <circle cx="50" cy="50" r="40" className="stroke-primary/5" />
                  <path d="M0,50 L100,50 M50,0 L50,100" className="stroke-primary/5" />
               </svg>
               
               {/* Radar Circles */}
               <div className="absolute w-[300px] h-[300px] border border-primary/20 rounded-full animate-ping opacity-20"></div>
               <div className="absolute w-[450px] h-[450px] border border-primary/10 rounded-full animate-pulse opacity-10"></div>
               <div className="absolute w-[2px] h-[300px] bg-gradient-to-t from-primary/60 to-transparent top-1/2 left-1/2 -translate-x-1/2 -translate-y-full origin-bottom animate-radar-sweep"></div>
               
               {/* Threat Nodes */}
               {mapNodes.map((node, i) => (
                 <div 
                   key={i} 
                   className="absolute h-4 w-4 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(230,51,51,0.8)]"
                   style={{ left: `${node.x}%`, top: `${node.y}%` }}
                 >
                   <div className="absolute -top-8 -left-4 bg-background/90 border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-accent whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                     THREAT_VEC_0{i}
                   </div>
                 </div>
               ))}
               
               <div className="relative z-10 text-center space-y-2">
                 <ScanSearch className="h-16 w-16 text-primary mx-auto mb-4" />
                 <h4 className="text-xl font-headline font-bold uppercase tracking-widest">{location}</h4>
                 <p className="text-[10px] font-mono opacity-60">GEOLOCATION DATA SYNC... OK</p>
               </div>
               
               <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-background/80 p-2 rounded-lg border border-white/5">
                 <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[8px] font-bold uppercase tracking-widest">Live Feed-{location.substring(0,3).toUpperCase()}</span>
               </div>
            </Card>

            <div className="lg:col-span-7 space-y-8 animate-in slide-in-from-right duration-700">
              <Card className="bg-card border-white/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                      <Globe className="h-6 w-6 text-primary" />
                      Regional Intelligence
                    </CardTitle>
                    <Badge variant={result.safetyLevel === 'Critical' || result.safetyLevel === 'High Risk' ? 'destructive' : 'default'} className="mt-2 py-1 px-4 uppercase tracking-wider font-bold">
                      {result.safetyLevel} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-secondary/20 rounded-xl border border-white/5 text-center">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Phishing</div>
                      <div className="text-xl font-bold text-primary">{result.regionalStats.phishingRate}</div>
                    </div>
                    <div className="p-4 bg-secondary/20 rounded-xl border border-white/5 text-center">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Attacks</div>
                      <div className="text-xl font-bold text-accent">{result.regionalStats.networkAttacks}</div>
                    </div>
                    <div className="p-4 bg-secondary/20 rounded-xl border border-white/5 text-center">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Breaches</div>
                      <div className="text-xl font-bold text-yellow-500">{result.regionalStats.dataBreaches}</div>
                    </div>
                  </div>

                  <div className="p-5 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <Info className="h-4 w-4" /> Expert Advisory
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{result.advice}"</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-accent" />
                    Detected Vectors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.topThreats.map((threat, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-background/50 border border-white/5 rounded-xl hover:bg-secondary/30 transition-all cursor-default group">
                        <AlertCircle className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold tracking-tight">{threat}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
