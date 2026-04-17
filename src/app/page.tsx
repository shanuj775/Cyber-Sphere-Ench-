"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Cpu,
  Eye,
  Fingerprint,
  Gavel,
  Globe,
  Handshake,
  Lock,
  Scale,
  Search,
  Shield,
  Terminal,
} from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { HeroOrbScene } from "@/components/hero-orb-scene";

function NeonButton({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "outline";
}) {
  const classes =
    variant === "primary"
      ? "group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full border border-primary/60 bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-[0_18px_50px_rgba(14,165,233,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-[0_24px_60px_rgba(14,165,233,0.3)]"
      : "group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full border border-border bg-background/70 px-8 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card";

  return (
    <Link href={href}>
      <button className={classes}>
        <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.18)_35%,transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    </Link>
  );
}

function CyberCard({
  icon,
  title,
  desc,
  href,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  delay?: number;
}) {
  return (
    <Link href={href} className="group block h-full">
      <div
        className="reveal-card cyber-card h-full rounded-[28px] border border-border/70 bg-card/80 p-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:border-primary/35"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="mb-6 inline-flex rounded-2xl border border-primary/15 bg-primary/10 p-4 text-primary transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
        <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Open Tool <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [feed, setFeed] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const events = [
      "Mumbai node hardened after credential sweep.",
      "Suspicious redirect blocked across public gateway.",
      "Video authenticity model retrained with fresh telemetry.",
      "Regional justice index signal stabilized for SDG-16 view.",
      "Identity mesh synchronized across enterprise devices.",
      "Phishing campaign signature isolated before propagation.",
      "Port scan intercepted and quarantined at perimeter edge.",
      "Threat confidence recalculated with low false-positive bias.",
    ];

    const interval = setInterval(() => {
      setFeed((prev) => [
        events[Math.floor(Math.random() * events.length)],
        ...prev.slice(0, 4),
      ]);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: t("tools.fakeMessage"),
      desc: "Detect suspicious language, urgency traps, and impersonation patterns in real time.",
      href: "/tools/fake-message",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t("tools.linkScanner"),
      desc: "Check URLs against threat signals before anyone on your team opens them.",
      href: "/tools/link-scanner",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: t("tools.passwordChecker"),
      desc: "Measure password strength and get practical fixes for risky credentials.",
      href: "/tools/password-checker",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: t("tools.deepfakeVerifier"),
      desc: "Review media authenticity with fast forensic signals and confidence scoring.",
      href: "/tools/deepfake-verifier",
    },
  ];

  const statCards = [
    { value: "12.8M+", label: "Protected Scans" },
    { value: "99.999%", label: "Platform Uptime" },
    { value: "4.2M", label: "Threats Blocked" },
  ];

  return (
    <div className="relative flex flex-col overflow-x-hidden">
      <section className="relative overflow-hidden pb-20 pt-16">
        <div className="mx-auto grid min-h-[92vh] w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
          <div
            className={`max-w-3xl space-y-8 transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary animate-float-slow">
              <Activity className="h-3.5 w-3.5" />
              {t("home.hero.badge")}
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-bold leading-[0.92] tracking-tight text-foreground sm:text-6xl xl:text-7xl">
                <span className="block">{t("home.hero.title1")}</span>
                <span className="block bg-[linear-gradient(90deg,hsl(var(--foreground)),hsl(var(--primary)))] bg-clip-text text-transparent">
                  {t("home.hero.title2")}
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                {t("home.hero.desc")}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <NeonButton href="/tools" variant="primary">
                {t("home.hero.btn1")}
                <ArrowRight className="h-5 w-5" />
              </NeonButton>
              <NeonButton href="/dashboard" variant="outline">
                {t("home.hero.btn2")}
              </NeonButton>
            </div>

            <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
              {statCards.map((item, index) => (
                <div
                  key={item.label}
                  className="reveal-card rounded-[24px] border border-border/80 bg-card/75 px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="text-2xl font-bold text-foreground">{item.value}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-150 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <HeroOrbScene />
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-card/30 py-4 backdrop-blur-sm">
        <div className="animate-marquee flex gap-20 whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-20">
              {[
                `${t("home.ticker.scans")}: 12.8M+`,
                `${t("home.ticker.threats")}: 4.2M`,
                `${t("home.ticker.uptime")}: 99.999%`,
                `${t("home.ticker.nodes")}: 2,400`,
              ].map((item) => (
                <div key={`${i}-${item}`} className="flex items-center gap-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                    {item}
                  </span>
                  <span className="text-primary/40">◆</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-24 md:grid-cols-12">
        <div className="space-y-6 md:col-span-4">
          <div className="inline-flex rounded-2xl border border-primary/15 bg-primary/10 p-3 text-primary animate-float-slow">
            <Terminal className="h-6 w-6" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t("home.intel.title")}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {t("home.intel.desc")}
            </p>
          </div>

          <div className="reveal-card rounded-[28px] border border-border/70 bg-card/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-border/70 pb-3">
              <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                Live Threat Feed
              </span>
            </div>
            <div className="space-y-3 font-mono text-[11px]">
              {feed.length === 0 ? (
                <div className="text-muted-foreground">Awaiting data stream...</div>
              ) : (
                feed.map((entry, index) => (
                  <div
                    key={`${entry}-${index}`}
                    className="flex gap-3 animate-slide-up"
                    style={{ opacity: 1 - index * 0.15 }}
                  >
                    <span className="font-semibold text-primary">[SYS]</span>
                    <span className="text-muted-foreground">{entry}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-8">
          {features.map((feature, index) => (
            <CyberCard key={feature.href} {...feature} delay={index * 90} />
          ))}
        </div>
      </section>

      <section className="relative py-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary animate-float-delay">
              {t("home.sdg.badge")}
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {t("home.sdg.title")}
            </h2>
            <p className="mx-auto max-w-3xl text-base leading-8 text-muted-foreground">
              {t("home.sdg.desc")}
            </p>
          </div>

          <div className="grid w-full gap-6 md:grid-cols-3">
            {[
              { icon: <Scale className="h-6 w-6" />, title: t("home.sdg.item1.title"), desc: t("home.sdg.item1.desc") },
              { icon: <Gavel className="h-6 w-6" />, title: t("home.sdg.item2.title"), desc: t("home.sdg.item2.desc") },
              { icon: <Handshake className="h-6 w-6" />, title: t("home.sdg.item3.title"), desc: t("home.sdg.item3.desc") },
            ].map((item, index) => (
              <div
                key={item.title}
                className="reveal-card rounded-[28px] border border-border/70 bg-card/80 p-8 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="mb-5 text-primary">{item.icon}</div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: <Cpu className="h-7 w-7 text-primary" />, value: "4.8 GHz", label: "Neural Frequency" },
              { icon: <Fingerprint className="h-7 w-7 text-sky-500" />, value: "Zero", label: "Trust Latency" },
              { icon: <Globe className="h-7 w-7 text-teal-500" />, value: "Mesh", label: "Network Topology" },
              { icon: <Shield className="h-7 w-7 text-indigo-500" />, value: "AES-X", label: "Protocol Standard" },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`reveal-card rounded-[26px] border border-border/70 bg-card/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ${
                  index % 2 === 1 ? "lg:translate-y-8" : ""
                }`}
                style={{ animationDelay: `${index * 110}ms` }}
              >
                {item.icon}
                <div className="mt-5 text-2xl font-bold text-foreground">{item.value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-7">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              {t("home.tech.title")}
            </h2>
            <p className="text-base leading-8 text-muted-foreground">
              {t("home.tech.desc")}
            </p>
            <ul className="space-y-4">
              {[t("home.tech.li1"), t("home.tech.li2"), t("home.tech.li3")].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-foreground">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="leading-7 text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <NeonButton href="/tools" variant="primary">
              Explore Tools
              <ArrowRight className="h-5 w-5" />
            </NeonButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 bg-card/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 grid gap-12 md:grid-cols-4">
            <div className="space-y-5 md:col-span-2">
              <Link href="/" className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  Cyber<span className="text-primary">-Sphere</span>
                </span>
              </Link>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                {t("footer.desc")}
              </p>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Architecture
              </h5>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  ["Tools", "/tools"],
                  ["Dashboard", "/dashboard"],
                  ["Admin", "/admin"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="transition-colors hover:text-primary">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Protocol
              </h5>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {["Privacy Nexus", "Legal Framework", "SDG Compliance"].map((label) => (
                  <li key={label}>
                    <Link href="#" className="transition-colors hover:text-primary">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-5 border-t border-border/70 pt-8 md:flex-row">
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {t("footer.rights")}
            </div>
            <div className="flex gap-5 text-muted-foreground">
              <Link href="#" className="transition-colors hover:text-primary">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="transition-colors hover:text-primary">
                <Terminal className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
