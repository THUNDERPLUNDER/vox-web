/* CONTRACT: Primary NO-site navigation (#125H) — hub model: Forside, Hjelp, Lyd i hverdagen, Ordbok, Om.
   Hørehjelpen via header/mobile CTA only (not a regular nav item).
 */

export const NO_NAV_LINKS = [
  { href: "/no", label: "Forside" },
  { href: "/no/hub", label: "Hjelp" },
  { href: "/no/lyd-i-hverdagen", label: "Lyd i hverdagen" },
  { href: "/no/ordbok", label: "Ordbok" },
  { href: "/no/om", label: "Om" },
] as const;

export const NO_NAV_CHAT_HREF = "/no/chat";
export const NO_NAV_CHAT_LABEL = "Start samtale";
