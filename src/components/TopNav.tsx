import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Building2, Sparkles, Layers, DollarSign } from "lucide-react";
import { Button } from "./ui";
import { startTour } from "../lib/tour";

function LinkItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition " +
        (isActive ? "bg-slate-800/70 text-slate-50" : "text-slate-200 hover:bg-slate-800/40")
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default function TopNav() {
  const loc = useLocation();
  const nav = useNavigate();
  const inApp = loc.pathname.startsWith("/app");
  return (
    <div className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-sky-500/15 border border-sky-400/30 grid place-items-center">
            <Sparkles className="h-5 w-5 text-sky-300" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-wide">TRACE CONNECT</div>
            <div className="text-xs text-slate-400">Pre‑construction planning demo</div>
          </div>
        </NavLink>

        <div className="hidden md:flex items-center gap-2">
          <LinkItem to="/app/projects" icon={<Layers className="h-4 w-4" />} label="Projects" />
          <LinkItem to="/pricing" icon={<DollarSign className="h-4 w-4" />} label="Pricing" />
          <LinkItem to="/about" icon={<Building2 className="h-4 w-4" />} label="About" />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
            <span className="kbd">Demo</span>
            <span className="text-slate-500">•</span>
            <span>{inApp ? "App view" : "Marketing view"}</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              startTour();
              nav("/app/projects");
            }}
            title="Guided demo tour"
          >
            Guided Demo
          </Button>
          <Button variant="subtle" onClick={() => nav("/app/projects")}>
            Open Demo App
          </Button>
        </div>
      </div>
    </div>
  );
}
