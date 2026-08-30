/* CONTRACT: Backstage v0.1 content — pedagogisk systemforklaring (forståelse først, teknikk nederst). */

export const backstageMeta = {
  title: "Backstage",
  lead: "Backstage er kontrollrommet for hvordan Viddel fungerer bak scenen. Her forklarer vi AI-flyten, beskyttelsen, feilstater og hva som må sjekkes før vi deler med flere.",
  updatedAt: "2026-08-30",
  issue: "#180 · #184 · #222 · #346",
} as const;

export const statusPanel = [
  { label: "Spør Viddel", value: "Midlertidig utilgjengelig — guard v0.2 under QA", tone: "wait" as const },
  { label: "Guard", value: "Eierbryter + Vercel Firewall", tone: "ok" as const },
  { label: "Monitoring", value: "Vercel logs + PostHog EU", tone: "ok" as const },
  { label: "Conversation feedback", value: "Neon EU · 90 dager", tone: "ok" as const },
] as const;

export const quickAnswers = [
  {
    question: "Hva skjer når noen spør Viddel?",
    answer:
      "Spørsmålet går gjennom Viddel sitt eget grensesnitt. Appen sjekker om eier eller offentlig tilgang er aktiv, Firewall begrenser offentlig bruk, og spørsmålet sendes så til AI-motoren.",
  },
  {
    question: "Hva beskytter oss?",
    answer:
      "Eier låser opp med en firesifret kode som gir en separat sterk cookie. Vercel Flags holder én offentlig av/på-verdi. Vercel Firewall begrenser offentlig trafikk per IP, mens appen sjekker origin og meldingslengde.",
  },
  {
    question: "Hva gjør vi når noe ikke virker?",
    answer: "Start med hva brukeren ser, sjekk Runtime Logs, Vercel Firewall og Google/CES — se feilsøkingsseksjonen under.",
  },
  {
    question: "Hvor orienterer vi oss i VIS?",
    answer:
      "VIS kontrollrom (/vis/) og venstremenyen på interne flater — rolig orientering om hvor du er og hva siden er til for. Backstage er fortsatt canonical systemreferanse.",
  },
  {
    question: "Hva måles når noen bruker AI-chatten?",
    answer:
      "Vercel viser forespørsler, HTTP 429 og strukturerte app-utfall uten at vi lagrer spørsmål eller svar. PostHog EU får få produkt-events — hvilken side, inngang og feilkode — aldri innhold.",
  },
  {
    question: "Hva lagres når noen gir tilbakemelding?",
    answer:
      "En separat Neon-database i Frankfurt lagrer score, valgte hurtiggrunner, valgfri kommentar, tidspunkt, route og miljø i 90 dager. CES-session, spørsmål, svar og samtaleutdrag følger aldri med.",
  },
] as const;

export type SystemMapLayer = {
  id: string;
  layer: string;
  title: string;
  human: string;
  tech?: string;
};

/** FIGUR 1 — overordnet systemkart med visuelle lag. */
export const systemMapLayers: SystemMapLayer[] = [
  {
    id: "user",
    layer: "Bruker",
    title: "Brukeren",
    human: "Brukeren skriver et spørsmål i Spør Viddel.",
  },
  {
    id: "surface",
    layer: "Brukerflate",
    title: "Spør Viddel UI",
    human: "Viddel sitt eget chat-grensesnitt — ikke en ferdig widget innebygd.",
    tech: "/no/chat/",
  },
  {
    id: "server",
    layer: "Viddel-server",
    title: "Viddel API",
    human: "Viddel tar imot spørsmålet og holder nøkler og AI-kall på serveren.",
    tech: "/api/chat",
  },
  {
    id: "guard",
    layer: "Beskyttelse",
    title: "Eierkontroll + Vercel Firewall",
    human:
      "Eier bruker AI uten offentlig kvote. Offentlig tilgang styres i Vercel Flags, og Vercel Firewall begrenser andre per IP. Appen sjekker origin og maks meldingslengde.",
  },
  {
    id: "ai",
    layer: "AI-motor",
    title: "Google Agent Search :answer",
    human: "Production bruker direct :answer. CES runSession er rollback-path.",
    tech: "VIDDEL_AI_BACKEND · google_agent_search_direct",
  },
  {
    id: "response",
    layer: "Svar",
    title: "Tilbake til brukeren",
    human: "Svaret vises i Viddel sitt eget grensesnitt.",
  },
];

export type ChatFlowStep = {
  step: number;
  title: string;
  human: string;
  why?: string;
  tech?: string;
};

/** FIGUR 2 — detaljert, menneskelig chat-flyt. */
export const chatFlowSteps: ChatFlowStep[] = [
  {
    step: 1,
    title: "Brukeren spør",
    human: "Spørsmålet sendes fra Spør Viddel.",
    tech: "/no/chat/",
  },
  {
    step: 2,
    title: "Viddel sjekker lengde",
    human: "For lange spørsmål stoppes før de sendes videre.",
    why: "Dette hindrer at altfor lange spørsmål sendes videre.",
    tech: "maks 2000 tegn",
  },
  {
    step: 3,
    title: "Viddel sjekker hvor forespørselen kommer fra",
    human: "Kun godkjente nettsteder kan kalle API-et direkte.",
    why: "Dette beskytter mot misbruk utenfor Viddel.",
    tech: "origin guard",
  },
  {
    step: 4,
    title: "Tilgangen kontrolleres",
    human: "Eier kommer gjennom med sikker cookie. For andre må offentlig tilgang være på, og Firewall begrenser mengden per IP.",
    why: "Dette beskytter kostnad og misbruk.",
    tech: "owner cookie · Vercel Flag public-ai-enabled · Vercel Firewall HTTP 429",
  },
  {
    step: 5,
    title: "AI-motoren svarer",
    human: "Backend velges av VIDDEL_AI_BACKEND. Production: Google Agent Search :answer med Viddel response contract v0.1.",
    why: "Svaret kommer fra Google Discovery Engine — ikke fra widget i nettleseren.",
    tech: "google_agent_search_direct · src/lib/agent-search-answer.ts",
  },
  {
    step: 6,
    title: "Viddel viser svaret",
    human: "Svaret rendres som lesbar tekst (Markdown → DOM) i chatten — uten CES-widget i nettleseren.",
    tech: "src/lib/render-assistant-markdown.ts · /no/chat/",
  },
];

