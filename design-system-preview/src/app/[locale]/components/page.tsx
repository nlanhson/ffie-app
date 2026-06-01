import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const components = [
  {
    href: "/components/input",
    name: "Input",
    status: "v1.0",
    blurb:
      "Text + search + password + email. Density-aware (40 / 48 / 56pt heights). Owns the focus-ring contract and the form-labelling rules.",
  },
  {
    href: "/components/button",
    name: "Button",
    status: "v1.0",
    blurb:
      "4 variants × 3 sizes × full-width / hug / icon-only. Press feedback, loading spinner, two destructive confirm modes (undo + hold-to-confirm), reduced-motion aware. The P5 forgive-the-editor contract is encoded here.",
  },
  {
    href: "/components/status-pill",
    name: "StatusPill",
    status: "v1.0",
    blurb:
      "8 statuses × 2 variants (filled / subtle) × 3 sizes. Shape + icon + label each independently carry meaning — the rotating syncing icon is the mitigation for the colorblind audit's marginal sunlight pair. The P2 offline-first contract lives in the offline / syncing / stale / fresh quartet.",
  },
  {
    href: "/components/toast",
    name: "Toast",
    status: "v1.0",
    blurb:
      "8 statuses + toast.undo(). Closes the parent half of Button confirm=\"undo\" — 60s window, pause-on-hover, pause-on-focus. Top-center on phone (thumb-reachable), bottom-right on desktop. Composes a filled md StatusPill as the leading mark; danger uses role='alert' + aria-live='assertive'. Promote-by-id pattern for syncing → success/danger.",
  },
  {
    href: "/components/modal",
    name: "Modal",
    status: "v1.0",
    blurb:
      "Composable Modal primitives (FFIE re-exports of Radix Dialog) plus a ConfirmModal convenience component. The modal IS the confirmation step (P5) — destructive variant closes immediately and fires a 60s undo toast via sonner. Three semantic variants (info / confirm / destructive) with matching feedback color + icon.",
  },
  {
    href: "/components/card",
    name: "Card",
    status: "v1.0",
    blurb:
      "Composition primitive for any row-like or block-like surface: news feed item (P1), document library row (P2), back-office compact data row (P5), public landing block (P7). Owns the P2 stale=true treatment (opacity.stale 0.6) and density-aware padding. Composes with StatusPill + Button + textStyles roles. The last component before Stage 3 screens.",
  },
];

const planned: { name: string; blurb: string }[] = [];

export default function ComponentsIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Components"
        lede="Reference implementations that consume the design system end-to-end. Each component spec lives in project/design-system/components/ and the live preview here renders all variants, states, and densities against the active theme."
      />

      <div className="grid grid-cols-1 gap-4">
        {components.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group block rounded-lg border border-gray-200 bg-white p-6 hover:border-gray-400 hover:shadow-sm transition"
          >
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                {c.name}
              </h2>
              <span className="rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-xs font-mono text-green-900">
                {c.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-2xl">
              {c.blurb}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Planned next
        </h2>
        <ul className="space-y-2">
          {planned.map((p) => (
            <li
              key={p.name}
              className="flex items-baseline gap-3 rounded-md border border-dashed border-gray-300 bg-gray-50/40 p-3"
            >
              <span className="font-mono text-sm font-semibold text-gray-700">
                {p.name}
              </span>
              <span className="text-sm text-gray-600">{p.blurb}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
