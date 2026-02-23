import React from "react";
import clsx from "clsx";

export function Stepper({ steps, activeIndex }: { steps: string[]; activeIndex: number }) {
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <div key={s} className="flex items-center gap-3">
            <div
              className={clsx(
                "h-8 w-8 rounded-full grid place-items-center text-xs font-extrabold border",
                done && "bg-emerald-400/15 border-emerald-400/40 text-emerald-200",
                active && "bg-sky-400/15 border-sky-400/40 text-sky-200",
                !done && !active && "bg-slate-900/40 border-slate-700/60 text-slate-400"
              )}
            >
              {i + 1}
            </div>
            <div className={clsx("text-sm font-semibold", active ? "text-slate-50" : done ? "text-slate-200" : "text-slate-500")}>
              {s}
            </div>
            {i < steps.length - 1 && <div className="h-px w-8 bg-slate-700/60" />}
          </div>
        );
      })}
    </div>
  );
}
