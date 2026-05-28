/* CONTRACT: Primary NO-site navigation (#125H, routes #125J).
   Hub model: Forside, Hjelp, Bedre lyd, Ordbok, Om Viddel.
   Spør Viddel via header/mobile CTA only (not a regular nav item).
 */

export const NO_NAV_LINKS = [
  { href: "/no", label: "Forside" },
  { href: "/no/hjelp", label: "Hjelp" },
  { href: "/no/bedre-lyd", label: "Bedre lyd" },
  { href: "/no/ordbok", label: "Ordbok" },
  { href: "/no/om", label: "Om Viddel" },
] as const;

export const NO_NAV_CHAT_HREF = "/no/chat";
export const NO_NAV_CHAT_LABEL = "Spør Viddel";
