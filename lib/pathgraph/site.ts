const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";

export const siteBasePath = configuredBasePath && configuredBasePath !== "/"
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

export const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000")
  .replace(/\/+$/, "");

export function siteUrl(path = "/") {
  const normalizedPath = path === "/" ? "/" : `/${path.replace(/^\/+/, "")}`;
  return `${siteOrigin}${siteBasePath}${normalizedPath}`;
}

export function sitePath(path = "/") {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("#")) return path;
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] || "/";
  const suffix = match?.[2] || "";
  const normalizedPath = pathname === "/" ? "/" : `/${pathname.replace(/^\/+/, "")}`;
  if (siteBasePath && (normalizedPath === siteBasePath || normalizedPath.startsWith(`${siteBasePath}/`))) {
    return `${normalizedPath}${suffix}`;
  }
  return `${siteBasePath}${normalizedPath}${suffix}`;
}
