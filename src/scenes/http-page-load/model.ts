import { phaseAtTime } from "../../core/time";
import type { ScenePhase, SceneTone } from "../../core/types";

export type PageLoadPhaseId = "url" | "dns" | "tls" | "get" | "query" | "html" | "render";

export const PAGE_LOAD_DURATION_MS = 7200;

export const PAGE_LOAD_PHASES = [
  { id: "url", label: "URL", startMs: 0, snapshotMs: 350 },
  { id: "dns", label: "DNS", startMs: 850, snapshotMs: 1200 },
  { id: "tls", label: "TLS", startMs: 1700, snapshotMs: 2100 },
  { id: "get", label: "HTTP GET", startMs: 2600, snapshotMs: 3050 },
  { id: "query", label: "QUERY", startMs: 3700, snapshotMs: 4150 },
  { id: "html", label: "HTML", startMs: 4900, snapshotMs: 5400 },
  { id: "render", label: "RENDER", startMs: 6100, snapshotMs: 6600 },
] as const satisfies readonly ScenePhase<PageLoadPhaseId>[];

export interface PageLoadSceneState {
  phaseId: PageLoadPhaseId;
  browserStatus: string;
  browserTone: SceneTone;
  dnsStatus: string;
  edgeStatus: string;
  edgeTone: SceneTone;
  appStatus: string;
  appTone: SceneTone;
  databaseStatus: string;
  databaseTone: SceneTone;
  dnsResolved: boolean;
  secure: boolean;
  responseStarted: boolean;
  rendered: boolean;
  statusCode: string;
}

const BROWSER_STATE: Record<PageLoadPhaseId, [string, SceneTone]> = {
  url: ["NAVIGATING", "accent"],
  dns: ["WAITING FOR DNS", "read"],
  tls: ["OPENING SECURE CHANNEL", "lock"],
  get: ["REQUEST SENT", "accent"],
  query: ["WAITING FOR DATA", "prepare"],
  html: ["RECEIVING HTML", "data"],
  render: ["FIRST PAINT / 624MS", "commit"],
};

export function derivePageLoadSceneState(elapsedMs: number): PageLoadSceneState {
  const phase = phaseAtTime(PAGE_LOAD_PHASES, elapsedMs);
  const [browserStatus, browserTone] = BROWSER_STATE[phase.id];
  const dnsResolved = elapsedMs >= 1450;
  const secure = elapsedMs >= 2350;
  const responseStarted = elapsedMs >= 5200;
  const rendered = elapsedMs >= 6400;

  return {
    phaseId: phase.id,
    browserStatus,
    browserTone,
    dnsStatus: dnsResolved ? "A 203.0.113.42 / 60S" : phase.id === "dns" ? "RESOLVING A RECORD" : "CACHE READY",
    edgeStatus:
      phase.id === "tls"
        ? "TLS 1.3 HANDSHAKE"
        : phase.id === "get"
          ? "HTTP/2 · GET /"
          : responseStarted
            ? "HTTP/2 · 200 OK"
            : "LISTEN :443",
    edgeTone: phase.id === "tls" ? "lock" : responseStarted ? "commit" : "read",
    appStatus:
      phase.id === "get"
        ? "ROUTE /"
        : phase.id === "query"
          ? "AWAIT DATABASE"
          : responseStarted
            ? "SSR COMPLETE / 12KB"
            : "READY / 8 WORKERS",
    appTone: phase.id === "query" ? "prepare" : responseStarted ? "commit" : "accent",
    databaseStatus:
      phase.id === "query" ? "SELECT ARTICLES" : elapsedMs >= 4550 ? "12 ROWS / 18MS" : "CONNECTION IDLE",
    databaseTone: phase.id === "query" ? "prepare" : elapsedMs >= 4550 ? "commit" : "neutral",
    dnsResolved,
    secure,
    responseStarted,
    rendered,
    statusCode: responseStarted ? "200 OK" : "—",
  };
}
