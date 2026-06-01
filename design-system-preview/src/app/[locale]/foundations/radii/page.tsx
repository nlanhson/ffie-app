import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { primitives } from "@tokens";

export default function RadiiPage() {
  const { radii } = primitives;
  return (
    <>
      <PageHeader
        eyebrow="Foundations"
        title="Radii"
        lede="Corner radii. `full` is the pill / circular treatment."
      />
      <SectionHeading title="Scale" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(radii).map(([name, r]) => (
          <div
            key={name}
            className="rounded-lg border border-gray-200 bg-white p-4 text-center"
          >
            <div
              className="mx-auto mb-3 h-20 w-20 bg-gray-900"
              style={{ borderRadius: r === 9999 ? 9999 : r }}
            />
            <div className="text-xs font-mono uppercase text-gray-500">
              {name}
            </div>
            <div className="text-xs text-gray-400">
              {r === 9999 ? "full" : `${r}pt`}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