export const protectionRules = [
  {
    title: "Offentlig bryter",
    value: "Vercel Flags",
    human: "Én global verdi kan slås av/på i Vercel. Eier fungerer også når offentlig tilgang er av.",
  },
  {
    title: "Maks lengde",
    value: "2000 tegn",
    human: "Lengre spørsmål avvises med en tydelig melding til brukeren.",
  },
  {
    title: "Trafikkgrense",
    value: "Vercel Firewall",
    human: "IP-basert begrensning skjer på plattformen og svarer med HTTP 429 uten å gjøre chatten avhengig av en ekstern teller.",
  },
] as const;

/** Guard strategy — temporary owner control + Vercel Firewall (#180 v0.2). */
export const guardStrategyExplainer = {
  title: "Public guard v0.2",
  lead: "Frem til innlogging gir en enkel eierkode, ett Vercel-flagg og Vercel Firewall et lett kostnadsvern. Appen beholder enkle, stabile innholdssjekker.",
  publicGuard: {
    label: "Public guard (#180)",
    human:
      "Appen sjekker eiercookie, offentlig av/på-status, origin og maks meldingslengde. Vercel Flags brukes bare til én bryter — ikke som teller.",
  },
  vercelLimits: {
    label: "Juster grenser i Vercel Firewall",
    human:
      "Terskler endres i Vercel Dashboard → Firewall → Custom Rules. Endringen krever ikke kode eller redeploy.",
  },
} as const;

/** Anbefalt midlertidig testmodus før ekstern pilot — ikke permanent produksjonsnivå. */
export const prePilotReliabilityExplainer = {
  title: "Reliability-test uten lokal token",
  steps: [
    "Kontroller at Firewall-reglene er aktive for /api/chat og /api/image-vision.",
    "Kjør 8 spredte kall med npm run chat:reliability.",
    "Bruk Preview eller juster regelen midlertidig hvis en større test er nødvendig.",
    "Vurder CES-stabilitet fra safe metadata (suksess, upstream, timeout, rate_limit).",
    "Sett en midlertidig justert regel tilbake etter testen.",
  ],
  note: "Guard forblir aktiv — vi justerer bare terskelen midlertidig.",
} as const;

export const firewallExplainer = {
  title: "Hvor ble Upstash av?",
  body: "Upstash ble fjernet fra chat-kjeden 19. august etter en tellerfeil som stengte hele tjenesten. Vercel Firewall håndterer nå trafikkgrensen før API-et kjører.",
} as const;

export const cesExplainer = {
  title: "Hva betyr CES?",
  body: "CES er den opprinnelige AI-kanalen (runSession). Viddel eier grensesnittet rundt. Production bruker nå direct :answer — CES er kjent rollback-path ved å sette VIDDEL_AI_BACKEND=ces_channel.",
} as const;

export type BackstageLink = {
  label: string;
  href: string;
  /** Open in new tab for external consoles */
  external?: boolean;
};

/** Klikkbare handlingslenker — ingen secrets, kun offentlige konsoll-URL-er. */
export const backstageLinks = {
  vercelProject: {
    label: "Åpne Vercel-prosjekt",
    href: "https://vercel.com/raddum-5965s-projects/vox-web",
    external: true,
  },
  vercelEnv: {
    label: "Åpne Vercel env-vars",
    href: "https://vercel.com/raddum-5965s-projects/vox-web/settings/environment-variables",
    external: true,
  },
  vercelDeployments: {
    label: "Åpne Vercel Deployments",
    href: "https://vercel.com/raddum-5965s-projects/vox-web/deployments",
    external: true,
  },
  vercelLogs: {
    label: "Åpne Runtime Logs",
    href: "https://vercel.com/raddum-5965s-projects/vox-web/logs",
    external: true,
  },
  vercelFirewall: {
    label: "Åpne Vercel Firewall",
    href: "https://vercel.com/raddum-5965s-projects/vox-web/firewall",
    external: true,
  },
  googleCloud: {
    label: "Åpne Google Cloud",
    href: "https://console.cloud.google.com/?project=hearing-aid-mvp",
    external: true,
  },
  githubRepo: {
    label: "Åpne GitHub repo",
    href: "https://github.com/THUNDERPLUNDER/vox-web",
    external: true,
  },
  githubIssues: {
    label: "Åpne GitHub issues",
    href: "https://github.com/THUNDERPLUNDER/vox-web/issues",
    external: true,
  },
  githubIssue181: {
    label: "Issue #181 (access parkert)",
    href: "https://github.com/THUNDERPLUNDER/vox-web/issues/181",
    external: true,
  },
  githubPulls: {
    label: "Åpne PR-er",
    href: "https://github.com/THUNDERPLUNDER/vox-web/pulls",
    external: true,
  },
  guardFile: {
    label: "Åpne guard-koden",
    href: "https://github.com/THUNDERPLUNDER/vox-web/blob/main/src/lib/chat-api-guard.ts",
    external: true,
  },
  apiRouteFile: {
    label: "Åpne API-ruten",
    href: "https://github.com/THUNDERPLUNDER/vox-web/blob/main/src/pages/api/chat.ts",
    external: true,
  },
  currentStateFile: {
    label: "Åpne current-state-filen",
    href: "https://github.com/THUNDERPLUNDER/vox-web/blob/main/src/data/mvp-current-state.ts",
    external: true,
  },
  vis: {
    label: "Åpne VIS",
    href: "https://www.viddel.no/vis/",
  },
  backstage: {
    label: "Åpne Backstage",
    href: "https://www.viddel.no/backstage/",
  },
  designsystem: {
    label: "Åpne Designsystem",
    href: "https://www.viddel.no/designsystem/",
  },
  chat: {
    label: "Åpne Spør Viddel",
    href: "https://www.viddel.no/no/chat/",
  },
  viddelAiBackendFile: {
    label: "Backend-velger (kode)",
    href: "https://github.com/THUNDERPLUNDER/vox-web/blob/main/src/lib/viddel-ai-backend.ts",
    external: true,
  },
  responseContractFile: {
    label: "Response contract v0.1",
    href: "https://github.com/THUNDERPLUNDER/vox-web/blob/main/src/lib/viddel-response-contract.ts",
    external: true,
  },
  agentSearchAnswerFile: {
    label: "Google :answer-klient",
    href: "https://github.com/THUNDERPLUNDER/vox-web/blob/main/src/lib/agent-search-answer.ts",
    external: true,
  },
  renderMarkdownFile: {
    label: "Markdown-renderer",
    href: "https://github.com/THUNDERPLUNDER/vox-web/blob/main/src/lib/render-assistant-markdown.ts",
    external: true,
  },
  chatPageFile: {
    label: "Chat-side (kode)",
    href: "https://github.com/THUNDERPLUNDER/vox-web/blob/main/src/pages/no/chat.astro",
    external: true,
  },
  githubIssue217: {
    label: "Issue #217 (formatting)",
    href: "https://github.com/THUNDERPLUNDER/vox-web/issues/217",
    external: true,
  },
  githubIssue222: {
    label: "Issue #222 (denne doc)",
    href: "https://github.com/THUNDERPLUNDER/vox-web/issues/222",
    external: true,
  },
} as const satisfies Record<string, BackstageLink>;

