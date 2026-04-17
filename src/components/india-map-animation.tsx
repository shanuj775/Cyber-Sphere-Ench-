"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Globe, LocateFixed } from "lucide-react";

type CityNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  labelDx: number;
  labelDy: number;
  status: "secure" | "monitoring" | "alert";
  latency: string;
  load: string;
  radius: number;
};

const CITY_NODES: CityNode[] = [
  { id: "delhi", label: "Delhi", x: 47.6, y: 24.4, labelDx: 1.8, labelDy: -3.5, status: "secure", latency: "0.8ms", load: "74%", radius: 2.2 },
  { id: "mumbai", label: "Mumbai", x: 30.6, y: 55.8, labelDx: -5.4, labelDy: -3.4, status: "monitoring", latency: "2.1ms", load: "81%", radius: 3.4 },
  { id: "hyderabad", label: "Hyderabad", x: 45.6, y: 64.2, labelDx: 0.1, labelDy: -3.9, status: "secure", latency: "1.5ms", load: "72%", radius: 1.8 },
  { id: "kolkata", label: "Kolkata", x: 66.2, y: 48.4, labelDx: 1.1, labelDy: -4.3, status: "alert", latency: "3.7ms", load: "88%", radius: 4.0 },
  { id: "chennai", label: "Chennai", x: 51.9, y: 81.0, labelDx: 0.5, labelDy: -3.8, status: "monitoring", latency: "1.4ms", load: "71%", radius: 2.3 },
];

const SEA_LABELS = [
  { label: "Arabian Sea", x: 14, y: 63 },
  { label: "Bay of Bengal", x: 82, y: 58 },
];

function statusTone(status: CityNode["status"]) {
  if (status === "alert") {
    return {
      label: "Alert",
      pill: "bg-pink-500/20 text-pink-300",
      glow: "rgba(236,72,153,0.42)",
    };
  }

  if (status === "monitoring") {
    return {
      label: "Monitoring",
      pill: "bg-cyan-500/20 text-cyan-300",
      glow: "rgba(34,211,238,0.34)",
    };
  }

  return {
    label: "Secure",
    pill: "bg-blue-500/20 text-blue-300",
    glow: "rgba(96,165,250,0.34)",
  };
}

export function IndiaMapAnimation() {
  const [activeId, setActiveId] = useState<string>("hyderabad");
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % CITY_NODES.length);
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setActiveId(CITY_NODES[pulseIndex]?.id ?? "hyderabad");
  }, [pulseIndex]);

  const activeCity = useMemo(
    () => CITY_NODES.find((city) => city.id === activeId) ?? CITY_NODES[0],
    [activeId]
  );

  return (
    <div className="relative mx-auto w-full max-w-[760px]">
      <div className="map-shell overflow-hidden rounded-[34px] border border-border/80 bg-card/80 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-7">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
              India Security Mesh
            </div>
            <h3 className="mt-2 text-2xl font-bold text-foreground">
              Real-time defensive coverage across major Indian cities
            </h3>
          </div>
          <div className="rounded-2xl border border-primary/15 bg-primary/10 px-4 py-3 text-left sm:min-w-[156px] sm:text-right">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
              Active Region
            </div>
            <div className="mt-1 text-sm font-bold text-foreground">{activeCity.label}</div>
          </div>
        </div>

        <div className="map-board relative overflow-hidden rounded-[30px] border border-primary/15 p-4">
          <div className="map-board-grid absolute inset-0" />

          <div className="relative z-10 mr-auto aspect-[667/777] w-full max-w-[560px] lg:-ml-10">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b4/India_outline.svg"
              alt="Outline map of India"
              className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-100"
            />
            <div className="india-map-fill absolute inset-0" />

            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <defs>
                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="1.4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {SEA_LABELS.map((item) => (
                <text
                  key={item.label}
                  x={item.x}
                  y={item.y}
                  textAnchor="middle"
                  fontSize="4.1"
                  className="fill-sky-300/55"
                  style={{ fontStyle: "italic", fontWeight: 700 }}
                >
                  {item.label}
                </text>
              ))}

              {CITY_NODES.map((city) => {
                const tone = statusTone(city.status);
                const isActive = city.id === activeId;
                return (
                  <g
                    key={city.id}
                    onMouseEnter={() => setActiveId(city.id)}
                    onClick={() => setActiveId(city.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isActive ? city.radius + 1.35 : city.radius + 0.55}
                      fill={tone.glow}
                      filter="url(#softGlow)"
                      className={isActive ? "map-node-ring" : ""}
                    />
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={city.radius}
                      fill="#f472b6"
                      opacity={0.94}
                    />
                    <text
                      x={city.x + city.labelDx}
                      y={city.y + city.labelDy}
                      textAnchor="middle"
                      fontSize={isActive ? "3.35" : "3.1"}
                      className="fill-slate-100"
                      style={{ fontWeight: 700 }}
                    >
                      {city.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-[22px] border border-border/70 bg-background/70 p-4 dark:bg-background/30">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Node Telemetry
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="telemetry-tile rounded-2xl border border-border/60 bg-card/80 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Selected
                </div>
                <div className="mt-3 text-[1.75rem] font-bold leading-none text-foreground">
                  {activeCity.label}
                </div>
              </div>
              <div className="telemetry-tile rounded-2xl border border-border/60 bg-card/80 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Latency
                </div>
                <div className="mt-3 text-[1.75rem] font-bold leading-none text-foreground">
                  {activeCity.latency}
                </div>
              </div>
              <div className="telemetry-tile rounded-2xl border border-border/60 bg-card/80 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Secure Load
                </div>
                <div className="mt-3 text-[1.75rem] font-bold leading-none text-foreground">
                  {activeCity.load}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-border/70 bg-background/70 p-4 dark:bg-background/30">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Response State
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {CITY_NODES.slice(0, 4).map((city) => {
                const tone = statusTone(city.status);
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => setActiveId(city.id)}
                    className={`telemetry-panel rounded-2xl border p-4 text-left transition-colors ${
                      activeId === city.id
                        ? "border-primary/50 bg-primary/10"
                        : "border-border/60 bg-card/70 hover:border-primary/25"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-base font-semibold leading-none text-foreground">
                          {city.label}
                        </div>
                        <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          {city.latency} latency
                        </div>
                      </div>
                      <div className="shrink-0 text-right text-[11px] font-semibold text-muted-foreground">
                        Load
                        <div className="mt-1 text-sm text-foreground">{city.load}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${tone.pill}`}>
                        {tone.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-primary/10 bg-card/70 px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
            <LocateFixed className="h-3.5 w-3.5" />
            Hover or tap a city node
          </div>
        </div>
      </div>
    </div>
  );
}
