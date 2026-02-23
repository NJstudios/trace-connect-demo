import type { Project, TemplateId, ModelParams, ScheduleTask, MaterialLineItem, RiskFlag } from "./types";
import { isoToday, addDaysIso } from "./lib/date";

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function templateLabel(id: TemplateId): string {
  switch (id) {
    case "retail":
      return "Modern Retail Shell";
    case "office":
      return "Small Office";
    case "warehouse":
      return "Warehouse Expansion";
  }
}

export function generateModel(templateId: TemplateId): ModelParams {
  if (templateId === "retail") return { widthM: 32, depthM: 24, heightM: 8, floors: 1, roof: "flat", hasCanopy: true };
  if (templateId === "office") return { widthM: 36, depthM: 22, heightM: 10, floors: 2, roof: "flat", hasCanopy: false };
  return { widthM: 60, depthM: 30, heightM: 9, floors: 1, roof: "gable", hasCanopy: false };
}

export function generateSchedule(templateId: TemplateId): ScheduleTask[] {
  // More realistic, judge-friendly timeline. (Still a demo.)
  if (templateId === "retail") {
    return [
      { id: uid("t"), name: "Concept + scope validation", startOffsetDays: 0, durationDays: 7, owner: "PM", phase: "Precon", critical: true },
      { id: uid("t"), name: "Permit set (architectural)", startOffsetDays: 5, durationDays: 14, owner: "Architect", phase: "Design", critical: true },
      { id: uid("t"), name: "MEP design package", startOffsetDays: 10, durationDays: 12, owner: "Engineer", phase: "Design" },
      { id: uid("t"), name: "Permit submission + review", startOffsetDays: 19, durationDays: 21, owner: "PM", phase: "Precon", critical: true, milestone: true },
      { id: uid("t"), name: "Long-lead procurement (HVAC/steel/glazing)", startOffsetDays: 14, durationDays: 42, owner: "Estimator", phase: "Procurement", critical: true },
      { id: uid("t"), name: "Sitework + utilities", startOffsetDays: 40, durationDays: 14, owner: "Field", phase: "Construction", critical: true },
      { id: uid("t"), name: "Foundation + slab", startOffsetDays: 52, durationDays: 10, owner: "Field", phase: "Construction", critical: true, milestone: true },
      { id: uid("t"), name: "Steel erection", startOffsetDays: 62, durationDays: 14, owner: "Field", phase: "Construction", critical: true },
      { id: uid("t"), name: "Envelope + roofing", startOffsetDays: 72, durationDays: 18, owner: "Field", phase: "Construction" },
      { id: uid("t"), name: "Storefront glazing install", startOffsetDays: 82, durationDays: 10, owner: "Field", phase: "Construction", critical: true },
      { id: uid("t"), name: "MEP rough-in", startOffsetDays: 78, durationDays: 20, owner: "Engineer", phase: "Construction", critical: true },
      { id: uid("t"), name: "Interior buildout + finishes", startOffsetDays: 98, durationDays: 26, owner: "Field", phase: "Construction" },
      { id: uid("t"), name: "Commissioning + punch list", startOffsetDays: 122, durationDays: 12, owner: "PM", phase: "Construction", milestone: true },
      { id: uid("t"), name: "Final inspection + turnover", startOffsetDays: 135, durationDays: 5, owner: "PM", phase: "Construction", critical: true, milestone: true },
    ];
  }

  // Keep other templates simpler (demo).
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
    base.splice(10, 0, {
      id: uid("t"),
      name: "Steel package fabrication",
      startOffsetDays: 22,
      durationDays: 14,
      owner: "Estimator",
      phase: "Procurement",
      critical: true,
    });
  }
  if (templateId === "office") {
    base.splice(12, 0, {
      id: uid("t"),
      name: "Interior partitions + glazing",
      startOffsetDays: 38,
      durationDays: 7,
      owner: "Field",
      phase: "Construction",
    });
  }
  return base;
}

