import type { ReactNode } from "react";
import { themes } from "@tokens";

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  const navy = themes.light.brand.institutional;
  return (
    <header className="mb-10 border-b border-gray-200 pb-8">
      {eyebrow && (
        <div
          className="mb-2 text-xs font-semibold uppercase tracking-wider"
          style={{ color: navy }}
        >
          {eyebrow}
        </div>
      )}
      <h1
        className="text-3xl font-bold mb-3"
        style={{ color: navy }}
      >
        {title}
      </h1>
      {lede && (
        <p className="text-base text-gray-600 leading-relaxed max-w-3xl">
          {lede}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}

export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 mt-12">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
}
