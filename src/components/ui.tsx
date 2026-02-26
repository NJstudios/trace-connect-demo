import * as React from "react";
import { cn } from "../lib/utils";

export function Container(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", props.className)}>
      {props.children}
    </div>
  );
}

export function Card(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-soft",
        "transition-shadow",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

type ButtonVariant = "default" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }
) {
  const { className, variant = "default", size = "md", ...rest } = props;

  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold " +
    "transition active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none";

  const sizes = size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 text-sm";

  const variants =
    variant === "default"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : variant === "secondary"
        ? "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200"
        : "bg-transparent text-slate-700 hover:bg-slate-100";

  return <button className={cn(base, sizes, variants, className)} {...rest} />;
}

type BadgeTone = "neutral" | "info" | "ok" | "warn";

export function Badge(props: React.PropsWithChildren<{ tone?: BadgeTone; className?: string }>) {
  const { tone = "neutral" } = props;
  const toneCls =
    tone === "info"
      ? "bg-blue-50 text-blue-700 border-blue-100"
      : tone === "ok"
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : tone === "warn"
          ? "bg-amber-50 text-amber-800 border-amber-100"
          : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold", toneCls, props.className)}>
      {props.children}
    </span>
  );
}

export function Divider(props: { className?: string }) {
  return <div className={cn("h-px w-full bg-slate-200", props.className)} />;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900",
        "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900",
        "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300",
        props.className
      )}
    />
  );
}

export function StatTile(props: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-4", props.className)}>
      <div className="text-xs font-semibold text-slate-500">{props.label}</div>
      <div className="mt-1 text-base font-extrabold text-slate-900">{props.value}</div>
    </div>
  );
}
