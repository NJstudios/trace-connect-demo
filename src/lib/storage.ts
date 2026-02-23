import type { Project } from "../types";
import { seedProjects } from "../seed";

const KEY = "trace_connect_demo_projects_v1";

export function loadProjects(): Project[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const seeded = seedProjects();
    localStorage.setItem(KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = seedProjects();
      localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch {
    const seeded = seedProjects();
    localStorage.setItem(KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(KEY, JSON.stringify(projects));
}

export function upsertProject(project: Project) {
  const projects = loadProjects();
  const idx = projects.findIndex(p => p.id === project.id);
  if (idx >= 0) projects[idx] = project;
  else projects.unshift(project);
  saveProjects(projects);
}

export function deleteProject(id: string) {
  const projects = loadProjects().filter(p => p.id !== id);
  saveProjects(projects);
}

export function resetDemoData() {
  localStorage.removeItem(KEY);
}
