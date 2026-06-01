/* CONTRACT: Backstage v0.1 content — pedagogisk systemforklaring (forståelse først, teknikk nederst). */

export const backstageMeta = {
  title: "Backstage",
  lead: "Backstage er kontrollrommet for hvordan Viddel fungerer bak scenen. Her forklarer vi AI-flyten, beskyttelsen, feilstater og hva som må sjekkes før vi deler med flere.",
  updatedAt: "2026-05-30",
  issue: "#184",
} as const;

export const statusPanel = [
  { label: "Spør Viddel", value: "Live i production", tone: "live" as const },
  { label: "Guard", value: "Aktiv", tone: "ok" as const },
  { label: "Ekstern deling", value: "Venter på usage monitoring", tone: "wait" as const },
] as const;

export const quickAnswers = [
  {
    question: "Hva skjer når noen spør Viddel?",
    answer: "Spørsmålet går gjennom Viddel sitt eget grensesnitt, sjekkes, telles og sendes til AI-motoren — svaret kommer tilbake i samme chat.",
  },
  {
    question: "Hva beskytter oss?",
    answer: "Grenser på lengde og antall spørsmål, pluss sjekk av hvor forespørselen kommer fra. Mangler beskyttelsen i production, stenger Viddel trygt.",
  },
  {
    question: "Hva gjør vi når noe ikke virker?",
    answer: "Start med hva brukeren ser, sjekk env-vars i Vercel, Upstash og CES — se feilsøkingsseksjonen under.",
  },
  {
    question: "Hvor orienterer vi oss i VIS?",
    answer:
      "VIS kontrollrom (/vis/) og venstremenyen på interne flater — rolig orientering om hvor du er og hva siden er til for. Backstage er fortsatt canonical systemreferanse.",
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
    title: "Guard + Upstash",
    human: "Viddel sjekker at spørsmålet er lovlig og innenfor grensen. Upstash teller bruk.",
  },
  {
    id: "ai",
    layer: "AI-motor",
    title: "CES",
    human: "CES lager svaret. Viddel eier grensesnittet rundt.",
    tech: "runSession",
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
    title: "Upstash sjekker bruksmengde",
    human: "Teller hvor mange spørsmål som kommer fra samme IP.",
    why: "Dette beskytter kostnad og misbruk.",
    tech: "10 / 10 min · 50 / døgn",
  },
  {
    step: 5,
    title: "CES får spørsmålet",
    human: "AI-motoren lager svaret.",
    why: "Dette er selve AI-svaret.",
    tech: "CES runSession",
  },
  {
    step: 6,
    title: "Viddel viser svaret",
    human: "Svaret vises i chatten — uten CES-widget i nettleseren.",
  },
];

export const protectionRules = [
  {
    title: "Maks lengde",
    value: "2000 tegn",
    human: "Lengre spørsmål avvises med en tydelig melding til brukeren.",
  },
  {
    title: "Kort sikt",
    value: "10 spørsmål per 10 minutter",
    human: "Beskyttelse mot rask spam fra samme IP.",
  },
  {
    title: "Døgn",
    value: "50 spørsmål per døgn",
    human: "Tak på total bruk per IP per dag.",
  },
  {
    title: "Trygg stenging",
    value: "Viddel stenger trygt",
    human: "Hvis tellelaget mangler i production, svarer Viddel ikke — den står ikke åpen uten beskyttelse.",
    tech: "guard_unavailable",
  },
] as const;

export const upstashExplainer = {
  title: "Hva betyr Upstash?",
  body: "Upstash er bare telleren. Den husker ikke samtalen. Den teller hvor mange spørsmål som kommer fra samme IP — slik at vi kan stoppe misbruk uten å lagre det brukeren skriver.",
} as const;

