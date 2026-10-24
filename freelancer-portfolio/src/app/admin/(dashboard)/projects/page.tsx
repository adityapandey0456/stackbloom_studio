import Link from "next/link";
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import {
  getStudioProjects,
  saveStudioProject,
} from "@/server/services/projects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const covers = [
  "project-green",
  "project-purple",
  "project-orange",
  "project-blue",
  "project-pink",
];

function refreshProjectPages() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/admin/projects");
}

async function saveProject(formData: FormData) {
  "use server";

  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  function text(key: string, limit: number) {
    const value = formData.get(key);

    if (
      typeof value !== "string" ||
      value.trim().length > limit
    ) {
      throw new Error(`Invalid ${key}.`);
    }

    return value.trim();
  }

  function validUrl(value: string) {
    if (!value) return true;

    try {
      const url = new URL(value);

      return (
        ["https:", "http:"].includes(url.protocol) &&
        !url.username &&
        !url.password
      );
    } catch {
      return false;
    }
  }

  const id = text("id", 36);
  const name = text("name", 100);
  const category = text("category", 100);
  const headline = text("headline", 100);
  const description = text("description", 1500);
  const technologyText = text("technologies", 500);
  const github = text("github", 500);
  const live = text("live", 500);
  const cover = text("cover", 30);

  const technologies = [
    ...new Set(
      technologyText
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    ),
  ];

  if (
    name.length < 2 ||
    category.length < 2 ||
    headline.length < 2 ||
    description.length < 20 ||
    technologies.length === 0 ||
    !covers.includes(cover) ||
    !validUrl(github) ||
    !validUrl(live)
  ) {
    throw new Error(
      "Please check the project fields and URLs."
    );
  }

  let archived = false;

  if (id) {
    const existing = await getStudioProjects(true);

    const current = existing.find(
      (project) => project.id === id
    );

    if (!current) {
      throw new Error("Project not found.");
    }

    archived = current.archived === true;
  }

  await saveStudioProject({
    id: id || randomUUID(),
    name,
    category,
    headline,
    description,
    technologies,
    github,
    live,
    cover,
    archived,
  });

  refreshProjectPages();
  redirect("/admin/projects?saved=1");
}

async function setProjectArchive(formData: FormData) {
  "use server";

  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const id = formData.get("id");
  const archiveValue = formData.get("archived");

  if (
    typeof id !== "string" ||
    !["true", "false"].includes(String(archiveValue))
  ) {
    throw new Error("Invalid project request.");
  }

  const projects = await getStudioProjects(true);

  const project = projects.find(
    (item) => item.id === id
  );

  if (!project) {
    throw new Error("Project not found.");
  }

  const archived = archiveValue === "true";

  await saveStudioProject({
    ...project,
    archived,
  });

  refreshProjectPages();

  redirect(
    `/admin/projects?notice=${archived ? "archived" : "restored"}`
  );
}

type PageProps = {
  searchParams: Promise<{
    edit?: string;
    saved?: string;
    notice?: string;
  }>;
};

