import React, { useMemo } from "react";
import type { MaterialLineItem } from "../types";
import { formatUSD } from "../lib/money";
import { Badge, Card } from "./ui";

function tone(cat: MaterialLineItem["category"]) {
  switch (cat) {
    case "Concrete": return "info";
    case "Steel": return "warn";
    case "Wood": return "ok";
    case "MEP": return "danger";
    case "Finishes": return "info";
    case "Sitework": return "warn";
  }
}

export default function MaterialsTable({ items }: { items: MaterialLineItem[] }) {
  const totals = useMemo(() => {
    const total = items.reduce((sum, it) => sum + it.qty * it.unitCost, 0);
    return { total };
  }, [items]);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">Materials List (generated)</div>
          <div className="text-xs text-slate-400 mt-1">
            A preliminary bill of materials to reduce overspending risk.
          </div>
        </div>
        <Badge tone="warn">{formatUSD(totals.total)} est.</Badge>
      </div>

      <div className="mt-4 overflow-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-400">
            <tr className="border-b border-slate-800/70">
              <th className="py-2 text-left font-semibold">Category</th>
              <th className="py-2 text-left font-semibold">Item</th>
              <th className="py-2 text-right font-semibold">Qty</th>
              <th className="py-2 text-left font-semibold">Unit</th>
              <th className="py-2 text-right font-semibold">Unit Cost</th>
              <th className="py-2 text-right font-semibold">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const line = it.qty * it.unitCost;
              return (
                <tr key={it.id} className="border-b border-slate-800/50">
                  <td className="py-2 pr-4">
                    <Badge tone={tone(it.category) as any}>{it.category}</Badge>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="font-semibold">{it.name}</div>
                    {it.notes && <div className="text-xs text-slate-500">{it.notes}</div>}
                  </td>
                  <td className="py-2 pr-4 text-right text-slate-200">{it.qty.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-slate-200">{it.unit}</td>
                  <td className="py-2 pr-4 text-right text-slate-200">{formatUSD(it.unitCost)}</td>
                  <td className="py-2 text-right font-semibold">{formatUSD(line)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
