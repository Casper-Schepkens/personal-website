import Link from "next/link";
import Image from "next/image";
import content from "@/lib/content";
import { getFeaturedProjects, getActiveProjects } from "@/lib/projects";
import { HeroText, SectionHeading, FadeIn } from "@/components/Motion";
import ProjectCard from "@/components/ProjectCard";

export default function HomePage() {
  const featured = getFeaturedProjects(4);
  const active = getActiveProjects(2);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="py-20 sm:py-28">
        <HeroText>
          <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:gap-16">
            <div className="shrink-0">
              <Image
                src="/images/logo.png"
                alt="Casper Schepkens logo"
                width={160}
                height={160}
                className="w-32 sm:w-40 h-auto"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-brand text-muted mb-3">
                {content.home.tagline}
              </p>
              <h1 className="font-display text-4xl font-normal tracking-tight sm:text-6xl text-balance">
                Casper Schepkens
              </h1>
              <p className="mt-2 font-display text-xl text-foreground/80">
                Ondernemer
              </p>
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

      {active.length > 0 && (
        <section className="pb-24">
          <SectionHeading
            title={content.home.currentlyTitle}
            subtitle={content.home.currentlySubtitle}
          />
          <div className="grid gap-4">
            {active.map((project, i) => (
              <FadeIn key={project.slug} delay={i * 0.1}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-all hover:border-foreground/20 hover:shadow-sm"
                >
                  <div>
                    <p className="font-display text-xl group-hover:text-foreground/80 transition-colors">
                      {project.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">{project.summary}</p>
                  </div>
                  <span className="text-muted opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
