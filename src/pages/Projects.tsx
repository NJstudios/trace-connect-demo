import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, RefreshCcw, ArrowRight, MapPin } from "lucide-react";
import { Badge, Button, Card, Divider } from "../components/ui";
import type { Project } from "../types";
import { loadProjects, deleteProject, resetDemoData } from "../lib/storage";
import { templateLabel } from "../seed";
import { formatShortDate } from "../lib/date";

function statusTone(status: Project["status"]) {
  if (status === "Generated") return "ok";
  if (status === "In Review") return "warn";
  return "info";
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => setProjects(loadProjects()), []);

  const stats = useMemo(() => {
    const total = projects.length;
    const generated = projects.filter(p => p.status === "Generated").length;
    return { total, generated };
  }, [projects]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">Projects</div>
          <div className="mt-1 text-sm text-slate-300">
            Manage blueprints and generated outputs (3D model, schedule, materials).
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="info">{stats.total} total</Badge>
            <Badge tone="ok">{stats.generated} generated</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to="/app/new"><Button><Plus className="h-4 w-4" /> New Project</Button></Link>
          <Button
            variant="subtle"
            onClick={() => { resetDemoData(); setProjects(loadProjects()); }}
            title="Reset local demo data"
          >
            <RefreshCcw className="h-4 w-4" /> Reset demo
          </Button>
        </div>
      </div>

      <Divider />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Card key={p.id} className="p-5 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {p.location}
                </div>
              </div>
              <Badge tone={statusTone(p.status) as any}>{p.status}</Badge>
            </div>

            <div className="mt-4 text-sm text-slate-300">
              Template: <span className="font-semibold text-slate-100">{templateLabel(p.templateId)}</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Planned start: {formatShortDate(p.startDateIso)}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Link to={`/app/projects/${p.id}`} className="inline-flex">
                <Button variant="subtle">
                  Open <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => { deleteProject(p.id); setProjects(loadProjects()); }}
                title="Delete project (demo)"
              >
                <Trash2 className="h-4 w-4 text-slate-300" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
