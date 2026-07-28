# Viddel Concept Prototype — Current Best Answer v0.2

Status: Godkjent produktgrunnlag før layout og implementering  
Eier: Thomas  
Relatert GitHub-sak: #283  
Sist oppdatert: 2026-07-28

## 1. Dokumentets rolle

Dette dokumentet samler den godkjente kontrakten, informasjonsarkitekturen,
kjernebeskrivelsene og side-/statekartet for neste Viddel-prototype.

Det er **Current Best Answer (CBA)**: beste arbeidsgrunnlag med dagens innsikt,
ikke en permanent eller ferdig produktspesifikasjon. Ny innsikt kan føre til en
ny beslutning.

Dokumentet beslutter ikke layout, navigasjonsmønster, komponenter, tokens,
autentiseringsløsning, database eller produksjonsarkitektur.

## 2. Formål og ønsket respons

Prototypen skal gjøre den sammenhengende Viddel-idéen troverdig og engasjerende.

Den skal primært vise hvordan Viddel hjelper mennesker med voksen nedsatt hørsel
i hverdagen. Sekundært skal den vise hvordan aggregert og personvernvennlig
innsikt kan være relevant for Hørselsforbundet.

Hørselsforbundet omtales generelt, nasjonalt og regionalt. Prototypen skal ikke
bygges rundt eller henvende seg til ett bestemt lokallag.

Ønsket respons er at mottakeren:

- forstår helheten i tjenesten
- ser konkret verdi for brukere
- opplever retningen som relevant og troverdig
- ønsker å bidra til videre validering

## 3. Sannhetsgrense

Prototypen skal tydelig skille mellom:

### Fungerer i dag

- redaksjonelle artikler om voksen nedsatt hørsel
- artikkel og artikkelchat som én sammenhengende flate
- seed-spørsmål som bygger bro fra artikkeltema til egen situasjon
- frittstående Viddel-AI

Den fungerende tjenesten skal over tid dekke et overbevisende spenn av nyttige
temaer og spørsmål om voksen nedsatt hørsel. «Ingen eller svak lyd» er et
etablert eksempel, ikke hele produktløftet.

### Konsept som skal valideres

- innlogget Viddel
- lagret og gjenfinnbar samtalehistorikk
- videreføring av en tidligere samtale
- brukerstyrt status til audiograf
- aggregert innsikt for Hørselsforbundet

Konseptflater bruker syntetiske eksempeldata. Før produksjonsarkitektur er
besluttet skal de ikke love reell innlogging, lagring, deling eller analyse.

## 4. Overordnet informasjonsarkitektur

### A. Åpen Viddel

Brukeren får spesialisert hjelp om voksen nedsatt hørsel gjennom artikler,
artikkelchat og frittstående AI.

Åpen/uinnlogget tilgang er en senere tilgangshypotese. Den kan for eksempel
fungere som demonstrasjon eller begrenset prøvebruk. Registreringspunkt,
spørsmålsgrense og forretningsmodell er ikke besluttet.

### B. Innlogget Viddel

Innlogget state er hovedhypotesen for den fulle produktopplevelsen.

Brukeren kan:

- starte en ny samtale
- finne igjen tidligere samtaler
- fortsette i samme tråd
- åpne en artikkelsamtale igjen fra den ordinære samtaleoversikten

Samtalene er historikken. «Mine sider» og en separat historikkhendelse er ikke
egne områder i denne CBA-en.

### C. Min status til audiograf

Brukeren velger en periode. Viddel foreslår relevante temaer og statuspunkter
fra brukerens samtaler. Brukeren velger, redigerer og forhåndsviser hva som skal
tas med videre.

Brukeren eier innholdet og delingsbeslutningen. Løsningen skal ikke antyde
automatisk sending eller audiograftilgang.

### D. Innsikt for Hørselsforbundet

Dette er en separat konseptflate for aggregert, personvernvennlig innsikt.

Den skal synliggjøre:

- hva mennesker oftest trenger hjelp med
- hvor de fortsatt står fast
- hvilke problemer og behov som ikke fanges godt nok opp
- mulige forskjeller mellom brukernes hverdagserfaringer og fagmiljøets bilde

Hørselsforbundet er første og eneste organisatoriske mottaker i prototypen.
Audiografforbundet, klinikker, offentlig sektor og forskningsmiljøer er
framtidige interessent- og forretningshypoteser, ikke ekstra POC-flater.

## 5. Kjernebeskrivelser

### 1. Åpen Viddel — spesialisert hjelp om voksen nedsatt hørsel

**Behov:** Få forståelig og relevant hjelp når en hørselsrelatert situasjon
oppstår.

**Løfte:** Viddel gir rask, domenetilpasset veiledning og hjelper brukeren til
enten å løse problemet eller forstå neste forsvarlige handling.

**Nødvendig innhold:** Et troverdig artikkeltilbud, integrert artikkelchat og en
frittstående AI som kan håndtere et bredt spenn av relevante spørsmål.

