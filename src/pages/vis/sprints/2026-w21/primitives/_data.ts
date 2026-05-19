/* CONTRACT: Local VIS-only data model for the #124 Primitives Lab catalog.
   Contains candidate primitive content only; no production token implementation.
*/

export const primitiveBase = "/vis/sprints/2026-w21/primitives";

export const guardrails = [
  "VIS-only decision support",
  "No production pages",
  "No global token implementation",
  "No Storyblok schema changes",
  "No #125 MVP reskin",
  "Magenta = high-character / low-quantity",
  "Glass = chrome/material, not editorial default",
  "Editorial = light, clean and readable",
];

export const statusLabels = {
  notStarted: "Not started",
  candidate: "Candidate",
  favorite: "Favorite exists",
  needsReview: "Needs review",
  recommended: "Recommended direction exists",
  parked: "Parked",
} as const;

export const navItems = [
  { slug: "surfaces", title: "Surfaces" },
  { slug: "radius", title: "Radius" },
  { slug: "strokes", title: "Strokes" },
  { slug: "elevation", title: "Elevation" },
  { slug: "layering", title: "Layering" },
  { slug: "buttons", title: "Buttons" },
  { slug: "cards", title: "Cards" },
  { slug: "inputs", title: "Inputs" },
  { slug: "pills", title: "Pills" },
  { slug: "focus", title: "Focus" },
  { slug: "glass", title: "Glass" },
  { slug: "signals", title: "Signals" },
  { slug: "ai-action", title: "AI / action" },
] as const;

type IterationStatus = "Favorite" | "Candidate" | "Parked" | "Rejected" | "Open slot";
type PageStatus = keyof typeof statusLabels;

export type PrimitivePage = {
  slug: string;
  title: string;
  status: PageStatus;
  purpose: string;
  does: string;
  applies: {
    chrome: string;
    editorial: string;
    action: string;
  };
  favorite?: {
    name: string;
    note: string;
    sample: string;
  };
  favoriteStack?: {
    label: string;
    value: string;
    tone: string;
  }[];
  surfaceRoles?: {
    title: string;
    role: string;
    candidate: string;
    tone: string;
  }[];
  surfaceCandidates?: {
    id: string;
    title: string;
    status: "Recommended" | "Candidate" | "Parked";
    copy: string;
    pros: string[];
    risks: string[];
    sample: string;
  }[];
  dependencies?: {
    title: string;
    note: string;
  }[];
  suggestedScale?: string[];
  tokenNote?: string;
  iterations: {
    id: "P1" | "P2" | "P3" | "P4";
    status: IterationStatus;
    name: string;
    sample: string;
    copy: string;
    rationale: string;
  }[];
  do: string[];
  dont: string[];
  questions: string[];
  extra?: "buttons";
};

const signalAllowed = ["Small dots", "Ghost halo", "Micro audio bars in small quantity", "Edge/detail"];
const signalNotAllowed = ["Large pink fills", "Long structural pink layout lines", "Decorative pink gradient as main move"];

const defaultIterations: PrimitivePage["iterations"] = [
  {
    id: "P1",
    status: "Candidate",
    name: "Baseline",
    sample: "neutral-card",
    copy: "Simple baseline carried over from the first lab.",
    rationale: "Kept as a comparison point, not as a final decision.",
  },
  {
    id: "P2",
    status: "Candidate",
    name: "Deep identity",
    sample: "deep-card",
    copy: "Introduces Deep Nordic Blue where identity or action needs depth.",
    rationale: "Worth reviewing across real content and responsive states.",
  },
  {
    id: "P3",
    status: "Parked",
    name: "Signal-led",
    sample: "signal-card",
    copy: "Tests a stronger kinetic signal treatment.",
    rationale: "Parked unless the signal remains clearly low-quantity.",
  },
  {
    id: "P4",
    status: "Rejected",
    name: "Decorative",
    sample: "rejected-card",
    copy: "Uses color as decoration rather than product meaning.",
    rationale: "Rejected for now because it weakens restraint and readability.",
  },
];

