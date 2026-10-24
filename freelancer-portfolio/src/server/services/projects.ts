import "server-only";

import {
  mkdir,
  readFile,
  readdir,
  rename,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { defaultProjects } from "@/config/portfolio";

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

const directory = path.join(
  process.cwd(),
  "data",
  "projects"
);

function validProjectId(id: string): boolean {
  const isOriginal = defaultProjects.some(
    (project) => project.id === id
  );

  const isUuid =
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
      id
    );

  return isOriginal || isUuid;
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

  let files: string[] = [];

  try {
    files = await readdir(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const savedProjects = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map(async (file): Promise<StudioProject> => {
        const content = await readFile(
          path.join(directory, file),
          "utf8"
        );

        const project = JSON.parse(content) as StudioProject;

        if (
          !project ||
          typeof project.id !== "string" ||
          !validProjectId(project.id) ||
          file !== `${project.id}.json`
        ) {
          throw new Error(`Invalid saved project: ${file}`);
        }

        return {
          ...project,
          archived: project.archived === true,
        };
      })
  );

  for (const project of savedProjects) {
    combined.set(project.id, project);
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

  await mkdir(directory, { recursive: true });

  const temporary = path.join(
    directory,
    `${randomUUID()}.tmp`
  );

  const target = path.join(
    directory,
    `${project.id}.json`
  );

  await writeFile(
    temporary,
    JSON.stringify(
      {
        ...project,
        archived: project.archived === true,
      },
      null,
      2
    ),
    "utf8"
  );

  await rename(temporary, target);
}