import { ContrastBadge } from "./ContrastBadge";

export function ColorSwatch({
  name,
  value,
  contrastOn,
}: {
  name: string;
  value: string;
  contrastOn?: string[];
}) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      <div className="h-20" style={{ background: value }} />
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900">{name}</div>
          <div className="text-xs font-mono text-gray-500 uppercase">
            {value}
          </div>
        </div>
        {contrastOn && contrastOn.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {contrastOn.map((bg) => (
              <ContrastBadge key={bg} fg={value} bg={bg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ColorRamp({
  name,
  ramp,
}: {
  name: string;
  ramp: Record<string | number, string>;
}) {
  const entries = Object.entries(ramp);
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-gray-900 capitalize">
        {name}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {entries.map(([step, hex]) => (
          <ColorSwatch
            key={step}
            name={`${name}.${step}`}
            value={hex}
            contrastOn={["#FFFFFF", "#000000"]}
          />
        ))}
      </div>
    </div>
  );
}
