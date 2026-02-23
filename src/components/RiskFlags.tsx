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

      <div className="mt-4 space-y-3">
        {risks.map(r => (
          <div key={r.id} className="rounded-xl border border-slate-800/70 bg-slate-900/30 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold">{r.title}</div>
              <Badge tone={tone(r.severity) as any}>{r.severity}</Badge>
            </div>
            <div className="mt-1 text-sm text-slate-300">{r.detail}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
