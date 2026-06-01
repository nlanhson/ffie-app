"use client";

import { useState, type CSSProperties } from "react";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { primitives, type TextStyleName } from "@tokens";

const fontVar = {
  display: "var(--font-display)",
  brand: "var(--font-brand)",
  mono: "var(--font-mono)",
};

function familyVar(stack: string): string {
  // Inspect the first family in the stack and map it to the next/font-aware
  // CSS variable. Stays in lockstep with globals.css.
  if (stack.includes("Montserrat")) return fontVar.display;
  if (stack.includes("Museo")) return fontVar.brand;
  if (stack.includes("ui-monospace") || stack.includes("SFMono"))
    return fontVar.mono;
  return stack;
}

function applyTextStyle(
  style: (typeof primitives.textStyles)[TextStyleName],
  scale = 1
): CSSProperties {
  const css: CSSProperties = {
    fontFamily: familyVar(style.fontFamily as unknown as string),
    fontSize: (style.fontSize as number) * scale,
    lineHeight: style.lineHeight,
    fontWeight: style.fontWeight,
    letterSpacing:
      style.letterSpacing === 0
        ? 0
        : `${(style.letterSpacing as number).toFixed(3)}em`,
  };
  if ("textTransform" in style) {
    css.textTransform = style.textTransform;
  }
  return css;
}

const sampleByRole: Record<string, string> = {
  "display.lg": "Construisons l'électricité, ensemble.",
  "display.md": "Construisons l'électricité, ensemble.",
  "heading.h1": "New CE-marking requirements for low-voltage installations",
  "heading.h2": "Section 7.2 · Cable management",
  "heading.h3": "Clearance distance for cable trays",
  "heading.h4": "Worksite quick reference",
  "body.lg":
    "Updates to NF C 15-100 take effect 1 July 2026. Includes a checklist for residential installations completed after the effective date.",
  "body.md":
    "Julien works on rural sites with gloves on, in dead-zone cell signal, under direct sun. He needs a document found inside 60 seconds, every time.",
  "body.sm":
    "Cached today · last fetched 2 minutes ago. Available offline at the touch of a tile.",
  "label.lg": "Read the update",
  "label.md": "Saved to library",
  "label.sm": "Cached today",
  eyebrow: "News · Worksite",
  caption: "Last updated · 28 May 2026",
  code: "tokens.themes.light.action.primary.bg",
};

const scaleOptions = [
  { label: "100%", value: 1, note: "Default" },
  { label: "115%", value: 1.15, note: "iOS Dynamic Type +1" },
  { label: "135%", value: 1.35, note: "iOS Dynamic Type +3 / Android Large" },
  { label: "200%", value: 2.0, note: "Android Huge — WCAG SC 1.4.4" },
];

