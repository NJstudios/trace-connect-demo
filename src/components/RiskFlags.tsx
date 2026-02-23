import React from "react";
import type { RiskFlag } from "../types";
import { Badge, Card } from "./ui";
import { AlertTriangle } from "lucide-react";

function tone(sev: RiskFlag["severity"]) {
  if (sev === "High") return "danger";
  if (sev === "Medium") return "warn";
  return "ok";
}

export default function RiskFlags({ risks }: { risks: RiskFlag[] }) {
  const p50Delay = risks.reduce((s, r) => s + (r.delayDaysP50 ?? 0), 0);
  const p90Delay = risks.reduce((s, r) => s + (r.delayDaysP90 ?? 0), 0);
  const p50Cost = risks.reduce((s, r) => s + (r.costImpactP50 ?? 0), 0);
  const p90Cost = risks.reduce((s, r) => s + (r.costImpactP90 ?? 0), 0);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">Risk Flags</div>
          <div className="text-xs text-slate-400 mt-1">
            Issues detected early, before labor & materials are committed.
          </div>
        </div>
        <Badge tone="danger"><AlertTriangle className="h-3.5 w-3.5" /> {risks.length}</Badge>
      </div>

      {(p50Delay > 0 || p50Cost > 0) && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Badge tone="warn">P50 delay: {p50Delay}d</Badge>
          <Badge tone="warn">P90 delay: {p90Delay}d</Badge>
          <Badge tone="danger">P50 cost: ${p50Cost.toLocaleString()}</Badge>
          <Badge tone="danger">P90 cost: ${p90Cost.toLocaleString()}</Badge>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {risks.map(r => (
          <div key={r.id} className="rounded-xl border border-slate-800/70 bg-slate-900/30 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold">{r.title}</div>
              <Badge tone={tone(r.severity) as any}>{r.severity}</Badge>
            </div>
            <div className="mt-1 text-sm text-slate-300">{r.detail}</div>

            {(r.probability != null || r.delayDaysP50 != null || r.costImpactP50 != null) && (
              <div className="mt-2 text-xs text-slate-400 flex flex-wrap gap-2">
                {r.probability != null && <span>Prob {(r.probability * 100).toFixed(0)}%</span>}
                {r.delayDaysP50 != null && <span>Delay P50 {r.delayDaysP50}d</span>}
                {r.delayDaysP90 != null && <span>P90 {r.delayDaysP90}d</span>}
                {r.costImpactP50 != null && <span>Cost P50 ${r.costImpactP50.toLocaleString()}</span>}
              </div>
            )}

            {r.mitigation && (
              <div className="mt-2 text-xs text-slate-400">
                <span className="text-slate-300 font-semibold">Mitigation:</span> {r.mitigation}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
