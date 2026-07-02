import content from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg">Casper Schepkens</p>
            <p className="mt-1 text-sm text-muted max-w-md">{content.footer.socialNote}</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="mailto:casper.schepkens@icloud.com"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              casper.schepkens@icloud.com
            </a>
            <a
              href="https://linkedin.com/in/casperschepkens"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-muted">
          © {year} Casper Schepkens. {content.footer.rights}
        </p>
      </div>
    </footer>
  );
}