export type AiChatConfigBlock = {
  id: string;
  title: string;
  human: string;
  bullets?: readonly string[];
  files?: readonly string[];
  envVars?: readonly string[];
  links?: readonly BackstageLink[];
  caution?: string;
};

/** AI-chat konfigurasjon — lesbar VIS/Backstage-referanse (#217 · #222). */
export const aiChatConfigExplainer = {
  title: "AI-chat konfigurasjon",
  lead: "Slik er Spør Viddel satt opp nå — backend, svarstil, Google-kall og frontend-rendering. Ingen secrets her; kun hvor ting lever og hva som kan endres trygt.",
  productionModel: {
    title: "Production-modell nå",
    bullets: [
      "/api/chat er server-proxy — nøkler og AI-kall skjer kun på serveren.",
      "Aktiv backend velges med VIDDEL_AI_BACKEND i Vercel.",
      "Production bruker google_agent_search_direct (Google Discovery Engine :answer).",
      "Rollback-path er ces_channel (CES runSession) — se nederst.",
    ],
  },
  blocks: [
    {
      id: "backend-select",
      title: "Hvilken backend er aktiv?",
      human:
        "Sjekk VIDDEL_AI_BACKEND i Vercel Production (og Preview ved behov). Verdier: google_agent_search_direct eller ces_channel. Ugyldig/manglende → ces_channel (default i kode).",
      envVars: ["VIDDEL_AI_BACKEND"],
      files: ["src/lib/viddel-ai-backend.ts", "src/pages/api/chat.ts"],
      links: [backstageLinks.viddelAiBackendFile, backstageLinks.apiRouteFile, backstageLinks.vercelEnv],
    },
    {
      id: "direct-answer",
      title: "Hva bruker direct :answer?",
      human:
        "Google Discovery Engine servingConfigs:answer — ikke CES widget og ikke CES_APP_ID som engine-id.",
      bullets: [
        "Engine-id: AGENT_SEARCH_ENGINE_ID (Discovery Engine engine — f.eks. h-rehjelpen-v1-2_…).",
        "CES_APP_ID er app/kanal-id — må ikke brukes som engine-id.",
        "Serving config: AGENT_SEARCH_SERVING_CONFIG (default default_serving_config).",
        "Session: AGENT_SEARCH_ANSWER_SESSION=omit (anbefalt) eller full — ikke session: \"-\".",
        "Auth: GOOGLE_SERVICE_ACCOUNT_JSON + IAM roles/discoveryengine.user.",
      ],
      envVars: [
        "AGENT_SEARCH_ENGINE_ID",
        "AGENT_SEARCH_SERVING_CONFIG",
        "AGENT_SEARCH_ANSWER_SESSION",
        "AGENT_SEARCH_LOCATION",
        "CES_PROJECT_ID",
        "CES_LOCATION",
        "GOOGLE_SERVICE_ACCOUNT_JSON",
      ],
      files: ["src/lib/agent-search-answer.ts", "src/lib/ces-auth.ts"],
      links: [backstageLinks.agentSearchAnswerFile, backstageLinks.googleCloud],
    },
    {
      id: "response-contract",
      title: "Hvor styres svarstil?",
      human:
        "Viddel response contract v0.1 ligger i repo — ikke skjult i GCP Console. Endres som versjonert produktendring, ikke ad hoc i console.",
      bullets: [
        "VIDDEL_RESPONSE_CONTRACT_VERSION = v0.1",
        "VIDDEL_RESPONSE_PREAMBLE styrer lengde, tone, ordvalg, oppfølgingsspørsmål og audiograf-håndtering.",
        "Reduserer manual-dump og lange kildeutdrag.",
        "Preamble sendes som answerGenerationSpec.promptSpec.preamble i :answer-kallet.",
      ],
      files: ["src/lib/viddel-response-contract.ts"],
      links: [backstageLinks.responseContractFile, backstageLinks.githubIssue217],
      caution: "Oppdater contract version når preamble endres vesentlig — ikke bare små ord.",
    },
    {
      id: "google-request",
      title: "Google request-config",
      human: "agent-search-answer.ts bygger :answer-body med guard-flagg, retry og includeCitations: true.",
      bullets: [
        "ignoreAdversarialQuery: true",
        "ignoreNonAnswerSeekingQuery: false",
        "includeCitations: true (uendret)",
        "Ingen prompt/answer logging i runtime.",
      ],
      files: ["src/lib/agent-search-answer.ts"],
      links: [backstageLinks.agentSearchAnswerFile],
    },
    {
      id: "frontend-render",
      title: "Hvor rendres Markdown?",
      human:
        "Frontend i Viddel — ikke CES/GCP. Assistent-svar bygges som DOM-noder (bold, lister, avsnitt). Brukermeldinger forblir ren tekst.",
      bullets: [
        "/no/chat — standalone chatflate",
        "render-assistant-markdown.ts — safe renderer uten innerHTML på rå AI-tekst",
        "viddel-standalone-chat.css — liste-/avsnitts-styling",
      ],
      files: [
        "src/pages/no/chat.astro",
        "src/lib/render-assistant-markdown.ts",
        "src/styles/viddel-standalone-chat.css",
      ],
      links: [backstageLinks.chat, backstageLinks.renderMarkdownFile, backstageLinks.chatPageFile],
    },
    {
      id: "operational-rules",
      title: "Ikke endre dette casualt",
      human: "Disse grepene krever eksplisitt beslutning og ofte redeploy.",
      bullets: [
        "Bytt ikke production-backend uten avklaring (VIDDEL_AI_BACKEND).",
        "Ikke restrukturer datastore mens svarformat testes.",
        "Ikke start PostHog som del av config-arbeid.",
        "Ikke logg prompt eller svar i runtime.",
        "Response contract = versjonert produktendring — dokumenter i issue/PR.",
      ],
    },
    {
      id: "rollback",
      title: "Rollback til CES channel",
      human: "Kjent rollback hvis direct :answer feiler eller må isoleres.",
      bullets: [
        "Sett VIDDEL_AI_BACKEND=ces_channel i Vercel Production — eller fjern variabelen (default ces_channel).",
        "Behold CES_* env-vars for runSession-path.",
        "Redeploy Production.",
        "Test ett enkelt spørsmål i /no/chat.",
      ],
      envVars: ["VIDDEL_AI_BACKEND", "CES_APP_ID", "CES_DEPLOYMENT_ID"],
      links: [backstageLinks.vercelEnv, backstageLinks.vercelDeployments, backstageLinks.chat],
    },
  ] satisfies readonly AiChatConfigBlock[],
  adjustStyleGuide: {
    title: "Når du justerer svarstil senere",
    steps: [
      "Rediger src/lib/viddel-response-contract.ts (preamble + ev. bump version).",
      "Deploy — preamble sendes automatisk via agent-search-answer.ts.",
      "Test visuelt i /no/chat (korthet, tone, lister, ingen rå **).",
      "Oppdater Backstage hvis env eller filpunkter endres.",
    ],
  },
} as const;

