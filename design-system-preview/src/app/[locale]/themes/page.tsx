"use client";

import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { ContrastBadge } from "@/components/ContrastBadge";
import { useTheme } from "@/lib/theme-context";
import { themes, type ThemeName, primitives } from "@tokens";

const themeOrder: ThemeName[] = ["light", "dark", "sunlight"];

export default function ThemesPage() {
  const { themeName, setThemeName, theme } = useTheme();

  return (
    <>
      <PageHeader
        eyebrow="Foundations"
        title="Themes"
        lede="Three semantic themes share the primitive ramps. Sunlight is a separate first-class theme — borders carry elevation instead of shadows, and every text pair clears AAA outdoors."
      >
        <div className="mt-2 inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {themeOrder.map((name) => {
            const active = name === themeName;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setThemeName(name)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {themes[name].label}
              </button>
            );
          })}
        </div>
      </PageHeader>

      <SectionHeading
        title="Live preview"
        description="A small component built only from this theme’s semantic tokens. Switch above to see the same component re-skin."
      />
      <div
        className="rounded-2xl p-8 border"
        style={{
          background: theme.surface.default,
          borderColor: theme.border.default,
          color: theme.text.body,
          boxShadow:
            themeName === "sunlight" ? "none" : primitives.elevation.md.web,
        }}
      >
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div
              className="text-xs font-mono uppercase tracking-wider"
              style={{ color: theme.text.muted }}
            >
              News · Worksite
            </div>
            <h3
              className="mt-1 text-2xl font-semibold"
              style={{ color: theme.text.body }}
            >
              New CE-marking requirements for low-voltage installations
            </h3>
            <p
              className="mt-2 max-w-2xl text-sm"
              style={{ color: theme.text.muted }}
            >
              Updates to NF C 15-100 take effect 1 July 2026. Includes a
              checklist for residential installations completed after the
              effective date.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: theme.feedback.offline,
                color: "#000",
              }}
            >
              Offline copy
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: theme.feedback.syncing,
                color: "#fff",
              }}
            >
              Syncing
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium"
            style={{
              background: theme.action.primary.bg,
              color: theme.action.primary.fg,
            }}
          >
            Read the update
          </button>
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium"
            style={{
              background: theme.action.destructive.bg,
              color: theme.action.destructive.fg,
            }}
          >
            Remove from saved
          </button>
        </div>
      </div>

      <SectionHeading title="Semantic bindings" />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {[
          { label: "surface.default", value: theme.surface.default },
          { label: "surface.subtle", value: theme.surface.subtle },
          { label: "surface.raised", value: theme.surface.raised },
          { label: "border.default", value: theme.border.default },
          { label: "border.subtle", value: theme.border.subtle },
          { label: "text.body", value: theme.text.body },
          { label: "text.muted", value: theme.text.muted },
          { label: "text.inverse", value: theme.text.inverse },
          { label: "action.primary.bg", value: theme.action.primary.bg },
          { label: "action.primary.fg", value: theme.action.primary.fg },
          { label: "action.destructive.bg", value: theme.action.destructive.bg },
          { label: "action.destructive.fg", value: theme.action.destructive.fg },
          { label: "feedback.success", value: theme.feedback.success },
          { label: "feedback.warning", value: theme.feedback.warning },
          { label: "feedback.danger", value: theme.feedback.danger },
          { label: "feedback.info", value: theme.feedback.info },
          { label: "feedback.offline", value: theme.feedback.offline },
          { label: "feedback.syncing", value: theme.feedback.syncing },
          { label: "feedback.stale", value: theme.feedback.stale },
          { label: "state.gated.public", value: theme.state.gated.public },
          {
            label: "state.gated.memberOnly",
            value: theme.state.gated.memberOnly,
          },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
          >
            <div
              className="h-8 w-8 shrink-0 rounded border border-gray-200"
              style={{ background: row.value }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xs text-gray-900 truncate">
                {row.label}
              </div>
              <div className="font-mono text-xs text-gray-500 uppercase">
                {row.value}
              </div>
            </div>
            <ContrastBadge fg={row.value} bg={theme.surface.default} />
          </div>
        ))}
      </div>
    </>
  );
}
