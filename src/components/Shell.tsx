import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Container, Button } from "./ui";
import { cn } from "../lib/utils";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "text-sm font-semibold px-3 py-2 rounded-xl transition",
          isActive ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-100"
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function Shell(props: React.PropsWithChildren) {
  const loc = useLocation();
  const onDemo = loc.pathname.startsWith("/demo");

  return (
    <div className="min-h-screen bg-grid">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <Container className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center text-sm font-extrabold">
              TC
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold">Trace Connect</div>
              <div className="text-xs text-slate-500">Pre‑construction planning</div>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <NavItem to="/" label="Home" />
            <NavItem to="/pricing" label="Pricing" />
            <NavItem to="/demo" label="Demo" />
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/demo">
              <Button variant={onDemo ? "secondary" : "default"}>Open Demo</Button>
            </Link>
          </div>
        </Container>
      </header>

      <main>
        <Container className="py-10">{props.children}</Container>
      </main>

      <footer className="border-t border-slate-200 bg-white/60">
        <Container className="py-6 text-xs text-slate-500">
          Trace Connect • Demo
        </Container>
      </footer>
    </div>
  );
}
