"use client"

export const dynamic = 'force-dynamic';

import type { ReactNode } from 'react';
import { useLanguage } from '@/components/language-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, History, Star, ArrowUpRight, ShieldCheck, Newspaper, Loader2, Link as LinkIcon, MessageSquare, Image as ImageIcon, FileSearch, QrCode } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

type ScanRecord = DocumentData & {
  id: string;
  type: string;
  icon: ReactNode;
  scanTimestamp?: string | number | Date;
  resultStatus?: string;
  scannedUrl?: string;
  messageContentPreview?: string;
  scannedContent?: string;
};

export default function UserDashboard() {
  const { t } = useLanguage();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Fetch unified recent scans (multiple collections)
  const linkScansQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'linkScanResults'), orderBy('scanTimestamp', 'desc'), limit(3));
  }, [firestore, user]);

  const messageScansQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'messageScanResults'), orderBy('scanTimestamp', 'desc'), limit(3));
  }, [firestore, user]);

  const qrScansQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'qrCodeScanResults'), orderBy('scanTimestamp', 'desc'), limit(3));
  }, [firestore, user]);

  const { data: linkScans, isLoading: linksLoading } = useCollection<DocumentData>(linkScansQuery);
  const { data: messageScans, isLoading: messagesLoading } = useCollection<DocumentData>(messageScansQuery);
  const { data: qrScans, isLoading: qrLoading } = useCollection<DocumentData>(qrScansQuery);

  const isLoadingHistory = linksLoading || messagesLoading || qrLoading;

  const scanRecords: ScanRecord[] = [
    ...(linkScans || []).map(s => ({ ...s, type: 'Link', icon: <LinkIcon className="h-4 w-4" /> })),
    ...(messageScans || []).map(s => ({ ...s, type: 'Message', icon: <MessageSquare className="h-4 w-4" /> })),
    ...(qrScans || []).map(s => ({ ...s, type: 'QR', icon: <QrCode className="h-4 w-4" /> }))
  ];

  const allScans = scanRecords
    .sort((a, b) => new Date(b.scanTimestamp ?? 0).getTime() - new Date(a.scanTimestamp ?? 0).getTime())
    .slice(0, 10);

  const news = [
    { title: "New Zero-Day vulnerability found in popular browser", source: "Security Labs", time: "2h ago" },
    { title: "Phishing attacks increase by 40% in South Asia region", source: "Cyber Threat Intel", time: "5h ago" },
    { title: "AI-powered firewalls are the new standard", source: "Tech Weekly", time: "1d ago" },
  ];

  if (isUserLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <Shield className="h-16 w-16 text-muted-foreground mx-auto opacity-20" />
        <h1 className="text-3xl font-headline font-bold">Authentication Required</h1>
        <p className="text-muted-foreground">Please sign in to view your security analytics and history.</p>
        <Link href="/login">
          <Button size="lg" className="futuristic-glow">Sign In to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-headline font-bold">System Status: Optimal</h1>
          <p className="text-muted-foreground">Welcome back, Specialist. Your digital perimeter is currently secure.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{allScans.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Activity</div>
          </div>
          <div className="h-10 w-px bg-white/10"></div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {allScans.filter(s => s.resultStatus !== 'safe').length}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Threats Flagged</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Security Progress */}
        <Card className="lg:col-span-2 bg-card border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              Protection Coverage
            </CardTitle>
            <CardDescription>Based on tools utilized and safety best practices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Identity Protection</span>
                <span className="font-bold">85%</span>
              </div>
              <Progress value={85} className="h-2 bg-secondary" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Network Perimeter</span>
                <span className="font-bold">60%</span>
              </div>
              <Progress value={60} className="h-2 bg-secondary" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Content Verification</span>
                <span className="font-bold">95%</span>
              </div>
              <Progress value={95} className="h-2 bg-secondary" />
            </div>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Daily Security Intel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-background/50 rounded-xl border border-white/5 space-y-2">
              <div className="text-xs font-bold text-primary uppercase">Strategy #041</div>
              <p className="text-sm">Never use public Wi-Fi for financial transactions without an active VPN tunnel.</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-white/5 space-y-2">
              <div className="text-xs font-bold text-accent uppercase">Threat Intel</div>
              <p className="text-sm">New "Urgent Tax" SMS scams are targeting users in your region.</p>
            </div>
          </CardContent>
        </Card>

        {/* Unified Scan History */}
        <Card className="lg:col-span-2 bg-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-500" />
              Unified Activity Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex py-10 justify-center">
                <Loader2 className="animate-spin text-muted-foreground" />
              </div>
            ) : allScans.length > 0 ? (
              <div className="space-y-4">
                {allScans.map((scan, i) => {
                  const status = scan.resultStatus ?? 'unknown';
                  const isSafe = status === 'safe' || status === 'clean';

                  return (
                    <div key={i} className="flex items-center justify-between p-4 bg-background/30 rounded-xl border border-white/5 group hover:bg-background/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${isSafe ? 'bg-green-500/10 text-green-500' : 'bg-accent/10 text-accent'}`}>
                          {scan.icon}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{scan.type} Scan</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {scan.scannedUrl || scan.messageContentPreview || scan.scannedContent || 'Media Verification'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <Badge variant={isSafe ? 'default' : 'destructive'} className="h-6">
                          {status.toUpperCase()}
                        </Badge>
                        <div className="text-right hidden sm:block">
                          <div className="text-[10px] text-muted-foreground">{new Date(scan.scanTimestamp ?? Date.now()).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm border-2 border-dashed border-white/5 rounded-xl">
                No recent activity detected in the mesh.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cyber News */}
        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              Threat Landscape
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {news.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-primary uppercase">{item.source}</span>
                  <span className="text-[10px] text-muted-foreground">{item.time}</span>
                </div>
                <h4 className="text-sm font-medium group-hover:text-primary transition-colors flex items-center justify-between">
                  {item.title}
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                </h4>
                <div className="h-px bg-white/5 w-full mt-4 group-last:hidden"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
