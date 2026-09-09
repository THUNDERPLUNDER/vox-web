/* CONTRACT: VIS Runtime Feed v0.1 — retained narrow runtime snapshot, not overall project state.
   Project Brain + vis-project-state-v01 own the curated /vis overview. See OPERATING_RULES § B4. */

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
  updatedAt: "2026-09-09",
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
        "Kjør ekte samtale med feedback på den stabile Preview-flaten på desktop og mobil når runtime er klar.",
      issue: "#346",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/346",
      progressSteps: [
        { id: "storage", label: "Neon EU koblet", state: "done" },
        { id: "code", label: "Schema og feedbackflyt", state: "done" },
        { id: "qa", label: "Retention-QA", state: "current" },
        { id: "production", label: "Preview slutt-QA", state: "upcoming" },
      ],
    },
    {
      id: "stable-open-preview",
      headline: "Vi lager én stabil og åpen testflate for Thomas og Vibeke, uten skjult eierkode.",
      workTitle: "Stable open preview + production-only AI gate (#396)",
      area: "Drift og AI",
      why:
        "PIN, eiercookie og PR-spesifikke adresser ga unødvendig friksjon før intern QA. Preview skal være enkel å bruke uten å åpne Production.",
      status:
        "Kodeforenkling pågår: Preview åpnes og merkes globalt noindex; Production beholder public-ai-enabled og Vercel Firewall.",
      possibleSolution:
        "Feature-arbeid promoteres til den faste preview-branchen for Thomas/Vibeke-QA før main.",
      nextDecision:
        "Promoter grønn feature-branch til preview og verifiser preview.viddel.no før eventuell merge til main.",
      issue: "#396",
      issueLink: "https://github.com/THUNDERPLUNDER/vox-web/issues/396",
      progressSteps: [
        { id: "decision", label: "Forenkling besluttet", state: "done" },
        { id: "code", label: "Access-lag fjernes", state: "current" },
        { id: "preview", label: "Stabil Preview-QA", state: "upcoming" },
        { id: "main", label: "Owner merge-port", state: "upcoming" },
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
        label: "Issue #396",
        href: "https://github.com/THUNDERPLUNDER/vox-web/issues/396",
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
