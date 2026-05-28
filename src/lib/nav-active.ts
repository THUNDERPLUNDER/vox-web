/* CONTRACT: Consistent active-state matching for global NO navigation (#125H, #125J). */

export function isNavActive(href: string, currentPath: string): boolean {
  const p = currentPath || "";
  if (href === "/no") return p === "/no" || p === "/no/";
  if (href === "/no/hjelp") {
    return p === "/no/hjelp" || p.startsWith("/no/hjelp/") || p === "/no/hub" || p.startsWith("/no/hub/");
  }
  if (href === "/no/bedre-lyd") {
    return (
      p === "/no/bedre-lyd" ||
      p.startsWith("/no/bedre-lyd/") ||
      p === "/no/lyd-i-hverdagen" ||
      p.startsWith("/no/lyd-i-hverdagen/")
    );
  }
  if (href === "/no/chat") return p.startsWith("/no/chat");
  if (href !== "/no" && p.startsWith(`${href}/`)) return true;
  return p === href;
}
