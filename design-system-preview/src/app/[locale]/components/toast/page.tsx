"use client";

import { useRef, useState } from "react";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { toast, type ToastId } from "@/components/ui/Toast";
import { Trash2, Save, RefreshCw, WifiOff } from "lucide-react";

export default function ToastPage() {
  const [logLines, setLogLines] = useState<string[]>([]);
  const syncingIdRef = useRef<ToastId | null>(null);
  const [undoCount, setUndoCount] = useState(0);

  const log = (line: string) => {
    setLogLines((p) => [`${new Date().toLocaleTimeString()} · ${line}`, ...p].slice(0, 10));
  };

  return (
    <>
      <PageHeader
        eyebrow="Components · v1.0"
        title="Toast"
        lede="8 statuses + the P5 undo helper. Closes the parent half of the Button confirm='undo' contract (60s window). Slides in from top-center on phone, bottom-right on desktop. Pause-on-hover + pause-on-focus + swipe-to-dismiss + Esc-to-dismiss. Spec: project/design-system/components/Toast.md."
      />

      {/* Status fire row */}
      <SectionHeading
        title="Fire each status"
        description="Each call to toast.{name}(message, opts?). Defaults from Toast.md §3 — danger + syncing stay open until manually dismissed."
      />
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onPress={() => { toast.success("News publiée"); log("toast.success"); }}>success</Button>
          <Button variant="secondary" size="sm" onPress={() => { toast.warning("Connexion instable", { description: "Vos modifications seront enregistrées localement." }); log("toast.warning + description"); }}>warning + desc</Button>
          <Button variant="secondary" size="sm" onPress={() => { toast.danger("Échec de la synchronisation", { description: "2 documents n'ont pas pu être envoyés.", action: { label: "Réessayer", onClick: () => log("retry pressed") } }); log("toast.danger + action"); }}>danger + retry</Button>
          <Button variant="secondary" size="sm" onPress={() => { toast.info("Astuce : balayez pour fermer"); log("toast.info"); }}>info</Button>
          <Button variant="secondary" size="sm" onPress={() => { toast.offline("Hors-ligne", { description: "Modifications enregistrées localement." }); log("toast.offline"); }}>offline</Button>
          <Button variant="secondary" size="sm" onPress={() => { toast.stale("Cache obsolète", { description: "Tirez pour rafraîchir." }); log("toast.stale"); }}>stale</Button>
          <Button variant="secondary" size="sm" onPress={() => { toast.fresh("À jour"); log("toast.fresh (3s)"); }}>fresh</Button>
          <Button variant="ghost" size="sm" onPress={() => { toast.dismiss(); log("dismiss all"); }}>dismiss all</Button>
        </div>
      </div>

      {/* P5 — undo */}
      <SectionHeading
        title="P5 — toast.undo (60 s window)"
        description="The parent half of Button confirm='undo'. Fires the destructive action immediately, then shows an Undo affordance for motion.duration.undo (60 000 ms). Hovering or tabbing into the toast pauses the timer."
      />
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="destructive"
            confirm="undo"
            iconLeading={Trash2}
            onPress={() => {
              setUndoCount((n) => n + 1);
              log("destructive fired → toast.undo shown");
              toast.undo("Article retiré du fil", {
                description: "Disparu pour les membres jusqu'à annulation.",
                onUndo: () => {
                  setUndoCount((n) => Math.max(0, n - 1));
                  log("UNDO — article restored");
                },
              });
            }}
          >
            Retirer l'article
          </Button>
          <span className="text-sm text-gray-500">Articles retirés (non annulés) · {undoCount}</span>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          The Button fires <code className="font-mono">onPress</code> immediately; the toast surface is responsible for the 60s window. This is the load-bearing P5 contract — see Button.md §6 and Toast.md §6.
        </p>
      </div>

      {/* Promote — syncing → success/danger */}
      <SectionHeading
        title="Promote pattern — syncing → success / danger"
        description="A long-running action mounts a syncing toast, then promotes it in place by reusing the same id. Container stays put; content cross-fades."
      />
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            size="sm"
            iconLeading={Save}
            onPress={() => {
              const id = toast.syncing("Sauvegarde…");
              syncingIdRef.current = id;
              log(`syncing mounted (id=${String(id)})`);
              window.setTimeout(() => {
                toast.success("Sauvegardé", { id });
                log(`promote → success (id=${String(id)})`);
                syncingIdRef.current = null;
              }, 1800);
            }}
          >
            Simulate save (success)
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconLeading={Save}
            onPress={() => {
              const id = toast.syncing("Sauvegarde…");
              log(`syncing mounted (id=${String(id)})`);
              window.setTimeout(() => {
                toast.danger("Échec de la sauvegarde", {
                  id,
                  description: "La connexion a été perdue à mi-parcours.",
                  action: { label: "Réessayer", onClick: () => log("retry pressed (from promoted danger)") },
                });
                log(`promote → danger (id=${String(id)})`);
              }, 1800);
            }}
          >
            Simulate save (failure)
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeading={RefreshCw}
            onPress={() => {
              if (syncingIdRef.current != null) {
                toast.dismiss(syncingIdRef.current);
                log("syncing dismissed manually");
                syncingIdRef.current = null;
              } else {
                log("nothing syncing to dismiss");
              }
            }}
          >
            Dismiss in-flight syncing
          </Button>
        </div>
      </div>

      {/* Stacking */}
      <SectionHeading
        title="Stacking"
        description="Up to 3 toasts visible (sonner visibleToasts=3). Newer ones push older down (top) or up (bottom). Hover to expand the stack."
      />
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onPress={() => {
              ["Première", "Deuxième", "Troisième", "Quatrième", "Cinquième"].forEach((label, i) => {
                window.setTimeout(() => toast.info(`${label} notification`), i * 250);
              });
              log("fired 5 toasts at 250ms intervals");
            }}
          >
            Fire 5 in a row
          </Button>
          <Button
            variant="secondary"
            size="sm"
            iconLeading={WifiOff}
            onPress={() => {
              toast.offline("Hors-ligne", { description: "Le contenu peut être périmé. Reconnexion automatique dès que possible." });
              log("offline toast (long description, 6s)");
            }}
          >
            Long description (4-line cap)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onPress={() => {
              toast.success("Document avec un titre extrêmement long qui devrait être tronqué par les pointillés à un endroit donné");
              log("long title → truncate");
            }}
          >
            Long title → truncate
          </Button>
        </div>
      </div>

      {/* Position policy */}
      <SectionHeading
        title="Position policy"
        description="< md viewport: top-center (thumb-reachable on Julien's worksite phone). ≥ md: bottom-right. Set on the Toaster host, never per toast."
      />
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-700 leading-relaxed">
        <p>Resize the window across <code className="font-mono">768px</code> to see the host re-mount in the other corner. The toaster re-keys on position change so sonner picks up the new position cleanly.</p>
      </div>

      {/* Log */}
      <SectionHeading
        title="Event log"
        description="Confirms each toast helper, undo callbacks, and promote-by-id behavior."
      />
      <div className="rounded-lg border border-gray-200 bg-gray-950 p-4 font-mono text-xs text-green-400 min-h-[8rem]">
        {logLines.length === 0 ? (
          <span className="text-gray-500">No events yet. Fire a toast above.</span>
        ) : (
          <ul className="space-y-1">
            {logLines.map((l, i) => (
              <li key={`${l}-${i}`}>{l}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Design contracts */}
      <SectionHeading title="Design contracts" description="Slips on any of these regress P5 (undo) or P4 (a11y). From Toast.md §9." />
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
        Spec: <code className="font-mono">project/design-system/components/Toast.md</code> · tokens v0.6 ·{" "}
        component <code className="font-mono">src/components/ui/Toast.tsx</code> · host{" "}
        <code className="font-mono">src/components/ui/toaster.tsx</code>
      </p>
    </>
  );
}

const CONTRACTS = [
  { contract: "toast.undo default duration === motion.duration.undo (60 000 ms)", principle: "P5", where: "Toast.tsx toast.undo()" },
  { contract: "Hover + Tab focus pause the dismiss timer for ALL stacked toasts (sonner v2 defaults)", principle: "P5 + P4", where: "toaster.tsx + sonner runtime" },
  { contract: "danger toasts use role='alert' + aria-live='assertive'; others polite", principle: "P4", where: "Toast.tsx isAssertive()" },
  { contract: "Toast does NOT steal focus on mount", principle: "P4", where: "Toast.tsx ToastRow (no autoFocus)" },
  { contract: "prefers-reduced-motion swaps slide for opacity fade", principle: "P4 + motion-sensitivity", where: "sonner default + globals.css" },
  { contract: "Promote via id: syncing → success/danger cross-fades content, container stable", principle: "P2", where: "Toast.tsx show() + sonnerToast.custom(opts.id)" },
  { contract: "Action button label + dismiss button each reach 44pt touch target", principle: "P1 / WCAG 2.5.5", where: "Toast.tsx actionBtnStyle / dismissBtnStyle" },
  { contract: "Position top-center < md, bottom-right ≥ md (set on host, never per-toast)", principle: "P1", where: "toaster.tsx pickPosition()" },
  { contract: "Leading StatusPill mandatory — color is the third signal, not the first", principle: "P4", where: "Toast.tsx ToastRow (StatusPill always rendered)" },
];
