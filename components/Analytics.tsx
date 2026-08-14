"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: "country_change" | "comparison_interaction" | "career_navigation", parameters: Record<string, string | number | undefined>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, Object.fromEntries(Object.entries(parameters).filter(([, value]) => value !== undefined)));
}

function PageViewTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    window.gtag?.("config", measurementId, { page_path: `${pathname}${searchParams.size ? `?${searchParams}` : ""}` });
  }, [measurementId, pathname, searchParams]);
  return null;
}

export function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="pathgraph-ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{send_page_view:false});`}
      </Script>
      <Suspense fallback={null}><PageViewTracker measurementId={measurementId} /></Suspense>
    </>
  );
}
