"use client";

import { useState } from "react";
import {
  ArrowRight,
  Download,
  Save,
  Trash2,
  Search,
  Wifi,
  AlertTriangle,
} from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { themes, type ThemeName, type DensityMode } from "@tokens";
import { Button, type ButtonVariant, type ButtonSize } from "@/components/ui/Button";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "destructive", "ghost"];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];
const THEMES: ThemeName[] = ["light", "dark", "sunlight"];
const DENSITIES: DensityMode[] = ["comfortable", "compact", "spacious"];

export default function ButtonPage() {
  const [density, setDensity] = useState<DensityMode>("comfortable");
  const [logLines, setLogLines] = useState<string[]>([]);

  const log = (line: string) => {
    setLogLines((prev) => [`${new Date().toLocaleTimeString()} · ${line}`, ...prev].slice(0, 8));
  };

  return (
    <>
      <PageHeader
        eyebrow="Components · v1.0"
        title="Button"
        lede="4 variants × 3 sizes × all states × 3 themes × 3 densities. The P5 forgive-the-editor contract lives here as confirm='undo' and confirm='hold'. Spec: project/design-system/components/Button.md."
      />

      {/* Density toggle (shared with all sections below) */}
      <SectionHeading title="Density" description="Shifts horizontal padding only. Height never drops below the size floor." />
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Density">
          {DENSITIES.map((m) => {
            const active = m === density;
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setDensity(m)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-[#027489] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Variant × theme grid */}
      <SectionHeading
        title="Variants × themes"
        description="Each cell is a real Button reading theme tokens. Press, hover, focus, all live."
      />
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Variant</th>
              {THEMES.map((t) => (
                <th key={t} className="px-4 py-3 font-medium">
                  {themes[t].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {VARIANTS.map((v) => (
              <tr key={v}>
                <td className="px-4 py-4 align-middle font-mono text-xs text-gray-700">{v}</td>
                {THEMES.map((tn) => (
                  <td
                    key={tn}
                    className="px-4 py-4 align-middle"
                    style={{ background: themes[tn].surface.default }}
                  >
                    {v === "destructive" ? (
                      <Button
                        variant="destructive"
                        confirm="undo"
                        themeName={tn}
                        density={density}
                        iconLeading={iconFor(v)}
                        onPress={() => log(`${v} · ${tn} · pressed`)}
                      >
                        {labelFor(v)}
                      </Button>
                    ) : (
                      <Button
                        variant={v}
                        themeName={tn}
                        density={density}
                        iconLeading={iconFor(v)}
                        onPress={() => log(`${v} · ${tn} · pressed`)}
                      >
                        {labelFor(v)}
                      </Button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sizes */}
      <SectionHeading
        title="Sizes"
        description="sm 40 · md 48 (default, P1 floor) · lg 56. sm is back-office-only on mobile."
      />
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-end gap-3">
          {SIZES.map((s) => (
            <Button
              key={s}
              size={s}
              density={density}
              iconLeading={Save}
              onPress={() => log(`size ${s} pressed`)}
            >
              Save offline
            </Button>
          ))}
        </div>
      </div>

      {/* States */}
      <SectionHeading
        title="States"
        description="Default, hover, pressed (interact), focus (tab to it), disabled, loading."
      />
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StateGroup label="Default" density={density}>
            <Button density={density} iconLeading={Download} onPress={() => log("default")}>
              Download
            </Button>
          </StateGroup>
          <StateGroup label="Disabled" density={density}>
            <Button density={density} disabled iconLeading={Download} onPress={() => log("disabled")}>
              Download
            </Button>
          </StateGroup>
          <StateGroup label="Loading" density={density}>
            <Button density={density} loading iconLeading={Download} onPress={() => log("loading")}>
              Download
            </Button>
          </StateGroup>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Tab through the buttons above to see the focus ring (theme.border.focus, 2pt offset, ≥3:1).
        </p>
      </div>

      {/* Width / icon-only */}
      <SectionHeading
        title="Width &amp; icon-only"
        description="Default = hug content (min-width 80). fullWidth = fill container. iconOnly forces a square footprint."
      />
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="max-w-md">
          <Button fullWidth density={density} iconLeading={Wifi} onPress={() => log("fullWidth")}>
            Save offline · 12 MB
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button iconOnly ariaLabel="Search" iconLeading={Search} density={density} onPress={() => log("iconOnly search")} />
          <Button iconOnly ariaLabel="Save" iconLeading={Save} variant="secondary" density={density} onPress={() => log("iconOnly save")} />
          <Button iconOnly ariaLabel="Delete" iconLeading={Trash2} variant="destructive" confirm="undo" density={density} onPress={() => log("iconOnly delete")} />
        </div>
      </div>

      {/* Destructive confirm modes — the P5 contract */}
      <SectionHeading
        title="Destructive — the P5 contract"
        description="confirm='undo' fires immediately (parent owns the 60s undo toast). confirm='hold' requires a 600ms press-and-hold."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">confirm=&quot;undo&quot;</h3>
          <p className="text-xs text-gray-600 mb-4">
            Soft destructive — unpublish news, hide from feed. Press fires immediately; parent surface
            must show an undo toast for motion.duration.undo (60s).
          </p>
          <Button
            variant="destructive"
            confirm="undo"
            density={density}
            iconLeading={AlertTriangle}
            onPress={() => log("UNDO-MODE: action fired (parent shows toast for 60s)")}
          >
            Unpublish news
          </Button>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">confirm=&quot;hold&quot;</h3>
          <p className="text-xs text-gray-600 mb-4">
            Hard destructive — delete account, permanently remove. Press &amp; HOLD for 600ms;
            release early cancels. Esc cancels.
          </p>
          <Button
            variant="destructive"
            confirm="hold"
            density={density}
            iconLeading={Trash2}
            onPress={() => log("HOLD-MODE: action fired after 600ms hold")}
          >
            Delete account
          </Button>
        </div>
      </div>

      {/* Side-by-side density worked example */}
      <SectionHeading
        title="Same Button, three densities"
        description="A primary md button under each density. Padding shifts; height floor holds."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {DENSITIES.map((m) => {
          const active = m === density;
          return (
            <div
              key={m}
              className={`rounded-lg border bg-white p-5 transition-colors ${
                active ? "border-[#0094A9] ring-2 ring-[#0094A9]/30" : "border-gray-200"
              }`}
            >
              <div className="text-xs font-mono uppercase text-gray-500 mb-3">{m}</div>
              <Button density={m} iconLeading={Save} onPress={() => log(`density-example ${m}`)}>
                Save
              </Button>
            </div>
          );
        })}
      </div>

      {/* Live press log */}
      <SectionHeading title="Press log" description="Most recent 8 events. Confirms onPress fires (or doesn't, for hold/cancel)." />
      <div className="rounded-lg border border-gray-200 bg-gray-950 p-4 font-mono text-xs text-green-400 min-h-[8rem]">
        {logLines.length === 0 ? (
          <span className="text-gray-500">No presses yet. Try the buttons above.</span>
        ) : (
          <ul className="space-y-1">
            {logLines.map((l, i) => (
              <li key={`${l}-${i}`}>{l}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Design contracts summary */}
      <SectionHeading title="Design contracts" description="Slips on any of these regress a load-bearing principle. From Button.md §9." />
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
        Spec: <code className="font-mono">project/design-system/components/Button.md</code> · tokens v0.5 ·{" "}
        component <code className="font-mono">src/components/ui/Button.tsx</code>
      </p>
    </>
  );
}

const CONTRACTS = [
  { contract: "md size ≥ 48×48pt, density never compresses it", principle: "P1 + P4", where: "Button.tsx SIZE_TABLE + containerStyle.height" },
  { contract: "Focus ring 2pt solid, 2pt offset, theme.border.focus", principle: "P4", where: "globals.css .ffie-button:focus-visible" },
  { contract: "Color is not the only differentiator (border on secondary, icon on destructive)", principle: "P4", where: "resolveVariant() + caller iconLeading default" },
  { contract: "Destructive variant REQUIRES confirm prop", principle: "P5", where: "ButtonProps discriminated union" },
  { contract: "confirm=\"undo\" parent must show toast for 60s", principle: "P5", where: "Button.md §6 + caller responsibility (audited at usage)" },
  { contract: "confirm=\"hold\" requires 600ms press; Esc cancels", principle: "P5", where: "beginHold/cancelHold + handleKeyDown" },
  { contract: "prefers-reduced-motion skips press scale, keeps spinner", principle: "P4 + motion-sensitivity", where: "reducedMotion state + transition string" },
];

function StateGroup({ label, density, children }: { label: string; density: DensityMode; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-mono uppercase text-gray-500 mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
      <div className="text-[10px] text-gray-400 mt-2 font-mono">density={density}</div>
    </div>
  );
}

function iconFor(v: ButtonVariant) {
  switch (v) {
    case "primary": return ArrowRight;
    case "secondary": return Save;
    case "destructive": return AlertTriangle;
    case "ghost": return Download;
  }
}
function labelFor(v: ButtonVariant) {
  switch (v) {
    case "primary": return "Save offline";
    case "secondary": return "Save draft";
    case "destructive": return "Delete";
    case "ghost": return "Edit";
  }
}