export default function TypographyPage() {
  const [scale, setScale] = useState(1);
  const { fontSizes, fontWeights, lineHeights, letterSpacings, fontFamilies, textStyles } =
    primitives;
  const activeScale = scaleOptions.find((s) => s.value === scale) ?? scaleOptions[0];

  return (
    <>
      <PageHeader
        eyebrow="Foundations"
        title="Typography"
        lede="A 1.25 modular scale on a 16pt base, paired with the FFIE brand fonts. Specimens below are rendered with Montserrat (display, loaded via next/font) and the brand stack (Museo Sans → system fallback). Dynamic-Type simulator stress-tests P4: every style must still read at 200% per WCAG 1.4.4."
      >
        <div className="mt-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-2">
            Dynamic-Type simulator
          </div>
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            {scaleOptions.map((opt) => {
              const active = opt.value === scale;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setScale(opt.value)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title={opt.note}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {activeScale.note}
          </div>
        </div>
      </PageHeader>

      <SectionHeading
        title="Text styles · semantic roles"
        description="The role table. Components reference these names — not the underlying primitives — so the scale can be rebalanced in one place."
      />
      <div className="space-y-6">
        {(Object.keys(textStyles) as TextStyleName[]).map((role) => {
          const style = textStyles[role];
          return (
            <div
              key={role}
              className="rounded-lg border border-gray-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
                <code className="text-xs font-mono text-gray-900">
                  textStyles[&quot;{role}&quot;]
                </code>
                <div className="font-mono text-[10px] text-gray-500 flex gap-3">
                  <span>{style.fontSize}pt</span>
                  <span>lh {style.lineHeight}</span>
                  <span>wt {style.fontWeight}</span>
                  <span>
                    ls{" "}
                    {style.letterSpacing === 0
                      ? "0"
                      : `${(style.letterSpacing as number).toFixed(3)}em`}
                  </span>
                </div>
              </div>
              <div
                className="text-gray-900"
                style={applyTextStyle(style, scale)}
              >
                {sampleByRole[role] ?? role}
              </div>
            </div>
          );
        })}
      </div>

      <SectionHeading
        title="Scale primitives"
        description="The raw sizes the role table is composed from. The xs→sm and 3xl→4xl steps drift from a pure 1.25 ratio — accepted in exchange for safe whole-number sizes."
      />
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {Object.entries(fontSizes).map(([name, size], i, arr) => {
          const prev = i > 0 ? (arr[i - 1][1] as number) : null;
          const ratio = prev ? ((size as number) / prev).toFixed(2) : "—";
          return (
            <div
              key={name}
              className="flex flex-wrap items-baseline gap-6 border-b border-gray-100 py-4 last:border-b-0 last:pb-0 first:pt-0"
            >
              <div className="w-28 shrink-0">
                <div className="text-xs font-mono uppercase text-gray-500">
                  {name}
                </div>
                <div className="text-xs text-gray-400">{size}pt</div>
                <div className="text-[10px] text-gray-400">
                  ×{ratio}
                </div>
              </div>
              <div
                className="text-gray-900 leading-tight flex-1"
                style={{ fontSize: (size as number) * scale }}
              >
                Construisons l&apos;électricité.
              </div>
            </div>
          );
        })}
      </div>

      <SectionHeading title="Weights" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Object.entries(fontWeights).map(([name, weight]) => (
          <div
            key={name}
            className="flex items-baseline justify-between rounded-lg border border-gray-200 bg-white p-4"
          >
            <div
              className="text-lg text-gray-900"
              style={{
                fontWeight: weight as number,
                fontSize: 18 * scale,
                fontFamily: fontVar.brand,
              }}
            >
              Field-ready over feature-rich.
            </div>
            <div className="text-right">
              <div className="text-xs font-mono uppercase text-gray-500">
                {name}
              </div>
              <div className="text-xs text-gray-400">{weight}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading title="Line heights" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.entries(lineHeights).map(([name, lh]) => (
          <div
            key={name}
            className="rounded-lg border border-gray-200 bg-white p-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-mono uppercase text-gray-500">
                {name}
              </div>
              <div className="text-xs text-gray-400">{lh}</div>
            </div>
            <p
              className="text-sm text-gray-900"
              style={{
                lineHeight: lh as number,
                fontSize: 14 * scale,
                fontFamily: fontVar.brand,
              }}
            >
              Julien works on rural sites with gloves on, in dead-zone cell
              signal, under direct sun. He needs a document found inside 60
              seconds, every time.
            </p>
          </div>
        ))}
      </div>

      <SectionHeading title="Letter spacings" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(letterSpacings).map(([name, em]) => (
          <div
            key={name}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase text-gray-500">{name}</span>
              <span className="text-gray-400">{em}em</span>
            </div>
            <div
              className="mt-2 text-base text-gray-900"
              style={{
                letterSpacing: `${em}em`,
                fontFamily: fontVar.brand,
                fontSize: 18 * scale,
              }}
            >
              CONSTRUISONS L&apos;ÉLECTRICITÉ
            </div>
          </div>
        ))}
      </div>

      <SectionHeading title="Font families" />
      <div className="space-y-3">
        {Object.entries(fontFamilies).map(([name, stack]) => {
          const usingNextFont = name === "display";
          return (
            <div
              key={name}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className="text-xs font-mono uppercase text-gray-500">
                    {name}
                  </span>
                  {usingNextFont && (
                    <span className="ml-2 inline-flex rounded border border-green-200 bg-green-50 px-1.5 py-0.5 font-mono text-[10px] text-green-900">
                      Montserrat loaded via next/font
                    </span>
                  )}
                  {name === "brand" && (
                    <span className="ml-2 inline-flex rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] text-amber-900">
                      Museo Sans · license TBC with FFIE
                    </span>
                  )}
                </div>
                <div className="font-mono text-[10px] text-gray-400 truncate max-w-md">
                  {stack}
                </div>
              </div>
              <div
                className="mt-2 text-gray-900"
                style={{
                  fontFamily: familyVar(stack),
                  fontSize: 22 * scale,
                }}
              >
                Fédération Française des Intégrateurs Électriciens — 1234567890
              </div>
            </div>
          );
        })}
      </div>

      <SectionHeading
        title="Dynamic-Type contract"
        description="The four contracts the type system commits to."
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          {
            label: "200% scale must still read",
            body:
              "Use the simulator above. Every text style above must remain legible and not overflow its container at 200%. WCAG 2.2 SC 1.4.4.",
          },
          {
            label: "allowFontScaling defaults true",
            body:
              "On React Native, body and label styles never opt out of OS text scaling. Display headings may cap at +1 only if container overflow becomes unworkable — never by default.",
          },
          {
            label: "Body floor is 16pt",
            body:
              "Per P4, no body.* role drops below 16pt. body.sm at 14pt is reserved for secondary metadata (timestamps, footnotes), never for the main reading flow.",
          },
          {
            label: "Uppercase needs tracking",
            body:
              "The eyebrow style is the only role with letterSpacing.wider (0.06em) — caps without tracking compress unreadably. Never set text-transform: uppercase without it.",
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
