import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/lib/theme-context";
import { Toaster } from "@/components/ui/toaster";
import { routing } from "@/i18n/routing";

import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "FFIE Design System",
  description:
    "Live preview of the FFIE design tokens, themes, and foundations.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={montserrat.variable}>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <NextIntlClientProvider>
          <ThemeProvider>
            <div className="flex min-h-screen">
              <Nav />
              <main className="flex-1 p-10 max-w-6xl">{children}</main>
            </div>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
