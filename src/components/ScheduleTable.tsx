import React, { useMemo } from "react";
import type { ScheduleTask } from "../types";
import { addDaysIso, formatShortDate, clamp } from "../lib/date";
import { Badge, Card } from "./ui";
import clsx from "clsx";

function phaseTone(phase: ScheduleTask["phase"]) {
  switch (phase) {
    case "Design": return "info";
    case "Precon": return "warn";
    case "Procurement": return "danger";
    case "Construction": return "ok";
  }
}

export default function ScheduleTable({ startDateIso, tasks }: { startDateIso: string; tasks: ScheduleTask[] }) {
  const computed = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => a.startOffsetDays - b.startOffsetDays);
    const maxEnd = Math.max(...sorted.map(t => t.startOffsetDays + t.durationDays));
    return { sorted, maxEnd };
  }, [tasks]);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">Schedule (generated)</div>
          <div className="text-xs text-slate-400 mt-1">
            Automatically built WBS + dates from the selected template.
          </div>
        </div>
        <Badge tone="info">{computed.maxEnd} days</Badge>
      </div>

      <div className="mt-4 overflow-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-400">
            <tr className="border-b border-slate-800/70">
              <th className="py-2 text-left font-semibold">Task</th>
              <th className="py-2 text-left font-semibold">Owner</th>
              <th className="py-2 text-left font-semibold">Phase</th>
              <th className="py-2 text-left font-semibold">Dates</th>
              <th className="py-2 text-left font-semibold">Flags</th>
              <th className="py-2 text-left font-semibold">Timeline</th>
            </tr>
          </thead>
          <tbody>
            {computed.sorted.map((t) => {
              const start = addDaysIso(startDateIso, t.startOffsetDays);
              const end = addDaysIso(startDateIso, t.startOffsetDays + t.durationDays);
              const leftPct = (t.startOffsetDays / computed.maxEnd) * 100;
              const widthPct = (t.durationDays / computed.maxEnd) * 100;
              return (
                <tr key={t.id} className="border-b border-slate-800/50">
                  <td className="py-2 pr-4">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.durationDays}d • starts day {t.startOffsetDays}</div>
                  </td>
                  <td className="py-2 pr-4 text-slate-200">{t.owner}</td>
                  <td className="py-2 pr-4">
                    <Badge tone={phaseTone(t.phase) as any}>{t.phase}</Badge>
                  </td>
                  <td className="py-2 pr-4 text-slate-200">
                    {formatShortDate(start)} → {formatShortDate(end)}
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {t.critical && <Badge tone="warn">Critical</Badge>}
                      {t.milestone && <Badge tone="info">Milestone</Badge>}
                      {!t.critical && !t.milestone && <span className="text-xs text-slate-500">—</span>}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="h-3 w-full rounded-full bg-slate-900/50 border border-slate-800/60 relative overflow-hidden">
                      <div
                        className={clsx(
                          "absolute top-0 h-full rounded-full",
                          t.critical ? "bg-amber-400/70" : "bg-sky-500/55"
                        )}
                        style={{
                          left: `${clamp(leftPct, 0, 100)}%`,
                          width: `${clamp(widthPct, 0, 100)}%`,
                        }}
                      />

                      {t.milestone && (
                        <div
                          className="absolute -top-1.5 h-6 w-6 rotate-45 bg-slate-100/80"
                          style={{ left: `${clamp(leftPct + widthPct - 1, 0, 99)}%` }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
