"use client";

import { SiteLink as Link } from "@/components/SiteLink";

export function SiteFooter({ marketLabel, source }: { marketLabel?: string; source?: string }) {
  return (
    <footer>
      <Link className="brand footer-brand" href="/" prefetch={false}>
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>PathGraph</span>
      </Link>
      <div className="footer-links">
        <Link href="/careers" prefetch={false}>Careers</Link>
        <Link href="/compare" prefetch={false}>Comparisons</Link>
        <Link href="/methodology" prefetch={false}>Methodology</Link>
        <Link href="/data-sources" prefetch={false}>Data sources</Link>
      </div>
      <p>Independent career comparison{marketLabel ? ` · ${marketLabel} occupation-level data` : ""}</p>
      {source && <p>{source}</p>}
    </footer>
  );
}