export type ChangeRunbook = {
  id: string;
  title: string;
  whatChanges: string;
  where: string;
  whereToGo: string;
  after: string;
  test: string;
  actionLinks: readonly BackstageLink[];
  tech?: string;
  envVars?: readonly string[];
};

export type ServiceEntry = {
  id: string;
  name: string;
  layer: string;
  role: readonly string[];
  whenToOpen: readonly string[];
  places: readonly string[];
  actionLinks: readonly BackstageLink[];
};

/** Overordnet flyt — hvilke tjenester som henger sammen. */
export const serviceMapFlow = [
  { label: "Brukerflate", hint: "Spør Viddel" },
  { label: "Vercel", hint: "Firewall + nettsted + API" },
  { label: "Google", hint: "AI" },
  { label: "GitHub · VIS", hint: "Styring + status" },
] as const;

/** Tjenestekart — hvor gjør vi hva? */
export const services: ServiceEntry[] = [
  {
    id: "vercel",
    name: "Vercel",
    layer: "Kjører production",
    role: [
      "Kjører Viddel-siden og /api/chat i production",
      "Har environment variables",
      "Har Firewall, deployments og runtime logs",
    ],
    whenToOpen: [
      "Sette eller endre env-vars",
      "Redeploye etter endring",
      "Se runtime logs",
      "Endre trafikkgrensen",
      "Når production ikke virker",
    ],
    places: [
      "Project: vox-web",
      "Settings → Environment Variables",
      "Deployments",
      "Runtime Logs",
      "Firewall → Custom Rules",
    ],
    actionLinks: [
      backstageLinks.vercelProject,
      backstageLinks.vercelEnv,
      backstageLinks.vercelDeployments,
      backstageLinks.vercelLogs,
      backstageLinks.vercelFirewall,
    ],
  },
  {
    id: "google-ces",
    name: "Google Cloud / CES",
    layer: "AI-motor",
    role: [
      "AI-motoren som lager svarene",
      "Production: Google Agent Search :answer (direct)",
      "Rollback: CES runSession via ces_channel",
      "Kalles fra /api/chat via service account",
    ],
    whenToOpen: [
      "AI-svar kommer ikke",
      "Agent/deployment skal sjekkes",
      "CES-id-er eller service account må oppdateres",
      "Kunnskapsgrunnlag eller agentoppsett endres",
    ],
    places: [
      "Google Cloud project",
      "CES / Agent deployment",
      "Service account / credentials",
    ],
    actionLinks: [backstageLinks.googleCloud],
  },
  {
    id: "github",
    name: "GitHub",
    layer: "Kode og oppgaver",
    role: [
      "Kode, PR-er, issues og Return Tickets",
      "Oppgavebuss og beslutningshistorikk",
    ],
    whenToOpen: [
      "Se hva som er gjort",
      "Opprette eller endre arbeidsspor",
      "Lese Return Tickets",
      "Når Cursor har pushet branch/PR",
    ],
    places: [
      "THUNDERPLUNDER/vox-web → Issues",
      "Pull requests",
      "Commit history",
    ],
    actionLinks: [
      backstageLinks.githubRepo,
      backstageLinks.githubIssues,
      backstageLinks.githubPulls,
    ],
  },
  {
    id: "vis",
    name: "VIS",
    layer: "Intern styring",
    role: [
      "Intern visnings- og reviewflate",
      "Current-state, huber, sprint og systemflater",
    ],
    whenToOpen: [
      "Se hvor prosjektet står",
      "QA-e flater",
      "Navigere til /designsystem/ eller /backstage/",
    ],
    places: ["/vis/", "/designsystem/", "/backstage/"],
    actionLinks: [backstageLinks.vis, backstageLinks.designsystem, backstageLinks.backstage],
  },
];

