import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  FileText,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Wand2,
  CheckCircle2,
  Boxes,
  CalendarClock,
  AlertTriangle,
} from "lucide-react";
import { Badge, Button, Card, Divider, Input, Select } from "../components/ui";
import { addDaysIso, isoToday, sleep } from "../lib/utils";
import { makeDemoProject, templateLabel, type TemplateId } from "../lib/demoData";
import { MaterialsTable, RiskFlags, ScheduleTable, SummaryPanel, ModelPanel } from "../components/DemoPanels";
type Phase = "idle" | "intake" | "template" | "generating" | "outputs" | "exports" | "done";
type Tab = "overview" | "schedule" | "materials" | "risks";

const PIPELINE = [
  "Extracting blueprint geometry",
  "Generating massing model",
  "Building schedule (WBS + critical path)",
  "Compiling materials takeoff",
  "Generating risk flags",
] as const;

function stepTitle(phase: Phase) {
  switch (phase) {
    case "idle":
      return "Ready";
    case "intake":
      return "Intake";
    case "template":
      return "Template";
    case "generating":
      return "Generate";
    case "outputs":
      return "Deliverables";
    case "exports":
      return "Exports";
    case "done":
      return "Complete";
  }
}

function phaseTone(phase: Phase): "neutral" | "info" | "ok" | "warn" {
  if (phase === "done") return "ok";
  if (phase === "generating") return "info";
  if (phase === "exports") return "warn";
  if (phase === "outputs") return "ok";
  if (phase === "intake" || phase === "template") return "info";
  return "neutral";
}

/**
 * Lightweight “3D-ish” massing preview that is ALWAYS visible.
 * This avoids Three.js issues and still shows “the model changed” per template.
 */
