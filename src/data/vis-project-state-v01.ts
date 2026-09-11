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
    "ANLCKQm2NZqVO4dardrZtEbDl2gN1CbCs8VK9whKcOfbDVCUQ_rpftx8Ur57N9aGB9bAFn9Iw4Uy9YclpxGYlBI_f-4Jcgu2fzG0ZKqRX6o",
  brainLastMeaningfulUpdate: "2026-09-11",
  projectionUpdatedAt: "2026-09-11",
  projectionOwner: "Thomas",
  northStar:
    "Viddel skal være et lavterskel, ikke-klinisk mestrings-, forberedelses- og navigasjonslag for mennesker med svekket hørsel. Langsiktig bygger vi en norsk støtteplattform rundt hørsel: et felles kunnskaps- og navigasjonslag for personen med hørselsutfordringer og menneskene som hjelper rundt.",
  northStarContext:
    "Nærhet til norsk hverdag, støtteapparat og fagmiljø er en del av retningen.",
  strategicPrinciple: "Modellen leies. Relevansen læres.",
  strategicPrincipleMeaning:
    "Vi lytter, avklarer og lærer — og lar ny informasjon endre hjelpen.",
  phase:
    "Viddel har en fungerende prototype og en stabil Preview for intern og pre-beta testing. AI-hjelpen er blitt bedre, men videre hardening er bevisst parkert før limited-beta-beslutningen. Nå jobber vi parallelt med klinikkverdi, direkte brukerlæring og hvordan Viddel presenteres utad.",
  priorities: [
    {
      title: "Test klinikkverdien",
      description:
        "Finn ut hvilke konkrete problemer Viddel kan løse i klinikkens arbeidsflyt, hvem som opplever verdien, og om noen faktisk vil betale. Behandle betalingsvilje og effekt som hypoteser til vi har evidens.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/355",
    },
    {
      title: "Lær direkte fra brukere og Hørselsforbundet",
      description:
        "Fortsett kvalitative samtaler og feltlæring slik at produkt, innhold og research bygger på virkelige situasjoner. Hold researchintervju og produktbeta tydelig adskilt.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/415",
    },
    {
      title: "Gjør Viddel tydelig utad",
      description:
        "Sørg for at mennesker som møter Thomas, Vibeke eller Viddel på nett forstår det samme prosjektet: hva Viddel er nå, hva vi bygger og hva vi fortsatt prøver å lære.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/409",
    },
  ] satisfies ProjectStateItem[],
  latestDecisions: [
    {
      title: "AI-hardening er parkert med kjent gjeld",
      description:
        "#384 er god nok til at annet arbeid kan fortsette, men gjenværende kvalitet og #370 må vurderes igjen før #361 limited-beta GO/NO-GO.",
    },
    {
      title: "Viddel utad er et eget NOW-spor",
      description:
        "LinkedIn, offentlig web og partner-/introduksjonsmateriell kan utvikles parallelt med produktet så lenge påstandene er sanne mot faktisk state.",
    },
    {
      title: "Researchintervju er ikke produktbeta",
      description:
        "Direkte brukerlæring kan fortsette nå. Produktbeta krever fortsatt et eksplisitt #361 GO og separat opt-in.",
    },
  ] satisfies ProjectStateItem[],
  openQuestions: [
    {
      title: "Åpent spørsmål · betalende verdi",
      description:
        "Hvem har faktisk betalingsvilje, og hvilken dokumenterbar verdi skaper Viddel for klinikker eller andre betalere?",
    },
    {
      title: "Åpent spørsmål · beta-læring",
      description:
        "Hva må være godt nok før de første reelle produkttestene gir nyttig læring uten å bygge mer enn vi trenger?",
    },
    {
      title: "Hypotese · bruker-eid kontekst",
      description:
        "Blir hjelpen merkbart bedre når brukeren selv kan etablere og korrigere viktig informasjon om utstyr og situasjon?",
    },
  ] satisfies ProjectStateItem[],
  nextActions: [
    {
      title: "Test klinikkhypotesen videre",
      description:
        "Fortsett klinikkverdi, IN/DOGA, designpartner og prospect-samtaler uten å gjøre betalingsvilje eller klinikkeffekt til fakta før de er dokumentert.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/355",
    },
    {
      title: "Fortsett direkte brukerlæring og Viddel utad",
      description:
        "Følg opp #406/#415, HLF-intro #407 og External Presence #409/#410 som parallelle spor som ikke trenger å vente på AI-gatene.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/415",
    },
    {
      title: "La AI-hardening ligge til beta-gaten krever den",
      description:
        "Ikke gjenåpne #384/#370 automatisk. Gå tilbake til gjenværende evidens når #361 limited-beta GO/NO-GO faktisk skal tas, eller hvis ny QA viser at kvaliteten blokkerer nyttig bruk.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/361",
    },
  ] satisfies ProjectStateItem[],
} as const;
