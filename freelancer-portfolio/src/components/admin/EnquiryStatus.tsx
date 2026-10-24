"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const statuses = ["New", "Contacted", "Quoted", "Won", "Lost"];

export default function EnquiryStatus({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [savedStatus, setSavedStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function saveStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Update failed.");
      }

      setSavedStatus(status);
      setMessage("Status saved.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Update failed."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="status-form" onSubmit={saveStatus}>
      <label htmlFor={`status-${id}`}>Enquiry status</label>

      <div className="status-controls">
        <select
          id={`status-${id}`}
          value={status}
          disabled={saving}
          onChange={(event) => {
            setStatus(event.target.value);
            setMessage("");
          }}
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={saving || status === savedStatus}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <span role="status" aria-live="polite">
        {message}
      </span>
    </form>
  );
}