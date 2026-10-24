import {
  ArrowUpRight,
  BarChart3,
  Code2,
  Workflow,
} from "lucide-react";

import EnquiryForm from "@/components/forms/EnquiryForm";
import FAQ from "@/components/home/FAQ";
import FeaturedProjects from "@/components/home/FeaturedProjects";

const services = [
  {
    icon: Code2,
    title: "Website development",
    description:
      "Responsive business websites and web applications that explain your services clearly and help customers get in touch.",
    tags: "Business websites / Web applications / Website fixes",
  },
  {
    icon: BarChart3,
    title: "Data & dashboards",
    description:
      "Turn spreadsheets and business data into clear reports and dashboards that support everyday decisions.",
    tags: "Excel dashboards / Data analysis / Reporting",
  },
  {
    icon: Workflow,
    title: "Automation & tools",
    description:
      "Practical scripts and custom tools that reduce repetitive work and simplify your workflow.",
    tags: "Python scripts / Workflow tools / Data processing",
  },
];

const workProcess = [
  {
    number: "01",
    title: "Understand",
    description:
      "We discuss your goals, requirements and budget.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "You receive an agreed scope, quotation and timeline.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "I develop the solution and share progress for review.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "We check the work and complete the handover.",
  },
];

export default function HomePage() {
  return (
    <>
      <section
        className="hero container"
        aria-labelledby="hero-heading"
      >
        <div className="hero-content">
          <p className="eyebrow">
            FREELANCE DEVELOPMENT &amp; DATA SOLUTIONS
          </p>

          <h1 id="hero-heading">
            Your next idea,
            <br />
            <span>built with care.</span>
          </h1>

          <p className="hero-description">
  StackBloom Studio helps turn your ideas into thoughtful
  websites, useful applications, clear dashboards and
  practical automation tools.
</p>

          <div className="hero-actions">
            <a
              className="button button-primary"
              href="#contact"
            >
              Discuss your project
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>

            <a
              className="button button-secondary"
              href="#work"
            >
              Explore the work
            </a>
          </div>

          <div className="hero-note">
            Clear communication. A practical approach.
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="art-top">
            <span className="art-dot" />
            <span>FROM IDEA TO SOMETHING USEFUL</span>
          </div>

          <div className="art-symbol">↗</div>

          <div className="art-bottom">
            <span>Thoughtfully designed.</span>
            <strong>Built to work.</strong>
          </div>

          <div className="floating-label">
            &lt;/&gt; &nbsp; Design meets development
          </div>
        </div>
      </section>

      <section className="skills-strip" aria-label="Skills">
        <div className="container skills-content">
          <span>Web development</span>
          <span aria-hidden="true">✦</span>
          <span>Data dashboards</span>
          <span aria-hidden="true">✦</span>
          <span>Python automation</span>
          <span aria-hidden="true">✦</span>
          <span>Machine learning projects</span>
        </div>
      </section>

      <section
        id="services"
        className="section container"
        aria-labelledby="services-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHAT I CAN HELP WITH</p>

            <h2 id="services-heading">
              Good ideas deserve
              <br />
              a useful solution.
            </h2>
          </div>

          <p className="section-description">
            From your first business website to a custom tool
            for everyday tasks, let&apos;s build a solution
            around your requirements.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                className="service-card"
                key={service.title}
              >
                <div className="service-icon">
                  <Icon size={25} aria-hidden="true" />
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <div className="service-tags">
                  {service.tags}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <FeaturedProjects />

      <section
        id="about"
        className="section container about-section"
        aria-labelledby="about-heading"
      >
        <div className="about-monogram" aria-hidden="true">
          A<span>↗</span>
        </div>

        <div>
          <p className="eyebrow">
            THE PERSON BEHIND THE WORK
          </p>

          <h2 id="about-heading">
            Hi, I&apos;m Aditya.
          </h2>

          <p className="about-description">
            I&apos;m a full-stack developer with an interest
            in AI, automation and practical problem solving.
            My portfolio includes fintech workflows, career
            automation, computer vision prototypes and
            object-oriented applications.
          </p>

          <p className="about-description">
            I focus on understanding your requirements,
            explaining the options and turning the agreed
            scope into a clear, usable solution.
          </p>

          <div className="hero-actions">
            <a className="text-link" href="#contact">
              Tell me about your idea
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>

            <a
              className="text-link"
              href="https://github.com/adityapandey0456"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Explore Aditya's GitHub profile (opens in a new tab)"
            >
              Explore GitHub
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section
        className="process-section"
        aria-labelledby="process-heading"
      >
        <div className="container section">
          <p className="eyebrow">
            HOW WE WILL WORK TOGETHER
          </p>

          <h2 id="process-heading">
            Clear steps.
            <br />
            From conversation to delivery.
          </h2>

          <div className="process-grid">
            {workProcess.map((step) => (
              <article
                className="process-card"
                key={step.number}
              >
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FAQ />

      <section
        id="contact"
        className="section container"
        aria-labelledby="contact-heading"
      >
        <div className="contact-panel">
          <p className="eyebrow">
            HAVE SOMETHING IN MIND?
          </p>

          <h2 id="contact-heading">
            Let&apos;s build
            <br />
            something useful.
          </h2>

          <p>
            Share your idea, requirements and preferred
            timeline. Let&apos;s find the right approach
            for your project.
          </p>

          <EnquiryForm />
        </div>
      </section>
    </>
  );
}