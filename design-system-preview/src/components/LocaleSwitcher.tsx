"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onChange(next: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      className="inline-flex rounded-md border border-gray-200 bg-white p-0.5"
      role="radiogroup"
      aria-label={t("label")}
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(l)}
            disabled={isPending || active}
            className={`rounded px-2 py-0.5 text-[11px] font-mono uppercase transition ${
              active
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
            title={t(l)}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
