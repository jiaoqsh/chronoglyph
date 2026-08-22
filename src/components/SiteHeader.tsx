import { siteHref } from "../sitePath";

export interface SiteHeaderProps {
  active: "home" | "playground";
}

export function SiteHeader({ active }: SiteHeaderProps) {
  const homeHref = siteHref();
  const playgroundHref = siteHref("playground/");

  return (
    <header className="cg-site-header">
      <a className="cg-brand" href={homeHref} aria-label="Chronoglyph home">
        <span className="cg-brand__mark" aria-hidden="true">
          C/07
        </span>
        <span>CHRONOGLYPH</span>
      </a>
      <nav className="cg-site-nav" aria-label="Primary navigation">
        <a href={homeHref} aria-current={active === "home" ? "page" : undefined}>
          HOME
        </a>
        <a
          href={playgroundHref}
          aria-current={active === "playground" ? "page" : undefined}
        >
          PLAYGROUND
        </a>
      </nav>
      <div className="cg-header-meta">
        <span>SVG SCENE SYSTEM</span>
        <span>V0.4</span>
      </div>
    </header>
  );
}
