import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { primitives } from "@tokens";

export default function ElevationPage() {
  const { elevation } = primitives;
  return (
    <>
      <PageHeader
        eyebrow="Foundations"
        title="Elevation"
        lede="Elevation tokens are structured per-platform: { ios, android, web }. The web string renders here; the iOS shadow object and Android elevation number ship to React Native."
      />
      <SectionHeading title="Scale" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(elevation).map(([name, levels]) => (
          <div
            key={name}
            className="rounded-lg bg-gray-50 p-8 flex items-center justify-center"
          >
            <div
              className="rounded-lg bg-white px-5 py-6 w-full max-w-[200px]"
              style={{ boxShadow: (levels as { web: string }).web }}
            >
              <div className="text-xs font-mono uppercase text-gray-500">
                elevation.{name}
              </div>
              <div className="mt-1 text-xs text-gray-400 truncate">
                {(levels as { web: string }).web === "none"
                  ? "—"
                  : (levels as { web: string }).web.split(",")[0]}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading
        title="Per-platform values"
        description="The same elevation token exposes a tuned value for each runtime."
      />
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-3 py-2 font-semibold">Token</th>
              <th className="px-3 py-2 font-semibold">iOS</th>
              <th className="px-3 py-2 font-semibold">Android</th>
              <th className="px-3 py-2 font-semibold">Web</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.entries(elevation).map(([name, levels]) => {
              const l = levels as {
                ios: Record<string, unknown>;
                android: Record<string, unknown>;
                web: string;
              };
              return (
                <tr key={name}>
                  <td className="px-3 py-2 font-mono text-gray-900">
                    elevation.{name}
                  </td>
                  <td className="px-3 py-2 font-mono text-gray-600 align-top">
                    {JSON.stringify(l.ios)}
                  </td>
                  <td className="px-3 py-2 font-mono text-gray-600 align-top">
                    {JSON.stringify(l.android)}
                  </td>
                  <td className="px-3 py-2 font-mono text-gray-600 align-top">
                    {l.web}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
