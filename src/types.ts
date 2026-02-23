export type TemplateId = "retail" | "office" | "warehouse";

export type ProjectStatus = "Draft" | "Generated" | "In Review";

export interface ScheduleTask {
  id: string;
  name: string;
  startOffsetDays: number;
  durationDays: number;
  owner: "PM" | "Architect" | "Estimator" | "Engineer" | "Field";
  phase: "Design" | "Precon" | "Procurement" | "Construction";

  /** Highlight primary drivers (UI only) */
  critical?: boolean;

  /** Milestone marker (UI only) */
  milestone?: boolean;
}

export interface MaterialLineItem {
  id: string;
  category: "Concrete" | "Steel" | "Wood" | "MEP" | "Finishes" | "Sitework";
  name: string;
  qty: number;
  unit: "yd³" | "tons" | "ft²" | "lf" | "ea";
  unitCost: number;
  notes?: string;

  /** Optional procurement metadata (demo UI) */
  vendor?: string;
  source?: string;
  sku?: string;
  leadTimeDays?: number;
  shipDays?: number;
  shipMode?: "Local delivery" | "LTL freight" | "Parcel" | "Will-call";

  /** When to order relative to planned start (can be negative) */
  orderOffsetDays?: number;
}

export interface RiskFlag {
  id: string;
  severity: "Low" | "Medium" | "High";
  title: string;
  detail: string;

  /** Optional quantified impact (demo UI) */
  probability?: number; // 0..1
  delayDaysP50?: number;
  delayDaysP90?: number;
  costImpactP50?: number;
  costImpactP90?: number;
  mitigation?: string;
  owner?: "PM" | "Architect" | "Estimator" | "Engineer" | "Field";
  phase?: "Design" | "Precon" | "Procurement" | "Construction";
}

export interface ModelParams {
  widthM: number;
  depthM: number;
  heightM: number;
  floors: 1 | 2 | 3;
  roof: "flat" | "gable";
  hasCanopy: boolean;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  templateId: TemplateId;
  createdAtIso: string;
  startDateIso: string;
  status: ProjectStatus;
  blueprintFilename?: string;
  model: ModelParams;
  schedule: ScheduleTask[];
  materials: MaterialLineItem[];
  risks: RiskFlag[];
}
