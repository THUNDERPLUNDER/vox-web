/* CONTRACT: One-off Storyblok bootstrap for Publishing Slice 01 (components + stories + publish), idempotent by upsert. */
/**
 * Usage:
 *   STORYBLOK_SPACE_ID=12345 STORYBLOK_PERSONAL_TOKEN=xxx node scripts/storyblok-bootstrap-slice-01.mjs
 *
 * Required env:
 * - STORYBLOK_SPACE_ID
 * - STORYBLOK_PERSONAL_TOKEN or STORYBLOK_OAUTH_TOKEN
 *
 * Optional env:
 * - STORYBLOK_MANAGEMENT_BASE_URL (default: https://api.storyblok.com/v1)
 */

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_PERSONAL_TOKEN || process.env.STORYBLOK_OAUTH_TOKEN;
const BASE_URL = process.env.STORYBLOK_MANAGEMENT_BASE_URL || "https://api.storyblok.com/v1";

if (!SPACE_ID) {
  console.error("Missing env: STORYBLOK_SPACE_ID");
  process.exit(1);
}
if (!TOKEN) {
  console.error("Missing env: STORYBLOK_PERSONAL_TOKEN or STORYBLOK_OAUTH_TOKEN");
  process.exit(1);
}

const apiBase = `${BASE_URL}/spaces/${SPACE_ID}`;

