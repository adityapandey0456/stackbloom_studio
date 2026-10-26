import type { Metadata } from "next";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Discuss your website, application, dashboard or automation project with StackBloom Studio.",
};

export default function ContactPage() {
  return (
    <section
      className="section container"
      aria-labelledby="contact-page-heading"
    >
      <div className="contact-panel">
        <p className="eyebrow">
          LET&apos;S BUILD WITH STACKBLOOM
        </p>

        <h1
          id="contact-page-heading"
          className="contact-page-title"
        >
          Your idea.
          <br />
          Our starting point.
        </h1>

        <p>
          Tell me what you want to build, improve or automate.
          Include your requirements and preferred timeline so
          we can discuss a suitable approach.
        </p>

        <EnquiryForm />
      </div>

      <div className="contact-details-grid">
        <article className="service-card">
          <p className="eyebrow">EMAIL</p>
          <h2>Prefer a direct message?</h2>

          <a href="mailto:info@stackbloomstudio.space">
            info@stackbloomstudio.space
          </a>
        </article>

        <article className="service-card">
          <p className="eyebrow">WHAT HAPPENS NEXT</p>
          <h2>A conversation before a commitment.</h2>

          <p>
            Aditya reviews your enquiry and follows up to clarify
            the scope. Pricing, delivery and revisions are agreed
            before work starts.
          </p>
        </article>
      </div>
    </section>
  );
}