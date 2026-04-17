/* CONTRACT: Shared helper for routing smart questions into the demo chat surface. */

export function buildChatShellHref(seed: string, from: "hub" | "article"): string {
  const params = new URLSearchParams();
  params.set("seed", seed);
  params.set("from", from);
  return `/no/chat?${params.toString()}`;
}