export default async function AdminProjectsPage({
  searchParams,
}: PageProps) {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const query = await searchParams;
  const projects = await getStudioProjects(true);

  const selected = query.edit
    ? projects.find((project) => project.id === query.edit)
    : undefined;

  const publishedCount = projects.filter(
    (project) => !project.archived
  ).length;

  const archivedCount = projects.length - publishedCount;

  const notification =
    query.saved === "1"
      ? "Project saved successfully."
      : query.notice === "archived"
        ? "Project archived. It is now hidden from the public portfolio."
        : query.notice === "restored"
          ? "Project restored to the public portfolio."
          : "";

  return (
    <>
      <p className="eyebrow">
        STACKBLOOM STUDIO / PORTFOLIO
      </p>

      <h1 className="admin-title">Manage projects</h1>

      <p className="admin-summary">
        Add new projects, edit existing work or archive projects
        without deleting their details.
      </p>

      <div className="admin-project-links">
        <Link href="/admin">← Enquiries</Link>

        <Link href="/admin/projects">
          Add new project
        </Link>

        <Link href="/projects">
          View portfolio ↗
        </Link>
      </div>

      <p className="admin-summary">
        {publishedCount} published · {archivedCount} archived
      </p>

      {notification && (
        <p className="admin-save-message" role="status">
          {notification}
        </p>
      )}

      {query.edit && !selected ? (
        <div className="admin-enquiry" role="alert">
          <h2>Project not found</h2>
          <p>Select a project from the list below.</p>
          <Link
            href="/admin/projects"
            className="text-link"
          >
            Add a new project ↗
          </Link>
        </div>
      ) : (
        <form
          key={selected?.id || "new"}
          action={saveProject}
          className="admin-project-form"
        >
          <h2>
            {selected ? "Edit project" : "Add a project"}
          </h2>

          {selected?.archived && (
            <p className="admin-summary">
              This project is archived. Saving changes keeps it
              archived. Use Restore project to publish it again.
            </p>
          )}

          <input
            type="hidden"
            name="id"
            value={selected?.id || ""}
          />

          <label>
            Project name
            <input
              name="name"
              defaultValue={selected?.name || ""}
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label>
            Category
            <input
              name="category"
              placeholder="Web Development / Business Application"
              defaultValue={selected?.category || ""}
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label>
            Cover headline
            <input
              name="headline"
              placeholder="A short headline for the coloured cover"
              defaultValue={selected?.headline || ""}
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              rows={5}
              defaultValue={selected?.description || ""}
              minLength={20}
              maxLength={1500}
              required
            />
          </label>

          <label>
            Technologies, separated by commas
            <input
              name="technologies"
              placeholder="React, Python, Flask"
              defaultValue={
                selected?.technologies.join(", ") || ""
              }
              maxLength={500}
              required
            />
          </label>

          <label>
            GitHub URL — optional
            <input
              name="github"
              type="url"
              placeholder="https://github.com/..."
              defaultValue={selected?.github || ""}
              maxLength={500}
            />
          </label>

          <label>
            Website / demo URL — optional
            <input
              name="live"
              type="url"
              placeholder="https://..."
              defaultValue={selected?.live || ""}
              maxLength={500}
            />
          </label>

          <label>
            Cover colour
            <select
              name="cover"
              defaultValue={
                selected?.cover || "project-green"
              }
            >
              <option value="project-green">Green</option>
              <option value="project-purple">Purple</option>
              <option value="project-orange">Orange</option>
              <option value="project-blue">Blue</option>
              <option value="project-pink">Pink</option>
            </select>
          </label>

          <button
            type="submit"
            className="button button-primary"
          >
            {selected ? "Save changes" : "Publish project"}
          </button>
        </form>
      )}

      <h2 className="admin-project-list-title">
        Your portfolio projects
      </h2>

      {projects.length === 0 ? (
        <p className="admin-summary">
          No projects yet. Add your first project above.
        </p>
      ) : (
        <div className="admin-enquiries">
          {projects.map((project) => (
            <article
              className="admin-enquiry"
              key={project.id}
            >
              <h2>{project.name}</h2>
              <p>{project.category}</p>

              <div className="project-management-actions">
                <span
                  className={
                    project.archived
                      ? "project-state project-state-archived"
                      : "project-state"
                  }
                >
                  {project.archived
                    ? "Archived"
                    : "Published"}
                </span>

                <Link
                  className="text-link"
                  href={`/admin/projects?edit=${project.id}`}
                >
                  Edit project ↗
                </Link>

                {!project.archived && (
                  <Link
                    className="text-link"
                    href={`/projects/${project.id}`}
                  >
                    View page ↗
                  </Link>
                )}

                <form action={setProjectArchive}>
                  <input
                    type="hidden"
                    name="id"
                    value={project.id}
                  />

                  <input
                    type="hidden"
                    name="archived"
                    value={
                      project.archived ? "false" : "true"
                    }
                  />

                  <button
                    type="submit"
                    className="project-archive-button"
                  >
                    {project.archived
                      ? "Restore project"
                      : "Archive project"}
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}