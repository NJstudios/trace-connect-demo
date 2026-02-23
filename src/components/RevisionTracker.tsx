import React from "react";
import { Card, Badge, Button, Divider } from "./ui";
import { GitBranch, RefreshCcw } from "lucide-react";

type Revision = {
  id: string;
  author: string;
  note: string;
  ts: string;
};

const REV: Revision[] = [
  { id: "A", author: "AI Generator", note: "Initial model + schedule + BOM generated", ts: "Today" },
  { id: "B", author: "PM Review", note: "Updated long-lead procurement dates + risk flags", ts: "Today" },
  { id: "C", author: "Estimator", note: "Refreshed vendor pricing + lead times", ts: "Today" },
];

export default function RevisionTracker() {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-sky-300" /> Revision tracking
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Judge-friendly: shows how changes propagate across model, schedule, and materials.
          </div>
        </div>
        <Badge tone="info">Demo</Badge>
      </div>

      <Divider />

      <div className="mt-3 space-y-2">
        {REV.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-800/70 bg-slate-900/30 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold">Revision {r.id}</div>
              <div className="text-xs text-slate-500">{r.ts}</div>
            </div>
            <div className="mt-1 text-sm text-slate-300">{r.note}</div>
            <div className="mt-2 text-xs text-slate-400">By {r.author}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="subtle" onClick={() => alert("Demo: compare revisions")}>Compare</Button>
        <Button variant="ghost" onClick={() => alert("Demo: refresh pricing")}> <RefreshCcw className="h-4 w-4" /> Refresh</Button>
      </div>
    </Card>
  );
}
