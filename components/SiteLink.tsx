import type { AnchorHTMLAttributes, ReactNode } from "react";
import { sitePath } from "@/lib/pathgraph";

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  prefetch?: boolean;
};

export function SiteLink({ href, children, prefetch, ...props }: SiteLinkProps) {
  void prefetch;
  return <a href={sitePath(href)} {...props}>{children}</a>;
}
