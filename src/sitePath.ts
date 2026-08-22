const normalizedBase = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function siteHref(relativePath = ""): string {
  return `${normalizedBase}${relativePath.replace(/^\/+/, "")}`;
}

export function siteRoute(pathname: string): string {
  const basePath = new URL(normalizedBase, "https://chronoglyph.local").pathname;
  const relativePath = pathname.startsWith(basePath)
    ? pathname.slice(basePath.length)
    : pathname.replace(/^\/+/, "");
  const normalizedPath = relativePath.replace(/\/+$/, "");
  return normalizedPath ? `/${normalizedPath}` : "/";
}
