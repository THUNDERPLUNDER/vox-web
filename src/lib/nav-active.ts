/* CONTRACT: Consistent active-state matching for global NO navigation (hub-and-spoke + AI). */

export function isNavActive(href: string, currentPath: string): boolean {
  const p = currentPath || "";
  if (href === "/no") return p === "/no";
  if (href === "/no/hubs") return p === "/no/hubs" || p === "/no/hub" || p.startsWith("/no/artikkel");
  if (href === "/no/chat") return p.startsWith("/no/chat");
  if (href !== "/no" && p.startsWith(`${href}/`)) return true;
  return p === href;
}