export const firstCheckRules = [
  {
    symptom: "Siden laster ikke",
    check: "Vercel → Deployments / logs",
    links: [backstageLinks.vercelDeployments, backstageLinks.vercelLogs],
  },
  {
    symptom: "Chatten svarer ikke",
    check: "Vercel → Runtime Logs først, deretter Google Cloud / CES",
    links: [backstageLinks.vercelLogs, backstageLinks.googleCloud, backstageLinks.chat],
  },
  {
    symptom: "Rate limit slår inn",
    check: "Vercel Firewall + Runtime Logs",
    links: [backstageLinks.vercelFirewall, backstageLinks.vercelLogs],
  },
  {
    symptom: "AI feiler",
    check: "Vercel logs + Google Cloud / CES",
    links: [backstageLinks.vercelLogs, backstageLinks.googleCloud],
  },
  {
    symptom: "Status i VIS er feil",
    check: "current-state-filen → sjekk VIS",
    links: [backstageLinks.currentStateFile, backstageLinks.vis],
  },
] as const;

/** Runbooks — hvordan vi endrer operative verdier senere. */
export const changeRunbooks: ChangeRunbook[] = [
  {
    id: "ops-reliability",
    title: "Ops reliability test-token",
    whatChanges:
      "Aktivere eller rotere hemmelig token for intern stabilitetstest. Tokenet viser trygg responsmetadata, men omgår ikke Vercel Firewall.",
    where:
      "Vercel → Environment Variables: VIDDEL_OPS_TEST_TOKEN (Production, server-only). Script: scripts/chat-reliability-assessment.mjs.",
    whereToGo:
      "Vercel → Settings → Environment Variables. Generer sterk tilfeldig token lokalt — aldri i repo eller frontend. Redeploy Production.",
    after:
      "Redeploy. Kjør npm run chat:reliability med token i lokalt env og kontroller safe metadata. Hold serien innenfor aktiv Firewall-regel.",
    test:
      "Uten eller feil header: ingen ops-metadata. Riktig token: trygg metadata. Vercel Firewall gjelder i alle tilfeller.",
    actionLinks: [backstageLinks.vercelEnv, backstageLinks.vercelDeployments, backstageLinks.guardFile],
    envVars: ["VIDDEL_OPS_TEST_TOKEN"],
    tech: "src/lib/chat-ops-test.ts · aldri PUBLIC_ prefix · aldri i klientkode",
  },
  {
    id: "vercel-firewall",
    title: "Endre rate limits (Vercel Firewall)",
    whatChanges: "Hvor mange kall som tillates per IP til /api/chat og /api/image-vision.",
    where: "Vercel Dashboard → Firewall → Custom Rules.",
    whereToGo: "Åpne Vercel Firewall og rediger den aktuelle ruteregelen.",
    after: "Endringen gjelder uten redeploy. Test et vanlig kall og bekreft HTTP 429 når terskelen nås.",
    test: "Ett vanlig spørsmål skal fungere. En kontrollert serie over terskelen skal få HTTP 429 og en vennlig melding i chatten.",
    actionLinks: [backstageLinks.vercelFirewall, backstageLinks.vercelLogs],
    tech: "Vercel Firewall custom rate-limit rules",
  },
  {
    id: "max-length",
    title: "Endre maks lengde på spørsmål",
    whatChanges: "Hvor langt spørsmål brukeren kan sende — i dag 2000 tegn.",
    where: "I input-valideringen for chat guard.",
    whereToGo: "GitHub/Codex for kodeendring i guard. Etterpå Vercel → Deployments.",
    after: "Commit, deploy, og test med spørsmål på og rett over grensen.",
    test: "Send spørsmål med 2000 tegn (skal fungere). Send 2001 tegn eller mer (skal avvises med tydelig melding).",
    actionLinks: [backstageLinks.guardFile, backstageLinks.vercelDeployments],
    tech: "src/lib/chat-api-guard.ts · brukt av src/pages/api/chat.ts",
  },
  {
    id: "ces",
    title: "Endre CES / AI-motor-kobling",
    whatChanges: "Bytte eller oppdatere koblingen til AI-agenten — ny versjon, deployment eller prosjekt.",
    where: "Google Cloud/CES for agent/deployment. Vercel for env-vars.",
    whereToGo:
      "Google Cloud / CES for agent og deployment. Vercel → Environment Variables. Vercel → Deployments for redeploy.",
    after: "Redeploy Production. Test ekte svar i Spør Viddel.",
    test: "Send et enkelt spørsmål og bekreft at svaret kommer tilbake i chatten.",
    actionLinks: [
      backstageLinks.googleCloud,
      backstageLinks.vercelEnv,
      backstageLinks.vercelDeployments,
      backstageLinks.chat,
    ],
    envVars: [
      "CES_PROJECT_ID",
      "CES_LOCATION",
      "CES_APP_ID",
      "CES_APP_VERSION_ID",
      "CES_DEPLOYMENT_ID",
      "GOOGLE_SERVICE_ACCOUNT_JSON",
    ],
    tech: "Service account JSON kun i Vercel — aldri i repo.",
  },
  {
    id: "ai-backend",
    title: "Bytte AI-backend (direct ↔ CES)",
    whatChanges:
      "Hvilken AI-path /api/chat bruker — google_agent_search_direct (:answer) eller ces_channel (runSession).",
    where:
      "Vercel → VIDDEL_AI_BACKEND. Direct krever AGENT_SEARCH_ENGINE_ID + GOOGLE_SERVICE_ACCOUNT_JSON. CES krever CES_* ids.",
    whereToGo:
      "Vercel → Environment Variables → Redeploy. Les AI-chat konfigurasjon i Backstage før endring.",
    after:
      "Redeploy Production. Test /no/chat. Ved rollback: VIDDEL_AI_BACKEND=ces_channel eller fjern variabel.",
    test:
      "Ett spørsmål i Spør Viddel. Sjekk at svar kommer og at Markdown rendres (direct path).",
    actionLinks: [
      backstageLinks.vercelEnv,
      backstageLinks.vercelDeployments,
      backstageLinks.viddelAiBackendFile,
      backstageLinks.chat,
    ],
    envVars: [
      "VIDDEL_AI_BACKEND",
      "AGENT_SEARCH_ENGINE_ID",
      "AGENT_SEARCH_SERVING_CONFIG",
      "AGENT_SEARCH_ANSWER_SESSION",
      "CES_APP_ID",
      "CES_DEPLOYMENT_ID",
    ],
    tech: "src/lib/viddel-ai-backend.ts · src/lib/agent-search-answer.ts · src/lib/ces-run-session.ts",
  },
  {
    id: "response-contract",
    title: "Endre Viddel svarstil (response contract)",
    whatChanges: "Preamble som styrer tone, lengde, ordvalg og struktur i AI-svar — versjonert i repo.",
    where: "src/lib/viddel-response-contract.ts — sendes via promptSpec.preamble i :answer.",
    whereToGo: "GitHub/Cursor → rediger contract → commit → deploy. Bump VIDDEL_RESPONSE_CONTRACT_VERSION ved større endring.",
    after: "Deploy. Visuell QA i /no/chat — korthet, lister, ingen rå Markdown, audiograf kun når relevant.",
    test: "Minst 3–5 typiske spørsmål i /no/chat. Ikke endre GCP console for dette.",
    actionLinks: [
      backstageLinks.responseContractFile,
      backstageLinks.agentSearchAnswerFile,
      backstageLinks.chat,
      backstageLinks.githubIssue217,
    ],
    envVars: [],
    tech: "src/lib/viddel-response-contract.ts · #217",
  },
  {
    id: "disable-ai",
    title: "Slå av AI midlertidig",
    whatChanges: "Stoppe offentlig AI-svar midlertidig ved feil, kostnadsbekymring eller uventet adferd. Eier beholder tilgang.",
    where: "Vercel Dashboard → vox-web → Flags → public-ai-enabled.",
    whereToGo: "Sett Production til Off eller On. Den skjulte PIN-en på /no/chat/ styrer bare eiertilgangen.",
    after: "Endringen gjelder straks og krever ikke redeploy.",
    test: "Privat vindu skal se trygg utilgjengelig-melding. Nettleseren med eiercookie skal fortsatt få svar.",
    actionLinks: [backstageLinks.chat, backstageLinks.vercelLogs],
    envVars: [],
    tech: "public-ai-enabled · @vercel/flags-core · src/lib/public-ai-access-v01.ts",
  },
  {
    id: "access",
    title: "Midlertidig eier-PIN",
    whatChanges: "Eier-PIN og den lange eiercookie-hemmeligheten frem til ordentlig innlogging finnes.",
    where: "Vercel Environment Variables, server-side og sensitive.",
    whereToGo: "Sett VIDDEL_OWNER_PIN og VIDDEL_OWNER_SESSION_TOKEN. Del aldri verdiene i chat eller repo.",
    after: "Redeploy. Eksisterende eierøkter må låses opp på nytt hvis session-token roteres.",
    test: "Feil PIN avvises. Riktig PIN gir eiertilgang i 30 dager. Logg ut fjerner cookien.",
    actionLinks: [backstageLinks.vercelEnv, backstageLinks.chat, backstageLinks.vercelFirewall],
    envVars: ["VIDDEL_OWNER_PIN", "VIDDEL_OWNER_SESSION_TOKEN"],
    tech: "Midlertidig MVP-kontroll — ikke full brukerinnlogging.",
  },
  {
    id: "status",
    title: "Når vi endrer status",
    whatChanges: "Hva som er sant nå — live AI, guard, neste steg, risiko.",
    where: "Registry-filen for MVP-status.",
    whereToGo: "GitHub/Cursor → src/data/mvp-current-state.ts. VIS → /vis/ for kontroll etterpå.",
    after: "Sjekk /vis/ etterpå. Legg Return Ticket på relevant issue.",
    test: "VIS kontrollrom viser oppdatert nå-status og neste arbeid.",
    actionLinks: [
      backstageLinks.currentStateFile,
      backstageLinks.vis,
      backstageLinks.githubIssues,
    ],
    tech: "UI-mønster → vurder /designsystem/ · systemflyt → oppdater /backstage/",
  },
];

