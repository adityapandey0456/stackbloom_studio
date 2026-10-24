"use client";

import { useMemo, useState } from "react";
import EnquiryStatus from "@/components/admin/EnquiryStatus";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  status: string;
  createdAt: string;
};

const statuses = ["New", "Contacted", "Quoted", "Won", "Lost"];

function gmailLink(enquiry: Enquiry) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: enquiry.email,
    su: `Regarding your ${enquiry.service} enquiry`,
    body:
      `Hi ${enquiry.name},\n\n` +
      `Thank you for contacting StackBloom Studio about ` +
      `${enquiry.service}.\n\n` +
      `Your requirements:\n${enquiry.message}\n\n`,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}

export default function EnquiryInbox({
  enquiries,
}: {
  enquiries: Enquiry[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesStatus =
        filter === "All" || enquiry.status === filter;

      const matchesSearch = [
        enquiry.name,
        enquiry.email,
        enquiry.service,
        enquiry.message,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, search, filter]);

  const metrics = [
    {
      label: "Total enquiries",
      count: enquiries.length,
      detail: "All saved requests",
    },
    {
      label: "New",
      count: enquiries.filter((item) => item.status === "New").length,
      detail: "Awaiting first contact",
    },
    {
      label: "In discussion",
      count: enquiries.filter((item) =>
        ["Contacted", "Quoted"].includes(item.status)
      ).length,
      detail: "Contacted or quoted",
    },
    {
      label: "Won",
      count: enquiries.filter((item) => item.status === "Won").length,
      detail: "Marked as won",
    },
  ];

  return (
    <>
      <div className="inbox-metrics">
        {metrics.map((metric) => (
          <article className="inbox-metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.count}</strong>
            <p>{metric.detail}</p>
          </article>
        ))}
      </div>

      <div className="inbox-toolbar">
        <div className="inbox-search">
          <label htmlFor="enquiry-search">Search enquiries</label>
          <input
            id="enquiry-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, email, service or message..."
          />
        </div>

        <div className="inbox-filter">
          <label htmlFor="enquiry-filter">Status</label>
          <select
            id="enquiry-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="inbox-result-count" role="status">
        Showing {filtered.length} of {enquiries.length} enquiries
      </p>

      {filtered.length === 0 ? (
        <div className="inbox-empty">
          <h2>
            {enquiries.length === 0
              ? "Your next project starts here."
              : "No matching enquiries."}
          </h2>
          <p>
            {enquiries.length === 0
              ? "New contact form submissions will appear in this inbox."
              : "Try another search or select a different status."}
          </p>
        </div>
      ) : (
        <div className="inbox-list">
          {filtered.map((enquiry) => (
            <article className="inbox-card" key={enquiry.id}>
              <div className="inbox-card-top">
                <div className="inbox-client">
                  <div className="inbox-avatar" aria-hidden="true">
                    {enquiry.name.trim().charAt(0).toUpperCase() || "?"}
                  </div>

                  <div>
                    <h2>{enquiry.name}</h2>
                    <p>{enquiry.email}</p>
                  </div>
                </div>

                <span
                  className={`inbox-status inbox-status-${enquiry.status.toLowerCase()}`}
                >
                  {enquiry.status}
                </span>
              </div>

              <div className="inbox-request">
                <span className="inbox-service">
                  {enquiry.service}
                </span>
                <p>{enquiry.message}</p>
              </div>

              <div className="inbox-card-bottom">
                <div className="inbox-date">
                  <span>Received</span>
                  <time dateTime={enquiry.createdAt}>
                    {new Date(enquiry.createdAt).toLocaleString(
                      "en-IN",
                      {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}{" "}
                    IST
                  </time>
                </div>

                <div className="inbox-card-actions">
                  <EnquiryStatus
                    key={`${enquiry.id}-${enquiry.status}`}
                    id={enquiry.id}
                    currentStatus={enquiry.status}
                  />

                  <a
                    className="inbox-reply"
                    href={gmailLink(enquiry)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Reply to ${enquiry.name} in Gmail (opens in a new tab)`}
                  >
                    Reply in Gmail ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}