export const primitivePages: PrimitivePage[] = [
  {
    slug: "surfaces",
    title: "Surfaces",
    status: "recommended",
    purpose: "Define a usable Viddel MVP surface hierarchy before #125.",
    does: "Surface primitives define where content lives: clean editorial base, subtle elevated help, Deep Nordic identity/action, ink contrast, chrome glass and low-quantity signal details.",
    applies: {
      chrome: "Glass/solid orientation surfaces for nav, toolbar and orientation chips.",
      editorial: "Light, clean, readable surfaces are the default for articles, explanations and help.",
      action: "Deep Nordic Blue or ink can carry controlled action areas when the next step needs contrast.",
    },
    favorite: {
      name: "Light editorial + Deep Nordic identity/action + ink highest contrast",
      note: "Recommended direction: keep reading/help light, use #134D6A for identity depth and controlled action areas, reserve ink for highest contrast, and keep #FF55B0 as micro-signal only. Glass remains chrome/material.",
      sample: "surface-stack",
    },
    favoriteStack: [
      { label: "Editorial base", value: "#FFFFFF / #F8FAFC", tone: "light" },
      { label: "Elevated editorial", value: "#F3F4F6", tone: "elevated" },
      { label: "Deep identity/action", value: "#134D6A", tone: "deep" },
      { label: "Ink highest contrast", value: "#111827 / #020617 / #18181B", tone: "ink" },
      { label: "Magenta signal detail", value: "#FF55B0 low opacity", tone: "signal" },
      { label: "Glass chrome note", value: "chrome/material only", tone: "glass" },
    ],
    surfaceRoles: [
      {
        title: "Editorial base",
        role: "Light, clean reading/help surface. Default for articles, explanations and help.",
        candidate: "#FFFFFF / #F8FAFC",
        tone: "light",
      },
      {
        title: "Elevated editorial surface",
        role: "Cards, boxes, hub elements and helper blocks. Subtle, not heavy card UI.",
        candidate: "#F3F4F6 / #F8FAFC",
        tone: "elevated",
      },
      {
        title: "Deep Nordic Blue identity surface",
        role: "Identity, depth, orientation and controlled dark action fields.",
        candidate: "#134D6A",
        tone: "deep",
      },
      {
        title: "Ink / near-black action surface",
        role: "Primary action, highest contrast and dark panels where clarity matters.",
        candidate: "#111827 / #020617 / #18181B",
        tone: "ink",
      },
      {
        title: "Glass chrome surface",
        role: "Chrome/material for nav, toolbar and orientation chips. Not editorial content default.",
        candidate: "rgba + blur + solid fallback",
        tone: "glass",
      },
      {
        title: "Signal / ghost surface",
        role: "Kinetic Magenta as micro-signal only. Not large fill, not layout surface.",
        candidate: "#FF55B0 low opacity",
        tone: "signal",
      },
    ],
    surfaceCandidates: [
      {
        id: "A",
        title: "Light editorial + Deep Nordic Blue identity/action",
        status: "Recommended",
        copy: "Light editorial surfaces stay default while #134D6A carries identity, orientation and controlled action fields.",
        pros: ["Clear Viddel identity", "Keeps reading/help calm", "Lets AI/action feel connected but stronger"],
        risks: ["Deep blue can become too dominant if used as broad layout fill", "Needs strong text contrast on dark fields"],
        sample: "surface-candidate-a",
      },
      {
        id: "B",
        title: "Light editorial + Ink action + Blue identity support",
        status: "Candidate",
        copy: "Ink carries most action surfaces, while Deep Nordic Blue supports identity and orientation.",
        pros: ["Very clear action contrast", "Restrained and UI-safe", "Blue can stay more premium/identity-led"],
        risks: ["May feel less ownable", "AI/action may become too monochrome if blue is only secondary"],
        sample: "surface-candidate-b",
      },
      {
        id: "C",
        title: "Light editorial + Deep Blue action + Ink only for highest contrast",
        status: "Candidate",
        copy: "Deep Nordic Blue becomes the primary action surface, with ink reserved for highest-contrast moments.",
        pros: ["Distinct, warmer than pure ink", "Strong bridge from identity to action", "Good fit for dark AI transition blocks"],
        risks: ["Needs careful CTA hierarchy", "Can blur identity/action if every action turns blue"],
        sample: "surface-candidate-c",
      },
    ],
    dependencies: [
      {
        title: "Elevation / shadow dependency",
        note: "Surface hierarchy must work before depth is added.",
      },
      {
        title: "Layering / z-index dependency",
        note: "Glass, sticky chrome and overlays must respect semantic layers.",
      },
      {
        title: "Buttons dependency",
        note: "Button hierarchy should inherit surface roles, not invent new color logic.",
      },
    ],
    iterations: [
      {
        id: "P1",
        status: "Favorite",
        name: "Recommended surface stack",
        sample: "surface-stack",
        copy: "Light editorial base with Deep Nordic Blue identity/action, ink for highest contrast, glass limited to chrome, and magenta micro-signal.",
        rationale: "Recommended because it preserves reading clarity while giving Viddel a distinct identity/action surface.",
      },
      {
        id: "P2",
        status: "Candidate",
        name: "Ink-led action",
        sample: "surface-candidate-b",
        copy: "Light editorial with ink action and Deep Nordic Blue as identity support.",
        rationale: "Kept for comparison because ink is clear, but may feel less Viddel-specific.",
      },
      {
        id: "P3",
        status: "Candidate",
        name: "Deep-blue-led action",
        sample: "surface-candidate-c",
        copy: "Light editorial with Deep Nordic Blue as the stronger action surface and ink reserved for highest contrast.",
        rationale: "Promising for AI/action contexts but needs careful button/card hierarchy.",
      },
      {
        id: "P4",
        status: "Parked",
        name: "Magenta surface",
        sample: "surface-signal",
        copy: "Magenta as a larger surface or tint.",
        rationale: "Parked because #FF55B0 should remain ghost/signal/micro-detail, not a layout surface.",
      },
    ],
    do: [
      "Keep editorial/help surfaces light and readable.",
      "Use Deep Nordic Blue for identity depth and controlled action areas.",
      "Use ink/near-black for high contrast where needed.",
      "Keep glass limited to chrome/material.",
      "Use magenta only as ghost/signal/micro-detail.",
      "Pair dark surfaces with clear text contrast.",
    ],
    dont: [
      "Make all cards elevated.",
      "Use magenta as large surface fill.",
      "Use glass as default article/card material.",
      "Make editorial layer dark.",
      "Let action panels feel detached from content.",
      "Use shadow/elevation to compensate for unclear surface hierarchy.",
    ],
    questions: [
      "Should Deep Nordic Blue or Ink carry primary action surfaces?",
      "How elevated should hub/editorial cards be?",
      "Where does AI/action transition from editorial surface to dark/action surface?",
      "How much glass can chrome use before it distracts?",
      "Does #125 need separate article, hub and AI surface examples?",
    ],
  },
  {
    slug: "radius",
    title: "Radius",
    status: "candidate",
    purpose: "Create a practical corner scale from sharp structure to pill controls.",
    does: "Radius primitives make buttons, cards and chrome feel consistent while allowing larger hero/action primitives to be softer.",
    applies: {
      chrome: "Medium to large radius for glass bars and toolbars.",
      editorial: "Small to medium radius for cards and helper boxes.",
      action: "Large and pill radius for CTA and prompt controls.",
    },
    favorite: {
      name: "Small / medium / large / pill",
      note: "A simple scale is enough for v0.1; exact px values need review.",
      sample: "radius-favorite",
    },
    iterations: [
      { id: "P1", status: "Candidate", name: "Sharp", sample: "radius-sharp", copy: "0px for strict utility only.", rationale: "Kept as a rare structural option." },
      { id: "P2", status: "Favorite", name: "Medium", sample: "radius-medium", copy: "8px candidate for cards and fields.", rationale: "Best balance between calm editorial and product UI." },
      { id: "P3", status: "Candidate", name: "Large", sample: "radius-large", copy: "16px candidate for hero/action primitives.", rationale: "Useful when surfaces become larger and more physical." },
      { id: "P4", status: "Candidate", name: "Pill", sample: "radius-pill", copy: "999px for chips and compact controls.", rationale: "Kept for labels and small action affordances." },
    ],
    do: ["Use the same sample shape when comparing", "Allow larger radius for large CTA and hero primitives", "Keep small UI restrained"],
    dont: ["Make every content card pill-like", "Use many near-identical radius values", "Lock final px values before real primitives are tested"],
    questions: ["Should cards default to 8px or 12px?", "Should large action panels use 16px or 20px?", "Do glass chrome bars need more radius than cards?"],
  },
  {
    slug: "strokes",
    title: "Strokes",
    status: "candidate",
    purpose: "Define when borders separate, focus, identify or signal.",
    does: "Stroke primitives cover no stroke, subtle structure, identity stroke, focus stroke and signal edge.",
    applies: {
      chrome: "Subtle glass borders and focus outlines.",
      editorial: "Quiet separation only when hierarchy needs it.",
      action: "Deep identity or cyan focus strokes.",
    },
    favorite: {
      name: "Subtle structure + cyan focus",
      note: "Neutral borders for structure; #0EA5E9 for functional focus.",
      sample: "stroke-favorite",
    },
    iterations: [
      { id: "P1", status: "Favorite", name: "Subtle stroke", sample: "stroke-subtle", copy: "#E5E7EB / #D1D5DB for separation.", rationale: "Best default for editorial and utility." },
      { id: "P2", status: "Candidate", name: "Identity stroke", sample: "stroke-deep", copy: "#134D6A for deep identity detail.", rationale: "Useful in small doses on navigation or action panels." },
      { id: "P3", status: "Favorite", name: "Focus stroke", sample: "stroke-focus", copy: "#0EA5E9 for keyboard/focus.", rationale: "Functional and clear without making magenta default focus." },
      { id: "P4", status: "Parked", name: "Signal edge", sample: "stroke-signal", copy: "#FF55B0 as tiny edge/detail.", rationale: "Allowed only as micro-signal, not layout line." },
    ],
    do: ["Use cyan for default focus", "Use subtle borders for editorial structure", "Use signal edge sparingly"],
    dont: ["Use long magenta structural lines", "Over-border every card", "Use focus styling as decoration"],
    questions: ["Should identity stroke be 1px or 2px?", "Where should signal edge be allowed?", "How should focus stroke interact with glass chrome?"],
  },
  {
    slug: "elevation",
    title: "Elevation / shadow",
    status: "candidate",
    purpose: "Define how Viddel uses depth and shadow to separate content, chrome, overlays and action without making the expression heavy or glossy.",
    does: "Gives controlled visual depth, separates flat content, lifted cards, floating chrome and overlays, and supports readability and hierarchy rather than decoration.",
    applies: {
      chrome: "Sticky nav, floating controls and glass fallback.",
      editorial: "Very subtle lifting only where readability needs separation.",
      action: "Action panels, prompt containers and real overlays.",
    },
    suggestedScale: ["none", "subtle", "lifted", "floating", "overlay"],
    tokenNote: "These primitives may later map to token families such as shadow.*. Not implemented as global tokens in #124.",
    iterations: [
      {
        id: "P1",
        status: "Candidate",
        name: "Subtle depth scale",
        sample: "elevation-subtle",
        copy: "A restrained scale from none to overlay, with subtle/lifted as the main editorial candidates.",
        rationale: "Kept for review because depth is needed for hierarchy, chrome and overlays, but should not become a brand effect.",
      },
      {
        id: "P2",
        status: "Open slot",
        name: "Open slot",
        sample: "open-slot",
        copy: "Reserved for a future card/elevation comparison.",
        rationale: "Not tested yet.",
      },
      {
        id: "P3",
        status: "Open slot",
        name: "Open slot",
        sample: "open-slot",
        copy: "Reserved for a future chrome/floating treatment.",
        rationale: "Not tested yet.",
      },
      {
        id: "P4",
        status: "Open slot",
        name: "Open slot",
        sample: "open-slot",
        copy: "Reserved for overlay depth evaluation.",
        rationale: "Not tested yet.",
      },
    ],
    do: [
      "Use shadow to clarify hierarchy.",
      "Keep editorial surfaces mostly quiet.",
      "Use stronger depth only for overlays, floating chrome or active panels.",
      "Pair shadow with solid fallback where glass is used.",
    ],
    dont: [
      "Use heavy shadows as brand effect.",
      "Make every card float.",
      "Use depth to compensate for unclear layout.",
      "Add glossy premium effects.",
    ],
    questions: [
      "Hvor mye elevation trenger hub-kort egentlig?",
      "Skal editorial cards være helt flate eller svakt løftet?",
      "Skal glass chrome ha egen shadow/elevation?",
      "Trenger AI/action panels mer depth enn editorial cards?",
    ],
  },
  {
    slug: "layering",
    title: "Layering / z-index",
    status: "candidate",
    purpose: "Define Viddel stacking order so chrome, content, floating actions, overlays and VIS-shell do not collide.",
    does: "Gives a clear UI layer model, prevents random z-index values, and makes glass, sticky nav, dropdowns, AI panels and overlays predictable.",
    applies: {
      chrome: "Sticky nav, local nav and dropdowns.",
      editorial: "Base content and in-flow help blocks.",
      action: "Floating actions, panels and overlays. VIS chrome should remain separate from product primitives.",
    },
    suggestedScale: ["base", "content", "sticky chrome", "floating action", "overlay", "modal", "toast", "VIS chrome / debug"],
    tokenNote: "These primitives may later map to token families such as layer.*. Not implemented as global tokens in #124.",
    iterations: [
      {
        id: "P1",
        status: "Candidate",
        name: "Semantic layer stack",
        sample: "layering-stack",
        copy: "A named layer model for product content, chrome, floating actions, overlays and VIS/debug chrome.",
        rationale: "Kept for review because #125 needs semantic layers before sticky chrome, glass and overlays are implemented.",
      },
      {
        id: "P2",
        status: "Open slot",
        name: "Open slot",
        sample: "open-slot",
        copy: "Reserved for dropdown and sticky chrome interaction.",
        rationale: "Not tested yet.",
      },
      {
        id: "P3",
        status: "Open slot",
        name: "Open slot",
        sample: "open-slot",
        copy: "Reserved for AI prompt/action panel stacking.",
        rationale: "Not tested yet.",
      },
      {
        id: "P4",
        status: "Open slot",
        name: "Open slot",
        sample: "open-slot",
        copy: "Reserved for VIS chrome/debug separation.",
        rationale: "Not tested yet.",
      },
    ],
    do: [
      "Use named semantic layers.",
      "Keep product layers separate from VIS chrome.",
      "Define sticky/floating/overlay order before building #125.",
      "Keep numeric values hidden behind semantic naming later.",
    ],
    dont: [
      "Use random z-index values.",
      "Let glass chrome sit above modals.",
      "Let floating AI controls cover important content without rules.",
      "Mix VIS chrome and product chrome as if they are the same layer.",
    ],
    questions: [
      "Hvilket lag skal sticky product chrome ligge på?",
      "Hvor skal AI prompt/action panel ligge?",
      "Hvordan skal dropdowns og overlays samspille med glass?",
      "Skal VIS chrome ha eget høyere debug-lag uten å påvirke produktmodell?",
    ],
  },
  {
    slug: "buttons",
    title: "Buttons",
    status: "needsReview",
    purpose: "Make button levels scalable before real MVP reskin decisions.",
    does: "Button primitives describe hierarchy, state, surface variants and action behavior.",
    applies: {
      chrome: "Compact/icon or glass-aware controls only.",
      editorial: "Inline and secondary actions should stay calm.",
      action: "Primary, AI primary and dark variants can be stronger.",
    },
    favorite: {
      name: "Ink primary + deep AI primary",
      note: "Ink works for standard primary action; deep blue works for AI/action contexts.",
      sample: "button-favorite",
    },
    iterations: [
      { id: "P1", status: "Favorite", name: "Ink primary", sample: "button-primary", copy: "Near-black solid primary button.", rationale: "Strong, calm and not over-colored." },
      { id: "P2", status: "Candidate", name: "Deep AI primary", sample: "button-ai", copy: "Deep Nordic Blue for article-to-AI or next-step action.", rationale: "Useful when action belongs to AI/help transition." },
      { id: "P3", status: "Candidate", name: "Ghost / tertiary", sample: "button-ghost", copy: "Quiet outline or text action.", rationale: "Needed for secondary choices and editorial flows." },
      { id: "P4", status: "Parked", name: "Magenta action", sample: "button-magenta", copy: "Magenta as button fill.", rationale: "Parked because magenta should remain high-character, low-quantity." },
    ],
    do: ["Keep standard primary calm", "Let AI/action button be stronger in context", "Show disabled/loading/focus states"],
    dont: ["Make all buttons colorful", "Use magenta as default button fill", "Use heavy display type in small buttons"],
    questions: ["Should AI primary be deep blue or ink by default?", "How compact should chrome buttons be?", "Do dark surfaces need an inverse or deep button?"],
    extra: "buttons",
  },
  {
    slug: "cards",
    title: "Cards",
    status: "candidate",
    purpose: "Separate article, hub, info, decision, seed and dark action boxes.",
    does: "Card primitives define how content and help modules group without making every surface feel like a card.",
    applies: {
      chrome: "Rare; cards should not become navigation chrome.",
      editorial: "Article, hub, info and decision boxes.",
      action: "AI seed and dark action cards.",
    },
    favorite: {
      name: "Quiet editorial cards",
      note: "White/light cards with subtle border, plus dark action card when needed.",
      sample: "card-favorite",
    },
    iterations: defaultIterations,
    do: ["Keep article cards quiet", "Use decision boxes for meaningful forks", "Use dark cards only for next-step emphasis"],
    dont: ["Turn every content block into elevated card", "Use decorative gradients as card identity", "Detach AI cards from surrounding editorial content"],
    questions: ["How much shadow is acceptable?", "Should hub cards carry deep blue accents?", "When is a dark action card too heavy?"],
  },
  {
    slug: "inputs",
    title: "Inputs",
    status: "candidate",
    purpose: "Set up default, helper, focus and AI prompt input candidates.",
    does: "Input primitives handle user text, helper copy and prompt entry without making forms feel clinical.",
    applies: {
      chrome: "Search/filter fields only if needed.",
      editorial: "Search, feedback and helper fields.",
      action: "AI prompt and next-step input.",
    },
    favorite: {
      name: "Clean input + AI prompt container",
      note: "Standard inputs stay light; AI prompt can sit in a guided action surface.",
      sample: "input-favorite",
    },
    iterations: defaultIterations,
    do: ["Use helper text for clarity", "Use cyan for focus", "Keep prompt input connected to content"],
    dont: ["Make inputs feel like detached chat widgets", "Use magenta as default focus", "Hide helper constraints"],
    questions: ["Should prompt input include CTA inside the field?", "How much helper text is needed?", "How should error states use parked colors?"],
  },
  {
    slug: "pills",
    title: "Pills / tags / chips",
    status: "candidate",
    purpose: "Define compact labels for neutral, identity, functional, signal and status use.",
    does: "Pill primitives label state, category and small actions without competing with content.",
    applies: {
      chrome: "Toolbar chips and filters.",
      editorial: "Category tags and status labels.",
      action: "Seed questions and compact AI chips.",
    },
    favorite: {
      name: "Neutral + identity + cyan functional",
      note: "Magenta can appear as a dot, not as a full chip system.",
      sample: "pill-favorite",
    },
    iterations: defaultIterations,
    do: ["Use neutral chips by default", "Use cyan for functional state", "Use magenta as dot/micro-signal"],
    dont: ["Make chips decorative", "Use many colors in one row", "Use magenta as a large pill fill"],
    questions: ["Which states need chips in MVP?", "Should tags be uppercase?", "Can AI seed chips be larger than editorial tags?"],
  },
  {
    slug: "focus",
    title: "Focus states",
    status: "favorite",
    purpose: "Establish functional focus behavior separate from decorative signal.",
    does: "Focus primitives show keyboard state on buttons, inputs and cards/links.",
    applies: {
      chrome: "Navigation and toolbar controls.",
      editorial: "Links and article cards.",
      action: "Buttons, prompt inputs and AI seed cards.",
    },
    favorite: {
      name: "Cyan functional focus",
      note: "#0EA5E9 is the primary focus/active candidate. Magenta stays optional micro-signal.",
      sample: "focus-favorite",
    },
    iterations: [
      { id: "P1", status: "Favorite", name: "Cyan ring", sample: "focus-cyan", copy: "Clear functional focus ring.", rationale: "Best default because it is accessible and not brand-decorative." },
      { id: "P2", status: "Candidate", name: "Inset focus", sample: "focus-inset", copy: "Inset ring for compact chrome.", rationale: "May be useful where outer rings collide with glass." },
      { id: "P3", status: "Parked", name: "Magenta micro-signal", sample: "focus-magenta", copy: "Tiny magenta dot paired with cyan focus.", rationale: "Parked as optional accent, not default focus." },
      { id: "P4", status: "Rejected", name: "Magenta focus", sample: "focus-rejected", copy: "Magenta as default focus color.", rationale: "Rejected because it overuses the signal color." },
    ],
    do: ["Use cyan as primary focus", "Show focus on button, input and card/link", "Keep focus visible on dark surfaces"],
    dont: ["Use magenta as default focus everywhere", "Rely only on color without outline", "Hide focus on mouse interaction if keyboard needs it"],
    questions: ["Should focus ring be 2px or 3px?", "How should focus appear on glass chrome?", "Do cards need full outline or inset edge?"],
  },
  {
    slug: "glass",
    title: "Glass chrome",
    status: "needsReview",
    purpose: "Keep glass as chrome/material behavior, not as editorial surface.",
    does: "Glass primitives define transparent nav, toolbar and fallback behavior.",
    applies: {
      chrome: "Primary use: header, nav, toolbar and orientation chips.",
      editorial: "Not default. Editorial stays clean and light.",
      action: "Only if attached to context; avoid detached floating widgets.",
    },
    favorite: {
      name: "Subtle chrome glass with solid fallback",
      note: "rgba(255,255,255,.72) / rgba(2,6,23,.72), blur candidate 16px.",
      sample: "glass-favorite",
    },
    iterations: [
      { id: "P1", status: "Favorite", name: "Light chrome glass", sample: "glass-light", copy: "Transparent nav over light editorial base.", rationale: "Best default for orientation while keeping editorial clean." },
      { id: "P2", status: "Candidate", name: "Dark chrome glass", sample: "glass-dark", copy: "Dark glass over deep/near-black base.", rationale: "Useful for identity surfaces and dark navigation." },
      { id: "P3", status: "Candidate", name: "Solid fallback", sample: "glass-solid", copy: "Solid light/dark fallback for browsers or busy backgrounds.", rationale: "Required before production use." },
      { id: "P4", status: "Rejected", name: "Glass cards", sample: "glass-rejected", copy: "Glass as standard editorial content card.", rationale: "Rejected because editorial should remain clean and readable." },
    ],
    do: ["Use glass for chrome/orientation", "Keep glass subtle", "Provide solid fallback", "Use deep blue/ink for dark chrome"],
    dont: ["Use glass for every card", "Put long text on busy glass", "Make AI feel like a detached widget", "Overuse magenta inside chrome"],
    questions: ["Exact blur: 16px or 24px?", "Exact opacity for dark chrome?", "When should fallback activate visually?"],
  },
  {
    slug: "signals",
    title: "Signal primitives",
    status: "needsReview",
    purpose: "Define allowed and disallowed kinetic magenta usage.",
    does: "Signal primitives cover dots, halos, audio bars, edge/detail and ghost signal.",
    applies: {
      chrome: "Tiny orientation markers only.",
      editorial: "Very small accents, never long structural lines.",
      action: "Micro-signal in AI/action context, especially on dark surfaces.",
    },
    favorite: {
      name: "Ghost signal on dark/deep base",
      note: "Magenta works best as halo, dot, micro bars or edge detail over deep blue.",
      sample: "signal-favorite",
    },
    iterations: [
      { id: "P1", status: "Favorite", name: "Dot / halo", sample: "signal-dot", copy: "Small dot and ghost halo.", rationale: "Strong character with very low quantity." },
      { id: "P2", status: "Candidate", name: "Micro bars", sample: "signal-bars", copy: "Small audio bars for sound/motion.", rationale: "Kept because it ties signal to hearing/AI behavior." },
      { id: "P3", status: "Candidate", name: "Edge detail", sample: "signal-edge", copy: "Short edge/detail only.", rationale: "Allowed if it never becomes a layout rail." },
      { id: "P4", status: "Rejected", name: "Pink structure", sample: "signal-rejected", copy: "Long pink layout line or large fill.", rationale: "Rejected by #122 signal rule." },
    ],
    do: signalAllowed,
    dont: signalNotAllowed,
    questions: ["How many signals can appear on one view?", "Can magenta appear on light surfaces at all?", "Which icon primitives need signal bars?"],
  },
  {
    slug: "ai-action",
    title: "AI / action blocks",
    status: "needsReview",
    purpose: "Separate AI/action primitives from detached chatbot-widget behavior.",
    does: "AI/action primitives support article-to-AI transitions, preseeded questions, inline helper blocks and dark action panels.",
    applies: {
      chrome: "Rare; chrome can route to help but should not become the AI surface.",
      editorial: "Must continue from article/help content.",
      action: "Primary home for next-step blocks and prompt entry.",
    },
    favorite: {
      name: "Editorial-to-action transition",
      note: "The best candidate must be judged on an actual context page, not isolated.",
      sample: "ai-favorite",
    },
    iterations: [
      { id: "P1", status: "Favorite", name: "Article-to-AI transition", sample: "ai-transition", copy: "A calm block after content that offers concrete help.", rationale: "Best aligns AI with editorial reading flow." },
      { id: "P2", status: "Candidate", name: "Preseeded question", sample: "ai-seed", copy: "Question card that makes the next step obvious.", rationale: "Useful but must avoid becoming noisy chip soup." },
      { id: "P3", status: "Candidate", name: "Inline helper", sample: "ai-helper", copy: "Small helper block inside content.", rationale: "Needs context to judge interruption level." },
      { id: "P4", status: "Candidate", name: "Dark action panel", sample: "ai-dark", copy: "Strong next-step panel on deep blue/ink.", rationale: "Promising for transitions, but easy to overuse." },
    ],
    do: ["Attach AI/action to editorial context", "Use clear surfaces or dark surfaces", "Make next step concrete"],
    dont: ["Make AI a floating detached widget", "Use glass as default AI container", "Overuse magenta in prompts"],
    questions: ["Which article templates need AI/action?", "How much context must be carried into the prompt?", "Does dark action feel supportive or too heavy?"],
  },
];

export const pageBySlug = Object.fromEntries(primitivePages.map((page) => [page.slug, page]));
