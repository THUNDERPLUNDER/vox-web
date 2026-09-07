/* CONTRACT: Curated VIS read model of Viddel Project Brain. Not backlog or runtime truth. */

export type ProjectStateItem = {
  title: string;
  description: string;
  href?: string;
};

export const visProjectStateV01 = {
  sourceDocument: "Viddel – Project Brain (Current)",
  sourceId: "138fF8MyOEa4wAGa7rvcv5BFkBmieoNpq14DcZwSTzAE",
  sourceUrl:
    "https://docs.google.com/document/d/138fF8MyOEa4wAGa7rvcv5BFkBmieoNpq14DcZwSTzAE/edit",
  sourceRevision:
    "ANLCKQnmrSy3nydlZ7upkL5mbPpors8wex-tq2vvHQw228bhceaovy_2ldaD-_fDAp0BuoojMlI086K0Aat--pseNRPzl6B9GYtDv5n_LpQ",
  brainLastMeaningfulUpdate: "2026-09-07",
  projectionUpdatedAt: "2026-09-07",
  projectionOwner: "Thomas / @navigator",
  northStar:
    "Viddel skal være et lavterskel, ikke-klinisk mestrings-, forberedelses- og navigasjonslag for mennesker med svekket hørsel. Langsiktig bygger vi en norsk støtteplattform rundt hørsel: et felles kunnskaps- og navigasjonslag for personen med hørselsutfordringer og menneskene som hjelper rundt.",
  northStarContext:
    "Nærhet til norsk hverdag, støtteapparat og fagmiljø er en del av retningen.",
  strategicPrinciple: "Modellen leies. Relevansen læres.",
  strategicPrincipleMeaning:
    "Vi lytter, avklarer og lærer — og lar ny informasjon endre hjelpen.",
  phase:
    "Viddel har en fungerende prototype og live AI-chat i produksjon. Arbeidet er i kontrollert MVP- og test-readiness, ikke i åpen feature-ekspansjon.",
  priorities: [
    {
      title: "Tryggere og mer relevant AI-hjelp",
      description:
        "Forme minste Viddel-eide samtaletilstand og policy før neste sikkerhets- og eier-QA-port.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/384",
    },
    {
      title: "Dokumentere reell klinikkverdi",
      description:
        "Validere arbeidsflyt, nytte og betalingsvilje gjennom avgrensede samtaler — som hypoteser inntil de er bekreftet.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/355",
    },
    {
      title: "Holde prosjektbildet forståelig",
      description:
        "VIS viser en kuratert Project Brain-projeksjon. GitHub fortsetter å eie oppgaver og faktisk arbeidsstatus.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/354",
    },
  ] satisfies ProjectStateItem[],
  latestDecisions: [
    {
      title: "Én kilde per ansvar",
      description:
        "Project Brain eier den levende prosjektsyntesen. GitHub eier oppgaver. VIS er en kuratert leseflate.",
    },
    {
      title: "Retning før datoer",
      description:
        "Initiativer vurderes som NOW, NEXT, LATER eller WATCH. Datoer brukes bare når de er reelle milepæler.",
    },
    {
      title: "Viddel eier relevansen",
      description:
        "Standard AI og infrastruktur kan kjøpes; Viddels relevans, domenevalg, state og læring må eies.",
    },
  ] satisfies ProjectStateItem[],
  openQuestions: [
    {
      title: "Åpent spørsmål · betalende verdi",
      description:
        "Hvem har faktisk betalingsvilje, og hvilken dokumenterbar verdi skapes for klinikk eller andre betalere?",
    },
    {
      title: "Åpent spørsmål · beta-læring",
      description:
        "Hva er minste reelle testreise og feedback-oppsett som gir læring uten tung analyse eller unødvendig samtalelagring?",
    },
    {
      title: "Hypotese · bruker-eid kontekst",
      description:
        "Hvor mye bedre blir relevansen når brukeren selv kan etablere og korrigere den viktigste situasjonskonteksten?",
    },
  ] satisfies ProjectStateItem[],
  nextActions: [
    {
      title: "1 · Form arkitekturvalget",
      description:
        "Fullfør den avgrensede arkitekturformingen og ta en eksplisitt Thomas-beslutning før eventuell implementering.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/384",
    },
    {
      title: "2 · Gå gjennom sikkerhets- og QA-portene",
      description:
        "Ved godkjent løsning: avgrens implementeringen, kjør sikkerhetsporten og deretter nøyaktig eier-QA før GO/NO-GO.",
    },
    {
      title: "3 · Fortsett kommersiell læring",
      description:
        "Fortsett klinikkverdi-, IN/DOGA- og prospect-validering parallelt uten å presentere hypoteser som fakta.",
    },
  ] satisfies ProjectStateItem[],
} as const;
