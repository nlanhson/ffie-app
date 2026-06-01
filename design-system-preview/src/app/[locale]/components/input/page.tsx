"use client";

import { useState } from "react";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { Input, type InputDensity } from "@/components/ds/Input";
import { useTheme } from "@/lib/theme-context";
import type { ThemeName } from "@tokens";

export default function InputPage() {
  const { themeName, setThemeName, theme } = useTheme();
  const [density, setDensity] = useState<InputDensity>("comfortable");
  const [search, setSearch] = useState("NF C 15-100");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("xVL9!Worksite");
  const [invalidEmail, setInvalidEmail] = useState("julien.marchand");

  const themeOrder: ThemeName[] = ["light", "dark", "sunlight"];
  const densityOrder: InputDensity[] = ["compact", "comfortable", "spacious"];

  // Tint the page surface so dark theme actually looks dark.
  const pageSurface = theme.surface.default;
  const pageText = theme.text.body;

  return (
    <div style={{ color: pageText }}>
      <PageHeader
        eyebrow="Component · v1.0"
        title="Input"
        lede="Text + search + password + email variants. The component owns the focus-ring contract, the label/helper/error layout, and the density → height mapping. Every state below is live — switch theme + density to stress-test."
      >
        <div className="mt-4 flex flex-wrap gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              Theme
            </div>
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              {themeOrder.map((name) => {
                const active = name === themeName;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setThemeName(name)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              Density
            </div>
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              {densityOrder.map((d) => {
                const active = d === density;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDensity(d)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </PageHeader>

      {/* All renderings happen inside this themed surface so the component
          actually shows the active theme. */}
      <div
        className="rounded-2xl p-8 space-y-10 border"
        style={{
          background: pageSurface,
          borderColor: theme.border.default,
        }}
      >
        <Variant label="Search · canonical Julien flow step 3">
          <Input
            variant="search"
            density={density}
            placeholder="Search documents"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            label="Library search"
            helperText="Searches cached titles first — works offline."
          />
        </Variant>

        <Variant label="Text · with label + helper">
          <Input
            density={density}
            label="Company name"
            placeholder="Marchand Électricité SARL"
            helperText="As registered with the FFIE federation."
          />
        </Variant>

        <Variant label="Required · email">
          <Input
            variant="email"
            density={density}
            required
            label="Email"
            placeholder="prenom.nom@entreprise.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Variant>

        <Variant label="Error state · aria-invalid + role=alert">
          <Input
            variant="email"
            density={density}
            label="Email"
            value={invalidEmail}
            onChange={(e) => setInvalidEmail(e.target.value)}
            error="That doesn't look like an email address."
          />
        </Variant>

        <Variant label="Password · show/hide toggle">
          <Input
            variant="password"
            density={density}
            label="Password"
            placeholder="••••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            helperText="At least 12 characters. Biometric is the default — this is the fallback."
          />
        </Variant>

        <Variant label="Disabled">
          <Input
            density={density}
            label="Federation ID"
            value="FFIE-2026-04719"
            disabled
            helperText="Generated by the FFIE member registry — read-only."
          />
        </Variant>
      </div>

      <SectionHeading title="Anatomy" />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { label: "Height contract", body: "40 (compact) / 48 (comfortable, default) / 56 (spacious). Always fixed — paddings flex to fill." },
          { label: "Border (idle)", body: "theme.border.strong — clears WCAG 1.4.11 non-text 3:1 against the surface." },
          { label: "Border (focus)", body: "theme.border.focus + a 2pt outer ring with 2pt offset. Total focus indicator is 4pt thick — visible at arm's length even with gloves." },
          { label: "Error state", body: "aria-invalid='true' + role='alert' on the message. Border switches to feedback.danger; ring follows." },
          { label: "Label", body: "Real <label> with htmlFor. Required state shows a visible '*' AND aria-required. Placeholder is NEVER the label." },
          { label: "Helper / error", body: "aria-describedby points at exactly one — error wins when present. Stack gap is stack.tight (4)." },
        ].map((card) => (
          <li
            key={card.label}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="text-sm font-semibold text-gray-900">
              {card.label}
            </div>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              {card.body}
            </p>
          </li>
        ))}
      </ul>

      <SectionHeading title="Token recipe" />
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-2 font-semibold">Slot</th>
              <th className="px-4 py-2 font-semibold">Token</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-mono text-xs">
            {[
              ["background", "theme.surface.default"],
              ["background (disabled)", "theme.surface.subtle"],
              ["border (idle)", "theme.border.strong"],
              ["border (focus)", "theme.border.focus"],
              ["border (error)", "theme.feedback.danger"],
              ["text", "theme.text.body"],
              ["placeholder", "theme.text.placeholder"],
              ["label / helper", "theme.text.muted"],
              ["error text", "theme.feedback.danger"],
              ["icon color", "theme.text.muted"],
              ["horizontal inset", "inset.default (16) · inset.compact in compact"],
              ["label → field gap", "stack.tight (4)"],
              ["field → helper gap", "stack.tight (4)"],
              ["icon → text gap", "inline.snug (8)"],
              ["corner radius", "radii.md (8)"],
              ["focus transition", "motion.duration.fast (120ms)"],
            ].map(([slot, token]) => (
              <tr key={slot}>
                <td className="px-4 py-2 text-gray-900">{slot}</td>
                <td className="px-4 py-2 text-gray-700">{token}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Variant({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 font-mono">
        {label}
      </div>
      <div style={{ maxWidth: 420 }}>{children}</div>
    </div>
  );
}
