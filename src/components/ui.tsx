import React from "react";
import clsx from "clsx";

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "subtle" }) {
  const { variant = "primary", className, ...rest } = props;
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles: Record<string, string> = {
    primary: "bg-slate-100 hover:bg-white text-slate-950 shadow-soft",
    subtle: "bg-slate-900/35 hover:bg-slate-900/55 text-slate-100 border border-slate-800/70",
    ghost: "bg-transparent hover:bg-slate-900/35 text-slate-100",
    danger: "bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-soft",
  };
  return <button className={clsx(base, styles[variant], className)} {...rest} />;
}

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={clsx("glass rounded-2xl shadow-soft", className)} {...rest} />;
}

export function Badge(props: React.HTMLAttributes<HTMLSpanElement> & { tone?: "ok" | "warn" | "danger" | "info" }) {
  const { tone = "info", className, ...rest } = props;
  const tones: Record<string, string> = {
    ok: "bg-emerald-400/10 text-emerald-200 border-emerald-400/30",
    warn: "bg-amber-400/10 text-amber-200 border-amber-400/30",
    danger: "bg-rose-400/10 text-rose-200 border-rose-400/30",
    info: "bg-sky-400/10 text-sky-200 border-sky-400/30",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...rest}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      className={clsx(
        "w-full rounded-xl bg-slate-900/40 border border-slate-700/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 " +
          "focus:outline-none focus:ring-2 focus:ring-sky-400/50",
        className
      )}
      {...rest}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props;
  return (
    <select
      className={clsx(
        "w-full rounded-xl bg-slate-900/40 border border-slate-700/60 px-3 py-2 text-sm text-slate-100 " +
          "focus:outline-none focus:ring-2 focus:ring-sky-400/50",
        className
      )}
      {...rest}
    />
  );
}

export function Divider() {
  return <div className="h-px bg-slate-700/50" />;
}
