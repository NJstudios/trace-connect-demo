import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Boxes, CalendarClock, Layers3, ShieldCheck } from "lucide-react";
import { Badge, Button, Card, Divider } from "../components/ui";

function Feature(props: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 grid place-items-center">
          {props.icon}
        </div>
        <div>
          <div className="text-sm font-extrabold text-slate-900">{props.title}</div>
          <div className="mt-1 text-sm text-slate-600">{props.desc}</div>
        </div>
      </div>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="space-y-10">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <Badge tone="info">AI-powered pre‑construction planning</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Blueprint → 3D model → schedule → materials list
          </h1>
          <p className="text-slate-600 max-w-xl">
            Trace Connect turns early project inputs into actionable deliverables before construction begins — reducing
            planning gaps, rework, and schedule slip.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/demo">
              <Button>
                Run the Demo <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="secondary">View Pricing</Button>
            </Link>
          </div>

          <div className="pt-2 text-xs text-slate-500">
            Presentation tip: click <span className="kbd">Run the Demo</span> and let it walk through the full workflow.
          </div>
        </div>

        <Card className="p-6">
          <div className="text-sm font-extrabold text-slate-900">What the product delivers</div>
          <div className="mt-3 space-y-3 text-sm text-slate-600">
            <div className="flex gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-700 mt-0.5" />
              <div><span className="font-semibold text-slate-900">Risk flags</span> surfaced early to prevent rework.</div>
            </div>
            <div className="flex gap-2">
              <Layers3 className="h-4 w-4 text-blue-700 mt-0.5" />
              <div><span className="font-semibold text-slate-900">3D preview</span> (BIM-style massing concept).</div>
            </div>
            <div className="flex gap-2">
              <CalendarClock className="h-4 w-4 text-blue-700 mt-0.5" />
              <div><span className="font-semibold text-slate-900">Schedule</span> with owners + dependencies.</div>
            </div>
            <div className="flex gap-2">
              <Boxes className="h-4 w-4 text-blue-700 mt-0.5" />
              <div><span className="font-semibold text-slate-900">Materials</span> estimate (takeoff-style BOM).</div>
            </div>
          </div>

          <Divider className="my-5" />

          <div className="text-xs text-slate-500">
            Demo mode: outputs are simulated for a deterministic, judge-friendly walkthrough.
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Feature icon={<Layers3 className="h-5 w-5 text-blue-700" />} title="Blueprint intake" desc="Upload or select a template to standardize scope." />
        <Feature icon={<CalendarClock className="h-5 w-5 text-blue-700" />} title="Plan & schedule" desc="Generate a WBS schedule with durations and owners." />
        <Feature icon={<Boxes className="h-5 w-5 text-blue-700" />} title="Estimate materials" desc="Produce an early BOM to support budgeting and ordering." />
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Ready to see it?</div>
            <div className="mt-1 text-sm text-slate-600">
              The demo runs the full process on one page — no navigation required.
            </div>
          </div>
          <Link to="/demo">
            <Button>Open Demo <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
