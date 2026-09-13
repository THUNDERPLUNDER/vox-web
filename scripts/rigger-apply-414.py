from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"Expected patch anchor not found in {path}: {old[:120]!r}")
    if text.count(old) != 1:
        raise SystemExit(f"Patch anchor not unique in {path}: {old[:120]!r}")
    p.write_text(text.replace(old, new, 1))


# /vis compact roadmap: switch from build-time projection constants to runtime approved state.
index_path = "src/pages/vis/index.astro"
replace_once(
    index_path,
    '/* CONTRACT: VIS Project State v0.1 — curated Project Brain read model; never backlog. */\nimport VisInternalLayout',
    '/* CONTRACT: VIS Project State v0.1 — curated Project Brain read model; never backlog. */\nexport const prerender = false;\n\nimport VisInternalLayout',
)
replace_once(
    index_path,
    '''import {\n  roadmapFrontPreview,\n  roadmapFrontPreviewLabels,\n  roadmapHorizons,\n  roadmapInitiatives,\n  roadmapWatchSignals,\n} from "../../data/vis-roadmap-horizons-v01.ts";''',
    '''import { roadmapHorizons } from "../../data/vis-roadmap-horizons-v01.ts";\nimport { loadVisRoadmapProjectionV02 } from "../../data/load-vis-roadmap-projection-v02.ts";''',
)
replace_once(
    index_path,
    '''const architectureLayers = [''',
    '''Astro.response.headers.set("Cache-Control", "no-store");\nconst { projection: roadmapProjection, sourceState: roadmapSourceState } =\n  await loadVisRoadmapProjectionV02();\nconst roadmapInitiatives = roadmapProjection.initiatives;\nconst roadmapWatchSignals = roadmapProjection.watchSignals;\nconst roadmapFrontPreview = roadmapProjection.frontPreview;\nconst roadmapFrontPreviewLabels = roadmapProjection.frontPreviewLabels;\n\nconst architectureLayers = [''',
)
replace_once(
    index_path,
    '''        <div class="roadmap-preview__watch">\n          <strong>WATCH</strong>\n          <p>{roadmapPreviewWatch.map((signal) => signal.title).join(" · ")}</p>\n        </div>\n      </section>''',
    '''        <div class="roadmap-preview__watch">\n          <strong>WATCH</strong>\n          <p>{roadmapPreviewWatch.map((signal) => signal.title).join(" · ")}</p>\n        </div>\n        <p class="roadmap-preview__source">\n          {\n            roadmapSourceState === "fresh"\n              ? <>Roadmap state · {formatVisDate(roadmapProjection.approvedAt)} · rev {roadmapProjection.projectionRevision} · godkjent av {roadmapProjection.approvedBy}</>\n              : <>Roadmap state · fallback til sist bundne godkjente projeksjon · live state-kilde utilgjengelig</>\n          }\n        </p>\n      </section>''',
)
replace_once(
    index_path,
    '''    .roadmap-preview__watch p { margin: 0; color: rgb(var(--vis-muted)); font-size: 0.72rem; line-height: 1.45; }''',
    '''    .roadmap-preview__watch p { margin: 0; color: rgb(var(--vis-muted)); font-size: 0.72rem; line-height: 1.45; }\n    .roadmap-preview__source { margin: 0.7rem 0 0; color: rgb(130 143 157); font-size: 0.66rem; line-height: 1.4; }''',
)

