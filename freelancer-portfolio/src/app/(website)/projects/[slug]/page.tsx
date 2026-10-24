import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Code2 } from "lucide-react";
import { getStudioProjects } from "@/server/services/projects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getStudioProjects();
  const project = projects.find((item) => item.id === slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.name,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const projects = await getStudioProjects();
  const project = projects.find((item) => item.id === slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="section container">
      <Link href="/projects" className="text-link">
        ← All projects
      </Link>

      <div className="project-detail-heading">
        <p className="eyebrow">{project.category}</p>
        <h1>{project.name}</h1>
      </div>

      <div
        className={`project-detail-cover ${project.cover}`}
        aria-hidden="true"
      >
        <strong>{project.headline}</strong>
        <Code2 size={56} />
      </div>

      <div className="project-detail-content">
        <article>
          <p className="eyebrow">PROJECT OVERVIEW</p>
          <h2>About this project</h2>

          <p className="project-detail-description">
            {project.description}
          </p>
        </article>

        <aside className="project-detail-sidebar">
          <h2>Technologies</h2>

          <ul className="portfolio-tags">
            {project.technologies.map((technology, index) => (
              <li key={`${technology}-${index}`}>
                {technology}
              </li>
            ))}
          </ul>

          <div className="project-detail-links">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-secondary"
              >
                View on GitHub
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            )}

            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-primary"
              >
                Visit website
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            )}
          </div>
        </aside>
      </div>

      <div className="contact-panel">
        <p className="eyebrow">HAVE A RELATED IDEA?</p>
        <h2>Let&apos;s discuss your project.</h2>

        <p>
          Share your requirements so we can explore a suitable
          approach, scope and timeline.
        </p>

        <Link href="/contact" className="button button-primary">
          Start a conversation
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}