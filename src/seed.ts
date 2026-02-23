import type { Project, TemplateId, ModelParams, ScheduleTask, MaterialLineItem, RiskFlag } from "./types";
import { isoToday, addDaysIso } from "./lib/date";

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function templateLabel(id: TemplateId): string {
  switch (id) {
    case "retail": return "Retail Buildout";
    case "office": return "Small Office";
    case "warehouse": return "Warehouse Expansion";
  }
}

export function generateModel(templateId: TemplateId): ModelParams {
  if (templateId === "retail") return { widthM: 28, depthM: 18, heightM: 6, floors: 1, roof: "flat", hasCanopy: true };
  if (templateId === "office") return { widthM: 36, depthM: 22, heightM: 10, floors: 2, roof: "flat", hasCanopy: false };
  return { widthM: 60, depthM: 30, heightM: 9, floors: 1, roof: "gable", hasCanopy: false };
}

export function generateSchedule(templateId: TemplateId): ScheduleTask[] {
  const base: ScheduleTask[] = [
    { id: uid("t"), name: "Intake & blueprint parsing", startOffsetDays: 0, durationDays: 2, owner: "PM", phase: "Precon" },
    { id: uid("t"), name: "BIM massing model generation", startOffsetDays: 1, durationDays: 3, owner: "Architect", phase: "Design" },
    { id: uid("t"), name: "Code + zoning checks (risk flags)", startOffsetDays: 2, durationDays: 2, owner: "Engineer", phase: "Design" },
    { id: uid("t"), name: "Materials takeoff + preliminary BOM", startOffsetDays: 3, durationDays: 2, owner: "Estimator", phase: "Precon" },
    { id: uid("t"), name: "Draft schedule (WBS) + critical path", startOffsetDays: 4, durationDays: 2, owner: "PM", phase: "Precon" },
    { id: uid("t"), name: "Owner review + revisions", startOffsetDays: 6, durationDays: 3, owner: "PM", phase: "Precon" },
    { id: uid("t"), name: "Permitting submission packet", startOffsetDays: 7, durationDays: 5, owner: "Architect", phase: "Precon" },
    { id: uid("t"), name: "Procurement (long-lead items)", startOffsetDays: 9, durationDays: 10, owner: "Estimator", phase: "Procurement" },
    { id: uid("t"), name: "Mobilization", startOffsetDays: 19, durationDays: 2, owner: "Field", phase: "Construction" },
    { id: uid("t"), name: "Sitework + foundation", startOffsetDays: 21, durationDays: 7, owner: "Field", phase: "Construction" },
    { id: uid("t"), name: "Framing / shell", startOffsetDays: 28, durationDays: 10, owner: "Field", phase: "Construction" },
    { id: uid("t"), name: "MEP rough-in", startOffsetDays: 33, durationDays: 9, owner: "Field", phase: "Construction" },
    { id: uid("t"), name: "Finishes + punch list", startOffsetDays: 42, durationDays: 8, owner: "Field", phase: "Construction" },
  ];

  if (templateId === "warehouse") {
    base.splice(10, 0, { id: uid("t"), name: "Steel package fabrication", startOffsetDays: 22, durationDays: 14, owner: "Estimator", phase: "Procurement" });
  }
  if (templateId === "office") {
    base.splice(12, 0, { id: uid("t"), name: "Interior partitions + glazing", startOffsetDays: 38, durationDays: 7, owner: "Field", phase: "Construction" });
  }
  return base;
}