export type TroubleshootingCase = {
  id: string;
  userSees: string;
  usuallyMeans: string[];
  weCheck: string[];
  techCodes?: string[];
};

export const troubleshootingCases: TroubleshootingCase[] = [
  {
    id: "too-long",
    userSees: "«Spørsmålet er litt for langt. Prøv å korte det ned og send på nytt.»",
    usuallyMeans: ["Spørsmålet er over 2000 tegn.", "Forventet beskyttelse — ikke en systemfeil."],
    weCheck: ["Be brukeren korte ned spørsmålet.", "Ingen videre feilsøking nødvendig."],
    techCodes: ["message_too_long"],
  },
  {
    id: "rate-limit",
    userSees: "«Du har stilt mange spørsmål på kort tid. Prøv igjen litt senere.»",
    usuallyMeans: ["IP har nådd den aktive Vercel Firewall-grensen.", "Kan være ekte bruk eller misbruk."],
    weCheck: ["Vercel Firewall-regelen.", "Vent og prøv igjen.", "Vurder justering av terskelen ved behov."],
    techCodes: ["rate_limited", "HTTP 429"],
  },
  {
    id: "unavailable",
    userSees: "«Viddel er ikke tilgjengelig akkurat nå.»",
    usuallyMeans: [
      "Offentlig AI-tilgang kan være slått av i Vercel Flags.",
      "Vercel Flags kan være utilgjengelig; offentlig trafikk stoppes da trygt.",
      "CES-variabler mangler i Vercel.",
      "Google/CES-feil.",
    ],
    weCheck: [
      "Vercel env-vars (Production).",
      "Vercel runtime logs.",
      "CES status.",
    ],
    techCodes: ["public_ai_disabled", "configuration_missing", "auth"],
  },
  {
    id: "retry",
    userSees: "«Vi fikk ikke tak i svaret akkurat nå. Prøv igjen.»",
    usuallyMeans: ["Midlertidig feil mot AI-motoren.", "Uventet serverfeil."],
    weCheck: ["Vercel function logs.", "CES deployment aktiv.", "Prøv på nytt etter kort ventetid."],
    techCodes: ["upstream", "internal_error"],
  },
];

