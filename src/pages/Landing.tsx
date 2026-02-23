import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Boxes, Cloud, CalendarClock, Layers3 } from "lucide-react";
import { Badge, Button, Card, Divider } from "../components/ui";

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-sky-500/15 border border-sky-400/30 grid place-items-center">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-sm text-slate-300 mt-1">{desc}</div>
        </div>
      </div>
    </Card>
  );
}

export default function Landing() {
  return (
    <div className="space-y-10">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <Badge tone="info">AI-powered pre‑construction planning</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Blueprint → 3D model → schedule → materials list
          </h1>
          <p className="text-slate-300">
            Trace Connect is a planning layer that turns a blueprint/idea into outputs teams can act on —
            a modifiable 3D model plus a project schedule and materials list.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => window.location.assign("/app/projects")}>
              Open Demo <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="subtle" onClick={() => window.location.assign("/pricing")}>
              View Pricing
            </Button>
          </div>

          <div className="pt-2 text-xs text-slate-400">
            Demo tip: From <span className="kbd">Projects</span> click <span className="kbd">New Project</span>.
          </div>
        </div>

        <Card className="p-5">
          <div className="text-sm font-semibold">What the demo shows</div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300 mt-0.5" />
              <div><span className="font-semibold text-slate-100">Blueprint management</span> with a clean intake flow.</div>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300 mt-0.5" />
              <div><span className="font-semibold text-slate-100">3D model preview</span> (BIM-style massing).</div>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300 mt-0.5" />
              <div><span className="font-semibold text-slate-100">Cohesive planning & scheduling</span> with a timeline.</div>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300 mt-0.5" />
              <div><span className="font-semibold text-slate-100">Resource allotment</span> via an auto-generated materials list.</div>
            </div>
            <Divider />
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="rounded-full border border-slate-700/60 px-2 py-1">Revit export (mock)</span>
              <span className="rounded-full border border-slate-700/60 px-2 py-1">Procore sync (mock)</span>
              <span className="rounded-full border border-slate-700/60 px-2 py-1">Cloud backup (mock)</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Feature icon={<Layers3 className="h-5 w-5 text-sky-300" />} title="Blueprint Intake" desc="Upload a blueprint and select a template to standardize the pipeline." />
        <Feature icon={<Boxes className="h-5 w-5 text-sky-300" />} title="3D Model Output" desc="A modifiable 3D concept model teams can export into existing tools." />
        <Feature icon={<CalendarClock className="h-5 w-5 text-sky-300" />} title="Schedule + Materials" desc="Generate a WBS schedule and preliminary materials list to reduce delays." />
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm font-semibold">Jump into the product demo</div>
            <div className="text-sm text-slate-300 mt-1">
              Start with projects → new project → template blueprint → outputs.
            </div>
          </div>
          <Link to="/app/projects">
            <Button>Start Demo <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </Card>

      <div className="text-xs text-slate-500">
        Note: This site is a mock UI for DECA judging. It simulates the pipeline rather than running real CAD/BIM generation.
      </div>
    </div>
  );
}
