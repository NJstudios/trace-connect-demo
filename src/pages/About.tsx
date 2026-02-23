import React from "react";
import { Card, Badge } from "../components/ui";
import { Building2, Cloud, Link2, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6">
      <div>
        <Badge tone="info">Why Trace Connect</Badge>
        <h2 className="mt-3 text-3xl font-extrabold">A single planning layer for construction teams</h2>
        <p className="mt-2 text-slate-300 max-w-3xl">
          Trace Connect exists to help construction teams plan prior to breaking ground, using AI to streamline
          pre-construction decisions, reduce risk, and deliver predictable schedules and costs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 font-semibold">
            <Building2 className="h-4 w-4 text-sky-300" /> Output-first
          </div>
          <div className="mt-2 text-sm text-slate-300">
            Convert an idea/blueprint into a schedule, a materials list, and a modifiable 3D model that can flow into existing tools.
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 font-semibold">
            <Cloud className="h-4 w-4 text-sky-300" /> Cloud sync & backup
          </div>
          <div className="mt-2 text-sm text-slate-300">
            Projects stay synced across teams and devices, keeping everyone aligned.
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 font-semibold">
            <Link2 className="h-4 w-4 text-sky-300" /> Industry integrations
          </div>
          <div className="mt-2 text-sm text-slate-300">
            Designed to integrate with tools teams already use (e.g., Revit/Autodesk/Procore) rather than replacing them.
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4 text-sky-300" /> Risk reduction
          </div>
          <div className="mt-2 text-sm text-slate-300">
            Identify planning gaps early to reduce rework, delays, and cost overruns.
          </div>
        </Card>
      </div>
    </div>
  );
}
