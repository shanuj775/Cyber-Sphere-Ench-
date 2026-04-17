import type {Metadata} from 'next';
import './globals.css';
import {LanguageProvider} from '@/components/language-context';
import {ChatbotOverlay} from '@/components/chatbot-overlay';
import {Navbar} from '@/components/navbar';
import {Toaster} from '@/components/ui/toaster';
import {PanicButton} from '@/components/emergency-panic-button';
import {FirebaseClientProvider} from '@/firebase/client-provider';
import {SandParticles} from '@/components/sand-particles';

export const metadata: Metadata = {
  title: 'Cyber-Sphere | Professional AI Cybersecurity Defense',
  description: 'Enterprise-grade AI security tools and real-time monitoring supporting SDG-16 Global Justice.',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @keyframes ripple-neon {
            0%{ transform:scale(0); opacity:0.9; }
            100%{ transform:scale(5); opacity:0; }
          }
          @keyframes brain-breathe {
            0%,100%{ filter: drop-shadow(0 0 10px rgba(0,212,255,0.4)); }
            50%{ filter: drop-shadow(0 0 25px rgba(0,212,255,0.8)); }
          }
        `}</style>
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground selection:bg-cyan-400/20 selection:text-cyan-300">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="professional-bg absolute inset-0" />
          <div className="professional-orb absolute left-[-14rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full" />
          <div className="professional-orb professional-orb-secondary absolute bottom-[-16rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full" />
          <div className="cyber-grid absolute inset-0 opacity-60" />
          <SandParticles />
        </div>
        <FirebaseClientProvider>
          <LanguageProvider>
            <Navbar />
            <main className="pt-16 overflow-x-hidden relative z-10">
              {children}
            </main>
            <PanicButton />
            <ChatbotOverlay />
            <Toaster />
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
