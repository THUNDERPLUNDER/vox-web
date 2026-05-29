# Contact Sheet Generator

Lite lokalt verktøy for å lage PNG-kontaktark fra Viddel-bilder, slik at editorial image QA kan gjøres med tydelig nummerering.

## Installer Pillow

Scriptet bruker Python og Pillow:

```bash
python3 -m pip install Pillow
```

## Kjør

```bash
python3 scripts/make_contact_sheet.py --input /path/to/folder --output /path/to/contact-sheets
```

Default:

- 4 kolonner
- 12 bilder per ark
- ett PNG-ark per input-mappe
- undermapper med bilder får egne kontaktark
- nummerering vises som `03 filnavn.webp`

## Eksempel

```bash
python3 scripts/make_contact_sheet.py \
  --input ~/Downloads/viddel_bedre_lyd_images \
  --output contact-sheets
```

Hvis en mappe har mer enn 12 bilder, lager scriptet automatisk flere ark:

```text
contact-sheets/root-contact-01.png
contact-sheets/root-contact-02.png
```

Hvis input-mappen har undermapper med bilder, får hver undermappe egne ark:

```text
contact-sheets/root-contact-01.png
contact-sheets/bedre-lyd-contact-01.png
contact-sheets/hjelp-contact-01.png
```

## Nyttige valg

```bash
python3 scripts/make_contact_sheet.py \
  --input ~/Downloads/images \
  --output contact-sheets \
  --columns 4 \
  --per-sheet 12
```

Ignorer undermapper:

```bash
python3 scripts/make_contact_sheet.py --input ~/Downloads/images --no-subfolders
```