export const productionChecklist = [
  "Kan vi få ekte svar i Spør Viddel?",
  "Virker eier-PIN, offentlig av/på-bryter og eiertilgang når offentlig tilgang er av?",
  "Er Firewall-reglene aktive for begge AI-rutene?",
  "Ser vi feil i Vercel logs?",
  "Er VIS current-state oppdatert?",
  "Er Return Ticket lagt?",
] as const;

export const beforeExternalSharing = [
  "Hybrid monitoring v0.1 er aktiv — intern test med Thomas og Vibeke før ekstern deling.",
  "Sjekk Runtime Logs, Firewall og PostHog EU for mønstre — ikke innhold.",
  "Eier-PIN er kun en skjult, midlertidig MVP-kontroll; ordentlig innlogging kommer senere.",
  "Ekstern pilot krever egen beslutning.",
] as const;

export const monitoringExplainer = {
  title: "AI usage monitoring og feedback v0.1",
  lead: "Trygghet før ekstern deling — smalt, trinnvis og uten logging av samtaleinnhold.",
  layers: [
    {
      id: "drift",
      label: "Drift (Vercel)",
      human:
        "Vercel Runtime Logs viser strukturerte app-utfall for /api/chat. Firewall stopper overskytende trafikk med HTTP 429 før funksjonen kjører. Ops-test logges separat som [chat-ops-drift] (ops_test: true) — uten innhold, sessionId eller IP.",
      where: "Vercel → Firewall + Deployments → Runtime Logs",
    },
    {
      id: "product",
      label: "Produktinnsikt (PostHog EU)",
      human:
        "Få anonyme events: chat åpnet, inngang klikket, seed valgt, spørsmål sendt, svar OK/feil. Kun route, inngangsflate, artikkel-slug, seed-id og feilkode — aldri spørsmål eller svar.",
      where: "PostHog EU-prosjekt (session replay av, ingen brukerprofiler)",
    },
    {
      id: "ces",
      label: "CES (AI-motor)",
      human: "Operativ kjøring av AI — ikke produktanalytics. CES logger ikke i vårt lag.",
      where: "Google CES / Vertex — se cesExplainer",
    },
    {
      id: "feedback",
      label: "Conversation feedback (Neon EU)",
      human:
        "Eksplisitt tilbakemelding lagres i en egen Neon Postgres Free-database i AWS Frankfurt. Kun score, hurtiggrunner, valgfri kommentar og kontrollert metadata — aldri chatspørsmål, svar, transcript eller CES-session.",
      where: "Vercel → Storage → neon-apricot-coin · 90 dagers retention",
    },
  ],
} as const;

export const monitoringLogged = [
  "Strukturerte Vercel-utfall for /api/chat",
  "App-utfall: suksess, feil, message_too_long og configuration_missing; Firewall HTTP 429 vises separat",
  "Ops-test: [chat-ops-drift] med signal, error_code, upstream_http_status, duration_bucket, retry_used, attempt_count, ops_test: true",
  "PostHog: chat_opened, ai_entry_clicked, article_ai_seed_clicked, chat_question_sent, chat_answer_success/error",
  "Feilkoder (error_code) — aldri meldingstekst",
  "Route, entry_surface, article_slug, seed_id (hash — ikke spørsmålstekst)",
  "Neon feedback: separat feedback-reference, score, valgte grunner, valgfri kommentar, server-tidspunkt, route og environment",
] as const;

