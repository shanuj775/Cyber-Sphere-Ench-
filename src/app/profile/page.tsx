
"use client"

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Shield, Loader2, Save, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [displayName, setDisplayName] = useState('');
  const [language, setLanguage] = useState('en');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setLanguage(profile.preferredLanguage || 'en');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user || !firestore) return;
    setSaving(true);
    
    const updatedProfile = {
      id: user.uid,
      displayName,
      preferredLanguage: language,
      updatedAt: new Date().toISOString(),
      createdAt: profile?.createdAt || new Date().toISOString()
    };

    try {
      setDocumentNonBlocking(doc(firestore, 'users', user.uid), updatedProfile, { merge: true });
      toast({ title: "Profile Updated", description: "Your security identity has been synchronized." });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">Please establish an authenticated connection to view this node.</p>
        <Button asChild><Link href="/login">Go to Login</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-6 mb-12">
        <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-headline font-bold">Identity Management</h1>
          <p className="text-muted-foreground">Configure your specialist credentials and regional preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 bg-card border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Specialist Profile</CardTitle>
            <CardDescription>Update your public identity within the Cyber-Sphere mesh.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Node Email (Read Only)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" value={user.email || ''} readOnly className="pl-10 bg-secondary/20 cursor-not-allowed border-white/5" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Sentinel-One"
                  className="pl-10 bg-secondary/30 border-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Preferred Interface Language</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="pl-10 bg-secondary/30 border-white/10">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="glass-morphism">
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-white/5 pt-6">
            <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto ml-auto futuristic-glow h-11 px-8">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Synchronize Profile
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-primary/5 border-primary/20 h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Identity Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Authenticated Since</div>
              <div className="text-sm font-mono">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Last Sync</div>
              <div className="text-sm font-mono">{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleTimeString() : 'Never'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Node Security Tier</div>
              <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded inline-block">CERTIFIED SPECIALIST</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
