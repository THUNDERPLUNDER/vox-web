/* CONTRACT: Backstage v0.1 content — human-readable system reference for AI/API/guards/env (no secret values). */

export const backstageMeta = {
  title: "Backstage",
  lead: "Backstage forklarer hvordan Viddel fungerer bak scenen: AI-flow, API, guards, env-vars, feilstater og production-sjekker.",
  updatedAt: "2026-05-30",
  issue: "#184",
  relatedIssue: "#180",
} as const;

export const systemFlowSteps = [
  { id: "user", label: "Bruker" },
  { id: "chat-ui", label: "/no/chat/" },
  { id: "api", label: "/api/chat" },
  { id: "input", label: "Input guard" },
  { id: "origin", label: "Origin guard" },
  { id: "rate", label: "Upstash rate limit" },
  { id: "ces", label: "CES runSession" },
  { id: "response", label: "Svar tilbake" },
] as const;

export const chatFlowSteps = [
  {
    id: "ui",
    title: "Chat UI",
    detail: "Standalone custom chat på `/no/chat/` — samler melding og sessionId, viser svar og feilmeldinger.",
  },
  {
    id: "api",
    title: "API",
    detail: "POST `/api/chat` — server-side proxy. Credentials og CES-detaljer eksponeres aldri til klienten.",
  },
  {
    id: "input",
    title: "Input guard",
    detail: "Validerer JSON, tom melding, sessionId-format og maks 2000 tegn før noe sendes videre.",
  },
  {
    id: "origin",
    title: "Origin guard",
    detail: "Ekstra friksjon mot direkte API-kall utenfor tillatte domener (vox.raddum.no, viddel.no, preview/dev).",
  },
  {
    id: "rate",
    title: "Upstash rate limit",
    detail: "IP-basert telling per burst (10/10 min) og døgn (50/24 t). Upstash lagrer tellere — ikke samtalehistorikk.",
  },
  {
    id: "ces",
    title: "CES runSession",
    detail: "Headless Google CES runSession med service account. Returnerer agenttekst til API-et.",
  },
  {
    id: "response",
    title: "Svar tilbake",
    detail: "JSON `{ text, turnCompleted, turnIndex }` rendres i custom UI uten CES-widget.",
  },
] as const;

export const guardLimits = [
  {
    label: "Maks meldingslengde",
    value: "2000 tegn",
    note: "Avkortes av input guard — brukeren får `message_too_long`.",
  },
  {
    label: "Burst-grense",
    value: "10 spørsmål / 10 min / IP",
    note: "Sliding window via Upstash (`viddel-chat-burst`).",
  },
  {
    label: "Døgngrense",
    value: "50 spørsmål / døgn / IP",
    note: "Sliding window via Upstash (`viddel-chat-daily`).",
  },
  {
    label: "Fail-closed i production",
    value: "Ja",
    note: "Mangler Upstash env i production → `guard_unavailable` (503). Preview/dev kan kjøre uten.",
  },
  {
    label: "Upstash rolle",
    value: "Teller only",
    note: "Lagrer ikke samtaleinnhold eller session-historikk.",
  },
] as const;

export type EnvVarEntry = {
  name: string;
  group: "upstash" | "ces" | "auth";
  controls: string;
};

export const envVars: EnvVarEntry[] = [
  {
    name: "UPSTASH_REDIS_REST_URL",
    group: "upstash",
    controls: "Upstash Redis REST-endpoint for rate-limit tellere.",
  },
  {
    name: "UPSTASH_REDIS_REST_TOKEN",
    group: "upstash",
    controls: "Autentisering mot Upstash — kun server-side.",
  },
  {
    name: "CES_PROJECT_ID",
    group: "ces",
    controls: "Google CES prosjekt-ID for runSession.",
  },
  {
    name: "CES_LOCATION",
    group: "ces",
    controls: "CES region/location (f.eks. europe-west1).",
  },
  {
    name: "CES_APP_ID",
    group: "ces",
    controls: "CES app-ID for Viddel-agenten.",
  },
  {
    name: "CES_APP_VERSION_ID",
    group: "ces",
    controls: "Versjon av CES-appen som skal kjøres.",
  },
  {
    name: "CES_DEPLOYMENT_ID",
    group: "ces",
    controls: "Aktiv CES deployment som mottar runSession-kall.",
  },
  {
    name: "GOOGLE_SERVICE_ACCOUNT_JSON",
    group: "auth",
    controls: "Service account JSON for Google auth mot CES — aldri i klient eller repo.",
  },
];

export const envVarNotes = [
  "Alle env-vars må ligge i Vercel **Production** (og Preview ved behov for testing).",
  "Verdier settes kun i Vercel dashboard — aldri i repo, ChatGPT, Cursor-logg eller Return Tickets.",
  "Etter endring: redeploy production før verifisering.",
] as const;

export type ErrorState = {
  code: string;
  meaning: string;
  userSees: string;
  weCheck: string;
};

export const errorStates: ErrorState[] = [
  {
    code: "message_too_long",
    meaning: "Meldingen overstiger 2000 tegn.",
    userSees: "«Spørsmålet er litt for langt. Prøv å korte det ned og send på nytt.»",
    weCheck: "Forventet guard-adferd — ingen CES-kall. Be bruker korte ned.",
  },
  {
    code: "rate_limited",
    meaning: "IP har nådd burst- eller døgngrense i Upstash.",
    userSees: "«Du har stilt mange spørsmål på kort tid. Prøv igjen litt senere.»",
    weCheck: "Upstash tellere, evt. misbruk. Vent eller vurder justering av grenser.",
  },
  {
    code: "guard_unavailable",
    meaning: "Rate limiter kan ikke nå Upstash, eller Upstash env mangler i production.",
    userSees: "«Viddel er ikke tilgjengelig akkurat nå.»",
    weCheck: "UPSTASH_* i Vercel Production, Upstash status, Vercel redeploy.",
  },
  {
    code: "configuration_missing",
    meaning: "Minst én CES env-var mangler på serveren.",
    userSees: "«Viddel er ikke tilgjengelig akkurat nå.» (503)",
    weCheck: "Alle CES_* og GOOGLE_SERVICE_ACCOUNT_JSON satt i Production — se env-liste over.",
  },
  {
    code: "auth / upstream / internal_error",
    meaning: "CES auth feilet, upstream-feil fra Google, eller uventet serverfeil.",
    userSees: "«Vi fikk ikke tak i svaret akkurat nå. Prøv igjen.» eller «Viddel er ikke tilgjengelig akkurat nå.» (auth)",
    weCheck: "Service account JSON, CES deployment aktiv, Google Cloud status, Vercel function logs (`[api/chat]`).",
  },
];

export const productionChecklist = [
  "Upstash env-vars satt i Vercel Production?",
  "CES env-vars satt i Vercel Production?",
  "Redeploy kjørt etter env-endring?",
  "POST `/api/chat` returnerer 200 med gyldig message + sessionId?",
  "`/no/chat/` viser svar i UI?",
  "`/vis/` current-state oppdatert i `mvp-current-state.ts`?",
  "Return Ticket lagt på relevant issue?",
] as const;

export const beforeExternalSharing = [
  "AI usage monitoring v0.1 bør være på plass før ekstern deling.",
  "Access/login via «Mine sider» vurderes senere ved ekstern pilot — ikke kodefelt i chat-UI (#181 parkert).",
  "Ikke legg access code eller hemmeligheter i chat-flaten.",
  "Ekstern test krever egen produktbeslutning og QA-pass.",
] as const;
