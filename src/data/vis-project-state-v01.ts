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
    "ANLCKQmBcAoTnKyFyEvU-Cj49KvnKJXkV9Mn5dZci0UsTlRBirzZVOl46sarKYOU9wNfTYMjxotFTSpvaT4w3ZgB3Q7aSuS10gr-bvEY0IY",
  brainLastMeaningfulUpdate: "2026-09-12",
  projectionUpdatedAt: "2026-09-12",
  projectionOwner: "Thomas",
  northStar:
    "Viddel skal være et lavterskel, ikke-klinisk mestrings-, forberedelses- og navigasjonslag for mennesker med svekket hørsel. Langsiktig bygger vi en norsk støtteplattform rundt hørsel: et felles kunnskaps- og navigasjonslag for personen med hørselsutfordringer og menneskene som hjelper rundt.",
  northStarContext:
    "Nærhet til norsk hverdag, støtteapparat og fagmiljø er en del av retningen.",
  strategicPrinciple: "Modellen leies. Relevansen læres.",
  strategicPrincipleMeaning:
    "Vi lytter, avklarer og lærer — og lar ny informasjon endre hjelpen.",
  phase:
    "Viddel har fått Oppstartstilskudd 1 fra Innovasjon Norge. Markedsklar-sporet er aktivert med NoA / Kristine Hoff som foretrukket designpartner, avhengig av endelig kapasitet og periode før samarbeidsavtale og DOGA-søknad. Parallelt tester vi klinikkverdi, lærer direkte fra brukere og Hørselsforbundet, og gjør Viddel tydeligere utad. Videre AI-hardening er bevisst parkert til #361 faktisk krever den.",
  priorities: [
    {
      title: "Få Markedsklar formelt på plass",
      description:
        "Bekreft kapasitet og periode med NoA / Kristine, signer samarbeidsavtalen og send DOGA-søknaden. Hold sprinten rettet mot kunde-, verdi- og betalingsusikkerhet, ikke generell produkt- eller UI-redesign.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/383",
    },
    {
      title: "Test klinikkverdien",
      description:
        "Finn ut hvilke konkrete problemer Viddel kan løse i klinikkens arbeidsflyt, hvem som opplever verdien, og om noen faktisk vil betale. Klinikkeffekt og betalingsvilje er fortsatt hypoteser.",
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
      title: "Oppstartstilskudd 1 er godkjent",
      description:
        "Finansieringen er ikke lenger en åpen ekstern gate. Den gir rom for avgrenset gjennomføring, men er ikke i seg selv grunn til å utvide MVP- eller arkitekturscope.",
    },
    {
      title: "NoA / Kristine er valgt for Markedsklar",
      description:
        "Viddel ønsker å gjennomføre Markedsklar med Kristine Hoff / NoA, med endelig kapasitet og periode som neste praktiske avklaring før avtale og DOGA-søknad.",
    },
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
  ] satisfies ProjectStateItem[],
  openQuestions: [
    {
      title: "Åpent spørsmål · betalende verdi",
      description:
        "Hvem har faktisk betalingsvilje, og hvilken dokumenterbar verdi skaper Viddel for klinikker eller andre betalere?",
    },
    {
      title: "Åpent spørsmål · klinikkflyt",
      description:
        "Kan en bedre forberedt bruker gi konkret operativ verdi i klinikken uten at vi antar tids- eller kapasitetsgevinst før det er undersøkt?",
    },
    {
      title: "Åpent spørsmål · beta-læring",
      description:
        "Hva må være godt nok før de første reelle produkttestene gir nyttig læring uten å bygge mer enn vi trenger?",
    },
  ] satisfies ProjectStateItem[],
  nextActions: [
    {
      title: "Fullfør Markedsklar-oppsettet",
      description:
        "Få NoA / Kristine kapasitet og periode bekreftet, signer samarbeidsavtalen og send DOGA-søknaden.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/383",
    },
    {
      title: "Fortsett klinikk- og prospectvalidering",
      description:
        "Bruk eksisterende relasjoner og prospectliste til å lære om arbeidsflyt, verdi og beslutning/payer uten å promotere betalingsvilje eller klinikkeffekt til fakta.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/355",
    },
    {
      title: "Fortsett direkte brukerlæring og Viddel utad",
      description:
        "Følg opp #406/#415, HLF-intro #407 og External Presence #409/#410 som parallelle spor som ikke trenger å vente på AI-gatene.",
      href: "https://github.com/THUNDERPLUNDER/vox-web/issues/415",
    },
  ] satisfies ProjectStateItem[],
} as const;
