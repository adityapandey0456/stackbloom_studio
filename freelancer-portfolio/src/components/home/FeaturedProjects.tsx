import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code2 } from "lucide-react";
import { getStudioProjects } from "@/server/services/projects";

const projectImages: Record<string, string> = {
  dfinance: "/images/projects/dfinance.png",
  jobpilot: "/images/projects/jobpilot-ai.png",
  "isl-learning": "/images/projects/isl-learning.png",
  "ticket-machine": "/images/projects/train-ticket-machine.png",
  nailguard: "/images/projects/nailguard.png",
};

export default async function FeaturedProjects() {
  const projects = await getStudioProjects();

  return (
    <section
      id="work"
      className="work-section"
      aria-labelledby="work-heading"
    >
      <div className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SELECTED PROJECTS</p>

            <h2 id="work-heading">
              Ideas turned into
              <br />
              working applications.
            </h2>
          </div>

          <p className="section-description">
            Explore web platforms, automation tools and machine
            learning projects across different technologies.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => {
            const image = projectImages[project.id];
            const detailsUrl = `/projects/${encodeURIComponent(project.id)}`;

            return (
              <article className="project-card" key={project.id}>
                {image ? (
                  <Link
                    href={detailsUrl}
                    className="portfolio-cover"
                    aria-label={`Explore ${project.name}`}
                  >
                    <Image
                      src={image}
                      alt={`Conceptual interface illustration for ${project.name}`}
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      className="portfolio-cover-image"
                    />

                    <span className="portfolio-cover-caption">
                      Concept illustration
                    </span>
                  </Link>
                ) : (
                  <div className={`project-visual ${project.cover}`}>
                    <span>
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {project.category}
                    </span>

                    <strong>{project.headline}</strong>

                    <Code2 size={34} aria-hidden="true" />
                  </div>
                )}

                <div className="project-info">
                  <p className="project-category">
                    {project.category}
                  </p>

                  <h3>
                    <Link href={detailsUrl}>{project.name}</Link>
                  </h3>

                  <p className="portfolio-description">
                    {project.description}
                  </p>

                  <ul
                    className="portfolio-tags"
                    aria-label={`Technologies used in ${project.name}`}
                  >
                    {project.technologies.map((technology, index) => (
                      <li key={`${technology}-${index}`}>
                        {technology}
                      </li>
                    ))}
                  </ul>

                  <div className="portfolio-links">
                    <Link href={detailsUrl}>
                      View details
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.name} on GitHub (opens in a new tab)`}
                      >
                        <Code2 size={16} aria-hidden="true" />
                        GitHub
                      </a>
                    )}

                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${project.name} (opens in a new tab)`}
                      >
                        Visit website
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="portfolio-support">
          <div>
            <p className="eyebrow">
              ACADEMIC &amp; TECHNICAL SUPPORT
            </p>

            <h3>200+ academic and technical tasks supported</h3>

            <p>
              Support across college projects, programming practice,
              report feedback and assignment concepts, with clear
              explanations to help learners develop their own work.
            </p>
          </div>

          <Link
            href="/contact"
            className="button button-primary"
          >
            Discuss your requirements
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}