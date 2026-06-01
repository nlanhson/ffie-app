import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { version, lastUpdated, themes } from "@tokens";

export async function Nav() {
  const t = await getTranslations("Nav");

  const nav = [
    { href: "/", label: t("overview") },
    { href: "/foundations/color", label: t("color") },
    { href: "/foundations/typography", label: t("typography") },
    { href: "/foundations/spacing", label: t("spacing") },
    { href: "/foundations/sizing", label: t("sizing") },
    { href: "/foundations/motion", label: t("motion") },
    { href: "/foundations/radii", label: t("radii") },
    { href: "/foundations/elevation", label: t("elevation") },
    { href: "/themes", label: t("themes") },
    { href: "/tokens", label: t("tokens") },
    { href: "/flows", label: t("flows") },
    { href: "/components", label: t("components") },
    { href: "/components/input", label: `  · ${t("input")}` },
    { href: "/components/button", label: `  · ${t("button")}` },
    { href: "/components/status-pill", label: `  · ${t("statusPill")}` },
    { href: "/components/toast", label: `  · ${t("toast")}` },
    { href: "/components/modal", label: `  · ${t("modal")}` },
    { href: "/components/card", label: `  · ${t("card")}` },
  ];

  const navy = themes.light.brand.institutional;
  const teal = themes.light.brand.accent;

  return (
    <aside
      className="w-64 shrink-0 border-r border-gray-200 sticky top-0 h-screen overflow-y-auto"
      style={{ background: "#FAFBFC" }}
    >
      <div className="px-6 pt-6 pb-5 border-b border-gray-200">
        <Link href="/" className="flex items-start gap-3">
          <Image
            src="/logo-ffie.svg"
            alt="FFIE — Fédération Française des Intégrateurs Électriciens"
            width={44}
            height={37}
            priority
          />
          <div className="min-w-0">
            <div
              className="text-base font-semibold leading-tight"
              style={{ color: navy }}
            >
              FFIE
            </div>
            <div className="text-[11px] uppercase tracking-wider text-gray-500 leading-tight mt-0.5">
              {t("designSystem")}
            </div>
          </div>
        </Link>
        <div className="mt-3 flex items-center gap-2 text-[10px]">
          <span
            className="rounded-full px-1.5 py-0.5 font-mono font-semibold text-white"
            style={{ background: teal }}
          >
            v{version}
          </span>
          <span className="text-gray-400">
            {t("updated", { date: lastUpdated })}
          </span>
        </div>
        <div className="mt-3">
          <LocaleSwitcher />
        </div>
      </div>
      <nav className="flex flex-col gap-0.5 px-3 py-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-white hover:text-gray-900 transition"
          >
            <span className="relative">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-6 pb-6 mt-2">
        <a
          href="https://www.ffie.fr"
          target="_blank"
          rel="noreferrer"
          className="block text-[11px] text-gray-500 hover:text-gray-700"
        >
          ffie.fr ↗
        </a>
      </div>
    </aside>
  );
}
