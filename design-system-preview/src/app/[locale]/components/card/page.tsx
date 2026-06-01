"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Download, FileText, RefreshCw } from "lucide-react";

import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  Card,
  CardActions,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardMeta,
  CardRow,
  CardTitle,
} from "@/components/ds/Card";
import { useTheme } from "@/lib/theme-context";
import { semantics, type DensityMode, type ThemeName } from "@tokens";

const themeOrder: ThemeName[] = ["light", "dark", "sunlight"];
const densityOrder: DensityMode[] = ["compact", "comfortable", "spacious"];

export default function CardPreviewPage() {
  const t = useTranslations("CardPreview");
  const { themeName, setThemeName, theme } = useTheme();
  const [density, setDensity] = useState<DensityMode>("comfortable");

  return (
    <div style={{ color: theme.text.body }}>
      <PageHeader
        eyebrow="Component · v1.0"
        title="Card"
        lede={t("lede")}
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

      {/* Themed surface so dark + sunlight re-skin every Card live */}
      <div
        className="rounded-2xl p-8 space-y-12 border"
        style={{
          background: theme.surface.subtle,
          borderColor: theme.border.default,
        }}
      >
        {/* News feed item — the canonical Julien P1 card */}
        <section>
          <CardEyebrow>{t("newsFeed.eyebrow")}</CardEyebrow>
          <p className="text-sm text-gray-600 mb-4 max-w-2xl">
            {t("newsFeed.description")}
          </p>
          <Card
            density={density}
            themeName={themeName}
            interactive
            style={{ maxWidth: 540 }}
          >
            <CardHeader>
              <div style={{ display: "flex", alignItems: "flex-start", gap: semantics.spacing.inline.snug }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <CardEyebrow>{t("newsFeed.category")}</CardEyebrow>
                  <CardTitle style={{ marginTop: semantics.spacing.stack.tight }}>
                    {t("newsFeed.title")}
                  </CardTitle>
                </div>
                <CardActions>
                  <StatusPill name="fresh" size="sm" variant="subtle" themeName={themeName} />
                </CardActions>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{t("newsFeed.body")}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="primary" themeName={themeName} onPress={() => {}}>
                {t("newsFeed.read")}
              </Button>
              <Button size="sm" variant="ghost" themeName={themeName} onPress={() => {}}>
                {t("newsFeed.save")}
              </Button>
              <CardActions>
                <CardMeta>{t("newsFeed.meta")}</CardMeta>
              </CardActions>
            </CardFooter>
          </Card>
        </section>

        {/* Document library — three rows in a stack */}
        <section>
          <CardEyebrow>{t("docLibrary.eyebrow")}</CardEyebrow>
          <p className="text-sm text-gray-600 mb-4 max-w-2xl">
            {t("docLibrary.description")}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: semantics.spacing.stack.snug,
              maxWidth: 640,
            }}
          >
            <DocRow
              themeName={themeName}
              density={density}
              title={t("docLibrary.cableManagement")}
              meta={t("docLibrary.items.downloaded")}
              icon={<Download size={20} />}
              status={<StatusPill name="success" size="sm" themeName={themeName}>{t("docLibrary.items.downloaded").split(" · ")[0]}</StatusPill>}
            />
            <DocRow
              themeName={themeName}
              density={density}
              title={t("docLibrary.earthBonding")}
              meta={t("docLibrary.items.stale")}
              icon={<RefreshCw size={20} />}
              stale
              status={<StatusPill name="stale" size="sm" themeName={themeName} pulse>{t("docLibrary.items.stale").split(" — ")[0]}</StatusPill>}
            />
            <DocRow
              themeName={themeName}
              density={density}
              title={t("docLibrary.ceMarking")}
              meta={t("docLibrary.items.online")}
              icon={<FileText size={20} />}
              status={<StatusPill name="info" size="sm" variant="subtle" themeName={themeName}>{t("docLibrary.items.online").split(" · ")[0]}</StatusPill>}
            />
          </div>
        </section>

        {/* Back-office data table — compact density */}
        <section>
          <CardEyebrow>{t("backOffice.eyebrow")}</CardEyebrow>
          <p className="text-sm text-gray-600 mb-4 max-w-2xl">
            {t("backOffice.description")}
          </p>
          <Card density="compact" themeName={themeName} variant="outlined" style={{ padding: 0, maxWidth: 720 }}>
            <BackOfficeHeader themeName={themeName} t={t} />
            <BackOfficeRow themeName={themeName} title={t("backOffice.rows.ceMarking")} statusName="success" published="28 May" views="1 204" t={t} />
            <BackOfficeRow themeName={themeName} title={t("backOffice.rows.winterTraining")} statusName="syncing" published="—" views="—" t={t} />
            <BackOfficeRow themeName={themeName} title={t("backOffice.rows.memberDirectory")} statusName="fresh" published="26 May" views="847" t={t} />
          </Card>
        </section>

        {/* Stale state */}
        <section>
          <CardEyebrow>{t("stale.eyebrow")}</CardEyebrow>
          <p className="text-sm text-gray-600 mb-4 max-w-2xl">
            {t("stale.description")}
          </p>
          <Card density={density} themeName={themeName} stale style={{ maxWidth: 540, position: "relative" }}>
            <CardHeader>
              <div style={{ display: "flex", alignItems: "flex-start", gap: semantics.spacing.inline.snug }}>
                <div style={{ flex: 1 }}>
                  <CardEyebrow>{t("newsFeed.category")}</CardEyebrow>
                  <CardTitle style={{ marginTop: semantics.spacing.stack.tight }}>
                    {t("newsFeed.title")}
                  </CardTitle>
                </div>
                {/* StatusPill not dimmed — sits at full opacity above the stale layer */}
                <div style={{ position: "absolute", top: semantics.spacing.inset.default, right: semantics.spacing.inset.default, zIndex: 1 }}>
                  <StatusPill name="stale" size="sm" pulse themeName={themeName} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{t("newsFeed.body")}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="ghost" themeName={themeName} onPress={() => {}}>
                {t("newsFeed.read")}
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Public landing block — spacious */}
        <section>
          <CardEyebrow>{t("landing.eyebrow")}</CardEyebrow>
          <p className="text-sm text-gray-600 mb-4 max-w-2xl">
            {t("landing.description")}
          </p>
          <Card density="spacious" variant="raised" themeName={themeName} style={{ maxWidth: 720 }}>
            <CardHeader>
              <CardEyebrow>FFIE · Public</CardEyebrow>
              <CardTitle style={{ fontSize: 28, lineHeight: 1.2 }}>
                {t("landing.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription style={{ fontSize: 16 }}>
                {t("landing.body")}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button size="lg" variant="primary" themeName={themeName} onPress={() => {}}>
                {t("landing.explore")}
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>

      <SectionHeading title="Card contracts" />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { label: "Composition, not layout", body: "Sub-components describe semantic regions (Header / Content / Footer / Eyebrow / Title / Description / Meta / Actions / Row). Order them however the screen needs." },
          { label: "Density-aware padding", body: "inset.compact (8) for compact, inset.default (16) for comfortable, inset.comfortable (24) for spacious. Interactive primitives inside (Button, Input) keep their own size contracts — density NEVER compresses targets." },
          { label: "Stale = P2 contract", body: "stale={true} dims the inner content to opacity.stale (0.6). The StatusPill sits above the dimmed layer at full opacity — the user must SEE the status, that's the whole point." },
          { label: "Hover lift, sunlight border", body: "Light + dark: elevation.sm idle, hover lifts to elevation.md (120ms motion.fast). Sunlight: shadow-free — the border carries elevation (per the sunlight theme contract)." },
          { label: "Variants", body: "default (sm shadow), raised (md shadow), outlined (no shadow, stronger border), flat (no shadow, surface.subtle background). Pick the variant that matches what the surface is doing — not the look you're chasing." },
          { label: "Color through CSS variables in portals", body: "Background, border, and text colors flow through Tailwind utilities backed by the shadcn HSL bridge. ThemeProvider sets html[data-theme] so a Card in a Modal portal still renders the active theme." },
        ].map((c) => (
          <li key={c.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-sm font-semibold text-gray-900">{c.label}</div>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{c.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DocRow({
  title,
  meta,
  icon,
  status,
  themeName,
  density,
  stale,
}: {
  title: string;
  meta: string;
  icon: React.ReactNode;
  status: React.ReactNode;
  themeName: ThemeName;
  density: DensityMode;
  stale?: boolean;
}) {
  return (
    <Card density={density} themeName={themeName} interactive stale={stale}>
      <CardRow>
        <div
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            background: stale ? "transparent" : "rgba(0,0,0,0.04)",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <CardTitle style={{ fontSize: 16, lineHeight: 1.3 }}>{title}</CardTitle>
          <CardMeta style={{ marginTop: 2 }}>{meta}</CardMeta>
        </div>
        <CardActions>{status}</CardActions>
      </CardRow>
    </Card>
  );
}

function BackOfficeHeader({ themeName, t }: { themeName: ThemeName; t: ReturnType<typeof useTranslations> }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 100px 90px 80px",
        gap: semantics.spacing.inline.default,
        padding: `${semantics.spacing.inset.compact}px ${semantics.spacing.inset.default}px`,
        borderBottom: `1px solid hsl(var(--border))`,
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "hsl(var(--muted-foreground))",
      }}
    >
      <span>{t("backOffice.title")}</span>
      <span>{t("backOffice.status")}</span>
      <span>{t("backOffice.published")}</span>
      <span style={{ textAlign: "right" }}>{t("backOffice.views")}</span>
    </div>
  );
}

function BackOfficeRow({
  title,
  statusName,
  published,
  views,
  themeName,
  t,
}: {
  title: string;
  statusName: "success" | "syncing" | "fresh";
  published: string;
  views: string;
  themeName: ThemeName;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 100px 90px 80px",
        gap: semantics.spacing.inline.default,
        alignItems: "center",
        padding: `${semantics.spacing.inset.compact}px ${semantics.spacing.inset.default}px`,
        borderBottom: `1px solid hsl(var(--border))`,
        fontSize: 14,
      }}
    >
      <span style={{ fontWeight: 500, color: "hsl(var(--foreground))" }}>
        {title}
      </span>
      <StatusPill name={statusName} size="sm" variant="subtle" themeName={themeName} />
      <span style={{ color: "hsl(var(--muted-foreground))" }}>{published}</span>
      <span style={{ textAlign: "right", color: "hsl(var(--muted-foreground))" }}>{views}</span>
    </div>
  );
}
