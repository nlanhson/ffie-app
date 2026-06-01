import Link from "next/link";
import { PageHeader, SectionHeading } from "@/components/PageHeader";

type Step = {
  id: string;
  number: string;
  screen: string;
  trigger: string;
  outcome: string;
  principles: string[];
  duration: string;
  branches?: { when: string; outcome: string; recovery?: string }[];
};

const steps: Step[] = [
  {
    id: "context",
    number: "0",
    screen: "Worksite — phone locked, in pocket",
    trigger:
      "Apprentice asks about the clearance distance for cable trays on a residential job in a rural area. Julien needs the relevant NF C 15-100 section to confirm.",
    outcome:
      "Decision: open the FFIE app. Hands are gloved, signal is one bar 4G or none.",
    principles: ["P1"],
    duration: "—",
  },
  {
    id: "unlock",
    number: "1",
    screen: "Unlock & open",
    trigger:
      "Wake phone, tap FFIE icon. Biometric prompt (Face ID / fingerprint) fires automatically.",
    outcome:
      "Home screen — primary action (Search) immediately visible. No password to type with gloves.",
    principles: ["P1", "P4"],
    duration: "~2s",
  },
  {
    id: "search",
    number: "2",
    screen: "Home → Search field",
    trigger:
      "Tap the 48pt search tile pinned at the top of the home screen. Search is the front door, not buried in a sub-menu.",
    outcome:
      "Search field focused, keyboard appears, voice-input icon visible. Recent queries and bookmarked docs shown as suggestions.",
    principles: ["P1", "P3"],
    duration: "~1s",
  },
  {
    id: "query",
    number: "3",
    screen: "Type or dictate query",
    trigger:
      "Julien types 'NF C 15-100' — autocompletes from a known-document index. Or holds the voice icon and dictates.",
    outcome:
      "Live, incremental results begin appearing after the 3rd character. Cached results show first; uncached results stream in below if online.",
    principles: ["P2", "P3"],
    duration: "~3s",
  },
  {
    id: "results",
    number: "4",
    screen: "Results list",
    trigger:
      "Scan the results. Each row shows: title, section, last-updated date, and an offline-status pill — Downloaded · Stale · Available online.",
    outcome:
      "The 2nd row is 'NF C 15-100 — §7.2 Cable management' with a green Downloaded pill and a stamp 'cached today'.",
    principles: ["P2", "P4"],
    duration: "~2s",
  },
  {
    id: "open",
    number: "5",
    screen: "Open document",
    trigger:
      "Tap the row. Touch target is 56pt to forgive gloved imprecision.",
    outcome:
      "Document opens immediately from local cache. No spinner, no network wait.",
    principles: ["P1", "P2"],
    duration: "~0.5s",
    branches: [
      {
        when: "Result was Stale (cached >7 days)",
        outcome:
          "Document opens immediately from cache, but a calm amber banner sits at the top: 'cached 12 days ago, refreshing in background'. The banner uses feedback.stale at opacity 0.6 — informational, never punitive.",
        recovery:
          "If the background fetch fails, the banner persists and offers a manual Refresh action.",
      },
      {
        when: "Result was Available online and there is no signal",
        outcome:
          "Tap reveals an inline state: 'No connection — we can't open this doc right now.' Two clear options: Try again when online (queues a fetch) or Pick a downloaded result instead (returns focus to results).",
        recovery:
          "No dead-end. The queued fetch retries automatically when the device regains signal and pushes a local notification when ready.",
      },
    ],
  },
  {
    id: "read",
    number: "6",
    screen: "Document viewer",
    trigger:
      "Pinch-zoom to readable scale, scroll to §7.2, or use the bottom-sheet section index. In-doc search reachable via a 48pt FAB.",
    outcome:
      "Julien reads the clearance value. Apprentice satisfied.",
    principles: ["P1", "P3"],
    duration: "~10s",
  },
  {
    id: "share",
    number: "7",
    screen: "Optional — share section",
    trigger:
      "Long-press the section heading to invoke the OS share-sheet (WhatsApp, mail, Signal). External share is in scope; in-app messaging is not (PRD §out-of-scope).",
    outcome:
      "Apprentice receives a deep link to the same section. Job continues.",
    principles: ["P1"],
    duration: "~3s",
  },
];

const principleColor: Record<string, string> = {
  P1: "bg-indigo-50 text-indigo-900 border-indigo-200",
  P2: "bg-amber-50 text-amber-900 border-amber-200",
  P3: "bg-blue-50 text-blue-900 border-blue-200",
  P4: "bg-green-50 text-green-900 border-green-200",
  P5: "bg-red-50 text-red-900 border-red-200",
  P6: "bg-gray-50 text-gray-900 border-gray-300",
  P7: "bg-gray-50 text-gray-900 border-gray-300",
};

