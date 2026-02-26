export type TemplateId = "retail" | "office" | "warehouse";

export type ScheduleTask = {
  id: string;
  name: string;
  durationDays: number;
  startOffsetDays: number;
  owner: string;
};

export type MaterialItem = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  unitCost: number;
};

export type RiskFlag = {
  id: string;
  severity: "Low" | "Medium" | "High";
  title: string;
  detail: string;
  suggestion: string;
};

export type DemoProject = {
  name: string;
  location: string;
  templateId: TemplateId;
  startDateIso: string;
  blueprintFilename: string;
  schedule: ScheduleTask[];
  materials: MaterialItem[];
  risks: RiskFlag[];
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function templateLabel(t: TemplateId) {
  if (t === "retail") return "Retail Buildout";
  if (t === "office") return "Small Office";
  return "Warehouse Expansion";
}

export function makeDemoProject(startDateIso: string, templateId: TemplateId): DemoProject {
  const baseName = templateLabel(templateId);
  const schedule: ScheduleTask[] =
    templateId === "retail"
      ? [
          { id: uid("t"), name: "Site walk + scope confirmation", durationDays: 2, startOffsetDays: 0, owner: "PM" },
          { id: uid("t"), name: "Demo / rough-in planning", durationDays: 4, startOffsetDays: 2, owner: "Super" },
          { id: uid("t"), name: "MEP coordination", durationDays: 5, startOffsetDays: 6, owner: "MEP" },
          { id: uid("t"), name: "Framing + drywall", durationDays: 7, startOffsetDays: 11, owner: "GC" },
          { id: uid("t"), name: "Finishes + punch", durationDays: 5, startOffsetDays: 18, owner: "GC" },
        ]
      : templateId === "office"
        ? [
            { id: uid("t"), name: "Space plan validation", durationDays: 3, startOffsetDays: 0, owner: "Architect" },
            { id: uid("t"), name: "Permitting package", durationDays: 6, startOffsetDays: 3, owner: "Architect" },
            { id: uid("t"), name: "MEP rough-in", durationDays: 6, startOffsetDays: 9, owner: "MEP" },
            { id: uid("t"), name: "Interior buildout", durationDays: 8, startOffsetDays: 15, owner: "GC" },
          ]
        : [
            { id: uid("t"), name: "Existing conditions scan", durationDays: 3, startOffsetDays: 0, owner: "PM" },
            { id: uid("t"), name: "Structural review", durationDays: 5, startOffsetDays: 3, owner: "Engineer" },
            { id: uid("t"), name: "Slab + utilities", durationDays: 7, startOffsetDays: 8, owner: "GC" },
            { id: uid("t"), name: "Steel + envelope", durationDays: 10, startOffsetDays: 15, owner: "GC" },
          ];

  const materials: MaterialItem[] =
    templateId === "retail"
      ? [
          { id: uid("m"), name: "Drywall", unit: "sheets", qty: 210, unitCost: 14.25 },
          { id: uid("m"), name: "Metal studs", unit: "pcs", qty: 180, unitCost: 6.8 },
          { id: uid("m"), name: "Ceiling grid", unit: "sqft", qty: 1200, unitCost: 2.1 },
          { id: uid("m"), name: "Flooring (LVP)", unit: "sqft", qty: 1100, unitCost: 4.15 },
        ]
      : templateId === "office"
        ? [
            { id: uid("m"), name: "Drywall", unit: "sheets", qty: 160, unitCost: 14.25 },
            { id: uid("m"), name: "Paint", unit: "gal", qty: 45, unitCost: 32.0 },
            { id: uid("m"), name: "Carpet tile", unit: "sqft", qty: 900, unitCost: 3.6 },
            { id: uid("m"), name: "Lighting fixtures", unit: "pcs", qty: 22, unitCost: 115.0 },
          ]
        : [
            { id: uid("m"), name: "Concrete", unit: "yd³", qty: 38, unitCost: 165.0 },
            { id: uid("m"), name: "Rebar", unit: "tons", qty: 2.4, unitCost: 820.0 },
            { id: uid("m"), name: "Steel members", unit: "tons", qty: 6.2, unitCost: 2400.0 },
            { id: uid("m"), name: "Insulated panels", unit: "sqft", qty: 2200, unitCost: 6.75 },
          ];

  const risks: RiskFlag[] =
    templateId === "retail"
      ? [
          {
            id: uid("r"),
            severity: "High",
            title: "Potential MEP clash near back-of-house",
            detail: "Blueprint indicates tight routing where electrical + ductwork overlap.",
            suggestion: "Request coordinated MEP layout before rough-in to prevent rework.",
          },
          {
            id: uid("r"),
            severity: "Medium",
            title: "Unknown existing wall conditions",
            detail: "No demolition notes shown for interior partitions.",
            suggestion: "Add site walk checklist + verify load-bearing walls early.",
          },
        ]
      : templateId === "office"
        ? [
            {
              id: uid("r"),
              severity: "Medium",
              title: "Permitting timeline risk",
              detail: "Scope suggests work that may trigger inspection/permit updates.",
              suggestion: "Generate permitting checklist and submit package in week 1.",
            },
            {
              id: uid("r"),
              severity: "Low",
              title: "Finish lead times",
              detail: "Specified fixtures may have variable availability.",
              suggestion: "Confirm alternates and lock orders during planning.",
            },
          ]
        : [
            {
              id: uid("r"),
              severity: "High",
              title: "Structural loading assumptions",
              detail: "Warehouse expansion may require updated calcs for new equipment loads.",
              suggestion: "Flag engineer review on slab/footings before ordering steel.",
            },
            {
              id: uid("r"),
              severity: "Medium",
              title: "Utility tie-in dependencies",
              detail: "Schedule depends on availability of utility shutoff window.",
              suggestion: "Call utility provider early and set contingency dates.",
            },
          ];

  return {
    name: `${baseName} — Demo`,
    location: "Atlanta, GA",
    templateId,
    startDateIso,
    blueprintFilename: "Retail_Blueprint_A1.pdf",
    schedule,
    materials,
    risks,
  };
}