export function generateMaterials(templateId: TemplateId): MaterialLineItem[] {
  const retail: MaterialLineItem[] = [
    { id: uid("m"), category: "Concrete", name: "Slab-on-grade concrete", qty: 180, unit: "yd³", unitCost: 160, notes: "4" slab + thickened edges" },
    { id: uid("m"), category: "Steel", name: "Light steel framing", qty: 22, unit: "tons", unitCost: 2150 },
    { id: uid("m"), category: "MEP", name: "Electrical rough-in", qty: 3200, unit: "ft²", unitCost: 5.5 },
    { id: uid("m"), category: "MEP", name: "HVAC package (RTUs)", qty: 3, unit: "ea", unitCost: 9800 },
    { id: uid("m"), category: "Finishes", name: "Drywall + paint", qty: 7800, unit: "ft²", unitCost: 2.9 },
    { id: uid("m"), category: "Sitework", name: "Parking + striping", qty: 18000, unit: "ft²", unitCost: 1.6 },
  ];

  const office: MaterialLineItem[] = [
    { id: uid("m"), category: "Concrete", name: "Footings + slab", qty: 240, unit: "yd³", unitCost: 165 },
    { id: uid("m"), category: "Steel", name: "Structural steel (columns/beams)", qty: 38, unit: "tons", unitCost: 2400 },
    { id: uid("m"), category: "MEP", name: "Sprinkler system", qty: 11000, unit: "ft²", unitCost: 2.2 },
    { id: uid("m"), category: "MEP", name: "Electrical (panels, conduit, lighting)", qty: 11000, unit: "ft²", unitCost: 6.2 },
    { id: uid("m"), category: "Finishes", name: "Glazing + storefront", qty: 420, unit: "ft²", unitCost: 55 },
    { id: uid("m"), category: "Finishes", name: "Flooring + ceiling grid", qty: 11000, unit: "ft²", unitCost: 7.4 },
  ];

  const warehouse: MaterialLineItem[] = [
    { id: uid("m"), category: "Concrete", name: "Foundation + slab (heavy duty)", qty: 520, unit: "yd³", unitCost: 175 },
    { id: uid("m"), category: "Steel", name: "Pre-engineered metal building package", qty: 95, unit: "tons", unitCost: 2050 },
    { id: uid("m"), category: "MEP", name: "High-bay lighting", qty: 80, unit: "ea", unitCost: 420 },
    { id: uid("m"), category: "MEP", name: "Dock equipment (levelers, seals)", qty: 6, unit: "ea", unitCost: 7200 },
    { id: uid("m"), category: "Sitework", name: "Grading + drainage", qty: 1, unit: "ea", unitCost: 52000, notes: "Allowance" },
    { id: uid("m"), category: "Finishes", name: "Warehouse striping + safety signage", qty: 1, unit: "ea", unitCost: 6500 },
  ];

  return templateId === "retail" ? retail : templateId === "office" ? office : warehouse;
}

export function generateRisks(templateId: TemplateId): RiskFlag[] {
  const common: RiskFlag[] = [
    { id: uid("r"), severity: "Medium", title: "Permitting lead time variance", detail: "Permit turnaround can vary widely; schedule includes buffer but may shift based on jurisdiction." },
    { id: uid("r"), severity: "Low", title: "Utility coordination", detail: "Confirm service upgrade requirements early (power, water, gas) to avoid late changes." },
  ];

  if (templateId === "retail") {
    common.unshift({ id: uid("r"), severity: "High", title: "Long‑lead HVAC equipment", detail: "RTU availability can drive schedule risk; recommend ordering immediately after design freeze." });
  }
  if (templateId === "office") {
    common.unshift({ id: uid("r"), severity: "Medium", title: "Glazing / storefront procurement", detail: "Confirm glazing shop drawings and supplier lead times in week 2–3." });
  }
  if (templateId === "warehouse") {
    common.unshift({ id: uid("r"), severity: "High", title: "Steel package fabrication window", detail: "PEMB/steel fabrication and delivery is a primary critical-path driver for warehouse builds." });
  }
  return common;
}

export function seedProjects(): Project[] {
  const today = isoToday();
  const p1: Project = {
    id: uid("p"),
    name: "Canton Retail Buildout",
    location: "Canton, GA",
    templateId: "retail",
    createdAtIso: new Date().toISOString(),
    startDateIso: addDaysIso(today, 14),
    status: "Generated",
    blueprintFilename: "canton_retail_plan.pdf",
    model: generateModel("retail"),
    schedule: generateSchedule("retail"),
    materials: generateMaterials("retail"),
    risks: generateRisks("retail"),
  };

  const p2: Project = {
    id: uid("p"),
    name: "Midtown Office Renovation",
    location: "Atlanta, GA",
    templateId: "office",
    createdAtIso: new Date().toISOString(),
    startDateIso: addDaysIso(today, 21),
    status: "In Review",
    blueprintFilename: "midtown_office_floorplan.dwg",
    model: generateModel("office"),
    schedule: generateSchedule("office"),
    materials: generateMaterials("office"),
    risks: generateRisks("office"),
  };

  return [p1, p2];
}
