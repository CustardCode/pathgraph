import type { Metadata } from "next";
import { Analytics } from "@/components/Analytics";
import { siteUrl } from "@/lib/pathgraph";
import "./globals.css";

export function generateMetadata(): Metadata {
  const imageUrl = siteUrl("/og-v2.png");

  return {
    metadataBase: new URL(siteUrl("/")),
    title: "PathGraph — Compare careers beyond salary",
    description:
      "Compare career pay, outlook, work environment, skills and transition realities across supported national labour markets.",
    openGraph: {
      title: "PathGraph — Compare the work. Not just the salary.",
      description: "Make career trade-offs visible with PathGraph.",
      type: "website",
      url: siteUrl("/"),
      images: [{ url: imageUrl, width: 1536, height: 1024, alt: "PathGraph career comparison" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "PathGraph — Compare the work. Not just the salary.",
      description: "Make career trade-offs visible with PathGraph.",
      images: [imageUrl],
    },
    icons: { icon: siteUrl("/favicon.svg") },
    alternates: { canonical: siteUrl("/") },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<Analytics /></body>
    </html>
  );
}
