
"use client"

import { useState, useEffect } from 'react';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Lock, Mail, Loader2, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleAuth = async (type: 'login' | 'signup') => {
    if (!email || !password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome back", description: "Successfully logged in." });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Initialize UserProfile in Firestore
        if (firestore) {
          const profileData = {
            id: userCredential.user.uid,
            displayName: email.split('@')[0],
            preferredLanguage: 'en',
            createdAt: new Date().toISOString(),
            lastActivityAt: new Date().toISOString()
          };
          setDocumentNonBlocking(doc(firestore, 'users', userCredential.user.uid), profileData, { merge: true });
        }
        
        toast({ title: "Account created", description: "Welcome to Cyber-Sphere." });
      }
    } catch (error: any) {
      toast({ 
        title: "Authentication failed", 
        description: error.message || "An unexpected error occurred", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged out", description: "You have been securely signed out." });
    } catch (error) {
      console.error(error);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <Card className="bg-card border-white/5">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Authenticated</CardTitle>
            <CardDescription>Logged in as {user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full border-white/10">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-4xl font-headline font-bold">Access Node</h1>
        <p className="text-muted-foreground">Secure your connection to the Cyber-Sphere network.</p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/30 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your security profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="specialist@cyber-sphere.net" className="pl-10 bg-secondary/20" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" className="pl-10 bg-secondary/20" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAuth('login')} className="w-full h-12 futuristic-glow" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Establish Connection"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle>Register Account</CardTitle>
              <CardDescription>Create a new security identity in the mesh network.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="reg-email" type="email" placeholder="specialist@cyber-sphere.net" className="pl-10 bg-secondary/20" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="reg-password" type="password" className="pl-10 bg-secondary/20" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAuth('signup')} className="w-full h-12 futuristic-glow" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Initialize Identity"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
