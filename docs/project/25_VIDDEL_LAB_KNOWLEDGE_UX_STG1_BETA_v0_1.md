# Viddel LAB Knowledge UX — STG-1 BETA v0.1

Dato: 2026-08-25  
Omfang: LAB-only, ingen produksjonsendring

## Formål

Teste om brukeren kan velge riktig produsent og modellfamilie for situasjonen «ingen vanlig lyd», og om forskjellen mellom kildekontrollert og ikke punktkontrollert BETA er forståelig.

## Mikrobatch

| Claim | Modellomfang | Kontrollnivå | Synlig merking |
| --- | --- | --- | --- |
| CLM-SIT-001-OTI-001 | Oticon Intent 1–4 miniRITE | V3_EDITORIAL_APPROVED | Beta · kildekontrollert |
| CLM-SIT-001-PHO-001 | Phonak Audéo I-R / I-R Trial, I90–I30 | V1_SCOPE_CONFIRMED | Beta · ikke punktkontrollert |
| CLM-SIT-001-RES-001 | ReSound Nexia oppladbar RIE | V1_SCOPE_CONFIRMED | Beta · ikke punktkontrollert |

## Kildeavklaringer

- SRC-019 er en innholdsekvivalent kuratert kopi av SRC-008, støttet av lik størrelse, opprettelsestid og dokumentsignatur `276032US / 2024.05.24 / v1`. Byte-identitet er ikke hevdet.
- SRC-022 er en innholdsekvivalent kuratert kopi av SRC-012. Filnavnets «2026» er et samlingsnavn; manualens egen signatur er `029-1357-02/V1.00/2024-03`.
- SRC-025 er en egen ReSound Nexia-manual med signatur `402639011US/CA/VA 26.01 Rev. C`, utgitt 2026-01-01. Filnavnets «2024» er ikke versjonsfakta, og filen er ikke samme manual som SRC-016.

## Guardrails

- BETA og verifikasjonsstatus vises separat.
- V1-svarene sier eksplisitt at manualens ekthet og omfang er kontrollert, men at svarteksten ikke er punktkontrollert.
- Alle svar viser modellomfang, kilde, lokator, claim-ID og stoppunkt.
- Mobil-/TV-streaming ligger utenfor batchen.
- Ingen diagnose, behandling eller irreversible handlinger inngår.

## Verifikasjon

- Kilderegister, claim-register, stagingplan og endringslogg er oppdatert i `VDL_SOURCE_FITNESS_REVIEW_LAB_v0.1`.
- Byggvakten krever alle tre claim-ID-er og begge BETA-merkene.
- Neste kontroll er runtime-verifikasjon av produsentvalg, mobilvisning, kildevisning og restart etter preview-deploy.