const principleLabel: Record<string, string> = {
  P1: "P1 · Field-ready",
  P2: "P2 · Offline-default",
  P3: "P3 · Search front door",
  P4: "P4 · Accessibility floor",
  P5: "P5 · Forgive the editor",
  P6: "P6 · No public login wall",
  P7: "P7 · Substance over copy",
};

export default function JulienFindDocFlowPage() {
  return (
    <>
      <PageHeader
        eyebrow="Flow · Julien Marchand"
        title="Find a regulatory document on a worksite"
        lede="One canonical task, end-to-end. The success path is the spine; the offline and stale branches hang off step 5. Every step is annotated with the principles it’s honoring and an estimated wall-clock time."
      >
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Link
            href="/themes"
            className="rounded border border-gray-200 bg-white px-2 py-1 font-mono text-gray-700 hover:border-gray-400"
          >
            related → /themes
          </Link>
          <span className="rounded border border-gray-200 bg-white px-2 py-1 font-mono text-gray-700">
            stories: US-Library-search, US-Library-offline-read
          </span>
          <span className="rounded border border-gray-200 bg-white px-2 py-1 font-mono text-gray-700">
            target time-to-doc: &lt;60s
          </span>
        </div>
      </PageHeader>

      <SectionHeading
        title="Critical path"
        description="The success spine. Each node is a screen or state Julien moves through."
      />

      <ol className="relative">
        <span
          aria-hidden
          className="absolute left-5 top-2 bottom-2 w-px bg-gray-200"
        />
        {steps.map((step) => (
          <li key={step.id} className="relative pl-14 pb-8 last:pb-0">
            <span
              aria-hidden
              className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-900 bg-white font-mono text-sm font-semibold text-gray-900"
            >
              {step.number}
            </span>
            <article className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {step.screen}
                </h3>
                <span className="font-mono text-xs text-gray-500">
                  {step.duration}
                </span>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="inline font-semibold text-gray-900">
                    Trigger.{" "}
                  </dt>
                  <dd className="inline text-gray-700">{step.trigger}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-gray-900">
                    Outcome.{" "}
                  </dt>
                  <dd className="inline text-gray-700">{step.outcome}</dd>
                </div>
              </dl>
              {step.principles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {step.principles.map((p) => (
                    <span
                      key={p}
                      className={`rounded border px-2 py-0.5 font-mono text-[11px] ${principleColor[p] ?? ""}`}
                      title={principleLabel[p]}
                    >
                      {principleLabel[p] ?? p}
                    </span>
                  ))}
                </div>
              )}

              {step.branches && step.branches.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Branches from this step
                  </div>
                  {step.branches.map((b, i) => (
                    <div
                      key={i}
                      className="rounded-md border border-dashed border-amber-300 bg-amber-50/50 p-3"
                    >
                      <div className="text-xs font-semibold text-amber-900">
                        When · {b.when}
                      </div>
                      <p className="mt-1 text-sm text-gray-800 leading-relaxed">
                        {b.outcome}
                      </p>
                      {b.recovery && (
                        <p className="mt-1 text-sm text-gray-700">
                          <span className="font-semibold">Recovery. </span>
                          {b.recovery}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>
          </li>
        ))}
      </ol>

      <SectionHeading
        title="What this flow is committing the product to"
        description="Read these as design contracts. If any one of them slips, this flow fails."
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          {
            label: "Biometric default",
            body:
              "Password fallback exists but is never the first prompt. Gloved hands cannot type a strong password reliably.",
          },
          {
            label: "Search on home, not in a menu",
            body:
              "Tile placement is non-negotiable. Hidden behind a tab would break P3.",
          },
          {
            label: "Cache last 5 docs minimum, queryable offline",
            body:
              "Offline is the default, not a graceful fallback. The query must run on the local index whether or not signal is present.",
          },
          {
            label: "Status pills always shown, never hidden",
            body:
              "Downloaded · Stale · Available — three states, three visual tokens (feedback.success, feedback.stale, feedback.info), color and shape, never colour alone.",
          },
          {
            label: "No dead-ends on the offline branch",
            body:
              "Every blocked tap offers either a queued retry or a way back to a result that does work.",
          },
          {
            label: "60-second wall-clock budget",
            body:
              "Sum of step durations on the success path is ~22s. The 60s budget covers slow taps, glove fumbles, and the read time itself.",
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