export const monitoringNotLogged = [
  "Full spørsmålstekst",
  "Full svartekst",
  "Navn, e-post eller helseopplysninger",
  "Session replay fra chat-input",
  "Brukerprofiler eller persistent identitet",
  "Høreapparatmodell som fritekst",
  "CES session-ID, spørsmål, svar, transcript eller samtaleutdrag i feedback-store",
] as const;

export const monitoringEvents = [
  { id: "chat_opened", layer: "PostHog", note: "Standalone /no/chat/ lastet" },
  { id: "ai_entry_clicked", layer: "PostHog", note: "CTA til chat fra nav, hjelp m.m." },
  { id: "article_ai_seed_clicked", layer: "PostHog", note: "Seed-spørsmål fra artikkel" },
  { id: "chat_question_sent", layer: "PostHog", note: "Spørsmål sendt (seed/freeform — uten tekst)" },
  { id: "chat_answer_success", layer: "PostHog", note: "Svar mottatt OK" },
  { id: "chat_answer_error", layer: "PostHog", note: "Feil ved svar" },
  { id: "chat_rate_limited", layer: "PostHog", note: "Rate limit truffet" },
  { id: "chat_message_too_long", layer: "PostHog", note: "Melding for lang" },
] as const;

export type EnvVarEntry = {
  name: string;
  group: "ces" | "agent-search" | "auth" | "posthog" | "ops" | "feedback";
  controls: string;
};

export const envVars: EnvVarEntry[] = [
  { name: "VIDDEL_OWNER_PIN", group: "auth", controls: "Fire sifre; brukes kun til å låse opp eierøkten. Aldri frontend." },
  { name: "VIDDEL_OWNER_SESSION_TOKEN", group: "auth", controls: "Minst 32 tilfeldige tegn; cookie-verdi og smal Firewall-bypass for AI-rutene." },
  { name: "VIDDEL_OPS_TEST_TOKEN", group: "ops", controls: "Hemmelig ops reliability test som viser trygg responsmetadata. Omgår ikke Vercel Firewall. Aldri frontend." },
  {
    name: "VIDDEL_AI_BACKEND",
    group: "agent-search",
    controls: "Backend for /api/chat: google_agent_search_direct eller ces_channel. Default ces_channel.",
  },
  {
    name: "AGENT_SEARCH_ENGINE_ID",
    group: "agent-search",
    controls: "Discovery Engine engine-id for :answer — ikke CES_APP_ID.",
  },
  {
    name: "AGENT_SEARCH_SERVING_CONFIG",
    group: "agent-search",
    controls: "Serving config for :answer. Default default_serving_config.",
  },
  {
    name: "AGENT_SEARCH_ANSWER_SESSION",
    group: "agent-search",
    controls: "omit (anbefalt) eller full — styrer om session sendes i :answer.",
  },
  {
    name: "AGENT_SEARCH_LOCATION",
    group: "agent-search",
    controls: "Valgfri override for Discovery Engine region (ellers CES_LOCATION).",
  },
  { name: "CES_PROJECT_ID", group: "ces", controls: "CES prosjekt." },
  { name: "CES_LOCATION", group: "ces", controls: "CES region." },
  { name: "CES_APP_ID", group: "ces", controls: "Viddel-app i CES." },
  { name: "CES_APP_VERSION_ID", group: "ces", controls: "App-versjon." },
  { name: "CES_DEPLOYMENT_ID", group: "ces", controls: "Aktiv deployment." },
  { name: "GOOGLE_SERVICE_ACCOUNT_JSON", group: "auth", controls: "Google auth — kun server-side." },
  { name: "PUBLIC_POSTHOG_KEY", group: "posthog", controls: "PostHog prosjektnøkkel (public, EU)." },
  { name: "PUBLIC_POSTHOG_HOST", group: "posthog", controls: "PostHog API-host — default https://eu.i.posthog.com" },
  {
    name: "FEEDBACK_DATABASE_DATABASE_URL",
    group: "feedback",
    controls: "Neon Postgres-tilkobling fra Vercel Marketplace. Kun server-side; Frankfurt/EU.",
  },
  {
    name: "FEEDBACK_DATABASE_URL",
    group: "feedback",
    controls: "Valgfritt kort alias ved lokal/manuell konfigurasjon.",
  },
  {
    name: "CRON_SECRET",
    group: "feedback",
    controls: "Hemmelig bearer-token som beskytter daglig sletting av feedback eldre enn 90 dager.",
  },
];

export const envVarNotes = [
  "Sett kun i Vercel Production (Preview ved behov).",
  "Verdier aldri i repo, ChatGPT eller Codex-chat.",
  "Redeploy etter endring.",
] as const;

export const sourceFiles = [
  "src/pages/api/chat.ts",
  "src/lib/viddel-ai-backend.ts",
  "src/lib/agent-search-answer.ts",
  "src/lib/viddel-response-contract.ts",
  "src/lib/render-assistant-markdown.ts",
  "src/pages/no/chat.astro",
  "src/lib/chat-api-guard.ts",
  "src/lib/owner-access-v01.ts",
  "src/lib/public-ai-access-v01.ts",
  "src/pages/api/owner-access/*",
  "src/lib/chat-ops-test.ts",
  "src/lib/chat-usage-metrics.ts",
  "src/lib/viddel-analytics-events.ts",
  "src/components/analytics/ViddelAnalytics.astro",
  "src/lib/ces-env.ts",
  "src/lib/ces-run-session.ts",
  "src/pages/api/conversation-feedback.ts",
  "src/pages/api/conversation-feedback-retention.ts",
  "src/lib/conversation-feedback-v01.ts",
  "src/lib/conversation-feedback-store-v01.ts",
  "src/components/conversation/ConversationFeedbackPanel.astro",
] as const;
