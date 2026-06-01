/* CONTRACT: Helpers for VIS Tree Navigation v0.1 — path matching, contracts, active state. */

import { mvpCurrentState } from "../data/mvp-current-state.ts";
import {
  visNavSections,
  visPageContracts,
  type VisNavItem,
  type VisNavSection,
  type VisPageContract,
} from "../data/vis-navigation-v01.ts";

export function normalizeVisPath(pathname: string, baseUrl = "/"): string {
  let p = pathname;
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  if (base && base !== "/" && p.startsWith(base)) {
    p = p.slice(base.length) || "/";
  }
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

export function navHrefToPath(href: string): string {
  const p = href.startsWith("/") ? href : `/${href}`;
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

export type VisNavMatch = {
  item: VisNavItem;
  section: VisNavSection;
  exact: boolean;
};

export function findNavMatch(pathname: string, baseUrl = "/"): VisNavMatch | null {
  const path = normalizeVisPath(pathname, baseUrl);
  let best: VisNavMatch | null = null;

  for (const section of visNavSections) {
    for (const item of section.items) {
      if (!item.href) continue;
      const itemPath = navHrefToPath(item.href);
      const exact = path === itemPath;
      const prefix = path.startsWith(`${itemPath}/`);
      if (!exact && !prefix) continue;
      if (!best || (exact && !best.exact) || itemPath.length > navHrefToPath(best.item.href!)) {
        best = { item, section, exact };
      }
    }
  }
  return best;
}

export function resolvePageContract(pathname: string, baseUrl = "/", explicitId?: string): VisPageContract | undefined {
  if (explicitId && visPageContracts[explicitId]) {
    return visPageContracts[explicitId];
  }
  const path = normalizeVisPath(pathname, baseUrl);
  const match = findNavMatch(pathname, baseUrl);
  if (match?.item.pageContractId && visPageContracts[match.item.pageContractId]) {
    return visPageContracts[match.item.pageContractId];
  }
  if (path.startsWith("/vis/sprints/")) {
    return visPageContracts["sprint-lab-default"];
  }
  if (path.startsWith("/vis/") && path !== "/vis") {
    const slug = path.replace(/^\/vis\//, "");
    if (slug && !slug.includes("/") && visPageContracts[`wireframe-${slug}`]) {
      return visPageContracts[`wireframe-${slug}`];
    }
  }
  return undefined;
}

export function isNavItemActive(item: VisNavItem, pathname: string, baseUrl = "/"): boolean {
  const match = findNavMatch(pathname, baseUrl);
  if (!match || !item.href) return false;
  return match.item.id === item.id;
}

export function isSectionActive(section: VisNavSection, pathname: string, baseUrl = "/"): boolean {
  return section.items.some((item) => isNavItemActive(item, pathname, baseUrl));
}

export function getVisNavSections(): VisNavSection[] {
  return visNavSections;
}

export function getSprintNavLabel(): string {
  const sprint = mvpCurrentState.currentSprint;
  return sprint.status === "active" ? `Sprint ${sprint.label}` : `Sprint ${sprint.label} (arkiv)`;
}

export function resolveNavItemLabel(item: VisNavItem): string {
  if (item.id === "sprint-active") return getSprintNavLabel();
  return item.label;
}

export function resolveItemHref(item: VisNavItem, baseUrl: string): string | undefined {
  if (!item.href) return undefined;
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const clean = item.href.replace(/^\//, "");
  return `${base}${clean}`;
}

/** Build frontpage hub list from navigation registry — single source. */
export function getVisHubEntriesFromNav(baseUrl: string) {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const hubs: {
    id: string;
    title: string;
    mandate: string;
    href?: string;
    availability: "active" | "planned" | "historikk";
    tier: "primary" | "secondary";
    issue?: string;
  }[] = [];

  for (const section of visNavSections) {
    for (const item of section.items) {
      if (!item.hubTier || !item.href) continue;
      const contract = item.pageContractId ? visPageContracts[item.pageContractId] : undefined;
      hubs.push({
        id: item.id,
        title: resolveNavItemLabel(item),
        mandate: contract?.purpose ?? item.secondaryLabel ?? "",
        href: `${base}${item.href.replace(/^\//, "")}`,
        availability: contract?.status === "historical" || contract?.status === "legacy" ? "historikk" : "active",
        tier: item.hubTier,
      });
    }
  }

  const sprint = mvpCurrentState.currentSprint;
  const sprintActive = sprint.status === "active";
  const sprintHub = {
    id: "sprint",
    title: sprintActive ? `Sprint ${sprint.label}` : "Sprint / historikk",
    mandate: sprintActive
      ? "Operativ sprintflate — labs og beslutningsgrunnlag."
      : "Hvordan vi kom hit — ikke gjeldende sannhet.",
    href: `${base}${sprint.route.replace(/^\//, "")}`,
    availability: (sprintActive ? "active" : "historikk") as "active" | "historikk",
    tier: (sprintActive ? "primary" : "secondary") as "primary" | "secondary",
    issue: sprint.issue,
  };

  const primary = hubs.filter((h) => h.tier === "primary" && h.id !== "sprint-active");
  const secondary = hubs.filter((h) => h.tier === "secondary");
  if (sprintActive) return [...primary, sprintHub, ...secondary];
  return [...hubs.filter((h) => h.tier === "primary"), ...secondary, sprintHub];
}

export const visStatusLabels: Record<VisPageContract["status"], string> = {
  active: "Aktiv",
  canonical: "Canonical",
  lab: "Lab",
  reference: "Referanse",
  historical: "Historikk",
  legacy: "Legacy",
};
