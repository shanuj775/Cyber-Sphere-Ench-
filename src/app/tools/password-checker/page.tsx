"use client"

import { useState, useMemo } from 'react';
import { useLanguage } from '@/components/language-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Lock, Eye, EyeOff, ShieldCheck, Check, X } from 'lucide-react';

export default function PasswordChecker() {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const stats = useMemo(() => {
    let score = 0;
    if (password.length > 8) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    if (password.length > 12) score += 20;
    return score;
  }, [password]);

  const strengthLabel = () => {
    if (stats === 0) return { label: 'None', color: 'bg-muted' };
    if (stats <= 20) return { label: 'Critical', color: 'bg-red-500' };
    if (stats <= 40) return { label: 'Weak', color: 'bg-orange-500' };
    if (stats <= 60) return { label: 'Moderate', color: 'bg-yellow-500' };
    if (stats <= 80) return { label: 'Strong', color: 'bg-blue-500' };
    return { label: 'Unbreakable', color: 'bg-green-500' };
  };

  const checks = [
    { label: "Minimum 8 characters", valid: password.length >= 8 },
    { label: "Contains uppercase letters", valid: /[A-Z]/.test(password) },
    { label: "Contains numeric digits", valid: /[0-9]/.test(password) },
    { label: "Contains special characters", valid: /[^A-Za-z0-9]/.test(password) }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-headline font-bold">{t('tools.passwordChecker')}</h1>
        <p className="text-muted-foreground">Verify the resilience of your credentials against brute-force and dictionary attacks.</p>
      </div>

      <Card className="bg-card border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Credential Input
          </CardTitle>
          <CardDescription>Enter your proposed password for entropy analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="relative">
            <Input 
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="h-14 bg-secondary/30 border-white/10 text-lg"
            />
            <button 
              onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
            >
              {show ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold tracking-widest uppercase text-muted-foreground">Strength Gradient</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${strengthLabel().color}`}>
                {strengthLabel().label}
              </span>
            </div>
            <Progress value={stats} className="h-3 bg-secondary" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checks.map((check, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-white/5">
                {check.valid ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                <span className={`text-sm ${check.valid ? 'text-foreground' : 'text-muted-foreground'}`}>{check.label}</span>
              </div>
            ))}
          </div>

          {stats >= 80 && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-4 animate-in fade-in zoom-in">
              <ShieldCheck className="h-10 w-10 text-green-500" />
              <div>
                <h4 className="font-bold text-green-500">Secure Protocol Achieved</h4>
                <p className="text-xs text-muted-foreground">This password meets the high-security standards of the Cyber-Sphere mesh network.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}