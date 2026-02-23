import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, ExternalLink, FileText, RefreshCcw, Settings, Share2 } from "lucide-react";
import { Badge, Button, Card, Divider } from "../components/ui";
import type { Project } from "../types";
import { loadProjects, upsertProject } from "../lib/storage";
import { templateLabel } from "../seed";
import ModelViewer from "../components/ModelViewer";
import ScheduleTable from "../components/ScheduleTable";
import MaterialsTable from "../components/MaterialsTable";
import RiskFlags from "../components/RiskFlags";
import { formatShortDate } from "../lib/date";
import { formatUSD } from "../lib/money";

type TabId = "overview" | "schedule" | "materials" | "risks" | "exports";

function tabBtn(active: boolean) {
  return (
    "px-3 py-2 rounded-xl text-sm font-semibold border transition " +
    (active ? "bg-sky-500/10 border-sky-400/40 text-slate-50" : "bg-slate-900/30 border-slate-800/70 text-slate-300 hover:bg-slate-900/45")
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tab, setTab] = useState<TabId>("overview");

  useEffect(() => {
    const p = loadProjects().find(x => x.id === id) ?? null;
    setProject(p);
  }, [id]);

  const totals = useMemo(() => {
    if (!project) return { materialTotal: 0, duration: 0 };
    const materialTotal = project.materials.reduce((s, it) => s + it.qty * it.unitCost, 0);
    const duration = Math.max(...project.schedule.map(t => t.startOffsetDays + t.durationDays));
    return { materialTotal, duration };
  }, [project]);

  if (!project) {
    return (
      <Card className="p-6">
        <div className="text-sm font-semibold">Project not found</div>
        <div className="mt-2 text-sm text-slate-300">Return to Projects.</div>
        <Link to="/app/projects"><Button className="mt-4">Back</Button></Link>
      </Card>
    );
  }

  const exportClick = (label: string) => alert(`Demo: ${label}`);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link to="/app/projects" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-slate-100">
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Link>

          <div className="mt-2 text-2xl font-extrabold tracking-tight">{project.name}</div>
          <div className="mt-1 text-sm text-slate-300">
            {project.location} • {templateLabel(project.templateId)} • Start {formatShortDate(project.startDateIso)}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="ok">{project.status}</Badge>
            {project.blueprintFilename && <Badge tone="info"><FileText className="h-3.5 w-3.5" /> {project.blueprintFilename}</Badge>}
            <Badge tone="warn">{totals.duration} days</Badge>
            <Badge tone="warn">{formatUSD(totals.materialTotal)} materials</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="subtle" onClick={() => exportClick("Share link")}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="subtle" onClick={() => exportClick("Open in Procore")}>
            <ExternalLink className="h-4 w-4" /> Procore
          </Button>
          <Button variant="subtle" onClick={() => exportClick("Export RVT/IFC")}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <ModelViewer params={project.model} />

          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Settings className="h-4 w-4 text-sky-300" /> Demo controls
            </div>
            <div className="mt-2 text-sm text-slate-300">
              This is a mock UI. Use the tabs to show judges how outputs become actionable.
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="p-3 flex flex-wrap gap-2">
            <button className={tabBtn(tab === "overview")} onClick={() => setTab("overview")}>Overview</button>
            <button className={tabBtn(tab === "schedule")} onClick={() => setTab("schedule")}>Schedule</button>
            <button className={tabBtn(tab === "materials")} onClick={() => setTab("materials")}>Materials</button>
            <button className={tabBtn(tab === "risks")} onClick={() => setTab("risks")}>Risk flags</button>
            <button className={tabBtn(tab === "exports")} onClick={() => setTab("exports")}>Exports</button>
          </Card>

          {tab === "overview" && (
            <Card className="p-5 space-y-4">
              <div>
                <div className="text-sm font-semibold">Outputs summary</div>
                <div className="mt-1 text-sm text-slate-300">
                  Trace Connect turns a blueprint into deliverables that reduce planning gaps before construction.
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4">
                  <div className="text-xs text-slate-400">Generated model</div>
                  <div className="mt-1 text-sm font-semibold">3D massing + export</div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs text-slate-400">Schedule</div>
                  <div className="mt-1 text-sm font-semibold">{totals.duration} days</div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs text-slate-400">Materials estimate</div>
                  <div className="mt-1 text-sm font-semibold">{formatUSD(totals.materialTotal)}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs text-slate-400">Risk flags</div>
                  <div className="mt-1 text-sm font-semibold">{project.risks.length}</div>
                </Card>
              </div>

              <Divider />

              <div className="text-xs text-slate-400">
                Judge script: “This page shows the generated 3D model. On the right are the auto-generated schedule and materials list.
                This is the core of our product.”
              </div>
            </Card>
          )}

          {tab === "schedule" && <ScheduleTable startDateIso={project.startDateIso} tasks={project.schedule} />}
          {tab === "materials" && <MaterialsTable items={project.materials} />}
          {tab === "risks" && <RiskFlags risks={project.risks} />}

          {tab === "exports" && (
            <Card className="p-5 space-y-3">
              <div className="text-sm font-semibold">Exports & integrations (mock)</div>
              <div className="text-sm text-slate-300">
                Designed to flow into existing tools rather than replacing them.
              </div>

              <Divider />

              <div className="grid grid-cols-2 gap-2">
                <Button variant="subtle" onClick={() => exportClick("Export IFC")}>
                  <Download className="h-4 w-4" /> IFC
                </Button>
                <Button variant="subtle" onClick={() => exportClick("Export RVT (Revit)")}>
                  <Download className="h-4 w-4" /> RVT
                </Button>
                <Button variant="subtle" onClick={() => exportClick("Export schedule CSV")}>
                  <Download className="h-4 w-4" /> Schedule CSV
                </Button>
                <Button variant="subtle" onClick={() => exportClick("Export materials CSV")}>
                  <Download className="h-4 w-4" /> BOM CSV
                </Button>
              </div>

              <Divider />

              <Button onClick={() => exportClick("Send to Procore")}>
                <ExternalLink className="h-4 w-4" /> Send to Procore
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  const updated: Project = { ...project, status: project.status === "In Review" ? "Generated" : "In Review" };
                  upsertProject(updated);
                  setProject(updated);
                }}
              >
                <RefreshCcw className="h-4 w-4" /> Toggle status
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
