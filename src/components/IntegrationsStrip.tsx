import React from "react";

const ITEMS = [
  "Autodesk / Revit export",
  "Procore sync",
  "IFC / RVT",
  "Schedule CSV",
  "BOM CSV",
  "Cloud audit log",
];

export default function IntegrationsStrip() {
  return (
    <div className="flex flex-wrap gap-2">
      {ITEMS.map((t) => (
        <span
          key={t}
          className="rounded-full border border-slate-800/70 bg-slate-900/30 px-2 py-1 text-xs text-slate-300"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