### 2. Innlogget Viddel — finn, fortsett eller start en samtale

**Behov:** Slippe å begynne på nytt og kunne finne tilbake til en situasjon som
igjen er aktuell.

**Løfte:** Brukeren kan starte, finne igjen og fortsette samtaler.

**Sannhetsgrense:** Aktiv samtalekontekst bevares. Automatisk minne på tvers av
alle samtaler er ikke lovet.

### 3. Samtalen — forstå meg og hjelp meg videre

**Behov:** Bli forstått i egen situasjon og få et relevant, trygt og
handlingsrettet svar.

**Løfte:** Samme spesialiserte samtale kan starte fra en artikkel, fra den
frittstående AI-en eller ved at en tidligere tråd åpnes igjen.

**Ønsket utfall:** Brukeren opplever mer mestring og mindre usikkerhet, og vet
hva hun kan gjøre videre.

### 4. Min status til audiograf

**Behov:** Forklare utvikling, problemer, forsøk og behov til audiografen uten å
måtte rekonstruere alt i timen.

**Løfte:** Viddel foreslår en sammenfattet status fra en valgt periode, mens
brukeren kontrollerer, redigerer og godkjenner innholdet.

**Åpent spørsmål:** E-post, utskrift, PDF/dokument og mobilvisning er hypoteser.
Formatet skal valideres med både bruker og audiograf.

### 5. Innsikt for Hørselsforbundet

**Behov:** Forstå medlemmenes reelle hverdagserfaringer, udekkede behov og
friksjon bedre enn enkelthistorier og antakelser alene tillater.

**Løfte:** Viddel kan synliggjøre aggregerte behovssignaler og et mulig gap
mellom brukernes erfaringer og tjeneste-/fagmiljøets forståelse.

**Sannhetsgrense:** Syntetiske data i prototypen skal aldri framstilles som
dokumenterte funn. Innsiktsflaten skal ikke vise enkeltbrukere eller rå
samtaler.

## 6. Side- og statekart v0.1

Dette kartet beskriver funksjonelle flater og tilstander. Det er ikke en
beslutning om antall routes, navigasjon eller layout.

### Artikkel og artikkelchat

- Artikkel og chat oppleves som én enhet.
- Seed-spørsmål senker terskelen og leder fra tema til egen situasjon.
- Brukeren kan gå videre til fri dialog.
- For en innlogget bruker blir artikkelsamtalen tilgjengelig i den ordinære
  samtaleoversikten.
- Eksisterende produksjonsdesign og overgang beholdes i denne POC-runden.

### Innlogget samtaleområde

- samtaleoversikt i kronologisk rekkefølge
- tydelig inngang til ny samtale
- åpne en tidligere samtale
- fortsette i aktiv tråd med bevart trådkontekst
- tilgang til «Min status til audiograf»

### Min status til audiograf

- velg periode
- gjennomgå foreslåtte temaer og statuspunkter
- velg hva som skal tas med
- rediger innholdet
- forhåndsvis resultatet før eventuell eksport eller deling

### Innsikt for Hørselsforbundet

- overblikk over aggregerte behov og temaer
- synliggjøring av hvor brukere fortsatt står fast
- utforskning av perioden innsikten gjelder
- ingen tilgang til enkeltbrukere eller rå samtaler

## 7. Minimum som prototypen skal demonstrere

1. En bruker får relevant hjelp fra artikkel eller frittstående AI.
2. En innlogget bruker kan finne igjen og fortsette en samtale.
3. En artikkelsamtale inngår i den samme samtalehistorikken.
4. Brukeren kan lage og kontrollere en status til audiograf fra valgt periode.
5. Hørselsforbundet kan forstå potensialet i aggregert innsikt uten at
   prototypen later som data eller backend allerede finnes.

## 8. Ikke besluttet

- layout og navigasjonsmønster
- endelig visuell utforming
- komponent- og tokenendringer
- registreringspunkt og uinnlogget spørsmålsgrense
- autentisering, database og datamodell
- minne på tvers av samtaler
- eksport-/delingsformat til audiograf
- samtykke-, fullmakts- og personvernarkitektur
- analysepipeline og innsiktsmetodikk
- produksjonsklar organisasjonsflate

## 9. Neste designport

Neste steg er å beskrive og beslutte layout og komponentbehov for én flate om
gangen.

Arbeidsregel:

1. @rigger foreslår.
2. Thomas vurderer og beslutter.
3. Ingen UI-kode bygges før den aktuelle flaten er godkjent.
4. Eksisterende komponenter og tokens gjenbrukes der Thomas vurderer dem som
   gode nok.

Første anbefalte flate er innlogget samtaleområde: samtaleoversikt, ny samtale
og aktiv samtale. Dette er den nye broen mellom dagens fungerende Viddel og
konseptet som skal valideres.
