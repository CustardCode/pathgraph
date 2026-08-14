import { SiteLink as Link } from "@/components/SiteLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | PathGraph",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <main><SiteHeader /><section className="route-hero not-found-page"><p className="eyebrow">Page not found</p><h1>This path is not in the graph.</h1><p className="hero-lede">The career or comparison may not be published, or the address may be incorrect.</p><div className="not-found-links"><Link href="/careers" prefetch={false}>Browse careers</Link><Link href="/compare" prefetch={false}>Browse comparisons</Link></div></section><SiteFooter /></main>;
}
