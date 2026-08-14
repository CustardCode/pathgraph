"use client";

import { SiteLink as Link } from "@/components/SiteLink";
import { useState } from "react";

export function SiteHeader() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="PathGraph home" prefetch={false}>
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span>PathGraph</span>
      </Link>
      <button
        className="nav-toggle"
        type="button"
        aria-expanded={navigationOpen}
        aria-controls="primary-navigation"
        onClick={() => setNavigationOpen((open) => !open)}
      >
        {navigationOpen ? "Close" : "Menu"}
      </button>
      <nav id="primary-navigation" className={navigationOpen ? "open" : ""} aria-label="Primary navigation">
        <Link href="/careers" prefetch={false}>Careers</Link>
        <Link href="/compare" prefetch={false}>Compare</Link>
        <Link href="/methodology" prefetch={false}>Methodology</Link>
        <Link href="/data-sources" prefetch={false}>Data sources</Link>
      </nav>
      <span className="coverage-chip">6 countries · 20 careers</span>
    </header>
  );
}
