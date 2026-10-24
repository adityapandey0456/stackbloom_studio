import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Aditya Pandey, founder of StackBloom Studio, and explore his work in web development, AI, dashboards and automation.",
};

const skills = [
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "Python",
  "Flask",
  "FastAPI",
  "MongoDB",
  "TensorFlow",
  "OpenCV",
  "Kotlin",
  "Git",
];

const approach = [
  {
    title: "Understand your goals",
    description:
      "Every project starts with a conversation about your requirements, intended users and the problems you want to solve.",
  },
  {
    title: "Agree on a clear scope",
    description:
      "Deliverables, timelines and review points are agreed before development begins, so you know what to expect.",
  },
  {
    title: "Build for a useful handover",
    description:
      "The agreed delivery includes the information you need to understand, run and use the finished work.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section
        className="section container about-section"
        aria-labelledby="about-page-heading"
      >
        <div className="about-monogram" aria-hidden="true">
          A<span>↗</span>
        </div>

        <div>
          <p className="eyebrow">
            THE PERSON BEHIND STACKBLOOM STUDIO
          </p>

          <h1
            id="about-page-heading"
            className="about-page-title"
          >
            Hi, I&apos;m
            <br />
            Aditya Pandey.
          </h1>

          <p className="about-description">
            I&apos;m the founder of StackBloom Studio and a
            full-stack developer interested in building useful
            websites, applications, automation tools and AI
            prototypes.
          </p>

          <p className="about-description">
            StackBloom Studio brings this work together under
            one brand, with a focus on clear communication,
            practical solutions and development shaped around
            your requirements.
          </p>

          <div className="hero-actions">
            <Link
              href="/contact"
              className="button button-primary"
            >
              Discuss your project
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>

            <a
              href="https://github.com/adityapandey0456"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
              aria-label="Explore Aditya's GitHub profile (opens in a new tab)"
            >
              Explore GitHub
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section
        className="work-section"
        aria-labelledby="studio-heading"
      >
        <div className="section container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ABOUT THE STUDIO</p>

              <h2 id="studio-heading">
                Ideas into applications.
                <br />
                Complexity into clarity.
              </h2>
            </div>

            <p className="section-description">
              Websites, apps, dashboards and automation tools
              built around what you need to achieve.
            </p>
          </div>

          <p className="about-description">
            My portfolio spans financial workflows, career
            automation, Indian Sign Language learning, image
            classification and object-oriented programming.
            These projects explore different technologies and
            approaches to practical software problems.
          </p>

          <Link href="/projects" className="text-link">
            Explore selected projects
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section
        className="section container"
        aria-labelledby="approach-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">HOW I WORK</p>

            <h2 id="approach-heading">
              Understand the problem.
              <br />
              Build with purpose.
            </h2>
          </div>

          <p className="section-description">
            Work directly with the developer, from the first
            conversation through to review and handover.
          </p>
        </div>

        <div className="services-grid">
          {approach.map((item) => (
            <article
              className="service-card"
              key={item.title}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="work-section"
        aria-labelledby="technologies-heading"
      >
        <div className="section container">
          <p className="eyebrow">
            TECHNOLOGIES IN MY PROJECTS
          </p>

          <h2 id="technologies-heading">
            A toolkit for different challenges.
          </h2>

          <ul
            className="about-skills"
            aria-label="Technologies"
          >
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>

          <Link href="/services" className="text-link">
            Explore studio services
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section container">
        <div className="contact-panel">
          <p className="eyebrow">
            LET&apos;S BUILD SOMETHING USEFUL
          </p>

          <h2>Have an idea in mind?</h2>

          <p>
            Tell me what you want to build. We can discuss your
            requirements, explore the options and agree on
            the next steps.
          </p>

          <Link
            href="/contact"
            className="button button-primary"
          >
            Start a conversation
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}