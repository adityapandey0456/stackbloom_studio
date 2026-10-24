"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Menu, X } from "lucide-react";

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <div
      className="mobile-navigation"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((previous) => !previous)}
      >
        {open ? (
          <X size={23} aria-hidden="true" />
        ) : (
          <Menu size={23} aria-hidden="true" />
        )}
      </button>

      {open && (
        <nav
          id={menuId}
          className="mobile-menu-panel"
          aria-label="Mobile navigation"
        >
          <Link href="/services" onClick={() => setOpen(false)}>
            Services
          </Link>

          <Link href="/projects" onClick={() => setOpen(false)}>
            Work
          </Link>

          <Link href="/about" onClick={() => setOpen(false)}>
            About
          </Link>

          <Link href="/faq" onClick={() => setOpen(false)}>
            FAQs
          </Link>

          <Link
            href="/contact"
            className="mobile-menu-contact"
            onClick={() => setOpen(false)}
          >
            Discuss your project ↗
          </Link>
        </nav>
      )}
    </div>
  );
}