import Link from "next/link";
import content from "@/lib/content";
import { getFeaturedProjects } from "@/lib/projects";
import { getRecentRoadmapItems } from "@/lib/roadmap";
import { siteConfig } from "@/lib/site";
import { HeroText, SectionHeading, FadeIn } from "@/components/Motion";
import ProjectCard from "@/components/ProjectCard";
import LogoMark from "@/components/LogoMark";

export default function HomePage() {
  const featured = getFeaturedProjects(2);
  const recentMilestones = getRecentRoadmapItems(4);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="py-20 sm:py-28">
        <HeroText>
          <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:gap-16">
            <LogoMark size="lg" priority />
            <div>
              <p className="text-sm font-medium uppercase tracking-brand text-muted mb-3">
                {content.home.tagline}
              </p>
              <h1 className="font-display text-4xl font-normal tracking-tight sm:text-6xl text-balance">
                Casper Schepkens
              </h1>
              <p className="mt-6 max-w-xl text-muted leading-relaxed">
                {content.home.intro}
              </p>
            </div>
          </div>
        </HeroText>
      </section>

      <section className="pb-24">
        <SectionHeading
          title={content.home.featuredTitle}
          subtitle={content.home.featuredSubtitle}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
        <FadeIn className="mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline underline-offset-4"
          >
            {content.home.viewAll} →
          </Link>
        </FadeIn>
      </section>

      <section className="pb-24">
        <SectionHeading title={content.home.nowTitle} />
        <FadeIn>
          <p className="max-w-2xl text-muted leading-relaxed text-lg">
            {content.home.now}
          </p>
        </FadeIn>
      </section>

      <section className="pb-24">
        <SectionHeading title={content.home.aboutTeaserTitle} />
        <FadeIn>
          <p className="max-w-2xl text-muted leading-relaxed text-lg">
            {content.home.aboutTeaser}
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline underline-offset-4"
          >
            {content.home.aboutTeaserLink} →
          </Link>
        </FadeIn>
      </section>

      <section className="pb-24">
        <SectionHeading
          title={content.home.roadmapTitle}
          subtitle={content.home.roadmapSubtitle}
        />
        <div className="relative max-w-2xl">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" aria-hidden />
          <div className="space-y-6">
            {recentMilestones.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.05}>
                <div className="relative pl-8">
                  <span className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-foreground bg-background" />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <time className="text-sm font-medium tabular-nums">{item.date}</time>
                    <span className="rounded-md bg-surface-hover px-2 py-0.5 text-xs text-muted">
                      {content.roadmap.types[item.type] ?? item.type}
                    </span>
                  </div>
                  <p className="font-display mt-1 text-lg">{item.title}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
        <FadeIn className="mt-8">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline underline-offset-4"
          >
            {content.home.roadmapLink} →
          </Link>
        </FadeIn>
      </section>

      <section className="pb-24">
        <FadeIn>
          <div className="rounded-xl border border-border bg-surface p-8 text-center sm:p-10">
            <h2 className="font-display text-2xl sm:text-3xl">{content.home.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-md text-muted leading-relaxed">
              {content.home.ctaText}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:border-foreground/30 transition-colors"
              >
                {content.home.ctaEmail}
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:border-foreground/30 transition-colors"
              >
                {content.home.ctaLinkedIn}
              </a>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
