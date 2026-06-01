"use client";

import { useState } from "react";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { primitives, semantics, withDensity, type DensityMode } from "@tokens";

const { space } = primitives;
const { inset, stack, inline, gap, gutter } = semantics.spacing;

const FAMILIES = {
  inset: { tokens: inset, color: "#0094A9" },
  stack: { tokens: stack, color: "#222D5D" },
  inline: { tokens: inline, color: "#02B5CE" },
  gap: { tokens: gap, color: "#4B5563" },
} as const;

type Family = keyof typeof FAMILIES;

const DENSITY_LABELS: Record<DensityMode, string> = {
  comfortable: "Comfortable — default · mobile member-facing (P1)",
  compact: "Compact — back-office data tables, Sylvie (P5)",
  spacious: "Spacious — public landing sections (P7)",
};

const PRINCIPLE_CONTRACTS = [
  {
    n: 1,
    rule: "Mobile gutter = gutter.mobile (16)",
    anchor: "P1 / Julien",
    breaks: "Tighter eats thumb-zone; wider wastes screen on a 5.5\" phone in a glove.",
  },
  {
    n: 2,
    rule: "Primary touch target = 48pt, secondary = 44pt — never compressed by density",
    anchor: "P1 + P4",
    breaks: "Misses Julien gloved; misses WCAG 2.5.5.",
  },
  {
    n: 3,
    rule: "Min gap between two adjacent tappable targets = inline.snug (8)",
    anchor: "P4",
    breaks: "At 200% zoom the targets merge and become unhittable.",
  },
  {
    n: 4,
    rule: "Status pills (offline / syncing / stale) get inline.snug (8) from text — never flush",
    anchor: "P2",
    breaks: "Pill reads as part of the sentence, not as system state.",
  },
  {
    n: 5,
    rule: "Search bar gets stack.section (40) above the first result list",
    anchor: "P3",
    breaks: "Search stops feeling like the front door.",
  },
  {
    n: 6,
    rule: "Destructive confirmation modals use inset.comfortable (24)",
    anchor: "P5 / Sylvie",
    breaks: "Tight modals correlate with mis-taps.",
  },
  {
    n: 7,
    rule: "Public landing sections use stack.section (40)",
    anchor: "P6 + P7",
    breaks: "Tight rhythm reads as a wall of text to a scroll-skimmer.",
  },
  {
    n: 8,
    rule: "Back-office data tables run density='compact' — row padding inset.compact (8)",
    anchor: "P5",
    breaks: "Sylvie sees 6 items per screen instead of 12.",
  },
];

