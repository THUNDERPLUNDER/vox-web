# Decision — Public root and contact CBA v0.1

Status: **CBA locked / production verified**  
Date: 2026-08-03  
Route: `/`  
Domain: `https://www.viddel.no/`  
Related: PR #302, Oppstartstilskudd 1 application submitted 2026-07-31

## Kort beslutning

`viddel.no` skal møte eksterne besøkende med en kort offentlig presentasjon av Viddel, ikke sende dem direkte til produkt-MVP-en under `/no/`.

Rotforsiden skal være en rolig selskapsflate med godkjent Viddel-wordmark, overskriften **«Hjelp med lyd i hverdagen»**, en kort beskrivelse av arbeidet og kontaktpunktet `kontakt@viddel.no`.

Produkt-MVP-en under `/no/` beholdes uendret og er ikke lenket fra rotforsiden.

---

## Bakgrunn

`viddel.no` var oppgitt i søknaden til Innovasjon Norge. En saksbehandler eller annen ekstern besøkende kunne derfor møte en uferdig produktflate som ga et mer detaljert og mer avklart inntrykk enn prosjektstatusen tilsa.

Før denne beslutningen redirectet `/` til `/no/`. Det blandet to ulike formål:

- `/` som offentlig presentasjon av Viddel AS
- `/no/` som aktiv produkt-MVP og intern testflate

Rotforsiden ble publisert 2026-08-03 og kontrollert på produksjonsdomenet etter Vercel-deploy.

---

## Sidekontrakt for `/`

| Element | Beslutning |
|---|---|
| Merkevare | Viddel-wordmark øverst |
| H1 | `Hjelp med lyd i hverdagen` |
| Formål | Kort forklare hva Viddel arbeider med |
| Status | Førsteversjon og brukertesting omtales nøkternt |
| Kontakt | `Spørsmål? Skriv til kontakt@viddel.no.` |
| Navigasjon | Ingen produktnavigasjon eller lenke til `/no/` |
| Produktfunksjoner | Ingen CES, chat, innlogging eller utviklerverktøy |
| Indeksering | `index,follow`, canonical `https://www.viddel.no/` |

### Språkføring

- Merkevaren skal ikke gjentas unødvendig i overskriften når wordmarken allerede er synlig.
- Ikke bruk «under utvikling» som etikett.
- Unngå generiske AI-formuleringer om trygghet og forenklede steg, samt vag copy om at brukeren skal «forstå hva som skjer».
- Beskriv konkret hva tjenesten samler og forklarer; effekt skal vises gjennom innhold og produkt, ikke forsikres i slagord.
- Rotforsiden skal ikke låse Viddel til en bestemt klinikkflyt eller betalerhypotese.

---

## Kontaktpunkt og e-postflyt

`kontakt@viddel.no` er en Google Workspace-gruppe og felles inngang for Thomas og Vibeke.

| Punkt | Gjeldende oppsett |
|---|---|
| Mottak | Google Workspace / Google Groups |
| Gruppeadresse | `kontakt@viddel.no` |
| Eksterne avsendere | Tillatt |
| Medlemskap | Invitert / administrert, ikke offentlig medlemsliste |
| MX | Google (`smtp.google.com`) |
| SPF | `v=spf1 include:_spf.google.com ~all` |
| DKIM | Aktivert med selector `google` |
| DMARC | `v=DMARC1; p=reject` |

### Operativ regel for e-post

- Google Workspace er eneste godkjente avsenderplattform i dagens oppsett.
- Nye systemer som skal sende som `@viddel.no`, må få SPF- og/eller DKIM-oppsett før de tas i bruk.
- Det skal ikke opprettes en ny betalt innboks når gruppealiaset dekker behovet.
- Ved leveringsfeil kontrolleres SPF, DKIM og DMARC før gruppetilgang endres.
- Etter DNS- eller leverandørendringer testes en ny melding mot en ekstern mottaker. Mottakerdetaljene skal vise `mailed-by: viddel.no` og `signed-by: viddel.no` når DKIM er slått gjennom.

---

## Implementasjon og verifikasjon

| Kontroll | Resultat |
|---|---|
| `/` redirecter ikke til `/no/` | Verifisert |
| Apex `viddel.no` peker til `www.viddel.no` | Verifisert, HTTP 307 |
| `https://www.viddel.no/` svarer | Verifisert, HTTP 200 |
| Synlig H1 | `Hjelp med lyd i hverdagen` |
| Kontaktlenke | `mailto:kontakt@viddel.no` |
| Vercel production deploy | Success, merge commit `0f09562a` |
| Gruppelevering | Verifisert til gruppemedlemmene |
| SPF | Offentlig DNS-verifisert |
| DKIM | Offentlig DNS-verifisert og aktivert i Google Admin |
| DMARC | Beholdt på `p=reject` etter vellykket SPF-test |

---

## Avgrensninger

- Ingen endring i `/no/` eller øvrige produktruter.
- Ingen ny produkt-IA, funksjonalitet eller kommersiell hypotese.
- Ingen eksponering av interne flater fra rotforsiden.
- Ingen kontaktskjema, CRM-integrasjon eller ny e-postlisens.
- CBA-en dokumenterer gjeldende produksjonsbeslutning; den er ikke en full merkevare- eller kommunikasjonsstrategi.

---

## Forholdet til tidligere beslutning

`DECISION_125J_COPY_NAV_ROUTES_CBA.md` beskrev domeneflytt til `viddel.no` som et senere arbeidspunkt. Dette punktet er nå gjennomført for rotforsiden og canonical på `/`.

Den tidligere beslutningen gjelder fortsatt for produkt-IA og rutene under `/no/`.

---

## Arbeidsregel

Bruk denne CBA-en som gjeldende kontrakt for offentlig rotforside og kontaktpunkt til et nytt eksplisitt mandat erstatter den.

Endringer i rotforsidens formål, eksponering av `/no/`, kontaktmodell eller e-postleverandør skal vurderes som en ny beslutning, ikke som en umerket tekstrettelse.
