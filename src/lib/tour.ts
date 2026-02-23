export type TourStep = "projects" | "new" | "outputs";

const KEY = "trace_connect_tour_v1";

export function startTour() {
  sessionStorage.setItem(KEY, "projects");
}

export function getTourStep(): TourStep | null {
  const v = sessionStorage.getItem(KEY);
  if (v === "projects" || v === "new" || v === "outputs") return v;
  return null;
}

export function setTourStep(step: TourStep) {
  sessionStorage.setItem(KEY, step);
}

export function endTour() {
  sessionStorage.removeItem(KEY);
}
