import { contrastRatio, gradeContrast, formatRatio } from "@/lib/contrast";

const palette = {
  AAA: "bg-green-100 text-green-900 border-green-200",
  AA: "bg-blue-100 text-blue-900 border-blue-200",
  "AA-large": "bg-amber-100 text-amber-900 border-amber-200",
  Fail: "bg-red-100 text-red-900 border-red-200",
} as const;

export function ContrastBadge({ fg, bg }: { fg: string; bg: string }) {
  const r = contrastRatio(fg, bg);
  const grade = gradeContrast(r);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 font-mono text-[10px] ${palette[grade]}`}
      title={`fg ${fg} on bg ${bg}`}
    >
      <span className="font-semibold">{grade}</span>
      <span>{formatRatio(r)}</span>
    </span>
  );
}
