/* CONTRACT: Consistent active-state matching for global NO navigation (#125H hub model). */

export function isNavActive(href: string, currentPath: string): boolean {
  const p = currentPath || "";
  if (href === "/no") return p === "/no" || p === "/no/";
  if (href === "/no/hub") return p === "/no/hub" || p.startsWith("/no/hub/");
  if (href === "/no/lyd-i-hverdagen") {
    return p === "/no/lyd-i-hverdagen" || p.startsWith("/no/lyd-i-hverdagen/");
  }
  if (href === "/no/chat") return p.startsWith("/no/chat");
  if (href !== "/no" && p.startsWith(`${href}/`)) return true;
  return p === href;
}