export function generateMaterials(templateId: TemplateId): MaterialLineItem[] {
  const retail: MaterialLineItem[] = [
    {
      id: uid("m"),
      category: "Concrete",
      name: "Slab-on-grade concrete",
      qty: 180,
      unit: "yd³",
      unitCost: 165,
      notes: '4" slab + thickened edges',
      vendor: "Holcim / Lafarge",
      source: "Regional plant",
      leadTimeDays: 5,
      shipDays: 1,
      shipMode: "Local delivery",
      orderOffsetDays: -14,
    },
    {
      id: uid("m"),
      category: "Steel",
      name: "Structural steel framing",
      qty: 24,
      unit: "tons",
      unitCost: 2300,
      vendor: "Nucor Building Systems",
      source: "Fabrication partner",
      leadTimeDays: 28,
      shipDays: 4,
      shipMode: "LTL freight",
      orderOffsetDays: -45,
    },
    {
      id: uid("m"),
      category: "Finishes",
      name: "Storefront glazing system",
      qty: 210,
      unit: "ft²",
      unitCost: 96,
      vendor: "Oldcastle BuildingEnvelope",
      source: "Fabricated system",
      leadTimeDays: 30,
      shipDays: 5,
      shipMode: "LTL freight",
      orderOffsetDays: -40,
    },
    {
      id: uid("m"),
      category: "MEP",
      name: "Roof-top HVAC units",
      qty: 2,
      unit: "ea",
      unitCost: 12800,
      vendor: "Trane",
      source: "Mechanical supplier",
      leadTimeDays: 35,
      shipDays: 6,
      shipMode: "LTL freight",
      orderOffsetDays: -60,
    },
    {
      id: uid("m"),
      category: "MEP",
      name: "Electrical rough-in materials",
      qty: 10500,
      unit: "ft²",
      unitCost: 2.9,
      vendor: "Graybar",
      source: "Regional distribution",
      leadTimeDays: 7,
      shipDays: 2,
      shipMode: "Parcel",
      orderOffsetDays: -18,
    },
    {
      id: uid("m"),
      category: "Finishes",
      name: "Gypsum board + joint compound",
      qty: 7800,
      unit: "ft²",
      unitCost: 1.35,
      vendor: "USG",
      source: "Local distributor",
      leadTimeDays: 5,
      shipDays: 2,
      shipMode: "Local delivery",
      orderOffsetDays: -10,
    },
    {
      id: uid("m"),
      category: "Finishes",
      name: "Paint system",
      qty: 7800,
      unit: "ft²",
      unitCost: 0.85,
      vendor: "Sherwin-Williams",
      source: "Local store",
      leadTimeDays: 2,
      shipDays: 1,
      shipMode: "Local delivery",
      orderOffsetDays: -5,
    },
    {
      id: uid("m"),
      category: "Sitework",
      name: "Asphalt paving + striping",
      qty: 18000,
      unit: "ft²",
      unitCost: 1.6,
      vendor: "Vulcan Materials",
      source: "Local plant",
      leadTimeDays: 7,
      shipDays: 1,
      shipMode: "Local delivery",
      orderOffsetDays: -20,
    },
    {
      id: uid("m"),
      category: "Finishes",
      name: "Roofing membrane system",
      qty: 10500,
      unit: "ft²",
      unitCost: 1.95,
      vendor: "Carlisle SynTec",
      source: "Roofing supplier",
      leadTimeDays: 10,
      shipDays: 4,
      shipMode: "LTL freight",
      orderOffsetDays: -30,
    },
  ];

  const office: MaterialLineItem[] = [
    { id: uid("m"), category: "Concrete", name: "Footings + slab", qty: 240, unit: "yd³", unitCost: 165, vendor: "Holcim / Lafarge", leadTimeDays: 5, shipDays: 1, shipMode: "Local delivery", orderOffsetDays: -14 },
    { id: uid("m"), category: "Steel", name: "Structural steel (columns/beams)", qty: 38, unit: "tons", unitCost: 2400, vendor: "Nucor", leadTimeDays: 28, shipDays: 4, shipMode: "LTL freight", orderOffsetDays: -45 },
    { id: uid("m"), category: "MEP", name: "Sprinkler system", qty: 11000, unit: "ft²", unitCost: 2.2, vendor: "Johnson Controls", leadTimeDays: 14, shipDays: 3, shipMode: "LTL freight", orderOffsetDays: -25 },
    { id: uid("m"), category: "MEP", name: "Electrical (panels, conduit, lighting)", qty: 11000, unit: "ft²", unitCost: 6.2, vendor: "Rexel", leadTimeDays: 10, shipDays: 3, shipMode: "Parcel", orderOffsetDays: -20 },
    { id: uid("m"), category: "Finishes", name: "Glazing + storefront", qty: 420, unit: "ft²", unitCost: 55, vendor: "Oldcastle BuildingEnvelope", leadTimeDays: 30, shipDays: 5, shipMode: "LTL freight", orderOffsetDays: -40 },
    { id: uid("m"), category: "Finishes", name: "Flooring + ceiling grid", qty: 11000, unit: "ft²", unitCost: 7.4, vendor: "Armstrong", leadTimeDays: 14, shipDays: 4, shipMode: "LTL freight", orderOffsetDays: -15 },
  ];

  const warehouse: MaterialLineItem[] = [
    { id: uid("m"), category: "Concrete", name: "Foundation + slab (heavy duty)", qty: 520, unit: "yd³", unitCost: 175, vendor: "Holcim / Lafarge", leadTimeDays: 7, shipDays: 1, shipMode: "Local delivery", orderOffsetDays: -20 },
    { id: uid("m"), category: "Steel", name: "Pre-engineered metal building package", qty: 95, unit: "tons", unitCost: 2050, vendor: "Butler Manufacturing", leadTimeDays: 45, shipDays: 7, shipMode: "LTL freight", orderOffsetDays: -75 },
    { id: uid("m"), category: "MEP", name: "High-bay lighting", qty: 80, unit: "ea", unitCost: 420, vendor: "Grainger", leadTimeDays: 7, shipDays: 3, shipMode: "Parcel", orderOffsetDays: -25 },
    { id: uid("m"), category: "MEP", name: "Dock equipment (levelers, seals)", qty: 6, unit: "ea", unitCost: 7200, vendor: "Rite-Hite", leadTimeDays: 28, shipDays: 6, shipMode: "LTL freight", orderOffsetDays: -55 },
    { id: uid("m"), category: "Sitework", name: "Grading + drainage", qty: 1, unit: "ea", unitCost: 52000, notes: "Allowance", vendor: "Vulcan Materials", leadTimeDays: 10, shipDays: 2, shipMode: "Local delivery", orderOffsetDays: -20 },
    { id: uid("m"), category: "Finishes", name: "Warehouse striping + safety signage", qty: 1, unit: "ea", unitCost: 6500, vendor: "Fastenal", leadTimeDays: 7, shipDays: 3, shipMode: "Parcel", orderOffsetDays: -10 },
  ];

  return templateId === "retail" ? retail : templateId === "office" ? office : warehouse;
}

