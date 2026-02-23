import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, FileText, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Badge, Button, Card, Divider, Input, Select } from "../components/ui";
import { Stepper } from "../components/Stepper";
import { FileDrop } from "../components/FileDrop";
import type { TemplateId, Project } from "../types";
import { generateModel, generateSchedule, generateMaterials, generateRisks, templateLabel } from "../seed";
import { upsertProject } from "../lib/storage";
import { isoToday, addDaysIso } from "../lib/date";
import { getTourStep, setTourStep, endTour } from "../lib/tour";

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const STEPS = ["Project", "Blueprint", "Generate", "Review"];

export default function NewProject() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);

  const tour = getTourStep();

  const [name, setName] = useState("New Build");
  const [location, setLocation] = useState("Atlanta, GA");
  const [templateId, setTemplateId] = useState<TemplateId>("retail");
  const [startDateIso, setStartDateIso] = useState(addDaysIso(isoToday(), 21));
  const [blueprintFilename, setBlueprintFilename] = useState<string | undefined>(undefined);

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");

  const canNext = useMemo(() => {
    if (step === 0) return name.trim().length > 2 && location.trim().length > 2;
    if (step === 1) return true; // blueprint optional for demo
    if (step === 2) return phase === "done";
    return true;
  }, [step, name, location, phase]);

  const startGenerate = async () => {
    setPhase("running");
    setProgress(0);

    const steps = [
      "Extracting blueprint geometry",
      "Generating BIM-style massing model",
      "Building schedule (WBS + critical path)",
      "Compiling materials list (takeoff)",
      "Generating risk flags",
    ];

    for (let i = 0; i < steps.length; i++) {
      const msg = steps[i];
      // eslint-disable-next-line no-alert
      console.log(msg);
      await new Promise(r => setTimeout(r, 700));
      setProgress(Math.round(((i + 1) / steps.length) * 100));
    }

    setPhase("done");
  };

  const createProject = () => {
    const p: Project = {
      id: uid("p"),
      name,
      location,
      templateId,
      createdAtIso: new Date().toISOString(),
      startDateIso,
      status: "Generated",
      blueprintFilename,
      model: generateModel(templateId),
      schedule: generateSchedule(templateId),
      materials: generateMaterials(templateId),
      risks: generateRisks(templateId),
    };

    upsertProject(p);

    if (tour) setTourStep("outputs");
    nav(`/app/projects/${p.id}`);
  };

  return (
    <div className="space-y-6">
      {tour === "new" && (
        <Card className="p-5 border border-sky-400/25">
          <div className="text-sm font-semibold">Guided demo (Step 2/3)</div>
          <div className="mt-1 text-sm text-slate-300">
            Use the wizard to show: template selection → generation → outputs page.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="subtle" onClick={() => { setStep(1); }}>Go to Blueprint step</Button>
            <Button onClick={() => { setStep(2); }}>Jump to Generate</Button>
            <Button variant="ghost" onClick={() => endTour()}>Exit tour</Button>
          </div>
        </Card>
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">New Project</div>
          <div className="mt-1 text-sm text-slate-300">
            Walkthrough: projects → blueprint/template → outputs.
          </div>
        </div>
        <Badge tone="info">Demo wizard</Badge>
      </div>

      <Card className="p-5">
        <Stepper steps={STEPS} activeIndex={step} />
        <Divider />
        {step === 0 && (
          <div className="pt-4 grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-sky-300" /> Project details
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Project name</div>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Canton Retail Buildout" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Location</div>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Template</div>
                    <Select value={templateId} onChange={(e) => setTemplateId(e.target.value as any)}>
                      <option value="retail">Retail Buildout</option>
                      <option value="office">Small Office</option>
                      <option value="warehouse">Warehouse Expansion</option>
                    </Select>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Planned start</div>
                    <Input type="date" value={startDateIso} onChange={(e) => setStartDateIso(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-4">
              <div className="text-sm font-semibold">What you’ll get</div>
              <div className="mt-2 text-sm text-slate-300">
                After generation, Trace Connect produces:
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300 mt-0.5" /> Modifiable 3D model (exportable)</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300 mt-0.5" /> Cohesive schedule + timeline</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300 mt-0.5" /> Materials list / takeoff</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300 mt-0.5" /> Risk flags and checklists</li>
              </ul>
              <div className="mt-4 text-xs text-slate-400">
                Selected template: <span className="font-semibold text-slate-200">{templateLabel(templateId)}</span>
              </div>
            </Card>
          </div>
        )}

        {step === 1 && (
          <div className="pt-4 grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-300" /> Blueprint intake
              </div>
              <div className="text-sm text-slate-300">
                Upload a blueprint (PDF/DWG/etc). For DECA judging, this is mostly about showing the workflow.
              </div>
              <FileDrop onPick={(f) => setBlueprintFilename(f.name)} />
              {blueprintFilename && (
                <div className="text-xs text-slate-400">
                  Selected: <span className="font-semibold text-slate-200">{blueprintFilename}</span>
                </div>
              )}
            </div>

            <Card className="p-5">
              <div className="text-sm font-semibold">Template blueprint</div>
              <div className="mt-2 text-sm text-slate-300">
                Templates standardize the pipeline and let the demo produce realistic outputs quickly.
              </div>
              <div className="mt-4 space-y-3">
                {(["retail","office","warehouse"] as TemplateId[]).map((tid) => (
                  <button
                    key={tid}
                    onClick={() => setTemplateId(tid)}
                    className={
                      "w-full text-left rounded-xl border px-4 py-3 transition " +
                      (templateId === tid
                        ? "bg-sky-500/10 border-sky-400/40"
                        : "bg-slate-900/30 border-slate-800/70 hover:bg-slate-900/45")
                    }
                  >
                    <div className="font-semibold">{templateLabel(tid)}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Includes default scope assumptions, schedule template, and materials takeoff.
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="pt-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-300" /> Generate outputs
                </div>
                <div className="text-sm text-slate-300 mt-1">
                  This simulates your AI pipeline: blueprint extraction → 3D model → schedule → materials list.
                </div>
              </div>
              <Badge tone={phase === "done" ? "ok" : "info"}>{phase === "done" ? "Generated" : "Ready"}</Badge>
            </div>

            <Card className="mt-4 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Processing</div>
                <div className="text-xs text-slate-400">{progress}%</div>
              </div>
              <div className="mt-3 h-3 rounded-full bg-slate-900/50 border border-slate-800/60 overflow-hidden">
                <div className="h-full bg-sky-500/70" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={startGenerate}
                  disabled={phase === "running" || phase === "done"}
                >
                  Run generation
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => { setPhase("idle"); setProgress(0); }}
                  disabled={phase === "running"}
                >
                  Reset
                </Button>
              </div>
              {phase === "done" && (
                <div className="mt-4 text-sm text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Outputs ready — continue to review.
                </div>
              )}
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="pt-4 grid md:grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="text-sm font-semibold">Review summary</div>
              <div className="mt-2 text-sm text-slate-300">
                Your project will be created with generated outputs.
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div><span className="text-slate-400">Name:</span> <span className="font-semibold">{name}</span></div>
                <div><span className="text-slate-400">Location:</span> <span className="font-semibold">{location}</span></div>
                <div><span className="text-slate-400">Template:</span> <span className="font-semibold">{templateLabel(templateId)}</span></div>
                <div><span className="text-slate-400">Planned start:</span> <span className="font-semibold">{startDateIso}</span></div>
                <div><span className="text-slate-400">Blueprint:</span> <span className="font-semibold">{blueprintFilename ?? "— (demo)"}</span></div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-sm font-semibold">Create project</div>
              <div className="mt-2 text-sm text-slate-300">
                After creation, you’ll see the 3D model, schedule, materials, and export buttons.
              </div>
              <Button className="mt-4" onClick={createProject}>
                Create & open <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="mt-4 text-xs text-slate-400">
                Judge-friendly angle: show the “Outputs” page first, then point out how it integrates into existing tools.
              </div>
            </Card>
          </div>
        )}

        <Divider />

        <div className="pt-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => (step === 0 ? nav("/app/projects") : setStep(step - 1))}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canNext || step >= STEPS.length - 1}
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