async function sb(path, options = {}) {
  const { method = "GET", body } = options;
  const res = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} failed (${res.status}): ${text}`);
  }

  if (res.status === 204) return null;
  return await res.json();
}

function textField(pos) {
  return { type: "text", pos };
}
function textareaField(pos) {
  return { type: "textarea", pos };
}
function optionField(pos, options = []) {
  return { type: "option", pos, options };
}
function bloksField(pos, componentWhitelist = []) {
  return {
    type: "bloks",
    pos,
    restrict_components: componentWhitelist.length > 0,
    component_whitelist: componentWhitelist,
  };
}
function linkField(pos) {
  return { type: "text", pos };
}
function booleanField(pos) {
  return { type: "boolean", pos };
}

const componentSpecs = [
  {
    name: "hub_page",
    display_name: "Hub Page",
    is_root: true,
    is_nestable: false,
    schema: {
      title: textField(0),
      slug: textField(1),
      kjerne: textareaField(2),
      intro: textareaField(3),
      help_points: { type: "list", pos: 4 },
      primary_cta_label: textField(5),
      primary_cta_target: linkField(6),
      secondary_links: bloksField(7, ["related_link"]),
      trust_note: textareaField(8),
      status: optionField(9, [
        { name: "draft", value: "draft" },
        { name: "ready", value: "ready" },
        { name: "published", value: "published" },
      ]),
    },
  },
  {
    name: "article_page",
    display_name: "Article Page",
    is_root: true,
    is_nestable: false,
    schema: {
      title: textField(0),
      slug: textField(1),
      category_label: textField(2),
      parent_hub: textField(3),
      ingress: textareaField(4),
      sections: bloksField(5, ["article_section"]),
      module_blocks: bloksField(6, [
        "module_observation_box",
        "module_friction_box",
        "module_phrase_cards",
        "module_response_block",
        "module_reassurance_block",
        "related_link",
      ]),
      next_steps: { type: "list", pos: 7 },
      author_name: textField(8),
      author_role: textField(9),
      reviewer_name: textField(10),
      reviewer_role: textField(11),
      updated_at: textField(12),
      ai_note: textareaField(13),
      method_note: textareaField(14),
      status: optionField(15, [
        { name: "draft", value: "draft" },
        { name: "ready", value: "ready" },
        { name: "published", value: "published" },
      ]),
    },
  },
  {
    name: "ai_seed_question",
    display_name: "AI Seed Question",
    is_root: true,
    is_nestable: false,
    schema: {
      question: textareaField(0),
      short_answer: textareaField(1),
      followup_question: textareaField(2),
      related_article: textField(3),
      status: optionField(4, [
        { name: "draft", value: "draft" },
        { name: "ready", value: "ready" },
        { name: "published", value: "published" },
      ]),
    },
  },
  {
    name: "article_section",
    display_name: "Article Section",
    is_root: false,
    is_nestable: true,
    schema: {
      heading: textField(0),
      body: textareaField(1),
    },
  },
  {
    name: "module_observation_box",
    display_name: "Module Observation Box",
    is_root: false,
    is_nestable: true,
    schema: {
      title: textField(0),
      body: textareaField(1),
      points: { type: "list", pos: 2 },
    },
  },
  {
    name: "module_friction_box",
    display_name: "Module Friction Box",
    is_root: false,
    is_nestable: true,
    schema: {
      title: textField(0),
      body: textareaField(1),
      points: { type: "list", pos: 2 },
    },
  },
  {
    name: "module_phrase_cards",
    display_name: "Module Phrase Cards",
    is_root: false,
    is_nestable: true,
    schema: {
      title: textField(0),
      cards: { type: "list", pos: 1 },
    },
  },
  {
    name: "module_response_block",
    display_name: "Module Response Block",
    is_root: false,
    is_nestable: true,
    schema: {
      title: textField(0),
      body: textareaField(1),
      points: { type: "list", pos: 2 },
    },
  },
  {
    name: "module_reassurance_block",
    display_name: "Module Reassurance Block",
    is_root: false,
    is_nestable: true,
    schema: {
      title: textField(0),
      body: textareaField(1),
      points: { type: "list", pos: 2 },
    },
  },
  {
    name: "related_link",
    display_name: "Related Link",
    is_root: false,
    is_nestable: true,
    schema: {
      label: textField(0),
      href: linkField(1),
      coming_soon: booleanField(2),
    },
  },
];

const hubStory = {
  name: "Når du tror noen du er glad i hører dårlig",
  slug: "hub",
  content: {
    component: "hub_page",
    title: "Når du tror noen du er glad i hører dårlig",
    slug: "hub",
    kjerne: "Et rolig utgangspunkt for den første praten.",
    intro:
      "Denne huben samler første publiserte innholdspakke for hvordan man kan starte en vanskelig samtale på en trygg og respektfull måte.",
    help_points: [
      "Hvordan ta opp temaet uten å trigge motstand.",
      "Setninger du kan bruke i praksis.",
      "Hva du gjør når praten låser seg.",
      "Neste steg hvis dere trenger støtte.",
    ],
    primary_cta_label: "Les: Slik tar du praten",
    primary_cta_target: "/no/artikkel/slik-tar-du-praten",
    secondary_links: [
      {
        component: "related_link",
        label: "Hva gjør du når svaret er nei?",
        href: "/no/artikkel/hva-gjor-du-nar-svaret-er-nei",
        coming_soon: true,
      },
      {
        component: "related_link",
        label: "Slik følger du opp etterpå",
        href: "/no/artikkel/slik-folger-du-opp",
        coming_soon: true,
      },
    ],
    trust_note:
      "Innholdet er laget som en første praktisk versjon for live-test, og oppdateres fortløpende etter innsikt.",
    status: "published",
  },
};

const articleStory = {
  name: "Slik tar du praten",
  slug: "slik-tar-du-praten",
  content: {
    component: "article_page",
    title: "Slik tar du praten",
    slug: "slik-tar-du-praten",
    category_label: "Samtaleguide",
    parent_hub: "hub",
    ingress:
      "Når du er bekymret for hørselen til noen du er glad i, er timingen og tonen avgjørende. Her er en enkel struktur som gjør praten lettere å starte.",
    sections: [
      {
        component: "article_section",
        heading: "Start med omsorg, ikke diagnose",
        body: "Snakk om hva du ser i hverdagen, ikke hva du mener de 'har'. Fokuser på situasjoner der det blir slitsomt eller frustrerende.",
      },
      {
        component: "article_section",
        heading: "Velg riktig øyeblikk",
        body: "Ta praten når dere begge har tid og ro. Unngå å ta det opp midt i en konflikt eller i en setting med andre til stede.",
      },
      {
        component: "article_section",
        heading: "Gjør det til et samarbeid",
        body: "Bruk 'vi'-språk: Hva kan vi teste? Hvordan kan vi gjøre hverdagen enklere sammen?",
      },
    ],
    module_blocks: [
      {
        component: "module_observation_box",
        title: "Observasjon",
        body: "Typiske signaler som kan være verdt å snakke om:",
        points: [
          "Mange misforståelser i samtaler.",
          "TV-volumet blir stadig høyere.",
          "Sosiale settinger blir oftere unngått.",
        ],
      },
      {
        component: "module_friction_box",
        title: "Vanlige friksjoner",
        body: "Dette gjør praten vanskelig:",
        points: [
          "Temaet føles skambelagt.",
          "Begge parter blir fort defensive.",
          "Man mangler konkrete ord i øyeblikket.",
        ],
      },
      {
        component: "module_phrase_cards",
        title: "Setninger du kan bruke",
        cards: [
          "Jeg sier dette fordi jeg bryr meg om deg.",
          "Jeg ser at noen situasjoner tapper deg mer enn før.",
          "Kan vi teste noen små grep sammen?",
          "Vi trenger ikke løse alt nå.",
        ],
      },
      {
        component: "module_response_block",
        title: "Hvis du møter motstand",
        body: "Målet er å bevare relasjonen, ikke vinne diskusjonen.",
        points: [
          "Bekreft følelsen: 'Jeg skjønner at dette er vanskelig å snakke om.'",
          "Gå tilbake til omsorg: 'Jeg vil bare at du skal ha det lettere i hverdagen.'",
          "Foreslå et lite neste steg i stedet for stor beslutning.",
        ],
      },
      {
        component: "module_reassurance_block",
        title: "Trygghet i prosessen",
        body: "Små steg er ofte nok i starten. En god første prat kan være viktigere enn en perfekt plan.",
        points: ["Du gjør allerede noe viktig ved å ta temaet på alvor."],
      },
      {
        component: "related_link",
        label: "Til hub: første støttepakke",
        href: "/no/hub",
        coming_soon: false,
      },
    ],
    next_steps: [
      "Velg én situasjon dere vil gjøre lettere denne uken.",
      "Bli enige om én setning dere kan bruke når det blir vanskelig.",
      "Vurder om dere vil utforske mer støtte sammen.",
    ],
    author_name: "KlarLyd Redaksjon",
    author_role: "Innholdsutvikling",
    reviewer_name: "Faglig rådgiver",
    reviewer_role: "Hørsel og kommunikasjon",
    updated_at: "2026-04-15",
    ai_note: "Denne artikkelen er redigert av mennesker og støttet av AI i idéfasen.",
    method_note: "Bygger på praktiske samtalemønstre, observasjoner og iterativ forbedring.",
    status: "published",
  },
};

const seedStories = [
  {
    name: "Seed 01: starte praten",
    slug: "seed-starte-praten",
    content: {
      component: "ai_seed_question",
      question: "Hvordan kan jeg ta opp hørsel på en måte som ikke føles kritisk?",
      short_answer: "Start med omsorg og konkrete hverdagssituasjoner i stedet for diagnoser.",
      followup_question: "Kan du gi meg tre formuleringer jeg kan bruke ordrett?",
      related_article: "slik-tar-du-praten",
      status: "published",
    },
  },
  {
    name: "Seed 02: møte motstand",
    slug: "seed-mote-motstand",
    content: {
      component: "ai_seed_question",
      question: "Hva gjør jeg når personen blir irritert og avviser hele temaet?",
      short_answer: "Bekreft følelsen, senk tempoet og foreslå et mindre neste steg.",
      followup_question: "Hvordan kan jeg svare rolig i selve øyeblikket?",
      related_article: "slik-tar-du-praten",
      status: "published",
    },
  },
  {
    name: "Seed 03: timing",
    slug: "seed-riktig-timing",
    content: {
      component: "ai_seed_question",
      question: "Når er riktig tidspunkt å ta en slik samtale?",
      short_answer: "Velg et rolig tidspunkt uten publikum, stress eller tidspress.",
      followup_question: "Hvilke situasjoner bør jeg unngå?",
      related_article: "slik-tar-du-praten",
      status: "published",
    },
  },
  {
    name: "Seed 04: konkrete setninger",
    slug: "seed-konkrete-setninger",
    content: {
      component: "ai_seed_question",
      question: "Kan du gi meg forslag til setninger som høres varme og tydelige ut?",
      short_answer: "Ja, bruk korte formuleringer med 'jeg bryr meg' og 'kan vi teste sammen'.",
      followup_question: "Kan du tilpasse setningene til ektefelle/barn/venn?",
      related_article: "slik-tar-du-praten",
      status: "published",
    },
  },
  {
    name: "Seed 05: neste steg",
    slug: "seed-neste-steg",
    content: {
      component: "ai_seed_question",
      question: "Hva er et realistisk neste steg etter den første praten?",
      short_answer: "Bli enige om ett lite tiltak dere kan prøve i hverdagen først.",
      followup_question: "Kan du hjelpe oss velge ett tiltak basert på vår situasjon?",
      related_article: "slik-tar-du-praten",
      status: "published",
    },
  },
];

async function listAllComponents() {
  const data = await sb("/components");
  return Array.isArray(data?.components) ? data.components : [];
}

async function upsertComponent(spec, existingMap) {
  const existing = existingMap.get(spec.name);
  const payload = {
    component: {
      name: spec.name,
      display_name: spec.display_name,
      is_root: spec.is_root,
      is_nestable: spec.is_nestable,
      schema: spec.schema,
    },
  };

  if (existing?.id) {
    await sb(`/components/${existing.id}`, { method: "PUT", body: payload });
    return { action: "updated", name: spec.name, id: existing.id };
  }

  const created = await sb("/components", { method: "POST", body: payload });
  return { action: "created", name: spec.name, id: created?.component?.id };
}

async function listAllStories() {
  const stories = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const data = await sb(`/stories?page=${page}&per_page=${perPage}`);
    const batch = Array.isArray(data?.stories) ? data.stories : [];
    stories.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }

  return stories;
}

async function upsertStory(storySpec, existingMap) {
  const existing = existingMap.get(storySpec.slug);
  const payload = {
    story: {
      name: storySpec.name,
      slug: storySpec.slug,
      content: storySpec.content,
      is_startpage: false,
    },
  };

  if (existing?.id) {
    const updated = await sb(`/stories/${existing.id}`, { method: "PUT", body: payload });
    return { action: "updated", id: existing.id, story: updated?.story };
  }

  const created = await sb("/stories", { method: "POST", body: payload });
  return { action: "created", id: created?.story?.id, story: created?.story };
}

async function publishStoryById(storyId) {
  await sb(`/stories/${storyId}/publish`, { method: "GET" });
}

async function main() {
  console.log(`Storyblok Slice 01 bootstrap for space ${SPACE_ID}`);
  console.log(`Using API base: ${BASE_URL}`);

  const componentResults = [];
  const existingComponents = await listAllComponents();
  const componentMap = new Map(existingComponents.map((c) => [c.name, c]));
  for (const spec of componentSpecs) {
    const result = await upsertComponent(spec, componentMap);
    componentResults.push(result);
  }

  const storySpecs = [hubStory, articleStory, ...seedStories];
  const existingStories = await listAllStories();
  const storyMap = new Map(existingStories.map((s) => [s.slug, s]));
  const storyResults = [];

  for (const spec of storySpecs) {
    const result = await upsertStory(spec, storyMap);
    storyResults.push(result);
    if (result.id) {
      await publishStoryById(result.id);
    }
  }

  console.log("\nComponents:");
  for (const r of componentResults) {
    console.log(`- ${r.action.toUpperCase()}: ${r.name} (id: ${r.id ?? "n/a"})`);
  }

  console.log("\nStories:");
  for (const r of storyResults) {
    const slug = r.story?.slug || "unknown";
    console.log(`- ${r.action.toUpperCase()}: ${slug} (id: ${r.id ?? "n/a"}) + published`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nBootstrap failed:", err.message);
  process.exit(1);
});
