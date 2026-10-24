import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | Aditya Pandey",
  description:
    "Explore website development, dashboards, Python automation, AI prototypes and technical project guidance.",
};

const services = [
  {
    number: "01",
    title: "Website & Web App Development",
    description:
      "Business websites, landing pages and custom applications built around your requirements.",
    features: [
      "Responsive layouts for mobile and desktop",
      "Contact forms and enquiry workflows",
      "Admin dashboards and API integrations",
      "Updates and improvements to existing websites",
    ],
  },
  {
    number: "02",
    title: "Data Analysis & Dashboards",
    description:
      "Clear analysis and practical dashboards to help you understand your data.",
    features: [
      "Spreadsheet cleaning and preparation",
      "Excel dashboards and charts",
      "Exploratory data analysis",
      "Reports explaining findings and limitations",
    ],
  },
  {
    number: "03",
    title: "Python Automation & Custom Tools",
    description:
      "Scripts and tools that simplify repetitive tasks and data processing.",
    features: [
      "File processing and data transformation",
      "Workflow automation",
      "Custom utilities and application logic",
      "Setup instructions and usage documentation",
    ],
  },
  {
    number: "04",
    title: "AI & Machine Learning Prototypes",
    description:
      "Prototype applications that explore AI-assisted workflows and image classification.",
    features: [
      "Conversational assistants and LLM integrations",
      "Computer vision experiments",
      "Model integration with web interfaces",
      "Evaluation and explanation of prototype limitations",
    ],
  },
  {
    number: "05",
    title: "Technical Learning & Project Guidance",
    description:
      "Practical support to help learners understand concepts and develop their own work.",
    features: [
      "Programming explanations and debugging guidance",
      "Project planning and architecture discussions",
      "Report structure and draft feedback",
      "Code walkthroughs and presentation preparation",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="section container">
        <p className="eyebrow">HOW I CAN HELP</p>

        <h1 className="services-page-title">
          Practical solutions.
          <br />
          Built around your goals.
        </h1>

        <p className="services-page-intro">
          Tell me what you need to achieve. We can discuss the
          right approach, agree on the scope and plan the work
          before development begins.
        </p>

        <div className="service-detail-grid">
          {services.map((service) => (
            <article
              className="service-detail-card"
              key={service.number}
            >
              <span className="service-number">
                {service.number}
              </span>

              <h2>{service.title}</h2>
              <p>{service.description}</p>

              <ul>
                {service.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <Link href="/contact" className="text-link">
                Discuss this service
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="contact-panel">
          <p className="eyebrow">SCOPE BEFORE QUOTATION</p>
          <h2>What does your project need?</h2>

          <p>
            Share your goals, required features, budget range and
            preferred deadline. Pricing, revisions, third-party
            costs and delivery arrangements will be agreed before
            work starts.
          </p>

          <Link
            href="/contact"
            className="button button-primary"
          >
            Request a quotation
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}