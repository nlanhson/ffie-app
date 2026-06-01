"use client";

import { useState } from "react";
import { FileText, Newspaper, RefreshCw } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { themes, type ThemeName } from "@tokens";
import { StatusPill, type StatusName, type StatusPillSize, type StatusPillVariant } from "@/components/ui/StatusPill";

type Dichromacy = "deuteranopia" | "protanopia" | "tritanopia";

const ALL_STATUSES: StatusName[] = ["success", "warning", "danger", "info", "offline", "syncing", "stale", "fresh"];
const VARIANTS: StatusPillVariant[] = ["filled", "subtle"];
const SIZES: StatusPillSize[] = ["sm", "md", "lg"];
const THEMES: ThemeName[] = ["light", "dark", "sunlight"];
const DICHROMACIES: (Dichromacy | "none")[] = ["none", "deuteranopia", "protanopia", "tritanopia"];

const P2_STATUSES: StatusName[] = ["offline", "syncing", "stale", "fresh"];

export default function StatusPillPage() {
  const [logLines, setLogLines] = useState<string[]>([]);
  const [dichromacy, setDichromacy] = useState<Dichromacy | "none">("none");

  const log = (line: string) => {
    setLogLines((p) => [`${new Date().toLocaleTimeString()} · ${line}`, ...p].slice(0, 6));
  };

  // Filter applied via CSS to simulate dichromacy in real-time for any cell.
  const filterFor = (d: Dichromacy | "none") => (d === "none" ? undefined : `url(#cb-${d})`);

  return (
    <>
      <PageHeader
        eyebrow="Components · v1.0"
        title="StatusPill"
        lede="8 statuses × 2 variants × 3 sizes × 3 themes. Shape + icon + label each independently carry meaning (P4) — the rotating syncing icon is the mitigation for the colorblind audit's marginal sunlight pair. Spec: project/design-system/components/StatusPill.md."
      />

      {/* SVG color-blindness filters for live simulation */}
      <ColorblindFilters />

      {/* The P2 set in context — the load-bearing FFIE use case */}
      <SectionHeading
        title="The P2 set — Julien's worksite"
        description="offline / syncing / stale / fresh. Inline next to titles in a list row. This is the load-bearing FFIE use case."
      />
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {[
            { title: "NFC 15-100 — Édition 2024", status: "offline" as StatusName, meta: "12 MB · sauvegardé il y a 2 jours" },
            { title: "Guide installation tertiaire", status: "syncing" as StatusName, meta: "Mise à jour en cours…" },
            { title: "Décret tertiaire — Annexe B", status: "stale" as StatusName, meta: "Cache > 24h" },
            { title: "Norme NF C 14-100", status: "fresh" as StatusName, meta: "Synchronisé à l'instant" },
          ].map((row) => (
            <li key={row.title} className="flex items-center gap-3 px-4 py-3">
              <FileText size={18} className="text-gray-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-900 truncate">{row.title}</span>
                  <StatusPill name={row.status} variant="subtle" size="sm" />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{row.meta}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Status × variant × theme matrix */}
      <SectionHeading
        title="All statuses × variants × themes"
        description="Every cell is a real StatusPill reading theme tokens. Use the dichromacy filter to see the icon-as-mitigation pay off."
      />

      <div className="rounded-lg border border-gray-200 bg-white p-4 mb-4">
        <div className="flex flex-wrap gap-2 items-center" role="radiogroup" aria-label="Color-vision simulation">
          <span className="text-xs uppercase tracking-wider font-medium text-gray-500 mr-2">Simulate</span>
          {DICHROMACIES.map((d) => {
            const active = d === dichromacy;
            return (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setDichromacy(d)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  active ? "bg-[#027489] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {d === "none" ? "no filter" : d}
              </button>
            );
          })}
          {dichromacy !== "none" && (
            <span className="text-xs text-gray-500 ml-2">
              The pills still differ — icons + labels carry the load.
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {VARIANTS.map((variant) => (
          <div key={variant} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-700">
                variant = {variant}
              </h3>
            </div>
            <table className="w-full">
              <thead className="text-left text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Status</th>
                  {THEMES.map((tn) => (
                    <th key={tn} className="px-4 py-2 font-medium">{themes[tn].label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ALL_STATUSES.map((s) => (
                  <tr key={s}>
                    <td className="px-4 py-3 align-middle">
                      <code className={`font-mono text-xs ${P2_STATUSES.includes(s) ? "text-[#222D5D] font-semibold" : "text-gray-600"}`}>
                        {s}
                        {P2_STATUSES.includes(s) && <span className="ml-1 text-[10px] font-normal text-gray-400">P2</span>}
                      </code>
                    </td>
                    {THEMES.map((tn) => (
                      <td key={tn} className="px-4 py-3 align-middle" style={{ background: themes[tn].surface.default }}>
                        <div style={{ filter: filterFor(dichromacy) }}>
                          <StatusPill name={s} variant={variant} themeName={tn} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Sizes */}
      <SectionHeading title="Sizes" description="sm 20 · md 24 (default) · lg 32. lg is the only tappable size." />
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-4">
          {SIZES.map((s) => (
            <StatusPill key={s} name="offline" size={s} variant="subtle" />
          ))}
        </div>
      </div>

      {/* Tappable lg */}
      <SectionHeading
        title="Tappable (lg only)"
        description="Tap a stale pill to trigger a refresh. Same press feedback as Button. 6pt hit-slop reaches WCAG 2.5.5 (32 + 6 + 6 = 44)."
      />
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-4">
          <StatusPill
            name="stale"
            variant="subtle"
            size="lg"
            onPress={() => log("stale pill pressed — refresh triggered")}
          >
            Périmé — tapper pour rafraîchir
          </StatusPill>
          <StatusPill
            name="offline"
            variant="filled"
            size="lg"
            onPress={() => log("offline pill pressed")}
          >
            Hors-ligne
          </StatusPill>
        </div>
      </div>

      {/* Live region */}
      <SectionHeading title="Live region" description="aria-live='polite' on a syncing-to-success sequence (toast pattern)." />
      <LiveDemo log={log} />

      {/* Fresh fade */}
      <SectionHeading title="Fresh auto-fade" description="name='fresh' auto-fades after 3s (parent controls mount; the component handles the fade)." />
      <FreshDemo />

      {/* Press log */}
      <SectionHeading title="Press log" description="Confirms onPress fires for tappable lg pills." />
      <div className="rounded-lg border border-gray-200 bg-gray-950 p-4 font-mono text-xs text-green-400 min-h-[6rem]">
        {logLines.length === 0 ? (
          <span className="text-gray-500">No presses yet. Try the lg pills above.</span>
        ) : (
          <ul className="space-y-1">
            {logLines.map((l, i) => (
              <li key={`${l}-${i}`}>{l}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Design contracts */}
      <SectionHeading title="Design contracts" description="Slips on any of these regress P2 or P4. From StatusPill.md §9." />
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Contract</th>
              <th className="px-4 py-3 font-medium">Principle</th>
              <th className="px-4 py-3 font-medium">Where it lives</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {CONTRACTS.map((c) => (
              <tr key={c.contract}>
                <td className="px-4 py-3 text-gray-900">{c.contract}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#222D5D]">{c.principle}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{c.where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-xs text-gray-500">
        Spec: <code className="font-mono">project/design-system/components/StatusPill.md</code> · tokens v0.6 ·{" "}
        component <code className="font-mono">src/components/ui/StatusPill.tsx</code>
      </p>
    </>
  );
}

const CONTRACTS = [
  { contract: "Every status uses a unique icon (shape) — color is the 3rd signal, not the 1st", principle: "P4", where: "StatusPill.tsx ICON_BY_NAME" },
  { contract: "Sunlight subtle = outlined (white bg + saturated border) to preserve max contrast", principle: "P1 + P4", where: "tokens.ts themes.sunlight.feedback.subtle" },
  { contract: "Syncing rotation stays under prefers-reduced-motion (rotation IS the affordance)", principle: "P4 + motion-sensitivity", where: "StatusPill.tsx iconClass + globals.css .ffie-spin" },
  { contract: "onPress only on size='lg' (TS discriminated union)", principle: "P1 + P4", where: "StatusPillProps Tappable union" },
  { contract: "Tappable lg reaches 44pt target via 6pt hit-slop (32 + 6 + 6)", principle: "P4 / WCAG 2.5.5", where: "StatusPill.tsx tappable wrapper span" },
  { contract: "live={true} adds aria-live='polite' — for toasts, NEVER for list-row pills (would flood SR)", principle: "P4", where: "StatusPill.tsx aria-live binding + usage guidelines" },
  { contract: "Icon is non-negotiable — refused at compile time", principle: "P4", where: "StatusPillProps + ICON_BY_NAME default" },
];

function LiveDemo({ log }: { log: (s: string) => void }) {
  const [state, setState] = useState<StatusName>("syncing");
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <StatusPill name={state} variant="filled" size="lg" live>
          {state === "syncing" ? "Sauvegarde en cours" : state === "success" ? "Sauvegardé" : "Échec"}
        </StatusPill>
        <button
          type="button"
          onClick={() => {
            setState("syncing");
            log("live: syncing");
            window.setTimeout(() => {
              setState("success");
              log("live: success (SR re-announced)");
            }, 1500);
          }}
          className="rounded-md bg-gray-100 hover:bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
        >
          Simulate save
        </button>
      </div>
    </div>
  );
}

function FreshDemo() {
  const [key, setKey] = useState(0);
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <StatusPill key={key} name="fresh" variant="filled" size="md" />
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="rounded-md bg-gray-100 hover:bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 inline-flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Re-mount
        </button>
      </div>
    </div>
  );
}

// SVG color-blindness filters — Viénot 1999 LMS matrices, matching
// the audit in src/lib/colorblind.ts but applied at the DOM level via
// SVG <feColorMatrix>. This lets us toggle a global filter on any cell.
function ColorblindFilters() {
  // Coefficients from Brettel/Viénot — same source as colorblind.ts.
  // Each filter is RGBA -> RGBA via a 5x4 matrix.
  return (
    <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id="cb-deuteranopia">
          <feColorMatrix
            type="matrix"
            values="0.625 0.375 0 0 0
                    0.7 0.3 0 0 0
                    0 0.3 0.7 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="cb-protanopia">
          <feColorMatrix
            type="matrix"
            values="0.567 0.433 0 0 0
                    0.558 0.442 0 0 0
                    0 0.242 0.758 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="cb-tritanopia">
          <feColorMatrix
            type="matrix"
            values="0.95 0.05 0 0 0
                    0 0.433 0.567 0 0
                    0 0.475 0.525 0 0
                    0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}

