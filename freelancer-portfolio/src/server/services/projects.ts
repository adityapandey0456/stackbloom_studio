import "server-only";

import { defaultProjects } from "@/config/portfolio";
import { getDatabase } from "@/lib/supabase-admin";

export type StudioProject = {
  id: string;
  name: string;
  category: string;
  description: string;
  technologies: string[];
  github: string;
  live: string;
  headline: string;
  cover: string;
  archived?: boolean;
};

function validProjectId(id: string): boolean {
  return (
    defaultProjects.some((project) => project.id === id) ||
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
      id
    )
  );
}

export async function getStudioProjects(
  includeArchived = false
): Promise<StudioProject[]> {
  const combined = new Map<string, StudioProject>();

  for (const project of defaultProjects) {
    combined.set(project.id, {
      ...project,
      technologies: [...project.technologies],
      archived: false,
    });
  }

  const { data, error } = await getDatabase()
    .from("studio_projects")
    .select(
      "id,name,category,description,technologies,github,live,headline,cover,archived"
    )
    .order("id");

  if (error) {
    console.error("SUPABASE_READ_ERROR", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    throw new Error("Could not read projects from Supabase.");
  }

  for (const row of data ?? []) {
    if (!validProjectId(row.id)) {
      throw new Error("Invalid saved project ID.");
    }

    combined.set(row.id, {
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      technologies: row.technologies,
      github: row.github,
      live: row.live,
      headline: row.headline,
      cover: row.cover,
      archived: row.archived === true,
    });
  }

  const projects = [...combined.values()];

  return includeArchived
    ? projects
    : projects.filter((project) => !project.archived);
}

export async function saveStudioProject(
  project: StudioProject
): Promise<void> {
  if (!validProjectId(project.id)) {
    throw new Error("Invalid project ID.");
  }

  const { error } = await getDatabase()
    .from("studio_projects")
    .upsert(
      {
        id: project.id,
        name: project.name,
        category: project.category,
        description: project.description,
        technologies: project.technologies,
        github: project.github,
        live: project.live,
        headline: project.headline,
        cover: project.cover,
        archived: project.archived === true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) {
    console.error("SUPABASE_SAVE_ERROR", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    throw new Error("Could not save project to Supabase.");
  }
}