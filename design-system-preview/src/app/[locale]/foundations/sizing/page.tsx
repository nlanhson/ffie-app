import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { primitives } from "@tokens";

export default function SizingPage() {
  const { sizes } = primitives;

  return (
    <>
      <PageHeader
        eyebrow="Foundations"
        title="Sizing"
        lede="Touch targets are set against the principle 1 requirement (field-ready, gloved hands). WCAG 2.5.5 sets the absolute floor at 44pt; FFIE’s primary action floor is 48pt."
      />

      <SectionHeading
        title="Touch targets"
        description="Use comfortable (56pt) for hero CTAs on mobile; primary (48pt) for standard primary actions; secondary (44pt) is the absolute minimum."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Object.entries(sizes.touchTarget).map(([name, size]) => (
          <div
            key={name}
            className="rounded-lg border border-gray-200 bg-white p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-mono uppercase text-gray-500">
                {name}
              </div>
              <div className="text-xs text-gray-400">{size}pt</div>
            </div>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 font-medium text-white"
              style={{ height: size }}
            >
              {name} action
            </button>
          </div>
        ))}
      </div>

      <SectionHeading title="Icon sizes" />
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-end gap-8">
          {Object.entries(sizes.icon).map(([name, size]) => (
            <div key={name} className="text-center">
              <div
                className="mb-2 rounded-md bg-gray-200"
                style={{ width: size, height: size }}
              />
              <div className="text-xs font-mono uppercase text-gray-500">
                {name}
              </div>
              <div className="text-xs text-gray-400">{size}pt</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
