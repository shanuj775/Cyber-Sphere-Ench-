"use client"

import { useLanguage } from '@/components/language-context';
import { 
  ShieldCheck, Globe, Lock, Eye, FileSearch, QrCode, Terminal, AlertCircle, Newspaper
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const TOOL_COLORS: Record<string, string> = {
  blue: 'text-blue-400 border-blue-500/20 group-hover:border-blue-400/60 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
  red: 'text-red-400 border-red-500/20 group-hover:border-red-400/60 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]',
  green: 'text-green-400 border-green-500/20 group-hover:border-green-400/60 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]',
  purple: 'text-purple-400 border-purple-500/20 group-hover:border-purple-400/60 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
  yellow: 'text-yellow-400 border-yellow-500/20 group-hover:border-yellow-400/60 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]',
  cyan: 'text-cyan-400 border-cyan-500/20 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]',
  primary: 'text-cyan-400 border-cyan-500/20 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]',
  accent: 'text-red-400 border-red-500/20 group-hover:border-red-400/60 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]',
};

export default function ToolsPage() {
  const { t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number|null>(null);

  const tools = [
    { title: t('tools.fakeMessage'), icon: <ShieldCheck className="h-7 w-7" />, href: "/tools/fake-message", desc: "Detect fraudulent communications using AI linguistics.", colorKey: 'blue', tag: 'AI' },
    { title: t('tools.fakeNews'), icon: <Newspaper className="h-7 w-7" />, href: "/tools/fake-news", desc: "Trained credibility engine to evaluate article quality and flag fake or misleading news.", colorKey: 'red', tag: 'AI' },
    { title: t('tools.linkScanner'), icon: <Globe className="h-7 w-7" />, href: "/tools/link-scanner", desc: "Validate URLs against global threat databases.", colorKey: 'red', tag: 'LIVE' },
    { title: t('tools.passwordChecker'), icon: <Lock className="h-7 w-7" />, href: "/tools/password-checker", desc: "Measure password entropy and resistance to cracking.", colorKey: 'green', tag: 'LOCAL' },
    { title: t('tools.deepfakeVerifier'), icon: <Eye className="h-7 w-7" />, href: "/tools/deepfake-verifier", desc: "Analyze media for AI-generated manipulation.", colorKey: 'purple', tag: 'NEURAL' },
    { title: t('tools.malwareScanner'), icon: <FileSearch className="h-7 w-7" />, href: "/tools/malware-scanner", desc: "Deep packet inspection for malicious file payloads.", colorKey: 'yellow', tag: 'AI' },
    { title: t('tools.qrScanner'), icon: <QrCode className="h-7 w-7" />, href: "/tools/qr-scanner", desc: "Securely decode QR codes to prevent Qishing attacks.", colorKey: 'cyan', tag: 'SCAN' },
    { title: t('tools.portScanner'), icon: <Terminal className="h-7 w-7" />, href: "/tools/port-scanner", desc: "Simulated vulnerability assessment for local network nodes.", colorKey: 'primary', tag: 'SIM' },
    { title: "Location Safety", icon: <AlertCircle className="h-7 w-7" />, href: "/tools/location-safety", desc: "Geospatial analysis of regional cyber attack incidents.", colorKey: 'accent', tag: 'GEO' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
      {/* Header */}
      <div className="mb-20 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" style={{boxShadow:'0 0 6px #00d4ff'}} />
          8 Active Modules
        </div>
        <h1 className="text-5xl font-mono font-bold text-white/90" style={{textShadow:'0 0 30px rgba(0,212,255,0.2)'}}>
          Security Toolsets
        </h1>
        <p className="text-white/35 max-w-2xl mx-auto">
          Integrated suite of AI-powered cyber defense tools providing end-to-end digital protection.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {tools.map((tool, i) => {
          const colorClass = TOOL_COLORS[tool.colorKey] || TOOL_COLORS.cyan;
          return (
            <Link
              key={i}
              href={tool.href}
              className="group"
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <div className={`
                relative h-full p-6 rounded-[1.5rem] border bg-black/40 backdrop-blur-sm
                transition-all duration-400 overflow-hidden
                ${colorClass}
                group-hover:-translate-y-2
                group-active:scale-95 group-active:brightness-125
              `}>
                {/* Top shine */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Corner accents */}
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-current opacity-0 group-hover:opacity-40 transition-all duration-300" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-current opacity-0 group-hover:opacity-40 transition-all duration-300" />

                {/* Tag */}
                <div className="absolute top-4 right-4 text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border border-current/20 text-current opacity-50">
                  {tool.tag}
                </div>

                <div className={`p-3 rounded-xl bg-current/5 border border-current/10 w-fit mb-5 transition-all duration-400 group-hover:scale-110 group-hover:rotate-6`}>
                  <span className="text-current">{tool.icon}</span>
                </div>

                <h3 className="text-lg font-mono font-bold mb-2 text-white/85 group-hover:text-current transition-colors duration-300">
                  {tool.title}
                </h3>
                <p className="text-xs text-white/35 leading-relaxed">{tool.desc}</p>

                {/* Arrow */}
                <div className="mt-4 flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-current opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Launch <span className="ml-1">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
