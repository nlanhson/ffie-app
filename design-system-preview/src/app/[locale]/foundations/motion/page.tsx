"use client";

import { useState } from "react";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { primitives } from "@tokens";

const noteByDuration: Record<string, string> = {
  instant: "0ms — used when reduced-motion is on or no transition is desired.",
  fast: "120ms — press feedback, hover changes. Below this and it stops feeling responsive.",
  base: "200ms — most transitions. Default if unsure.",
  slow: "320ms — modal enter, drawer slide. Long enough to read direction.",
  confirm: "600ms — P5 destructive confirm reveal. Long enough that an editor pauses.",
  undo: "60,000ms — P5 undo window. Not a transition, a *commitment* duration.",
};

export default function MotionPage() {
  const { motion } = primitives;
  const [tick, setTick] = useState(0);

  return (
    <>
      <PageHeader
        eyebrow="Foundations"
        title="Motion"
        lede="Durations and easings, including the FFIE-specific tokens that encode product behavior — the 600ms destructive confirm reveal and the 60s undo window. Both come from principle 5: forgive the editor."
      />

      <SectionHeading title="Durations" />
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <button
          type="button"
          onClick={() => setTick((t) => t + 1)}
          className="mb-6 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          Replay animations ({tick})
        </button>
        <div className="space-y-4">
          {Object.entries(motion.duration).map(([name, ms]) => {
            const visible = ms <= 1000; // skip the 60s undo from running visibly
            return (
              <div
                key={name}
                className="grid grid-cols-12 items-center gap-4 border-t border-gray-100 pt-4 first:border-t-0 first:pt-0"
              >
                <div className="col-span-3">
                  <div className="text-sm font-mono text-gray-900">{name}</div>
                  <div className="text-xs text-gray-400">{ms}ms</div>
                </div>
                <div className="col-span-9">
                  <div className="relative h-2 rounded-full bg-gray-100 overflow-hidden">
                    {visible ? (
                      <div
                        key={tick}
                        className="absolute left-0 top-0 h-full bg-blue-500"
                        style={{
                          width: "100%",
                          animation: `grow ${ms}ms cubic-bezier(0.4,0,0.2,1) forwards`,
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-gray-500">
                        {ms.toLocaleString()}ms — outside replay range
                      </div>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {noteByDuration[name]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SectionHeading title="Easings" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Object.entries(motion.easing).map(([name, curve]) => (
          <div
            key={name}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="text-xs font-mono uppercase text-gray-500">
              {name}
            </div>
            <div className="mt-1 font-mono text-[11px] text-gray-700">
              {curve}
            </div>
          </div>
        ))}
      </div>

      <style>{`@keyframes grow { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }`}</style>
    </>
  );
}