export function generateRisks(templateId: TemplateId): RiskFlag[] {
  const common: RiskFlag[] = [
    {
      id: uid("r"),
      severity: "Medium",
      title: "Permitting lead time variance",
      detail: "Permit turnaround varies by jurisdiction; include buffer and confirm requirements early.",
      probability: 0.28,
      delayDaysP50: 5,
      delayDaysP90: 14,
      costImpactP50: 9000,
      costImpactP90: 25000,
      mitigation: "Early pre-submittal meeting + complete packet.",
      owner: "PM",
      phase: "Precon",
    },
    {
      id: uid("r"),
      severity: "Low",
      title: "Utility coordination",
      detail: "Confirm power/gas/water upgrades early to avoid late change orders.",
      probability: 0.18,
      delayDaysP50: 3,
      delayDaysP90: 8,
      costImpactP50: 6000,
      costImpactP90: 18000,
      mitigation: "Utility locate + early civil coordination.",
      owner: "Engineer",
      phase: "Construction",
    },
  ];

  if (templateId === "retail") {
    common.unshift({
      id: uid("r"),
      severity: "High",
      title: "Long-lead HVAC equipment",
      detail: "RTU availability can drive critical path; order after design freeze.",
      probability: 0.35,
      delayDaysP50: 6,
      delayDaysP90: 16,
      costImpactP50: 18000,
      costImpactP90: 52000,
      mitigation: "Release equipment submittal early + alternate model/vendor.",
      owner: "Estimator",
      phase: "Procurement",
    });
    common.unshift({
      id: uid("r"),
      severity: "High",
      title: "Steel fabrication / shop drawing cycle",
      detail: "Fabrication window + approvals can shift framing start.",
      probability: 0.30,
      delayDaysP50: 5,
      delayDaysP90: 12,
      costImpactP50: 14000,
      costImpactP90: 42000,
      mitigation: "Early structural package release + dedicated approval window.",
      owner: "Estimator",
      phase: "Procurement",
    });
  }
  if (templateId === "office") {
    common.unshift({
      id: uid("r"),
      severity: "Medium",
      title: "Glazing / storefront procurement",
      detail: "Confirm glazing shop drawings and supplier lead times in week 2–3.",
      probability: 0.22,
      delayDaysP50: 4,
      delayDaysP90: 10,
      costImpactP50: 8000,
      costImpactP90: 22000,
      mitigation: "Lock system early + expedited fabrication slot.",
      owner: "Architect",
      phase: "Procurement",
    });
  }
  if (templateId === "warehouse") {
    common.unshift({
      id: uid("r"),
      severity: "High",
      title: "Steel package fabrication window",
      detail: "PEMB fabrication + delivery is a primary critical-path driver.",
      probability: 0.40,
      delayDaysP50: 7,
      delayDaysP90: 18,
      costImpactP50: 22000,
      costImpactP90: 65000,
      mitigation: "Reserve fabrication slot + early engineering release.",
      owner: "Estimator",
      phase: "Procurement",
    });
  }
  return common;
}

export function seedProjects(): Project[] {
  const today = isoToday();
  const p1: Project = {
    id: uid("p"),
    name: "Modern Retail Shell – 10,500 SF",
    location: "Atlanta, GA",
    templateId: "retail",
    createdAtIso: new Date().toISOString(),
    startDateIso: addDaysIso(today, 21),
    status: "Generated",
    blueprintFilename: "retail_shell_v2.pdf",
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
    startDateIso: addDaysIso(today, 35),
    status: "In Review",
    blueprintFilename: "midtown_office_floorplan.dwg",
    model: generateModel("office"),
    schedule: generateSchedule("office"),
    materials: generateMaterials("office"),
    risks: generateRisks("office"),
  };

  return [p1, p2];
}