# Full roadmap: same runtime projection, with visible provenance/fallback status.
roadmap_path = "src/pages/vis/system/roadmap-timeline-v01.astro"
replace_once(
    roadmap_path,
    '/* CONTRACT: VIS Horizon Roadmap v0.1 — curated Project Brain direction joined to separate live GitHub task status. */\nimport VisInternalLayout',
    '/* CONTRACT: VIS Horizon Roadmap v0.1 — curated Project Brain direction joined to separate live GitHub task status. */\nexport const prerender = false;\n\nimport VisInternalLayout',
)
replace_once(
    roadmap_path,
    '''import {\n  roadmapDecisionForks,\n  githubIssueHref,\n  roadmapHorizons,\n  roadmapInitiatives,\n  roadmapProgramFrame,\n  roadmapProjectionMeta,\n  roadmapTracks,\n  roadmapWatchSignals,\n  type RoadmapInitiative,\n  type RoadmapTrackId,\n} from "../../../data/vis-roadmap-horizons-v01.ts";''',
    '''import {\n  githubIssueHref,\n  roadmapHorizons,\n  roadmapTracks,\n  type RoadmapInitiative,\n  type RoadmapTrackId,\n} from "../../../data/vis-roadmap-horizons-v01.ts";\nimport { loadVisRoadmapProjectionV02 } from "../../../data/load-vis-roadmap-projection-v02.ts";''',
)
replace_once(
    roadmap_path,
    '''const base = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;\nconst shapingCommentHref = `https://github.com/THUNDERPLUNDER/vox-web/issues/${roadmapProjectionMeta.shapingIssue}#issuecomment-${roadmapProjectionMeta.shapingCommentId}`;''',
    '''const base = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;\nAstro.response.headers.set("Cache-Control", "no-store");\nconst { projection: roadmapProjection, sourceState: roadmapSourceState, sourceUrl: roadmapSourceUrl } =\n  await loadVisRoadmapProjectionV02();\nconst roadmapInitiatives = roadmapProjection.initiatives;\nconst roadmapWatchSignals = roadmapProjection.watchSignals;\nconst roadmapDecisionForks = roadmapProjection.decisionForks;\nconst roadmapProgramFrame = roadmapProjection.programFrame;\nconst roadmapProjectionMeta = {\n  version: roadmapProjection.contractVersion,\n  title: roadmapProjection.title,\n  sourceDocument: roadmapProjection.sourceDocument,\n  projectionDate: roadmapProjection.approvedAt,\n  projectionOwner: roadmapProjection.approvedBy,\n};''',
)
replace_once(
    roadmap_path,
    '''          <strong>{roadmapProjectionMeta.sourceDocument}</strong> eier strategisk retning.\n          GitHub eier task- og runtime-status. VIS kobler kildene uten å gjøre dem til samme signal.\n        </p>\n        <a href={shapingCommentHref} rel="noopener noreferrer">Åpne shaping-kilden i #374</a>''',
    '''          <strong>{roadmapProjectionMeta.sourceDocument}</strong> eier strategisk retning.\n          GitHub eier task- og runtime-status. VIS kobler kildene uten å gjøre dem til samme signal.\n          <br />\n          {\n            roadmapSourceState === "fresh"\n              ? <>Roadmap state · {roadmapProjection.approvedAt} · rev {roadmapProjection.projectionRevision} · godkjent av {roadmapProjection.approvedBy}</>\n              : <>Roadmap state · fallback til sist bundne godkjente projeksjon · live state-kilde utilgjengelig</>\n          }\n        </p>\n        <a href={roadmapSourceUrl} rel="noopener noreferrer">Åpne approved state-kilden</a>''',
)
replace_once(
    roadmap_path,
    '<VisInternalLayout title="Viddel Horizon Roadmap v0.1" pageContractId="roadmap" showPageIntro={false}>',
    '<VisInternalLayout title="Viddel Horizon Roadmap" pageContractId="roadmap" showPageIntro={false}>',
)

# Mark the old TypeScript projection explicitly as bundled fallback/compatibility.
fallback_path = "src/data/vis-roadmap-horizons-v01.ts"
replace_once(
    fallback_path,
    '''/* CONTRACT: Curated Horizon Roadmap v0.1 projection. Project Brain owns direction;\n   GitHub owns task/runtime status; VIS is a read-only projection of both. */''',
    '''/* BUNDLED FALLBACK / COMPATIBILITY: Curated Horizon Roadmap v0.1.\n   Once #414 v0.2 is active, approved mutable roadmap state comes from vis-state at runtime.\n   Project Brain owns direction; GitHub owns task/runtime status; VIS remains a read-only projection. */''',
)

# Extend the roadmap verifier with v0.2 source, fresh-path and explicit fallback checks.
verify_path = "scripts/verify-vis-roadmap-horizons.mjs"
replace_once(
    verify_path,
    '''} from "../src/data/vis-roadmap-horizons-v01.ts";''',
    '''} from "../src/data/vis-roadmap-horizons-v01.ts";\nimport {\n  ROADMAP_PROJECTION_V02_URL,\n  loadVisRoadmapProjectionV02,\n  validateRoadmapProjectionV02,\n} from "../src/data/load-vis-roadmap-projection-v02.ts";''',
)
replace_once(
    verify_path,
    '''console.log("VIS Horizon Roadmap guard passed (13 objects, horizon/WATCH/timing/GitHub contracts verified).");''',
    '''const remoteResponse = await fetch(ROADMAP_PROJECTION_V02_URL, { cache: "no-store" });\nassert.ok(remoteResponse.ok, `approved v0.2 state source must be reachable (${remoteResponse.status})`);\nconst remoteProjection = await remoteResponse.json();\nassert.deepEqual(validateRoadmapProjectionV02(remoteProjection), [], "approved v0.2 projection must validate");\nassert.ok(\n  remoteProjection.initiatives.some(\n    (item) => item.id === "lived-hearing" && item.horizons.includes("next") && item.sourceIssues.includes(428) && item.sourceIssues.includes(429),\n  ),\n  "approved v0.2 state must project #428 and expose #429 through drill-down",\n);\nassert.ok(\n  remoteProjection.frontPreview.next.includes("lived-hearing"),\n  "compact preview must expose the approved lived-hearing competence area",\n);\n\nconst freshLoad = await loadVisRoadmapProjectionV02();\nassert.equal(freshLoad.sourceState, "fresh", "reachable valid approved source must load as fresh");\nassert.equal(freshLoad.projection.projectionRevision, remoteProjection.projectionRevision);\n\nconst realFetch = globalThis.fetch;\nglobalThis.fetch = async () => new Response("unavailable", { status: 503 });\ntry {\n  const fallbackLoad = await loadVisRoadmapProjectionV02();\n  assert.equal(fallbackLoad.sourceState, "fallback", "fetch failure must select explicit fallback");\n  assert.ok(fallbackLoad.projection.initiatives.length > 0, "fallback must never render an empty roadmap");\n} finally {\n  globalThis.fetch = realFetch;\n}\n\nconsole.log(\n  `VIS Horizon Roadmap guard passed (13-object bundled fallback + ${remoteProjection.initiatives.length}-object approved v0.2 source verified).`,\n);''',
)

print("#414 patch applied")