export default function SpacingPage() {
  const [density, setDensity] = useState<DensityMode>("comfortable");

  return (
    <>
      <PageHeader
        eyebrow="Foundations · v1.0"
        title="Spacing"
        lede="4pt base, hybrid step (4pt 0→16, 8pt 16→80). Primitive scale feeds four semantic families — inset, stack, inline, gap — plus breakpoint-aware gutters and three density modes for FFIE's three usage contexts."
      />

      {/* Density toggle */}
      <SectionHeading
        title="Density"
        description="One-step shift across every semantic family. Components honor density via withDensity()."
      />
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Density mode">
          {(Object.keys(DENSITY_LABELS) as DensityMode[]).map((mode) => {
            const active = mode === density;
            return (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setDensity(mode)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#027489] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-600">{DENSITY_LABELS[density]}</p>
      </div>

      {/* Primitive scale */}
      <SectionHeading
        title="Primitive scale"
        description="Raw values. Step numbers skipped from the scale (7, 9, 11…) do not exist."
      />
      <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-6">
        {Object.entries(space).map(([key, value]) => (
          <div key={key} className="flex items-center gap-4">
            <div className="w-20 shrink-0 text-right">
              <div className="text-xs font-mono uppercase text-gray-500">
                space.{key}
              </div>
            </div>
            <div className="w-16 shrink-0 text-right">
              <div className="text-xs text-gray-400">{value}pt</div>
            </div>
            <div className="flex-1">
              <div
                className="h-6 rounded-sm"
                style={{ width: value, background: "#0094A9" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Semantic families */}
      <SectionHeading
        title="Semantic families"
        description="Components read these — never the primitive scale directly."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {(Object.keys(FAMILIES) as Family[]).map((family) => (
          <FamilyCard key={family} family={family} density={density} />
        ))}
      </div>

      {/* Gutter (breakpoint-aware) */}
      <SectionHeading
        title="Gutter — page-level horizontal margin"
        description="Tied to breakpoint, not density. Density never shifts gutters."
      />
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Token</th>
              <th className="px-4 py-3 font-medium">Breakpoint</th>
              <th className="px-4 py-3 font-medium text-right">Value</th>
              <th className="px-4 py-3 font-medium">Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { name: "mobile", bp: "< 640 (sm)", v: gutter.mobile, why: "Julien one-handed on a worksite (P1)" },
              { name: "tablet", bp: "640–768 (sm–md)", v: gutter.tablet, why: "iPad / large phone landscape" },
              { name: "desktop", bp: "768–1280 (md–xl)", v: gutter.desktop, why: "Back-office default — Sylvie's monitor" },
              { name: "wide", bp: "≥ 1280 (xl)", v: gutter.wide, why: "Large desktop — readable line length" },
            ].map((row) => (
              <tr key={row.name}>
                <td className="px-4 py-3 font-mono text-xs">gutter.{row.name}</td>
                <td className="px-4 py-3 text-gray-600">{row.bp}</td>
                <td className="px-4 py-3 text-right font-mono">{row.v}pt</td>
                <td className="px-4 py-3 text-gray-600">{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Density worked example */}
      <SectionHeading
        title="Same card, three densities"
        description="A card asking for inset.default — resolved through withDensity() against the current mode."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {(["comfortable", "compact", "spacious"] as DensityMode[]).map((mode) => {
          const pad = withDensity("inset", "default", mode);
          const stk = withDensity("stack", "default", mode);
          const active = mode === density;
          return (
            <div
              key={mode}
              className={`rounded-lg border bg-white transition-colors ${
                active ? "border-[#0094A9] ring-2 ring-[#0094A9]/30" : "border-gray-200"
              }`}
              style={{ padding: pad }}
            >
              <div className="text-xs font-mono uppercase text-gray-500">{mode}</div>
              <div className="text-xs text-gray-400" style={{ marginTop: 2 }}>
                inset → {pad}pt · stack → {stk}pt
              </div>
              <div className="text-sm text-gray-900" style={{ marginTop: stk }}>
                Title of the card
              </div>
              <div className="text-sm text-gray-600" style={{ marginTop: stk }}>
                Body content. The inset and the rhythm between siblings shift together.
              </div>
            </div>
          );
        })}
      </div>

      {/* Persona-anchored contracts */}
      <SectionHeading
        title="Design contracts"
        description="Slips on any of these break a load-bearing principle. Recite-able rules."
      />
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="w-10 px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Rule</th>
              <th className="px-4 py-3 font-medium">Anchor</th>
              <th className="px-4 py-3 font-medium">Breaks if violated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {PRINCIPLE_CONTRACTS.map((c) => (
              <tr key={c.n}>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.n}</td>
                <td className="px-4 py-3 text-gray-900">{c.rule}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#222D5D]">{c.anchor}</td>
                <td className="px-4 py-3 text-gray-600">{c.breaks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-xs text-gray-500">
        Source: <code className="font-mono">project/design-system/SPACING.md</code> · tokens:{" "}
        <code className="font-mono">project/design-system/tokens.ts</code> v0.4
      </p>
    </>
  );
}

function FamilyCard({ family, density }: { family: Family; density: DensityMode }) {
  const { tokens: famTokens, color } = FAMILIES[family];
  const isVertical = family === "stack";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-gray-900">{family}</h3>
        <span className="text-xs text-gray-500">
          {family === "inset"
            ? "padding inside containers"
            : family === "stack"
              ? "vertical rhythm"
              : family === "inline"
                ? "horizontal row spacing"
                : "grid / flex gap"}
        </span>
      </div>
      <div className="space-y-2">
        {Object.entries(famTokens).map(([name, value]) => {
          const v = value as number;
          const shifted = name in famTokens && family !== "gap" && (family === "inset" || family === "stack" || family === "inline")
            ? safeWithDensity(family, name, density)
            : v;
          const isDifferent = shifted !== v;
          return (
            <div key={name} className="flex items-center gap-3">
              <div className="w-32 shrink-0">
                <div className="font-mono text-xs text-gray-700">
                  {family}.{name}
                </div>
                <div className="font-mono text-[10px] text-gray-400">
                  {v}pt
                  {isDifferent && (
                    <span className="ml-1 text-[#0094A9]">→ {shifted}pt @ {density}</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                {isVertical ? (
                  <div className="flex flex-col items-start">
                    <div className="h-2 w-24 rounded-sm bg-gray-300" />
                    <div style={{ height: shifted }} />
                    <div className="h-2 w-24 rounded-sm bg-gray-300" />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="h-6 w-12 rounded-sm bg-gray-300" />
                    <div style={{ width: shifted, height: 6, background: color }} />
                    <div className="h-6 w-12 rounded-sm bg-gray-300" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function safeWithDensity(family: Family, name: string, mode: DensityMode): number {
  if (family === "gap") {
    return (gap as Record<string, number>)[name];
  }
  try {
    // @ts-expect-error — runtime guard above narrows family; the helper's
    // generic constraint can't see that statically.
    return withDensity(family, name, mode);
  } catch {
    const fam = FAMILIES[family].tokens as Record<string, number>;
    return fam[name];
  }
}
