"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { tokens } from "@tokens";

type Row = { path: string; value: string; category: string };

function flatten(
  obj: unknown,
  category: string,
  prefix: string[],
  acc: Row[]
): void {
  if (obj === null || obj === undefined) return;
  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    acc.push({
      path: prefix.join("."),
      value: String(obj),
      category,
    });
    return;
  }
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      flatten(v, category, [...prefix, k], acc);
    }
  }
}

function buildRows(): Row[] {
  const rows: Row[] = [];
  for (const [primName, primValue] of Object.entries(tokens.primitives)) {
    flatten(primValue, "primitive", ["primitives", primName], rows);
  }
  for (const [themeName, themeValue] of Object.entries(tokens.themes)) {
    flatten(themeValue, `theme.${themeName}`, ["themes", themeName], rows);
  }
  return rows;
}

export default function TokensPage() {
  const allRows = useMemo(() => buildRows(), []);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return allRows;
    const needle = q.toLowerCase();
    return allRows.filter(
      (r) =>
        r.path.toLowerCase().includes(needle) ||
        r.value.toLowerCase().includes(needle) ||
        r.category.toLowerCase().includes(needle)
    );
  }, [allRows, q]);

  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="Tokens"
        lede="Every token in the canonical module, flattened into a single searchable table. Use this to verify a value, check a path, or grep by keyword."
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by path or value, e.g. indigo, undo, gray.900"
          className="mt-4 w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
        />
        <div className="mt-2 text-xs text-gray-500">
          {filtered.length} of {allRows.length} tokens
        </div>
      </PageHeader>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Path</th>
              <th className="px-4 py-3 font-semibold">Value</th>
              <th className="px-4 py-3 font-semibold">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((r) => (
              <tr key={`${r.category}-${r.path}`}>
                <td className="px-4 py-2 font-mono text-xs text-gray-900">
                  {r.path}
                </td>
                <td className="px-4 py-2">
                  {r.value.startsWith("#") ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded border border-gray-200"
                        style={{ background: r.value }}
                      />
                      <span className="font-mono text-xs text-gray-700 uppercase">
                        {r.value}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-gray-700">
                      {r.value}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-gray-500">
                  {r.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
