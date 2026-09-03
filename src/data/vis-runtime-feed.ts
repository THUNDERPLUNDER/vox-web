/* CONTRACT: VIS Runtime Feed v0.1 — kondensert agent-status for /vis/ (manuelt ved Return Ticket).
   Kommunikasjonsregel: skriv for Thomas/Vibeke — headline uten forkunnskap. Se OPERATING_RULES § B4. */

export type VisRuntimeProgressStep = {
  id: string;
  label: string;
  state: "done" | "current" | "upcoming";
};

export type VisRuntimeActiveWork = {
  id: string;
  /** Første setning — forklarer arbeidet uten kontekst. */
  headline: string;
  workTitle: string;
  area: string;
  why: string;
  status: string;
  possibleSolution: string;
  nextDecision: string;
  issue?: string;
  issueLink?: string;
  progressSteps: VisRuntimeProgressStep[];
};

export type VisRuntimeFeedLink = {
  label: string;
  href: string;
  kind?: "issue" | "page" | "external";
};

export type VisRuntimeFeed = {
  updatedAt: string;
  activeNow: VisRuntimeActiveWork[];
  recentlyCompletedSummary: string;
  lastReturnTicketSummary: string;
  links: {
    primary: VisRuntimeFeedLink[];
    secondary?: VisRuntimeFeedLink[];
  };
};

/** Manually updated after important Return Tickets — not synced from GitHub. */
export const visRuntimeFeed = {
  updatedAt: "2026-08-20",
  activeNow: [
    {
      id: "conversation-feedback-v01",
      headline: "Vi gjør det mulig å vurdere en samtale uten å lagre selve samtalen.",
      workTitle: "Conversation Feedback v0.1 (#346)",
      area: "Samtaledesign og personvern",
      why:
        "Intern beta-QA trenger både en enkel vurdering og brukerens egne forbedringskommentarer, men spørsmål, svar og CES-session skal ikke bli et nytt skjult datalager.",
      status:
        "Neon Free i Frankfurt er koblet til Production og Preview. Schema, API, Neon-write og adaptivt Tilbakemelding-panel er verifisert; 90-dagers cleanup er implementert, men ikke operativt verifisert.",
      possibleSolution:
        "En separat feedback-reference knytter score, hurtiggrunner og valgfri kommentar til én feedbackpost. Desktop bruker høyrepanel og mobil bruker sheet.",
      nextDecision:
        "Legg inn CRON_SECRET, redeploy og kjør autentisert cleanup-test. Deretter gjenstår owner-gated ekte samtale med feedback på desktop og mobil før merge.",
      issue: "#346",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/346",
      progressSteps: [
        { id: "storage", label: "Neon EU koblet", state: "done" },
        { id: "code", label: "Schema og feedbackflyt", state: "done" },
        { id: "qa", label: "Retention-QA", state: "current" },
        { id: "production", label: "Owner-gated slutt-QA", state: "upcoming" },
      ],
    },
    {
      id: "public-ai-guard-v02",
      headline: "Vi gjenoppretter chatten med en enkel eierkode og et lett kostnadsvern for andre.",
      workTitle: "Public AI guard v0.2 (#180)",
      area: "Drift og AI",
      why:
        "Upstash-telleren feilet før AI-kallet og gjorde Spør Viddel utilgjengelig. Frem til innlogging trenger den offentlige MVP-en bare et lett vern mot åpenbart misbruk.",
      status:
        "Feilen er diagnostisert. Eier-PIN, sikker eierøkt og offentlig av/på-flagg er implementert lokalt; Preview-test og Firewall-oppsett gjenstår.",
      possibleSolution:
        "Vercel Flags holder én av/på-verdi. Vercel Firewall begrenser PIN-forsøk, tekstspørsmål og bildeanalyse uten ny teller-infrastruktur.",
      nextDecision:
        "Koble koden til det opprettede flagget, kontroller eierflyten i Preview, og aktiver deretter de gjennomgåtte Firewall-reglene.",
      issue: "#180",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/180",
      progressSteps: [
        { id: "diagnosis", label: "Feilkilde funnet", state: "done" },
        { id: "code", label: "Guard v0.2 i kode", state: "done" },
        { id: "config", label: "Vercel-flagg opprettet", state: "done" },
        { id: "firewall", label: "Firewall-regler", state: "upcoming" },
        { id: "production", label: "Production-verifisering", state: "upcoming" },
      ],
    },
  ],
  recentlyCompletedSummary:
    "Viddel er nå canonical navn og www.viddel.no er produksjonsdomene. Permanent redirect for det tidligere VOX-domenet er besluttet, men avventer domenekonfigurasjon i Vercel.",
  lastReturnTicketSummary:
    "Production 503 er sporet til Upstash rate-limit storage-feil før AI-kallet. Guard v0.2 fjerner denne feilkilden og flytter trafikkgrensen til Vercel Firewall.",
  links: {
    primary: [
      {
        label: "Issue #346",
        href: "https://github.com/THUNDERPLUNDER/vox-web/issues/346",
        kind: "issue",
      },
      {
        label: "Issue #180",
        href: "https://github.com/THUNDERPLUNDER/vox-web/issues/180",
        kind: "issue",
      },
      {
        label: "Vercel Firewall",
        href: "https://vercel.com/raddum-5965s-projects/vox-web/firewall",
        kind: "external",
      },
    ],
    secondary: [
      {
        label: "Viddel.no",
        href: "/",
        kind: "page",
      },
      {
        label: "PR #302",
        href: "https://github.com/THUNDERPLUNDER/vox-web/pull/302",
        kind: "issue",
      },
      {
        label: "Backstage monitoring",
        href: "/backstage/",
        kind: "page",
      },
    ],
  },
} satisfies VisRuntimeFeed;

export function getVisRuntimeFeed(): VisRuntimeFeed {
  return visRuntimeFeed;
}
