import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { primitives, themes, version, lastUpdated } from "@tokens";

const cards = [
  { href: "/foundations/color", title: "Color", blurb: "Primitive ramps (50–950) including the FFIE brand navy + teal. Semantic bindings per theme, WCAG AAA/AA badges computed at render time." },
  { href: "/foundations/typography", title: "Typography", blurb: "1.25 modular scale on a 16pt base, system font stack, four weights, four line-heights." },
  { href: "/foundations/spacing", title: "Spacing", blurb: "4pt base. 4-step from 0–16, 8-step from 16+. Unitless RN-compatible numbers." },
  { href: "/foundations/sizing", title: "Sizing", blurb: "Touch targets (44 / 48 / 56) per P1. Icon sizes xs→xl." },
  { href: "/foundations/motion", title: "Motion", blurb: "Durations include the FFIE-specific 60000ms undo window (P5) and 600ms destructive confirm." },
  { href: "/foundations/radii", title: "Radii", blurb: "none → full pill, used consistently across components." },
  { href: "/foundations/elevation", title: "Elevation", blurb: "Structured per-platform tokens: { ios, android, web } for RN portability." },
  { href: "/themes", title: "Themes", blurb: "Switch between light, dark, and sunlight. Sunlight is a separate semantic theme — borders carry elevation, not shadows." },
  { href: "/tokens", title: "Tokens table", blurb: "Flat, searchable view of every primitive and theme binding." },
  { href: "/flows", title: "User flows", blurb: "Canonical scenarios from the personas brief, drawn against the design principles. Read each as a product contract." },
];

export default function OverviewPage() {
  const navy = themes.light.brand.institutional;
  const teal = themes.light.brand.accent;
  return (
    <>
      <section
        className="mb-10 rounded-2xl px-8 py-10 text-white"
        style={{
          background: `linear-gradient(135deg, ${navy} 0%, ${themes.light.brand.accent} 130%)`,
        }}
      >
        <div className="flex flex-wrap items-center gap-5">
          <div
            className="rounded-xl bg-white/10 p-3 backdrop-blur-sm"
            style={{ border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <Image
              src="/logo-ffie.svg"
              alt="FFIE logo"
              width={64}
              height={54}
              priority
            />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">
              Fédération Française des Intégrateurs Électriciens
            </div>
            <h1 className="mt-1 text-3xl font-bold leading-tight">
              FFIE Design System
            </h1>
            <p className="mt-2 text-sm text-white/80 max-w-2xl">
              <em>Construisons l’électricité, ensemble.</em> Live preview of
              the canonical token module powering the FFIE mobile app and
              back-office.
            </p>
          </div>
        </div>
      </section>

      <PageHeader
        eyebrow="Overview"
        title="What lives here"
        lede="Brand identity is now resolved against the live federation site. The teal anchor (#0094A9) and the institutional navy (#222D5D) below come directly from ffie.fr. Edits to tokens.ts hot-reload this preview automatically."
      >
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>
            <span className="font-mono text-gray-500">version</span>{" "}
            <strong className="text-gray-900">{version}</strong>
          </span>
          <span>
            <span className="font-mono text-gray-500">updated</span>{" "}
            <strong className="text-gray-900">{lastUpdated}</strong>
          </span>
          <span>
            <span className="font-mono text-gray-500">themes</span>{" "}
            <strong className="text-gray-900">
              {Object.keys(themes).length}
            </strong>
          </span>
          <span>
            <span className="font-mono text-gray-500">color ramps</span>{" "}
            <strong className="text-gray-900">
              {Object.keys(primitives.colors).filter(
                (k) => typeof (primitives.colors as Record<string, unknown>)[k] === "object"
              ).length}
            </strong>
          </span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group block rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-400 hover:shadow-sm transition"
          >
            <div className="text-base font-semibold text-gray-900 group-hover:text-gray-700">
              {c.title}
            </div>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              {c.blurb}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold" style={{ color: navy }}>
          Brand resolution
        </h2>
        <p className="mt-2 text-sm text-gray-700 leading-relaxed max-w-3xl">
          The brand layer was extracted from{" "}
          <a
            href="https://www.ffie.fr"
            target="_blank"
            rel="noreferrer"
            className="underline"
            style={{ color: teal }}
          >
            ffie.fr
          </a>{" "}
          on {lastUpdated}. The institutional navy{" "}
          <code className="font-mono bg-gray-100 px-1 rounded">#222D5D</code>{" "}
          comes from the federation logo; the teal CTA{" "}
          <code className="font-mono bg-gray-100 px-1 rounded">#0094A9</code>{" "}
          is the most-used color in the site’s compiled stylesheet (58
          occurrences). Both ramps live under{" "}
          <code className="font-mono bg-gray-100 px-1 rounded">
            primitives.colors.brand
          </code>
          . The previous indigo placeholder has been removed.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "brand.navy.700", value: "#222D5D", note: "Logo" },
            { label: "brand.teal.600", value: "#0094A9", note: "Primary CTA" },
            { label: "brand.teal.500", value: "#02B5CE", note: "Secondary" },
            { label: "brand.teal.400", value: "#04C6E2", note: "Highlight" },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-md border border-gray-200 overflow-hidden"
            >
              <div className="h-12" style={{ background: c.value }} />
              <div className="px-2 py-1.5 bg-white">
                <div className="font-mono text-[10px] text-gray-900">
                  {c.label}
                </div>
                <div className="font-mono text-[10px] text-gray-500 uppercase">
                  {c.value}
                </div>
                <div className="text-[10px] text-gray-500">{c.note}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold" style={{ color: navy }}>
          How this preview stays in sync
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-3xl">
          This Next.js app imports the canonical tokens module directly from{" "}
          <code className="font-mono text-gray-900 bg-gray-100 px-1 py-0.5 rounded">
            project/design-system/tokens.ts
          </code>{" "}
          via a webpack alias and{" "}
          <code className="font-mono text-gray-900 bg-gray-100 px-1 py-0.5 rounded">
            experimental.externalDir
          </code>
          . When a token value changes upstream, Next Fast Refresh re-renders
          the preview — no sync step. The contrast badges throughout the site
          are computed at render time from{" "}
          <code className="font-mono text-gray-900 bg-gray-100 px-1 py-0.5 rounded">
            src/lib/contrast.ts
          </code>
          , not hardcoded.
        </p>
      </section>
    </>
  );
}
