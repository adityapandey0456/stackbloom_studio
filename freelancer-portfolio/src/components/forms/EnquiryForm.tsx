"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

export default function EnquiryForm() {
  const formId = useId();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending) return;

    const form = event.currentTarget;
    const values = new FormData(form);

    setSending(true);
    setStatus("");
    setSuccess(false);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.get("name"),
          email: values.get("email"),
          service: values.get("service"),
          message: values.get("message"),
          consent: values.get("consent") === "on",
          website: values.get("website"),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to submit. Please try again."
        );
      }

      setSuccess(true);
      setStatus(
        `Your enquiry has been saved. Reference: ${result.reference}`
      );

      form.reset();
    } catch (error) {
      setSuccess(false);
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to submit. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      className="enquiry-form"
      onSubmit={handleSubmit}
      aria-busy={sending}
    >
      <div
        className="form-bot-trap"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <label htmlFor={`${formId}-website`}>
          Leave this field empty
        </label>

        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-row">
        <label htmlFor={`${formId}-name`}>
          Your name

          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Full name"
            minLength={2}
            maxLength={100}
            required
          />
        </label>

        <label htmlFor={`${formId}-email`}>
          Email address

          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            maxLength={254}
            required
          />
        </label>
      </div>

      <label htmlFor={`${formId}-service`}>
        What do you need?

        <select
          id={`${formId}-service`}
          name="service"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Select a service
          </option>
          <option value="Website development">
            Website development
          </option>
          <option value="Website fixes">
            Website fixes
          </option>
          <option value="Data dashboard">
            Data dashboard
          </option>
          <option value="Automation">
            Automation
          </option>
          <option value="Other">
            Other
          </option>
        </select>
      </label>

      <label htmlFor={`${formId}-message`}>
        Tell me about your project

        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          placeholder="Describe your goals, required features and preferred timeline."
          minLength={20}
          maxLength={5000}
          required
        />
      </label>

      <label
        className="consent-label"
        htmlFor={`${formId}-consent`}
      >
        <input
          id={`${formId}-consent`}
          name="consent"
          type="checkbox"
          required
        />

        <span>
  I agree that StackBloom Studio, operated by Aditya Pandey,
  can use these details to respond to my project enquiry.
  Read the{" "}
  <Link
    href="/privacy"
    style={{ textDecoration: "underline" }}
  >
    privacy notice
  </Link>
  .
</span>
      </label>

      <button
        className="button button-primary"
        type="submit"
        disabled={sending}
      >
        {sending ? "Sending..." : "Send project enquiry ↗"}
      </button>

      <p
        className={`form-status ${success ? "form-success" : ""}`}
        role="status"
        aria-live="polite"
      >
        {status}
      </p>
    </form>
  );
}