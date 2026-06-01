import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { ColorRamp, ColorSwatch } from "@/components/ColorSwatch";
import { ContrastBadge } from "@/components/ContrastBadge";
import { primitives, themes } from "@tokens";
import { formatRatio } from "@/lib/contrast";
import { lightness } from "@/lib/colorblind";
import {
  buildContrastCatalog,
  buildColorblindAudit,
  passesRequirement,
} from "@/lib/color-audit";

type Ramp = Record<string, string>;

function isRamp(v: unknown): v is Ramp {
  if (!v || typeof v !== "object") return false;
  return Object.values(v as Record<string, unknown>).every(
    (x) => typeof x === "string"
  );
}

function collectRamps(
  obj: Record<string, unknown>,
  prefix = ""
): [string, Ramp][] {
  const out: [string, Ramp][] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") continue;
    if (isRamp(v)) {
      out.push([prefix ? `${prefix}.${k}` : k, v]);
    } else if (v && typeof v === "object") {
      out.push(
        ...collectRamps(v as Record<string, unknown>, prefix ? `${prefix}.${k}` : k)
      );
    }
  }
  return out;
}

const verdictPalette = {
  distinct: "bg-green-100 text-green-900 border-green-200",
  marginal: "bg-amber-100 text-amber-900 border-amber-200",
  indistinguishable: "bg-red-100 text-red-900 border-red-200",
} as const;