function MassingPreview({
  templateId,
  animate,
}: {
  templateId: TemplateId;
  animate: boolean;
}) {
  const blocks = useMemo(() => {
    // Coordinates in SVG viewBox space.
    if (templateId === "retail") {
      return [
        { x: 26, y: 44, w: 88, h: 42, label: "Main volume" },
        { x: 92, y: 58, w: 26, h: 20, label: "Back-of-house" },
        { x: 18, y: 62, w: 26, h: 12, label: "Entry canopy" },
      ];
    }
    if (templateId === "office") {
      return [
        { x: 34, y: 42, w: 74, h: 44, label: "Base" },
        { x: 44, y: 28, w: 40, h: 22, label: "Second level" },
        { x: 86, y: 56, w: 18, h: 18, label: "Core" },
      ];
    }
    // warehouse
    return [
      { x: 18, y: 46, w: 102, h: 40, label: "Warehouse" },
      { x: 18, y: 60, w: 32, h: 22, label: "Office annex" },
      { x: 98, y: 60, w: 22, h: 18, label: "Dock" },
    ];
  }, [templateId]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="text-sm font-extrabold text-slate-900">Massing Model</div>
        <Badge tone="info">Preview</Badge>
      </div>
      <Divider />
      <div className="p-4">
        <div
          className={
            "relative aspect-[16/10] rounded-xl bg-slate-50 border border-slate-200 overflow-hidden " +
            (animate ? "motion-safe:animate-[float_2.6s_ease-in-out_infinite]" : "")
          }
        >
          <svg viewBox="0 0 140 100" className="h-full w-full">
            {/* subtle “grid” */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="1" />
              </pattern>
              <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(15,23,42,0.18)" />
              </filter>
            </defs>
            <rect x="0" y="0" width="140" height="100" fill="url(#grid)" />

            {/* “ground” */}
            <path d="M10,84 L130,84" stroke="rgba(15,23,42,0.25)" strokeWidth="2" />

            {/* blocks */}
            {blocks.map((b, i) => (
              <g key={i} filter="url(#shadow)">
                {/* top face */}
                <polygon
                  points={`${b.x},${b.y} ${b.x + b.w},${b.y} ${b.x + b.w - 10},${b.y - 10} ${b.x - 10},${b.y - 10}`}
                  fill="#e2e8f0"
                />
                {/* side face */}
                <polygon
                  points={`${b.x + b.w},${b.y} ${b.x + b.w},${b.y + b.h} ${b.x + b.w - 10},${b.y + b.h - 10} ${b.x + b.w - 10},${b.y - 10}`}
                  fill="#cbd5e1"
                />
                {/* front face */}
                <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#0f172a" rx="2" />
              </g>
            ))}
          </svg>

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
            <div className="text-[11px] text-slate-600 bg-white/85 border border-slate-200 rounded-lg px-2 py-1">
              Template: <span className="font-semibold text-slate-900">{templateLabel(templateId)}</span>
            </div>
            <div className="text-[11px] text-slate-600 bg-white/85 border border-slate-200 rounded-lg px-2 py-1">
              Deterministic preview
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          This preview updates immediately when the template changes and stays visible during the run.
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  const [presenterMode, setPresenterMode] = useState(true);
  const [speed, setSpeed] = useState<"1x" | "1.5x" | "2x">("1.5x");
  const ms = useMemo(() => (speed === "1x" ? 900 : speed === "1.5x" ? 650 : 500), [speed]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [pipelineIndex, setPipelineIndex] = useState<number>(-1);
  const [tab, setTab] = useState<Tab>("overview");
  const [running, setRunning] = useState(false);

  const [name, setName] = useState("Retail Buildout — Demo");
  const [location, setLocation] = useState("Atlanta, GA");
  const [templateId, setTemplateId] = useState<TemplateId>("retail");
  const [startDateIso, setStartDateIso] = useState(addDaysIso(isoToday(), 21));
  const [started, setStarted] = useState(false);
  const project = useMemo(() => {
    const p = makeDemoProject(startDateIso, templateId);
    return { ...p, name, location };
  }, [name, location, templateId, startDateIso]);

  const cancelledRef = useRef(false);

  const canStart =
  name.trim().length >= 3 &&
  location.trim().length >= 3 &&
  startDateIso.trim().length >= 8;
  const deliverablesReady =
  phase === "outputs" || phase === "exports" || phase === "done";

  const hasSchedule = Array.isArray((project as any)?.schedule);
  const hasMaterials = Array.isArray((project as any)?.materials);
  const hasRisks = Array.isArray((project as any)?.risks);

  function NotReady({ title }: { title: string }) {
    return (
      <Card className="p-6">
        <div className="text-sm font-extrabold text-slate-900">{title}</div>
        <div className="mt-2 text-sm text-slate-600">
          Run generation to produce deliverables, then this section will populate automatically.
        </div>
      </Card>
    );
  }


  const reset = () => {
    cancelledRef.current = true;
    setRunning(false);
    setPhase("idle");
    setProgress(0);
    setPipelineIndex(-1);
    setTab("overview");
    setStarted(false);
    cancelledRef.current = false;
  };

  const run = async () => {
    if (running) return;
    cancelledRef.current = false;
    setRunning(true);

    setPhase("intake");
    await sleep(ms);
    if (cancelledRef.current) return;

    setPhase("template");
    await sleep(ms);
    if (cancelledRef.current) return;

    setPhase("generating");
    setProgress(0);
    setPipelineIndex(0);

    for (let i = 0; i < PIPELINE.length; i++) {
      setPipelineIndex(i);
      setProgress(Math.round(((i + 1) / PIPELINE.length) * 100));
      await sleep(ms);
      if (cancelledRef.current) return;
    }

    setPhase("outputs");
    setTab("overview");
    await sleep(ms);
    if (cancelledRef.current) return;

    if (presenterMode) {
      setTab("schedule");
      await sleep(ms);
      if (cancelledRef.current) return;

      setTab("materials");
      await sleep(ms);
      if (cancelledRef.current) return;

      setTab("risks");
      await sleep(ms);
      if (cancelledRef.current) return;

      setTab("overview");
      await sleep(ms);
      if (cancelledRef.current) return;
    }

    setPhase("exports");
    await sleep(ms);
    if (cancelledRef.current) return;

    setPhase("done");
    setRunning(false);
  };

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const script = useMemo(() => {
    if (phase === "idle") {
      return "Run the demo to simulate intake, generate deliverables, then show schedule, materials, and risk flags.";
    }
    if (phase === "intake") {
      return "Intake captures the blueprint (or project intent) and normalizes inputs for generation.";
    }
    if (phase === "template") {
      return "Template selection applies assumptions and default scope rules so outputs are consistent and fast.";
    }
    if (phase === "generating") {
      return "Generation produces a massing model, a WBS schedule, a preliminary takeoff, and risk flags.";
    }
    if (phase === "outputs") {
      return "Deliverables are ready. You can inspect schedule sequencing, cost drivers in materials, and high-risk gaps.";
    }
    if (phase === "exports") {
      return "Exports push deliverables into existing workflows (models, schedules, BOMs).";
    }
    return "Complete. The full workflow is visible on one page — from inputs to actionable deliverables.";
  }, [phase]);

  const tabBtn = (t: Tab) =>
    "px-3 py-2 rounded-xl text-sm font-semibold border transition " +
    (tab === t
      ? "bg-blue-50 border-blue-200 text-slate-900"
      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50");

  const showDeliverables = started && (phase === "outputs" || phase === "exports" || phase === "done");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <Badge tone="neutral">Single-page walkthrough</Badge>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Product Demo</h2>
          <p className="mt-2 text-slate-600 max-w-3xl">
            One page shows the full pipeline — inputs → generation → deliverables → exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => {
            if (!started) {
              setStarted(true);
              setPhase("idle");
              setTab("overview");
              return;
            }
            run();
          }}
          disabled={!canStart || running}
        >
          <Play className="h-4 w-4" /> {started ? "Start demo" : "Continue"}
        </Button>
          <Button variant="secondary" onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button
            variant="ghost"
            onClick={() => setPresenterMode((v) => !v)}
            title="Auto-advance tabs and steps"
          >
            {presenterMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            Presenter mode: {presenterMode ? "On" : "Off"}
          </Button>

          <div className="hidden sm:flex items-center gap-2">
            <Badge tone="neutral">
              <Gauge className="h-3.5 w-3.5" /> Speed
            </Badge>
            <Select value={speed} onChange={(e) => setSpeed(e.target.value as any)} className="w-28">
              <option value="1x">1x</option>
              <option value="1.5x">1.5x</option>
              <option value="2x">2x</option>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* LEFT: inputs + pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-slate-900">Status</div>
                <div className="mt-1 text-sm text-slate-600">{script}</div>
              </div>
              <Badge tone={phaseTone(phase)}>
                <Sparkles className="h-3.5 w-3.5" /> {stepTitle(phase)}
              </Badge>
            </div>

            <Divider className="my-5" />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">Progress</span>
                <span>{phase === "generating" ? `${progress}%` : showDeliverables ? "100%" : "—"}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{
                    width:
                      phase === "generating"
                        ? `${progress}%`
                        : showDeliverables
                        ? "100%"
                        : phase === "template"
                        ? "30%"
                        : phase === "intake"
                        ? "15%"
                        : "0%",
                  }}
                />
              </div>

              {phase === "generating" && pipelineIndex >= 0 && (
                <div className="text-sm text-slate-700 flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">{PIPELINE[pipelineIndex]}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-extrabold text-slate-900">Inputs</div>
              <Badge tone="neutral">
                <FileText className="h-3.5 w-3.5" /> Config
              </Badge>
            </div>

            <Divider className="my-5" />

            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Project name</div>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Location</div>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Template</div>
                  <Select value={templateId} onChange={(e) => setTemplateId(e.target.value as any)}>
                    <option value="retail">Retail Buildout</option>
                    <option value="office">Small Office</option>
                    <option value="warehouse">Warehouse Expansion</option>
                  </Select>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Planned start</div>
                  <Input type="date" value={startDateIso} onChange={(e) => setStartDateIso(e.target.value)} />
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Changing template immediately updates the generated deliverables shown on the right.
              </div>
            </div>
          </Card>


        </div>

        {/* RIGHT: deliverables */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button className={tabBtn("overview")} onClick={() => setTab("overview")}>
                Overview
              </button>
              <button className={tabBtn("schedule")} onClick={() => setTab("schedule")}>
                Schedule
              </button>
              <button className={tabBtn("materials")} onClick={() => setTab("materials")}>
                Materials
              </button>
              <button className={tabBtn("risks")} onClick={() => setTab("risks")}>
                Risk flags
              </button>
            </div>

            <Badge tone={showDeliverables ? "ok" : "neutral"}>
              {showDeliverables ? "Deliverables ready" : "Waiting for run"}
            </Badge>
          </Card>

          {!started && (
            <Card className="p-8">
              <div className="text-sm font-extrabold text-slate-900">Enter project inputs to begin</div>
              <div className="mt-1 text-sm text-slate-600">
                Fill out the project name, location, template, and start date — then click Continue.
              </div>
            </Card>
          )}
          {!showDeliverables && (
            <Card className="p-8">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Run to generate deliverables</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Click <span className="font-semibold">Run demo</span> to populate the schedule, materials, and risk flags.
                  </div>

                  <div className="mt-5 grid md:grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Boxes className="h-4 w-4 text-slate-700" /> Materials
                      </div>
                      <div className="mt-1 text-xs text-slate-500">Preliminary takeoff + cost drivers</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <CalendarClock className="h-4 w-4 text-slate-700" /> Schedule
                      </div>
                      <div className="mt-1 text-xs text-slate-500">WBS timeline + sequencing</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <AlertTriangle className="h-4 w-4 text-slate-700" /> Risks
                      </div>
                      <div className="mt-1 text-xs text-slate-500">Flags planning gaps early</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {showDeliverables && tab === "overview" && (
            <div className="space-y-4">
              <ModelPanel templateId={templateId} />
              <SummaryPanel project={project as any} />
            </div>
          )}
          {tab === "schedule" && (deliverablesReady ? <ScheduleTable project={project as any} /> : <NotReady title="Schedule" />)}

          {tab === "materials" && (deliverablesReady ? <MaterialsTable project={project as any} /> : <NotReady title="Materials" />)}

          {tab === "risks" && (deliverablesReady ? <RiskFlags project={project as any} /> : <NotReady title="Risk flags" />)}
          {phase === "exports" || phase === "done" ? (
            <Card className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Exports</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Deliverables can be exported to downstream tools and workflows.
                  </div>
                </div>
                <Badge tone="warn">Actions</Badge>
              </div>

              <Divider className="my-5" />

              <div className="grid sm:grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => alert("Export IFC (demo)")}>Export IFC</Button>
                <Button variant="secondary" onClick={() => alert("Export RVT (demo)")}>Export RVT</Button>
                <Button variant="secondary" onClick={() => alert("Export schedule CSV (demo)")}>Export Schedule CSV</Button>
                <Button variant="secondary" onClick={() => alert("Export BOM CSV (demo)")}>Export BOM CSV</Button>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                The point is continuity: outputs don’t live in a slide — they feed the next systems.
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}