export const cesExplainer = {
  title: "Hva betyr CES?",
  body: "CES er AI-motoren som lager svaret. Viddel eier grensesnittet rundt — chatten, feilmeldingene og hvordan det føles for brukeren.",
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
  upstashConsole: {
    label: "Åpne Upstash Console",
    href: "https://console.upstash.com/",
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
    href: "https://vox.raddum.no/vis/",
  },
  backstage: {
    label: "Åpne Backstage",
    href: "https://vox.raddum.no/backstage/",
  },
  designsystem: {
    label: "Åpne Designsystem",
    href: "https://vox.raddum.no/designsystem/",
  },
  chat: {
    label: "Åpne Spør Viddel",
    href: "https://vox.raddum.no/no/chat/",
  },
} as const satisfies Record<string, BackstageLink>;

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
  { label: "Vercel", hint: "Nettsted + API" },
  { label: "Upstash · CES", hint: "Teller + AI" },
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
      "Har deployments og runtime logs",
    ],
    whenToOpen: [
      "Sette eller endre env-vars",
      "Redeploye etter endring",
      "Se runtime logs",
      "Når production ikke virker",
    ],
    places: [
      "Project: vox-web",
      "Settings → Environment Variables",
      "Deployments",
      "Runtime Logs",
    ],
    actionLinks: [
      backstageLinks.vercelProject,
      backstageLinks.vercelEnv,
      backstageLinks.vercelDeployments,
      backstageLinks.vercelLogs,
    ],
  },
  {
    id: "upstash",
    name: "Upstash",
    layer: "Teller bruk",
    role: [
      "Teller bruk for rate limit",
      "Holder styr på spørsmål per IP",
      "Lagrer ikke samtalehistorikk",
    ],
    whenToOpen: [
      "Sjekke rate limit / bruk",
      "Bytte eller rotere Redis-token",
      "Når rate limit oppfører seg rart",
    ],
    places: [
      "Redis: viddel-chat-rate-limit",
      "REST URL / REST TOKEN",
      "Usage / Monitor",
    ],
    actionLinks: [backstageLinks.upstashConsole],
  },
  {
    id: "google-ces",
    name: "Google Cloud / CES",
    layer: "AI-motor",
    role: [
      "AI-motoren som lager svarene",
      "Viddel-agent og deployment",
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
    check: "Upstash + Vercel logs",
    links: [backstageLinks.upstashConsole, backstageLinks.vercelLogs],
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
    id: "rate-limits",
    title: "Endre rate limits",
    whatChanges: "Hvor mange spørsmål som tillates — per 10 minutter og per døgn (per IP).",
    where: "I chat guard-koden. Nåværende grenser: 10 per 10 min og 50 per døgn.",
    whereToGo:
      "GitHub/Cursor for kodeendring i guard. Etterpå Vercel → Deployments. Ikke Vercel env alene — grensene ligger i kode i dag.",
    after: "Commit, deploy til Production, og test at chat fortsatt fungerer.",
    test: "Ett vanlig spørsmål (skal fungere). 11 raske spørsmål (skal stoppe med tydelig melding). For lang melding (skal avvises).",
    actionLinks: [
      backstageLinks.guardFile,
      backstageLinks.githubPulls,
      backstageLinks.vercelDeployments,
    ],
    tech: "src/lib/chat-api-guard.ts",
  },
  {
    id: "max-length",
    title: "Endre maks lengde på spørsmål",
    whatChanges: "Hvor langt spørsmål brukeren kan sende — i dag 2000 tegn.",
    where: "I input-valideringen for chat guard.",
    whereToGo: "GitHub/Cursor for kodeendring i guard. Etterpå Vercel → Deployments.",
    after: "Commit, deploy, og test med spørsmål på og rett over grensen.",
    test: "Send spørsmål med 2000 tegn (skal fungere). Send 2001 tegn eller mer (skal avvises med tydelig melding).",
    actionLinks: [backstageLinks.guardFile, backstageLinks.vercelDeployments],
    tech: "src/lib/chat-api-guard.ts · brukt av src/pages/api/chat.ts",
  },
  {
    id: "upstash",
    title: "Endre eller bytte Upstash",
    whatChanges: "Bytte telleren som holder styr på bruk — f.eks. ny Upstash-database eller nye nøkler.",
    where: "Upstash Console for Redis/REST-token. Vercel for env-vars.",
    whereToGo:
      "Upstash Console → Redis viddel-chat-rate-limit. Vercel → Settings → Environment Variables. Vercel → Deployments for redeploy.",
    after: "Redeploy Production. Test at chat svarer og at rate limit fortsatt virker.",
    test: "Ett vanlig spørsmål i Spør Viddel. Sjekk at feilmelding er trygg hvis noe er feil — ikke teknisk rot.",
    actionLinks: [
      backstageLinks.upstashConsole,
      backstageLinks.vercelEnv,
      backstageLinks.vercelDeployments,
    ],
    envVars: ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
    tech: "Verdier aldri i repo, ChatGPT eller Cursor.",
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
    id: "disable-ai",
    title: "Slå av AI midlertidig",
    whatChanges: "Stoppe AI-svar midlertidig — ved feil, kostnadsbekymring eller uventet adferd.",
    where: "Fjern eller deaktiver CES env-vars i Vercel Production.",
    whereToGo:
      "Vercel → Environment Variables / Deployments. Kontrollert handling — påvirker production. Oppdater VIS/current-state etterpå.",
    after: "Redeploy. Oppdater VIS current-state så teamet vet at AI er av.",
    test: "Brukeren skal se trygg feilmelding («Viddel er ikke tilgjengelig akkurat nå») — ikke rå teknisk feil.",
    actionLinks: [
      backstageLinks.vercelEnv,
      backstageLinks.vercelDeployments,
      backstageLinks.currentStateFile,
      backstageLinks.vis,
    ],
    tech: "configuration_missing · src/lib/ces-env.ts",
  },
  {
    id: "access",
    title: "Tilgang / passord / ekstern pilot",
    whatChanges: "Hvem som får bruke Spør Viddel ved ekstern pilot — ikke relevant nå (access er parkert).",
    where: "Fremtidig retning: «Mine sider» / innlogget tilstand i globalmenyen.",
    whereToGo:
      "Ikke nå — eget arbeidsspor før ekstern pilot. UI-retning: «Mine sider» i globalmenyen, ikke kodefelt i chatten.",
    after: "Server-side må fortsatt beskytte /api/chat når det kommer.",
    test: "Når det kommer: chatten skal oppleves som tilgjengelig når brukeren er inne — uten passord i selve chat-flaten.",
    actionLinks: [
      backstageLinks.githubIssues,
      backstageLinks.githubIssue181,
      backstageLinks.vis,
      backstageLinks.backstage,
    ],
    tech: "Access Gate #181 parkert/revertet.",
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
    usuallyMeans: ["IP har nådd grensen (10 per 10 min eller 50 per døgn).", "Kan være ekte bruk eller misbruk."],
    weCheck: ["Upstash tellere.", "Vent og prøv igjen.", "Vurder justering av grenser ved behov."],
    techCodes: ["rate_limited"],
  },
  {
    id: "unavailable",
    userSees: "«Viddel er ikke tilgjengelig akkurat nå.»",
    usuallyMeans: [
      "CES-variabler mangler i Vercel.",
      "Upstash mangler eller svarer ikke.",
      "Google/CES-feil.",
    ],
    weCheck: [
      "Vercel env-vars (Production).",
      "Vercel runtime logs.",
      "Upstash status.",
      "CES status.",
    ],
    techCodes: ["configuration_missing", "guard_unavailable", "auth"],
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
  "Er guard aktiv (Upstash env satt i Production)?",
  "Ser vi feil i Vercel logs?",
  "Er VIS current-state oppdatert?",
  "Er Return Ticket lagt?",
] as const;

export const beforeExternalSharing = [
  "AI usage monitoring v0.1 først.",
  "Access/login senere via «Mine sider» i globalmenyen — ikke kodefelt inne i chatten.",
  "Ekstern pilot krever egen beslutning.",
] as const;

export type EnvVarEntry = {
  name: string;
  group: "upstash" | "ces" | "auth";
  controls: string;
};

export const envVars: EnvVarEntry[] = [
  { name: "UPSTASH_REDIS_REST_URL", group: "upstash", controls: "Teller-endpoint." },
  { name: "UPSTASH_REDIS_REST_TOKEN", group: "upstash", controls: "Teller-autentisering." },
  { name: "CES_PROJECT_ID", group: "ces", controls: "CES prosjekt." },
  { name: "CES_LOCATION", group: "ces", controls: "CES region." },
  { name: "CES_APP_ID", group: "ces", controls: "Viddel-app i CES." },
  { name: "CES_APP_VERSION_ID", group: "ces", controls: "App-versjon." },
  { name: "CES_DEPLOYMENT_ID", group: "ces", controls: "Aktiv deployment." },
  { name: "GOOGLE_SERVICE_ACCOUNT_JSON", group: "auth", controls: "Google auth — kun server-side." },
];

export const envVarNotes = [
  "Sett kun i Vercel Production (Preview ved behov).",
  "Verdier aldri i repo, ChatGPT eller Cursor.",
  "Redeploy etter endring.",
] as const;

export const sourceFiles = [
  "src/pages/api/chat.ts",
  "src/lib/chat-api-guard.ts",
  "src/lib/ces-env.ts",
  "src/lib/ces-run-session.ts",
] as const;
