import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How StackBloom Studio handles project enquiries, email notifications, chatbot messages and admin session information.",
};

export default function PrivacyPage() {
  return (
    <section className="section container">
      <article className="privacy-content">
        <p className="eyebrow">STACKBLOOM STUDIO</p>

        <h1>Privacy notice</h1>

        <p>
          StackBloom Studio is operated by Aditya Pandey.
          This notice explains how information is handled
          through this portfolio and project enquiry website.
        </p>

        <h2>Project enquiries</h2>

        <p>
          When you submit the enquiry form, the website collects
          your name, email address, selected service, project
          message and consent. It also records an enquiry
          reference, submission time and enquiry status.
        </p>

        <h2>How your details are used</h2>

        <p>
          Enquiry details are used to review your requirements,
          respond to your request, prepare a quotation and manage
          project discussions. Submitting an enquiry does not
          automatically subscribe you to marketing emails.
        </p>

        <h2>Storage and access</h2>

        <p>
          In the current version, enquiries are stored in files
          on the computer or server running this website.
          The admin dashboard requires authentication to view
          enquiries and update their status.
        </p>

        <h2>Email notifications</h2>

        <p>
          When an enquiry is submitted, the website attempts to
          send its details to the studio&apos;s Gmail inbox
          through Google&apos;s email service. These details
          include your name, email address, selected service,
          project message and enquiry reference.
        </p>

        <p>
          A copy may therefore remain in the studio&apos;s
          mailbox as well as in the website&apos;s enquiry
          storage. Replies sent through Gmail are also handled
          through Google&apos;s email service.
        </p>

        <h2>Project assistant</h2>

        <p>
          The current guided chatbot uses predefined responses.
          Messages are held in the open page&apos;s memory and
          are not submitted as project enquiries or sent to an
          external AI provider. Reloading the page clears this
          conversation.
        </p>

        <p>
          Use the enquiry form if you want StackBloom Studio
          to receive and review your project requirements.
        </p>

        <h2>Admin session cookie</h2>

        <p>
          Signing in to the admin area creates a session cookie
          used to authenticate admin requests. The session is
          configured to expire after eight hours. Logging out
          removes the cookie from that browser.
        </p>

        <h2>Information to avoid sharing</h2>

        <p>
          Please do not submit passwords, private API keys,
          payment card details, identity documents or confidential
          client records through the enquiry form or chatbot.
          If a project requires sensitive information, discuss
          an appropriate transfer method first.
        </p>

        <h2>External links</h2>

        <p>
          Project links may open GitHub or other websites.
          Information you provide on those websites is handled
          under their own privacy notices.
        </p>

        <h2>Corrections and deletion requests</h2>

        <p>
          To request a correction or deletion of an enquiry,
          contact Aditya Pandey at{" "}
          <a href="mailto:adityapandey0456@gmail.com">
            adityapandey0456@gmail.com
          </a>
          . Include your enquiry reference if available.
          Please do not include passwords or sensitive documents
          in your request.
        </p>

        <h2>Changes to this notice</h2>

        <p>
          This notice will be updated when the website&apos;s
          storage, integrations or information handling changes.
        </p>

        <Link href="/contact" className="text-link">
          Go to contact page ↗
        </Link>
      </article>
    </section>
  );
}