export default function ColorPage() {
  const { colors } = primitives;
  const ramps = collectRamps(colors as unknown as Record<string, unknown>);
  const scalars = Object.entries(colors).filter(
    ([, v]) => typeof v === "string"
  ) as [string, string][];

  const catalog = buildContrastCatalog();
  const catalogByTheme = catalog.reduce<Record<string, typeof catalog>>(
    (acc, row) => {
      (acc[row.themeName] = acc[row.themeName] ?? []).push(row);
      return acc;
    },
    {}
  );
  const failures = catalog.filter((r) => !passesRequirement(r));

  const audit = buildColorblindAudit();
  const auditFailures = audit.filter(
    (r) => r.verdict === "indistinguishable" || r.verdict === "marginal"
  );

  return (
    <>
      <PageHeader
        eyebrow="Foundations"
        title="Color"
        lede="Primitive ramps live on the left side of the token model. Components never reference them directly — they go through one of the three semantic themes. Every audit below is computed live from tokens.ts: contrast badges from WCAG 2.x relative luminance, colour-blindness simulation from the Viénot 1999 LMS model, perceptual lightness from CIE Lab."
      >
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <span
            className={`rounded border px-2 py-1 font-mono ${
              failures.length === 0
                ? "bg-green-50 text-green-900 border-green-200"
                : "bg-red-50 text-red-900 border-red-200"
            }`}
          >
            Contrast catalog · {catalog.length - failures.length}/
            {catalog.length} pass
          </span>
          <span
            className={`rounded border px-2 py-1 font-mono ${
              auditFailures.length === 0
                ? "bg-green-50 text-green-900 border-green-200"
                : "bg-amber-50 text-amber-900 border-amber-200"
            }`}
          >
            Colour-blindness audit · {audit.length - auditFailures.length}/
            {audit.length} distinct
          </span>
        </div>
      </PageHeader>

      <SectionHeading
        title="Scalar primitives"
        description="Top-level color values that are not part of a ramp."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {scalars.map(([name, hex]) => (
          <ColorSwatch
            key={name}
            name={name}
            value={hex}
            contrastOn={["#FFFFFF", "#000000"]}
          />
        ))}
      </div>

      {ramps.map(([rampName, ramp]) => {
        const steps = Object.entries(ramp);
        return (
          <div key={rampName} className="mt-12">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-gray-900 capitalize">
                {rampName}
              </h3>
              <span className="text-[11px] font-mono text-gray-500">
                CIE L* progression
              </span>
            </div>
            <div className="mb-4 flex h-2 overflow-hidden rounded-full border border-gray-200">
              {steps.map(([k, hex]) => {
                const L = lightness(hex);
                return (
                  <div
                    key={k}
                    className="flex-1 relative"
                    style={{ background: hex }}
                    title={`${rampName}.${k} · L*=${L.toFixed(1)}`}
                  />
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {steps.map(([step, hex]) => (
                <ColorSwatch
                  key={step}
                  name={`${rampName}.${step}`}
                  value={hex}
                  contrastOn={["#FFFFFF", "#000000"]}
                />
              ))}
            </div>
          </div>
        );
      })}

      <SectionHeading
        title="Cross-theme contrast catalog"
        description="Every semantic pair × every theme, with the required threshold (AA 4.5:1 / AAA 7:1 / non-text AA 3:1) and whether the pair currently clears it. A red row is a tokens-level break in the design contract."
      />
      <div className="space-y-8">
        {(Object.keys(catalogByTheme) as Array<keyof typeof catalogByTheme>).map(
          (themeName) => {
            const rows = catalogByTheme[themeName];
            const themePass = rows.filter(passesRequirement).length;
            return (
              <div
                key={themeName}
                className="overflow-x-auto rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
                  <h3 className="text-sm font-semibold capitalize text-gray-900">
                    {themeName}
                  </h3>
                  <span className="text-xs font-mono text-gray-600">
                    {themePass}/{rows.length} pass
                  </span>
                </div>
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Pair</th>
                      <th className="px-4 py-2 font-semibold">Required</th>
                      <th className="px-4 py-2 font-semibold">Result</th>
                      <th className="px-4 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rows.map((row, i) => {
                      const ok = passesRequirement(row);
                      return (
                        <tr key={i} className={ok ? "" : "bg-red-50"}>
                          <td className="px-4 py-2 font-mono text-xs text-gray-900">
                            {row.pair}
                            <div className="font-mono text-[10px] text-gray-400 uppercase">
                              {row.fg} on {row.bg}
                            </div>
                          </td>
                          <td className="px-4 py-2 font-mono text-xs text-gray-700">
                            {row.required} ·{" "}
                            {row.required === "AAA"
                              ? "7:1"
                              : row.required === "AA"
                                ? "4.5:1"
                                : "3:1"}
                          </td>
                          <td className="px-4 py-2 font-mono text-xs text-gray-700">
                            {formatRatio(row.ratio)}
                          </td>
                          <td className="px-4 py-2">
                            <ContrastBadge fg={row.fg} bg={row.bg} />
                            {!ok && (
                              <span className="ml-2 inline-flex rounded border border-red-200 bg-red-100 px-1.5 py-0.5 font-mono text-[10px] text-red-900">
                                BELOW {row.required}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }
        )}
      </div>

      <SectionHeading
        title="Colour-blindness independence audit"
        description="For each load-bearing semantic pair, this simulates how the two colors look to a person with deuteranopia, protanopia, or tritanopia, then computes the CIE ΔE between the simulated pair. ΔE < 5 means a glance can’t tell them apart — that pair must be backed up by shape, icon, or text per P4."
      />
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-3 py-2 font-semibold">Theme</th>
              <th className="px-3 py-2 font-semibold">Semantic pair</th>
              <th className="px-3 py-2 font-semibold">Dichromacy</th>
              <th className="px-3 py-2 font-semibold">Original</th>
              <th className="px-3 py-2 font-semibold">Simulated</th>
              <th className="px-3 py-2 font-semibold">ΔE</th>
              <th className="px-3 py-2 font-semibold">Verdict</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {audit.map((row, i) => (
              <tr key={i}>
                <td className="px-3 py-2 font-mono text-xs text-gray-600 uppercase">
                  {row.themeName}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-gray-900">
                  {row.pair[0]} vs {row.pair[1]}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-gray-700 capitalize">
                  {row.type}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="h-5 w-5 rounded border border-gray-300"
                      style={{ background: row.hexA }}
                      title={row.hexA}
                    />
                    <div
                      className="h-5 w-5 rounded border border-gray-300"
                      style={{ background: row.hexB }}
                      title={row.hexB}
                    />
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="h-5 w-5 rounded border border-gray-300"
                      style={{ background: row.simA }}
                      title={row.simA}
                    />
                    <div
                      className="h-5 w-5 rounded border border-gray-300"
                      style={{ background: row.simB }}
                      title={row.simB}
                    />
                  </div>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-gray-700">
                  {row.delta.toFixed(1)}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex rounded border px-1.5 py-0.5 font-mono text-[10px] capitalize ${verdictPalette[row.verdict]}`}
                  >
                    {row.verdict}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeading
        title="How to read this"
        description="The four findings the system is committing to and how the audit enforces them."
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          {
            label: "AAA body text on every surface",
            body:
              "Per P4, text.body / surface.* must clear 7:1 in every theme. The catalog above goes red if any binding slips.",
          },
          {
            label: "offline ≠ syncing under colour blindness",
            body:
              "These two are the FFIE-specific load-bearing pair (P2). Amber vs teal — designed to never collapse to the same hue under any of the three common dichromacies. ΔE must stay > 5.",
          },
          {
            label: "danger never collapses to success",
            body:
              "Red-vs-green is the textbook deuteranopia failure. We accept that the colors converge perceptually and require icon + text reinforcement everywhere they appear.",
          },
          {
            label: "Brand surfaces still legible",
            body:
              "action.primary uses the FFIE teal in light/dark and the deeper navy in sunlight. The catalog verifies white-on-each clears AA at every step.",
          },
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
    </>
  );
}
