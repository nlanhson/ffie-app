import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const flows = [
  {
    href: "/flows/julien-find-doc",
    persona: "Julien Marchand · primary member",
    title: "Find a regulatory document on a worksite",
    blurb:
      "The canonical stress-test of principles 1, 2 and 3 — gloved hands, dead-zone signal, search as the front door, offline-first results.",
    coverage: ["P1", "P2", "P3", "P4"],
    stories: ["US-Library-search", "US-Library-offline-read"],
  },
];

export default function FlowsIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="User flows"
        lede="Each flow shown here is a canonical scenario from the personas brief, drawn against the design principles. Read it as a contract — every decision shown here is one the product is committed to honoring."
      />
      <div className="grid grid-cols-1 gap-4">
        {flows.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group block rounded-lg border border-gray-200 bg-white p-6 hover:border-gray-400 hover:shadow-sm transition"
          >
            <div className="text-xs font-mono uppercase tracking-wider text-gray-500">
              {f.persona}
            </div>
            <h2 className="mt-1 text-lg font-semibold text-gray-900 group-hover:text-gray-700">
              {f.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-2xl">
              {f.blurb}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {f.coverage.map((p) => (
                <span
                  key={p}
                  className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-mono text-gray-700"
                >
                  {p}
                </span>
              ))}
              <span className="text-xs text-gray-400">·</span>
              {f.stories.map((s) => (
                <span
                  key={s}
                  className="text-xs font-mono text-gray-500"
                >
                  {s}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
